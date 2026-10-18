#!/usr/bin/env bash
set -euo pipefail
PACK_PATH="$(pwd)/DENVUP_AI_SKILLS_PACK"
if [[ ! -d "$PACK_PATH" ]]; then
  echo "DENVUP_AI_SKILLS_PACK folder not found in the current project root." >&2
  exit 1
fi
AGENTS_PATH="$(pwd)/AGENTS.md"
BEGIN='<!-- BEGIN DENVUP AI SKILLS PACK INSTRUCTIONS -->'
END='<!-- END DENVUP AI SKILLS PACK INSTRUCTIONS -->'
BLOCK="$BEGIN
Before making changes, read \`DENVUP_AI_SKILLS_PACK/AI_WORKFLOW.md\` and search \`DENVUP_AI_SKILLS_PACK/SKILL-INDEX.md\` for relevant skills. Read the actual \`SKILL.md\` files and any required references before implementation. Verify tool-specific requirements, and report skills consulted, checks performed, results, and limitations. If the pack is inaccessible, say so rather than claiming it was used.
$END"
if [[ -f "$AGENTS_PATH" ]]; then
  if grep -Fq "$BEGIN" "$AGENTS_PATH"; then
    python3 - "$AGENTS_PATH" "$BLOCK" "$BEGIN" "$END" <<'PY'
import sys
from pathlib import Path
import re
p=Path(sys.argv[1]); block=sys.argv[2]; begin=sys.argv[3]; end=sys.argv[4]
text=p.read_text(encoding="utf-8")
pattern=re.escape(begin)+r".*?"+re.escape(end)
text=re.sub(pattern,lambda _:block,text,flags=re.S)
p.write_text(text,encoding="utf-8")
PY
  else
    printf '\n\n%s\n' "$BLOCK" >> "$AGENTS_PATH"
  fi
else
  printf '# AI Agent Instructions\n\n%s\n' "$BLOCK" > "$AGENTS_PATH"
fi
echo "DENVUP skill instructions installed/updated in AGENTS.md"
