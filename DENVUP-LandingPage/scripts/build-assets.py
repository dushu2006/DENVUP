#!/usr/bin/env python3
"""
DENVUP — brand asset builder.

Reproducibly derives every icon / social asset from the two supplied logo
files that live in the project root:

    logo_color.png   (1342 x 1172)  ember -> amber fox-in-orbit emblem
    logo_black.png   (1254 x 1254)  carbon-black version of the same emblem

Fact established by inspecting the pixels: neither file contains a wordmark.
Both are the emblem only. The "DENVUP" wordmark used on the site is typeset
in Archivo Variable (bundled, see src/styles/tokens.css) and is *not* traced
from artwork, so the supplied emblem is never redrawn or substituted.

Outputs (into ./public):
    favicon.svg            vector wrapper embedding the exact cropped pixels
    favicon-16/32/64.png   png icons
    icon-192/512.png       png icons
    apple-touch-icon.png   180x180 on the carbon-ink substrate
    brand-mark.png         1024x1024 transparent crop of the ember emblem
    brand-mark-ink.png     1024x1024 transparent crop of the black emblem
    og-image.png           1200x630 social preview
    og-image-square.png     600x600 social preview

Every output is a crop / scale / composite of the original pixels, so the
silhouette and proportions of the supplied logo are preserved exactly.

Usage:  python3 scripts/build-assets.py
"""

from __future__ import annotations

import base64
import io
import shutil
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
NODE_MODULES = ROOT / "node_modules"

LOGO_COLOR = ROOT / "logo_color.png"
LOGO_BLACK = ROOT / "logo_black.png"

INK = (11, 11, 12, 255)
PAPER = (237, 238, 234, 255)
EMBER = (240, 73, 15, 255)


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def trim(img: Image.Image, threshold: int = 8) -> Image.Image:
    """Crop an RGBA image to the bounding box of its visible pixels."""
    a = img.getchannel("A")
    bbox = a.point(lambda v: 255 if v > threshold else 0).getbbox()
    if not bbox:
        raise SystemExit("image has no visible pixels")
    return img.crop(bbox)


def fit_within(img: Image.Image, box: int) -> Image.Image:
    w, h = img.size
    scale = box / max(w, h)
    nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
    return img.resize((nw, nh), Image.LANCZOS)


