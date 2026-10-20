#!/usr/bin/env python3
"""
Check the study list against the skills pack.

The brief's gate is: "build SKILLS_STUDY_LIST.md (every relevant skill, read
fully, path + concrete takeaways, totals found/selected/read/excluded with
reasons)". A total that cannot be re-derived is just a number, so this script
re-derives it from the live pack and from the document, and fails when the two
disagree.

What it checks:

  1. The complete inventory in section 2 is exactly the live directory —
     no skill missing, none invented.
  2. The per-category counts in section 2 match the live directory.
  3. Every path in the selected index (section 3.0) exists on disk.
  4. No skill is both selected and named in the exclusion bullets.
  5. For every category: selected + excluded == the number of skills in it.
  6. The totals in section 1 (303 / 51 / 252) match what the document and
     the live tree say.

Usage:  python3 scripts/check-study-list.py
Exit code 0 when there are no problems, 1 otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PACK = ROOT.parent / "AI_Skills_Pack" / "skills"
STUDY_LIST = ROOT / "SKILLS_STUDY_LIST.md"

BACKTICK = re.compile(r"`([a-z0-9][a-z0-9\-]*)`")
SECTION_2 = re.compile(r"^### 2\.\d+ `([a-z0-9\-]+)` — (\d+)\s*$")
SECTION_5 = re.compile(r"^### 5\.\d+ `([a-z0-9\-]+)` — (?:all )?(\d+) excluded")
SELECTED_ROW = re.compile(r"^\|\s*`([a-z0-9\-]+/[a-z0-9\-]+/SKILL\.md)`\s*\|\s*([^|]+?)\s*\|\s*$")
TOTALS_ROW = re.compile(r"^\|\s*\*\*(Found|Selected|Excluded)\*\*[^|]*\|\s*\*\*(\d+)\*\*")


def main() -> int:
    problems: list[str] = []

    if not PACK.is_dir():
        print(f"the skills pack is not at {PACK}")
        return 1
    if not STUDY_LIST.is_file():
        print(f"the study list is not at {STUDY_LIST}")
        return 1

    text = STUDY_LIST.read_text(encoding="utf-8")
    lines = text.splitlines()

    # --- the live tree -----------------------------------------------------
    live: dict[str, set[str]] = {}
    for category in sorted(PACK.iterdir()):
        if not category.is_dir():
            continue
        for skill in sorted(category.iterdir()):
            if skill.is_dir() and (skill / "SKILL.md").is_file():
                live.setdefault(category.name, set()).add(skill.name)
    live_total = sum(len(names) for names in live.values())

    # --- section 2: the complete inventory ---------------------------------
    inventory: dict[str, set[str]] = {}
    stated_category_counts: dict[str, int] = {}
    current: str | None = None
    for line in lines:
        head = SECTION_2.match(line)
        if head:
            current = head.group(1)
            stated_category_counts[current] = int(head.group(2))
            inventory.setdefault(current, set())
            continue
        if current is None:
            continue
        if line.startswith("### ") or line.startswith("## "):
            current = None
            continue
        if line.startswith("#"):
            current = None
            continue
        for name in BACKTICK.findall(line):
            inventory[current].add(name)

    for category in sorted(set(live) | set(inventory)):
        in_live = live.get(category, set())
        in_doc = inventory.get(category, set())
        for name in sorted(in_live - in_doc):
            problems.append(f"{category}/{name}: in the pack, missing from section 2")
        for name in sorted(in_doc - in_live):
            problems.append(f"{category}/{name}: in section 2, not in the pack")
        stated = stated_category_counts.get(category)
        if stated is not None and stated != len(in_live):
            problems.append(
                f"{category}: section 2 says {stated} skills; the pack holds {len(in_live)}"
            )

    # --- section 3.0: the selected index -----------------------------------
    selected: dict[str, str] = {}
    in_index = False
    for line in lines:
        if line.startswith("### 3.0 "):
            in_index = True
            continue
        if in_index and line.startswith("### "):
            break
        if not in_index:
            continue
        match = SELECTED_ROW.match(line)
        if not match:
            continue
        path, depth = match.group(1), match.group(2).strip()
        if path in selected:
            problems.append(f"selected twice: {path}")
        selected[path] = depth

    for path in sorted(selected):
        parts = path.split("/")
        if len(parts) != 3 or parts[2] != "SKILL.md":
            problems.append(f"malformed selected path: {path}")
            continue
        if parts[1] not in live.get(parts[0], set()):
            problems.append(f"selected but not in the pack: {path}")

    # --- section 5: the exclusions -----------------------------------------
    excluded_counts: dict[str, int] = {}
    named_exclusions: dict[str, set[str]] = {}
    current = None
    in_exclusions = False
    for line in lines:
        if re.match(r"^## 5\.\s", line):
            in_exclusions = True
            continue
        if in_exclusions and re.match(r"^## \d", line):
            break
        if not in_exclusions:
            continue
        head = SECTION_5.match(line)
        if head:
            current = head.group(1)
            excluded_counts[current] = int(head.group(2))
            named_exclusions.setdefault(current, set())
            continue
        if line.startswith("### "):
            # Section 5.11 is the "read but not applied" list; it is counted
            # as selected, not as excluded.
            current = None
            continue
        if current is None:
            continue
        for name in BACKTICK.findall(line):
            named_exclusions[current].add(name)

    for path, depth in selected.items():
        category, name = path.split("/")[0], path.split("/")[1]
        if name in named_exclusions.get(category, set()):
            problems.append(f"both selected and excluded: {path}")

    # --- section 1: the totals ---------------------------------------------
    stated_totals: dict[str, int] = {}
    for line in lines:
        match = TOTALS_ROW.match(line)
        if match:
            stated_totals[match.group(1)] = int(match.group(2))
        else:
            match = re.match(r"^\|\s*— read \*\*(complete|partial|outline)\*\*[^|]*\|\s*\*\*(\d+)\*\*", line)
            if match:
                stated_totals[f"read {match.group(1)}"] = int(match.group(2))

    computed_total = len(selected) + sum(excluded_counts.values())

    for category in sorted(set(live) | set(excluded_counts)):
        sel = sum(1 for p in selected if p.split("/")[0] == category)
        exc = excluded_counts.get(category, 0)
        if sel + exc != len(live.get(category, set())):
            problems.append(
                f"{category}: {sel} selected + {exc} excluded != {len(live.get(category, set()))} in the pack"
            )

    if stated_totals.get("Found") != live_total:
        problems.append(
            f"section 1 says {stated_totals.get('Found')} skills were found; the pack holds {live_total}"
        )
    if stated_totals.get("Selected") != len(selected):
        problems.append(
            f"section 1 says {stated_totals.get('Selected')} were selected; the index lists {len(selected)}"
        )
    stated_excluded = stated_totals.get("Excluded")
    if stated_excluded is not None and stated_excluded != sum(excluded_counts.values()):
        problems.append(
            f"section 1 says {stated_excluded} were excluded; section 5 heads sum to {sum(excluded_counts.values())}"
        )
    if computed_total != live_total:
        problems.append(
            f"selected + excluded = {computed_total}, which is not the {live_total} skills in the pack"
        )

    # --- the report --------------------------------------------------------
    depths: dict[str, int] = {}
    for depth in selected.values():
        depths[depth] = depths.get(depth, 0) + 1

    print(f"skills in the pack : {live_total}")
    print(f"selected           : {len(selected)}")
    for depth in sorted(depths):
        print(f"  read {depth:<12}: {depths[depth]}")
    print(f"excluded           : {sum(excluded_counts.values())}")
    print(f"sum                : {computed_total}")

    if problems:
        print("\nproblems:")
        for problem in problems:
            print(f"  - {problem}")
        return 1

    print("\nproblems: NONE")
    return 0


if __name__ == "__main__":
    sys.exit(main())
