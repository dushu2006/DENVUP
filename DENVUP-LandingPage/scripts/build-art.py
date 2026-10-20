#!/usr/bin/env python3
"""
DENVUP — the original artwork.

Six pieces, one art direction, generated reproducibly. Every output is
1600x900, drawn from the studio palette, with a fixed seed, so running this
script twice produces byte-identical files.

The art direction is deliberately narrow:

  * a paper ground (#edecea) with a fine grain,
  * a blueprint grid of ember hairlines,
  * one large geometric mass in ink, ember or signal,
  * one small accent shape, off the centre,
  * a soft vertical light gradient, so the flat field is never flat.

Each piece is a different arrangement, so the six service pages do not read
as one image recoloured six times.

Outputs (into ./public/art):
    service-web-design.jpg
    service-ai-solutions.jpg
    service-business-integrations.jpg
    service-creative-experiences.jpg
    service-automation.jpg
    concepts-mask.jpg
    plate-01.jpg

Usage:  python3 scripts/build-art.py
"""

from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'art'

W, H = 1600, 900

PAPER = (237, 238, 234)
INK = (11, 11, 12)
EMBER = (240, 73, 15)
SIGNAL = (43, 57, 230)


def ground(seed: int) -> Image.Image:
    """Paper, a soft light gradient, and a fine grain."""
    base = Image.new('RGB', (W, H), PAPER)
    draw = ImageDraw.Draw(base)

    # A vertical gradient, very slightly warm at the top.
    for y in range(H):
        t = y / H
        lift = int(6 * (1 - t))
        draw.line([(0, y), (W, y)], fill=(PAPER[0] + lift, PAPER[1] + lift, PAPER[2] + lift - 1))

    # The grain: a fine noise field, blurred so it reads as paper rather
    # than as television static.
    rng = random.Random(seed)
    small = Image.new('L', (W // 3, H // 3), 128)
    pixels = small.load()
    for _ in range((W // 3) * (H // 3) // 2):
        x = rng.randrange(W // 3)
        y = rng.randrange(H // 3)
        pixels[x, y] = 128 + rng.randrange(-30, 31)
    noise = small.resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(0.7))
    base = Image.blend(base, Image.merge('RGB', (noise, noise, noise)), 0.055)
    return base


def grid(draw: ImageDraw.ImageDraw, step: int, colour: tuple[int, int, int], alpha: int) -> None:
    """A blueprint grid of hairlines."""
    line = colour + (alpha,)
    for x in range(0, W + 1, step):
        draw.line([(x, 0), (x, H)], fill=line, width=1)
    for y in range(0, H + 1, step):
        draw.line([(0, y), (W, y)], fill=line, width=1)


def accent_block(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, colour) -> None:
    draw.rectangle([x, y, x + w, y + h], fill=colour)


def make_web_design() -> Image.Image:
    """A page under construction: a large ink column on a blueprint."""
    img = ground(101)
    draw = ImageDraw.Draw(img, 'RGBA')
    grid(draw, 195, EMBER, 150)
    draw.rectangle([585, 55, 1255, 900], fill=INK)
    draw.rectangle([460, 715, 585, 900], fill=INK)
    accent_block(draw, 100, 600, 90, 90, SIGNAL)
    return img


def make_ai() -> Image.Image:
    """A field of nodes and paths."""
    img = ground(202)
    draw = ImageDraw.Draw(img, 'RGBA')
    grid(draw, 195, EMBER, 110)
    rng = random.Random(202)
    # A jittered grid, so the field is spread across the frame rather than
    # clustered in one corner.
    nodes = []
    for row in range(4):
        for column in range(5):
            x = 150 + column * 330 + rng.randrange(-70, 71)
            y = 130 + row * 210 + rng.randrange(-60, 61)
            nodes.append((x, y))
    for i, a in enumerate(nodes):
        for b in nodes[i + 1 :]:
            if abs(a[0] - b[0]) + abs(a[1] - b[1]) < 420:
                draw.line([a, b], fill=EMBER + (110,), width=1)
    for x, y in nodes:
        draw.ellipse([x - 7, y - 7, x + 7, y + 7], fill=INK)
    highlight = nodes[7]
    draw.ellipse(
        [highlight[0] - 26, highlight[1] - 26, highlight[0] + 26, highlight[1] + 26],
        fill=SIGNAL,
    )
    for x, y in nodes:
        if abs(x - highlight[0]) + abs(y - highlight[1]) < 500:
            draw.ellipse([x - 9, y - 9, x + 9, y + 9], fill=EMBER)
    return img


def make_integrations() -> Image.Image:
    """Named systems, drawn as bands, with a flow between them."""
    img = ground(303)
    draw = ImageDraw.Draw(img, 'RGBA')
    grid(draw, 195, EMBER, 120)
    rows = [(90, EMBER), (250, INK), (410, SIGNAL), (570, INK), (730, EMBER)]
    for index, (y, colour) in enumerate(rows):
        x0 = 120 + (index % 2) * 190
        x1 = W - 120 - ((index + 1) % 2) * 150
        draw.rectangle([x0, y, x1, y + 62], fill=colour + (235,))
    for index in range(len(rows) - 1):
        y0 = rows[index][0] + 62
        y1 = rows[index + 1][0]
        draw.line([(240, y0), (240, y1)], fill=EMBER + (200,), width=2)
    return img


def make_creative() -> Image.Image:
    """Layered planes turning in space.

    The planes are drawn as outlines with two solid ones, so nothing muddy
    is produced by two translucent colours crossing.
    """
    img = ground(404)
    draw = ImageDraw.Draw(img, 'RGBA')
    grid(draw, 195, EMBER, 100)

    def quad(index: int):
        inset = 150 + index * 92
        return [
            (inset, 235 + index * 16),
            (W - inset - 90, 175 + index * 26),
            (W - inset, H - 185 - index * 14),
            (inset + 90, H - 245 - index * 10),
        ]

    # The solid planes first, so the outlines sit on top of them.
    draw.polygon(quad(0), fill=EMBER)
    draw.polygon(quad(3), fill=SIGNAL)
    for index in (1, 2, 4, 5):
        draw.polygon(quad(index), outline=INK + (220,), width=3)
    for index in range(6):
        draw.polygon(quad(index), outline=INK + (200,), width=2)
    return img


def make_automation() -> Image.Image:
    """A token travelling a track through a processor."""
    img = ground(505)
    draw = ImageDraw.Draw(img, 'RGBA')
    grid(draw, 195, EMBER, 120)
    draw.rectangle([120, 250, 660, 650], outline=INK, width=3)
    draw.rectangle([700, 330, 1180, 570], fill=INK)
    draw.rectangle([760, 390, 1120, 510], fill=EMBER)
    draw.line([(660, 450), (700, 450)], fill=EMBER, width=4)
    draw.line([(1180, 450), (1460, 450)], fill=EMBER, width=4)
    accent_block(draw, 1240, 396, 96, 108, SIGNAL)
    return img


def make_concepts() -> Image.Image:
    """A mask opening: a circle cut out of a field."""
    img = ground(606)
    draw = ImageDraw.Draw(img, 'RGBA')
    grid(draw, 195, EMBER, 110)
    draw.rectangle([0, 0, W, H], fill=INK + (235,))
    mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(mask).ellipse([430, 60, 1170, 800], fill=255)
    img = Image.composite(Image.new('RGB', (W, H), PAPER), img, mask)
    draw = ImageDraw.Draw(img, 'RGBA')
    grid(draw, 195, EMBER, 150)
    draw.ellipse([430, 60, 1170, 800], outline=EMBER, width=3)
    accent_block(draw, 180, 640, 110, 110, SIGNAL)
    return img


def make_plate() -> Image.Image:
    """The studio plate: the real emblem, set on a blueprint.

    This is the one large image on the home page. The emblem itself is the
    supplied brand asset, untouched apart from being scaled; everything
    around it is drawn by this script.
    """
    img = ground(707)
    draw = ImageDraw.Draw(img, 'RGBA')
    grid(draw, 160, EMBER, 105)

    # A signal-blue plane, tipped, behind the mark.
    plane = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(plane)
    pd.polygon(
        [(690, 118), (1380, 196), (1330, 790), (640, 712)],
        fill=SIGNAL + (255,),
    )
    img = Image.alpha_composite(img.convert('RGBA'), plane).convert('RGB')
    draw = ImageDraw.Draw(img, 'RGBA')

    # The orbit: a thin ink ring, deliberately broken like the emblem's own.
    draw.arc([452, 44, 1318, 910], start=196, end=352, fill=INK + (235,), width=5)
    draw.arc([452, 44, 1318, 910], start=12, end=150, fill=INK + (235,), width=5)

    # The real emblem.
    emblem = Image.open(ROOT / 'public' / 'logo_color.png').convert('RGBA')
    bbox = emblem.getbbox()
    if bbox:
        emblem = emblem.crop(bbox)
    target = 560
    scale = target / max(emblem.size)
    emblem = emblem.resize(
        (max(1, int(emblem.width * scale)), max(1, int(emblem.height * scale))),
        Image.LANCZOS,
    )
    img = img.convert('RGBA')
    img.alpha_composite(emblem, (int(885 - emblem.width / 2), int(470 - emblem.height / 2)))
    img = img.convert('RGB')
    draw = ImageDraw.Draw(img, 'RGBA')

    # A type-specimen column on the left: rules of decreasing length.
    lengths = [520, 470, 430, 360, 300, 240]
    for index, length in enumerate(lengths):
        y = 178 + index * 52
        draw.rectangle([96, y, 96 + length, y + 7], fill=INK + (215 if index else 255,))
    draw.rectangle([96, 178, 96 + 58, 185], fill=EMBER + (255,))

    # A sampled lattice, bottom-left.
    for row in range(3):
        for column in range(6):
            x = 96 + column * 46
            y = 640 + row * 46
            filled = (row, column) in ((0, 1), (1, 3), (2, 0), (2, 5))
            draw.rectangle(
                [x, y, x + 34, y + 34],
                fill=EMBER + (255,) if filled else None,
                outline=EMBER + (140,),
                width=2,
            )
    return img


PIECES = {
    'service-web-design.jpg': make_web_design,
    'service-ai-solutions.jpg': make_ai,
    'service-business-integrations.jpg': make_integrations,
    'service-creative-experiences.jpg': make_creative,
    'service-automation.jpg': make_automation,
    'concepts-mask.jpg': make_concepts,
    'plate-01.jpg': make_plate,
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, maker in PIECES.items():
        image = maker().convert('RGB')
        target = OUT / name
        image.save(target, 'JPEG', quality=88, optimize=True, progressive=True)
        print(f'wrote {target.relative_to(ROOT)} ({target.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