def square_pad(img: Image.Image, box: int, bg=(0, 0, 0, 0)) -> Image.Image:
    canvas = Image.new("RGBA", (box, box), bg)
    out = fit_within(img, box)
    canvas.paste(out, ((box - out.width) // 2, (box - out.height) // 2), out)
    return canvas


def brand_ttf() -> Path | None:
    """
    Convert the bundled Archivo Variable latin woff2 into a TTF so Pillow can
    typeset the DENVUP wordmark with the real brand face.
    """
    try:
        from fontTools.ttLib import TTFont
    except ImportError:
        print("  ! fonttools not installed - wordmark will be omitted")
        return None

    files = NODE_MODULES / "@fontsource-variable" / "archivo" / "files"
    if not files.exists():
        print("  ! @fontsource-variable/archivo not installed")
        return None
    candidates = sorted(files.glob("archivo-latin-wght-normal.woff2"))
    if not candidates:
        candidates = sorted(files.glob("*latin-wght-normal.woff2"))
    if not candidates:
        return None
    try:
        font = TTFont(str(candidates[0]))
        font.flavor = None
        out = Path(tempfile.gettempdir()) / "denvup-archivo.ttf"
        font.save(str(out))
        return out
    except Exception as exc:  # pragma: no cover - environment dependent
        print(f"  ! font conversion failed: {exc}")
        return None


# --------------------------------------------------------------------------- #
# asset builders
# --------------------------------------------------------------------------- #
def build_icons(mark: Image.Image, mark_ink: Image.Image) -> None:
    for size in (16, 32, 64):
        img = square_pad(mark, size * 4).resize((size, size), Image.LANCZOS)
        img.save(PUBLIC / f"favicon-{size}.png", optimize=True)
        print(f"  + public/favicon-{size}.png")

    for size in (192, 512):
        square_pad(mark, size).save(PUBLIC / f"icon-{size}.png", optimize=True)
        print(f"  + public/icon-{size}.png")

    # iOS does not composite transparency: place the mark on carbon ink.
    tile = Image.new("RGBA", (180, 180), INK)
    inner = fit_within(mark, 140)
    tile.paste(inner, ((180 - inner.width) // 2, (180 - inner.height) // 2), inner)
    tile.convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)
    print("  + public/apple-touch-icon.png")

    square_pad(mark, 1024).save(PUBLIC / "brand-mark.png", optimize=True)
    print("  + public/brand-mark.png")
    square_pad(mark_ink, 1024).save(PUBLIC / "brand-mark-ink.png", optimize=True)
    print("  + public/brand-mark-ink.png")

    # The two supplied marks are published byte-identically so the page can
    # reference the original files directly. Nothing is re-encoded here.
    for src, name in ((LOGO_COLOR, "logo_color.png"), (LOGO_BLACK, "logo_black.png")):
        shutil.copyfile(src, PUBLIC / name)
        print(f"  + public/{name} (byte-identical copy of {src.name})")

    # A WebP sibling of each supplied mark. The artwork is identical, only the
    # encoding differs, and the PNG stays the fallback in every <picture>.
    for src, name in ((LOGO_COLOR, "logo_color.webp"), (LOGO_BLACK, "logo_black.webp")):
        Image.open(src).convert("RGBA").save(
            PUBLIC / name, format="WEBP", quality=88, method=6
        )
        print(f"  + public/{name} (WebP sibling of {src.name})")

    # SVG favicon: the exact cropped pixels of the supplied emblem, embedded.
    buf = io.BytesIO()
    square_pad(mark, 512).save(buf, format="PNG", optimize=True)
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" '
        'role="img" aria-label="DENVUP">'
        f'<image width="512" height="512" href="data:image/png;base64,'
        f'{base64.b64encode(buf.getvalue()).decode()}" />'
        "</svg>\n"
    )
    (PUBLIC / "favicon.svg").write_text(svg, encoding="utf-8")
    print("  + public/favicon.svg")


def draw_wordmark(draw: ImageDraw.ImageDraw, xy, ttf: Path, size: int, fill) -> None:
    font = ImageFont.truetype(str(ttf), size)
    draw.text(xy, "DENVUP", font=font, fill=fill)


def build_og(mark: Image.Image, ttf: Path | None) -> None:
    W, H = 1200, 630
    canvas = Image.new("RGBA", (W, H), INK)

    draw = ImageDraw.Draw(canvas)
    for x in range(0, W + 1, 40):
        draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, H + 1, 40):
        draw.line([(0, y), (W, y)], fill=(255, 255, 255, 8), width=1)

    m = fit_within(mark, 300)
    canvas.paste(m, (90, (H - m.height) // 2 - 10), m)

    if ttf:
        draw_wordmark(draw, (452, 196), ttf, 92, PAPER)
        draw.rectangle([456, 320, 456 + 200, 323], fill=EMBER)
        small = ImageFont.truetype(str(ttf), 26)
        draw.text(
            (452, 350),
            "Website design \u00b7 Development",
            font=small,
            fill=(237, 238, 234, 205),
        )
        draw.text(
            (452, 388),
            "Interactive experiences \u00b7 Digital solutions",
            font=small,
            fill=(237, 238, 234, 205),
        )
        micro = ImageFont.truetype(str(ttf), 19)
        draw.text((452, 466), "denvupforyou@gmail.com", font=micro, fill=(255, 182, 39, 235))

    canvas.convert("RGB").save(PUBLIC / "og-image.png", quality=92, optimize=True)
    print("  + public/og-image.png")

    sq = Image.new("RGBA", (600, 600), INK)
    m2 = fit_within(mark, 330)
    sq.paste(m2, ((600 - m2.width) // 2, 66), m2)
    if ttf:
        word_font = ImageFont.truetype(str(ttf), 74)
        bbox = draw.textbbox((0, 0), "DENVUP", font=word_font)
        wtext = bbox[2] - bbox[0]
        d2 = ImageDraw.Draw(sq)
        d2.text(((600 - wtext) // 2, 452), "DENVUP", font=word_font, fill=PAPER)
    sq.convert("RGB").save(PUBLIC / "og-image-square.png", quality=92, optimize=True)
    print("  + public/og-image-square.png")


def main() -> int:
    if not LOGO_COLOR.exists() or not LOGO_BLACK.exists():
        raise SystemExit("supplied logo files are missing from the project root")
    PUBLIC.mkdir(exist_ok=True)

    mark = trim(Image.open(LOGO_COLOR).convert("RGBA"))
    mark_ink = trim(Image.open(LOGO_BLACK).convert("RGBA"))
    print(f"  ember emblem = {mark.size}")
    print(f"  black emblem = {mark_ink.size}")

    build_icons(mark, mark_ink)
    build_og(mark, brand_ttf())
    return 0


if __name__ == "__main__":
    sys.exit(main())
