# Deep Repository Audit

This report was generated from the seven ZIP archives uploaded in this conversation. The complete extracted source trees are included in this pack. Commit references were matched against the repository snapshots previously inspected; if legal-grade provenance is required, verify each ZIP against the exact Git commit it came from.

## Summary

- Active skill bundles copied into `skills/`: **303**
- Impeccable agent-specific wrapper variants separately preserved: **20**
- Anthropic skill-authoring template preserved separately: **1**
- Original source repositories preserved in full: **7**
- Source `SKILL.md` files across all archives (including duplicates, wrappers, and the template): **400**

The active count is not the count of every `SKILL.md` path in the source archives. Some repositories ship copies of the same skill for different coding agents. Full copies remain in the original snapshots, while the active library selects canonical skills and retains Impeccable's agent wrappers separately.

## Repository-by-repository findings

### claudedesignskills
- Source: https://github.com/freshtechbro/claudedesignskills
- Snapshot commit reference: `1da73febff0c3e1dfefc07f8a5ef8f7d1dfdb6cd`
- Source files preserved: 1,027
- `SKILL.md` files in uploaded archive: 90
- Bytes uncompressed: 11,230,456
- License summary: MIT
- Active skill bundles: 23
- Notes: Claude Code marketplace structure; canonical skills are portable instructions, but plugin manifests/commands are Claude-specific.

### impeccable
- Source: https://github.com/pbakaus/impeccable
- Snapshot commit reference: `2f46b7a8b059af00d20dd13b64dbe165e7c6a742`
- Source files preserved: 4,063
- `SKILL.md` files in uploaded archive: 25
- Bytes uncompressed: 80,744,102
- License summary: Apache-2.0 (with NOTICE.md third-party attribution)
- Active skill bundles: 1
- Notes: Includes a multi-agent skill wrapper, references, scripts, detector/runtime source and platform-specific copies. Runtime commands may require Bun/Node/Rust or browser setup; do not assume available.

### taste-skill
- Source: https://github.com/Leonxlnx/taste-skill
- Snapshot commit reference: `f624f37a8c650b9cc550253104925efe4c8de246`
- Source files preserved: 89
- `SKILL.md` files in uploaded archive: 14
- Bytes uncompressed: 2,718,463
- License summary: MIT
- Active skill bundles: 14
- Notes: Includes design skill variants, image-generation guidance, examples/assets and install scripts; some flows expect image generation or browser tools.

### anthropic-skills
- Source: https://github.com/anthropics/skills
- Snapshot commit reference: `dbd4588f9e1033efb41dad4bef2f7947c8993d44`
- Source files preserved: 445
- `SKILL.md` files in uploaded archive: 20
- Bytes uncompressed: 11,892,466
- License summary: See repository files and per-skill license notices; includes THIRD_PARTY_NOTICES.md
- Active skill bundles: 19
- Notes: Contains 19 direct skills plus a skill-authoring template; several document/artifact skills include assets or scripts. Preserve THIRD_PARTY_NOTICES.md.

### mattpocock-skills
- Source: https://github.com/mattpocock/skills
- Snapshot commit reference: `49dd158d1076134a641b33ef035946536778336`
- Source files preserved: 190
- `SKILL.md` files in uploaded archive: 38
- Bytes uncompressed: 735,198
- License summary: MIT
- Active skill bundles: 38
- Notes: Engineering/productivity skills. Some skills assume specific agent tools, issue trackers, commands or workflows; review before use in Arena AI.

### openai-skills
- Source: https://github.com/openai/skills
- Snapshot commit reference: `49f948faa9258a0c61caceaf225e179651397431`
- Source files preserved: 783
- `SKILL.md` files in uploaded archive: 44
- Bytes uncompressed: 4,596,024
- License summary: See repository LICENSE/skill files; repository README marks this repository deprecated in favor of OpenAI Plugins
- Active skill bundles: 44
- Notes: 44 skill files preserved. README says repository is deprecated; skills remain included as requested but new Codex/plugin examples may live elsewhere.

### google-skills
- Source: https://github.com/google/skills
- Snapshot commit reference: `e86adb9e2b80220a593c2be9a68627171fd17afb`
- Source files preserved: 994
- `SKILL.md` files in uploaded archive: 169
- Bytes uncompressed: 7,870,811
- License summary: Apache-2.0
- Active skill bundles: 164
- Notes: 164 canonical skill definitions. .gitmodules references 16 external submodules; GitHub source ZIP does not embed submodule contents. The URLs and pinned branch/tag info remain in .gitmodules; this limitation is documented.

## Active skill counts by category

- 3D, Motion & Creative Graphics: 23
- AI Agents & Skill Development: 3
- Google Cloud & Cloud Platforms: 143
- Documents, Communication & Content: 13
- Engineering, Architecture & Productivity: 35
- General Workflow: 6
- Google Product Integrations: 18
- Platforms, Integrations & AI Tooling: 19
- Testing, Quality, Accessibility & Security: 14
- UI/UX, Design Systems & Visual Direction: 29

## Compatibility, completeness, and safety findings

- **Skill format vs native integration:** Markdown instructions are broadly portable, but Claude Code plugin manifests, slash commands, agent definitions, installer commands, and other host-specific workflows do not automatically become native Arena AI or Antigravity features.
- **Selective retrieval:** This library contains hundreds of skills. Agents should search the index and load only relevant skills and references for a task.
- **Impeccable runtime:** Its original source, references, scripts, assets, platform wrappers, tests, and runtime source are retained. Some commands require runtimes, dependencies, browser integration, or host-specific setup.
- **Taste Skill:** Some flows expect image generation, browser inspection, or particular agent integrations. Use documented fallbacks when unavailable.
- **OpenAI skills repository status:** The uploaded README labels this repository deprecated and points to OpenAI Plugins for current Codex/plugin examples. It is included because explicitly requested.
- **Google submodules:** The uploaded Google ZIP contains `.gitmodules` references to 16 external submodules. GitHub-generated source ZIPs do not include submodule repository contents. `.gitmodules` is preserved and the missing content is documented in `MISSING-SUBMODULES.md`.
- **Licensing:** Original license files and third-party notices are preserved. Review applicable licenses and per-skill notices before redistributing the combined pack.
- **Relative references:** Skill bundles are copied with their skill-local files. Some source references may point outside a skill directory, contain placeholders, or have upstream path inconsistencies. Original source trees are retained as the authoritative fallback; see `RESOURCE-DEPENDENCY-AUDIT.md`.