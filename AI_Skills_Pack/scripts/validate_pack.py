#!/usr/bin/env python3
from pathlib import Path
import json, sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
warnings = []
for required in ["README.md", "AI_WORKFLOW.md", "SKILL-INDEX.md", "REPOSITORY-AUDIT.md",
                 "LICENSES-AND-ATTRIBUTION.md", "MANIFEST.json"]:
    if not (ROOT / required).is_file():
        errors.append(f"Missing required file: {required}")
skills = list((ROOT / "skills").rglob("SKILL.md"))
if not skills:
    errors.append("No active SKILL.md files found.")
for skill in skills:
    source_info = skill.parent / "SOURCE-INFO.md"
    if not source_info.exists():
        warnings.append(f"No SOURCE-INFO.md: {skill.relative_to(ROOT)}")
source_root = ROOT / "sources" / "original-repositories"
for repo in ["claudedesignskills", "impeccable", "taste-skill", "anthropic-skills",
             "mattpocock-skills", "openai-skills", "google-skills"]:
    if not (source_root / repo).is_dir():
        errors.append(f"Missing source snapshot: {repo}")
index = ROOT / "SKILL-INDEX.md"
if index.exists():
    text = index.read_text(encoding="utf-8", errors="replace")
    for skill in skills:
        rel = skill.relative_to(ROOT).as_posix()
        if rel not in text:
            errors.append(f"Active skill not indexed: {rel}")
manifest_path = ROOT / "MANIFEST.json"
if manifest_path.exists():
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        for item in manifest.get("active_skills", []):
            p = ROOT / item["skill_file"]
            if not p.is_file():
                errors.append(f"Manifest skill missing: {item['skill_file']}")
        for item in manifest.get("source_files", []):
            if not (ROOT / item["path"]).is_file():
                errors.append(f"Manifest source file missing: {item['path']}")
    except Exception as exc:
        errors.append(f"Manifest parse/check failed: {exc}")
print(f"Active skill folders: {len(skills)}")
print(f"Source snapshots: {sum(1 for p in source_root.iterdir() if p.is_dir()) if source_root.exists() else 0}")
print(f"Errors: {len(errors)}; warnings: {len(warnings)}")
for x in warnings[:30]: print("WARNING:", x)
for x in errors[:100]: print("ERROR:", x)
sys.exit(1 if errors else 0)
