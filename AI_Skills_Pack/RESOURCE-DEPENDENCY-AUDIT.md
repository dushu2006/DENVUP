# Skill Resource Dependency Audit

This report checks Markdown links that look like local file or directory paths in the active skill bundles. External URLs and code identifiers are not counted. A local link that does not resolve from the organized bundle may be an upstream broken path, an illustrative placeholder, or a project-relative example. The complete original repository trees are preserved under `sources/original-repositories/`.

## Results

- Local path-like links inspected: **2,416**
- Links resolving somewhere in the assembled pack: **2,388**
- Links not resolving from the bundle and not found at the corresponding original source path: **28**

Some links intentionally refer to another skill. The active skills are organized by domain rather than their original repository directory, so the source path remains the authoritative reference if an inter-skill link no longer resolves after organization.

## Unresolved or placeholder-like links

These links were not silently rewritten because doing so could change the meaning of a third-party skill. Review the original source file if one is relevant to your task.

- **claudedesignskills / gsap-scrolltrigger** — `skills/3d-motion-creative/gsap-scrolltrigger/assets/examples/README.md`
  - `../references/api_reference.md`
  - `../references/common_patterns.md`
- **google-skills / developing-genkit-go** — `skills/cloud-platform/developing-genkit-go/references/agents-artifacts.md`
  - `g,`
- **google-skills / developing-genkit-go** — `skills/cloud-platform/developing-genkit-go/references/agents-sessions.md`
  - `"./.snapshots"`
  - `"./.snapshots",
	localstore.WithMaxPersistedChainLength(3`
- **google-skills / developing-genkit-go** — `skills/cloud-platform/developing-genkit-go/references/agents.md`
  - `g,`
- **google-skills / developing-genkit-go** — `skills/cloud-platform/developing-genkit-go/references/flows-and-http.md`
  - `ctx,`
- **google-skills / developing-genkit-go** — `skills/cloud-platform/developing-genkit-go/references/generation.md`
  - `ctx,`
- **google-skills / developing-genkit-go** — `skills/cloud-platform/developing-genkit-go/references/prompts.md`
  - `g,`
- **mattpocock-skills / domain-modeling** — `skills/engineering-workflow/domain-modeling/GLOSSARY-FORMAT.md`
  - `./src/ordering/GLOSSARY.md`
  - `./src/billing/GLOSSARY.md`
  - `./src/fulfillment/GLOSSARY.md`
- **mattpocock-skills / setup-ts-deep-modules** — `skills/engineering-workflow/setup-ts-deep-modules/SKILL.md`
  - `./src/packages/README.md`
- **openai-skills / cloudflare-deploy** — `skills/platforms-integrations-ai/cloudflare-deploy/references/durable-objects/README.md`
  - `../websockets/README.md`
- **openai-skills / cloudflare-deploy** — `skills/platforms-integrations-ai/cloudflare-deploy/references/tunnel/README.md`
  - `../access/`
  - `../warp/`
- **openai-skills / figma-code-connect-components** — `skills/ui-ux-design/figma-code-connect-components/SKILL.md`
  - `path/to/component`
  - `path/to/another`
  - `src/components/Button.tsx`
  - `src/components/ProductCard.tsx`
  - `src/components/Badge.tsx`
- **openai-skills / skill-creator** — `skills/platforms-integrations-ai/openai-skill-creator/SKILL.md`
  - `FORMS.md`
  - `REFERENCE.md`
  - `EXAMPLES.md`
  - `DOCX-JS.md`
  - `REDLINING.md`
  - `OOXML.md`

## Google repository submodules

The Google source archive also declares 16 external Git submodules in `.gitmodules`. GitHub-generated ZIPs omit those submodule contents; see `MISSING-SUBMODULES.md`. Network access was not available during bundle creation, so those external repositories could not be fetched in this build.