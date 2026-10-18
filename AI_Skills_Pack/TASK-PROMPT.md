# Reusable Task Prompt

Use this when the coding agent does not automatically load repository instructions.

Before implementing my request, inspect the repository and read `AGENTS.md`/`AI_WORKFLOW.md`. If `DENVUP_AI_SKILLS_PACK/` exists, consult `SKILL-INDEX.md`, identify the skills relevant to this task, and read their actual `SKILL.md` files and required references/assets/scripts before making changes. Do not merely rely on your general knowledge or claim to have read files you did not inspect.

Then inspect the existing architecture, make the smallest complete implementation that satisfies the request, and verify it using the available tests/build/browser checks. Do not run untrusted skill scripts or install dependencies without reviewing them. If a required skill or tool is unavailable, state the limitation and choose a safe fallback. Finish by listing the skills actually consulted, changed files, checks performed and results, and remaining limitations.
