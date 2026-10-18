# DENVUP AI Skills Pack

A complete, project-portable skill library assembled from the seven source repositories supplied by the user.

## What's included

- **303 active skill bundles** in categorized folders under `skills/`.
- Full extracted source snapshots of all seven uploaded repositories under `sources/original-repositories/`, including original READMEs, licenses, manifests, examples, assets, scripts, tests, and host-specific copies present in the ZIPs.
- **20 Impeccable agent-specific wrappers** separately preserved under `compatibility/impeccable-agent-variants/`.
- The Anthropic skill-authoring template under `templates/agent-skill-template/`.
- `SKILL-INDEX.md`, `REPOSITORY-AUDIT.md`, `RESOURCE-DEPENDENCY-AUDIT.md`, `LICENSES-AND-ATTRIBUTION.md`, `MISSING-SUBMODULES.md`, `MANIFEST.json`, and reusable project instructions.
- Validation and project-instruction installation scripts.

## Start here

1. Read `AI_WORKFLOW.md`.
2. Search `SKILL-INDEX.md` for the skill relevant to your task.
3. Open that skill's `SKILL.md` and any referenced files before implementing.
4. If a relative reference was relocated or doesn't resolve in the normalized bundle, use the corresponding original source path documented in `SOURCE-INFO.md`.
5. For each project, copy this entire folder into the repository as `DENVUP_AI_SKILLS_PACK/`, then install the instruction block.

## Install project instructions (Windows)

From the project root, after copying this folder into the repository:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\DENVUP_AI_SKILLS_PACK\scripts\install_project_instructions.ps1
```

The installer creates or appends a clearly marked block in `AGENTS.md` and does not intentionally overwrite unrelated existing content.

## Install project instructions (macOS/Linux/Git Bash)

```bash
bash ./DENVUP_AI_SKILLS_PACK/scripts/install_project_instructions.sh
```

## Validate the pack

```bash
python ./DENVUP_AI_SKILLS_PACK/scripts/validate_pack.py
```

Python 3.10+ is recommended. Validation checks that the index and active skill files exist, the manifest references files present in the pack, and all original source snapshots remain available. It does not prove that every agent-specific runtime command works.

## Important

- The folder is deliberately large. Quality and preserving the source material take priority over minimizing size.
- Skill instructions are not automatic enforcement. `AGENTS.md`/`AI_WORKFLOW.md` tells agents how to discover and consult the skills, but tool-specific behavior must be verified in Arena AI, Antigravity, or whichever agent is used.
- Do not load every skill for every task. Select relevant skills using the index to reduce context bloat and avoid conflicting advice.
- The OpenAI skills repository snapshot labels itself deprecated; retained because it was explicitly requested.
- The Google ZIP's 16 external Git submodules are not included by GitHub-generated source ZIPs; see `MISSING-SUBMODULES.md`.
- Review the preserved license and third-party notice files before redistributing the pack publicly.

## Source repositories

- [claudedesignskills](https://github.com/freshtechbro/claudedesignskills) — MIT
- [impeccable](https://github.com/pbakaus/impeccable) — Apache-2.0 (with NOTICE.md third-party attribution)
- [taste-skill](https://github.com/Leonxlnx/taste-skill) — MIT
- [anthropic-skills](https://github.com/anthropics/skills) — See repository files and per-skill license notices; includes THIRD_PARTY_NOTICES.md
- [mattpocock-skills](https://github.com/mattpocock/skills) — MIT
- [openai-skills](https://github.com/openai/skills) — See repository LICENSE/skill files; repository README marks this repository deprecated in favor of OpenAI Plugins
- [google-skills](https://github.com/google/skills) — Apache-2.0
