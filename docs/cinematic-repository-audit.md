# Cinematic redesign — clean-slate repository audit

Audit date: **3 October 2026**. Scope: read-only source/dependency/consumer inspection and planning. **No implementation, deletion, dependency change, or policy rewrite has been performed.**

This supplements the [cinematic-scroll blueprint](./cinematic-scroll-blueprint.md). The user’s clean-slate principle governs both documents. Existing implementation is disposable; useful production functionality is preserved only when it serves the new architecture.

Creative target: [Flowty reference fidelity baseline](./cinematic-reference-fidelity.md), then controlled Oryvelle adaptation. A fresh implementation does not imply a newly invented page journey. Old orb/constellation/night-to-dawn concepts must not re-enter Phase 1 through reuse or new code. The reference beat order and composition govern replacement.

## 1. Ideal architecture before reuse

From an empty repository, the proposed implementation would have:

- Next.js/React/TypeScript for semantic server composition, routing, metadata, and small interactive client boundaries.
- CSS Modules for scene/component styles and one small global reset/token layer. No Tailwind or CSS-in-JS requirement.
- GSAP/ScrollTrigger with scoped lifecycle management for labelled chapter timelines. Native scrolling; one continuous-progress owner per chapter.
- One shared opening stage/product renderer; separate photography chapter; normal-flow editorial content.
- A CSS atmosphere controller with named depth layers and deterministic palette/progress resolution.
- DOM product layers for modest/static appearances; one Three.js/R3F opening chapter is now selected following the [public renderer investigation](./flowty-phone-renderer-investigation.md). Validate its representative render before full choreography; do not add legacy rendering alongside it.
- Semantic legal/support routes with a simple normal-flow shell, independently styled from cinematic stages.
- Discrete React state only where interactions need it. No global state package or speculative animation/design-system framework.
- Focused tests of contracts that matter, browser QA for motion, and no tests retained solely to validate deleted behavior.

This target was chosen from the reference’s visual/storytelling requirements. The old landing is not its foundation. Asset quality and performance can change rendering techniques; missing assets cannot silently change the desktop storyboard. Use documented placeholders, retain scene roles, and report concrete fidelity gaps. Responsive and reduced-motion variants remain deliberate accessibility/performance adaptations, not evidence of uninspected Flowty mobile behavior.

## 2. Audit evidence and limits

Inspected the source inventory, package manifest, configuration, landing entry/component, scroll/canvas setup, utility/state modules, shared header, global styles, metadata routes, error pages, and policy/support consumers. `rg` searches verified references to the legacy landing modules, header, assets, and animation keyframe.

The current home imports `ParallaxLandingExperience`, not a scene hierarchy from the new blueprint. Its module owns scroll measurement/CSS variable writes, active scene state, canvas drawing, and old presentation details. Its children include a separate orb canvas loop. This is a coherent prior implementation, but it does not earn reuse simply because it works.

The audit is **static evidence**. It does not assert current live browser performance, correctness of product/legal claims, deployment status, asset licenses, or external analytics configuration. No test/build run was necessary for these documentation-only changes. Recheck the consumer graph and Git state before actual removal.

No site analytics integration or dedicated deployment-provider configuration was found in the inspected tracked source. Policy references to Android crash reporting are not evidence of website analytics. Preserve any actual external infrastructure discovered during implementation.

## 3. Classification rules

| Classification | Meaning | Implementation action |
|---|---|---|
| KEEP | Responsibility and implementation genuinely fit | Preserve; verify current requirements, avoid gratuitous churn |
| REFACTOR | Responsibility fits, implementation needs adjustment | Migrate into clear target ownership; remove old form when done |
| REPLACE | Functionality remains necessary, existing architecture conflicts | Build purpose-designed replacement; delete superseded implementation |
| REMOVE | Responsibility is obsolete or has no target consumer | Delete after verifying consumers; do not keep speculative utilities |

Some files contain more than one responsibility. Classify those responsibilities separately instead of preserving the entire file to save a few useful constants.

## 4. Landing and animation disposition

| Existing code | Decision | Evidence / rationale | Target / removal condition |
|---|---|---|---|
| `app/page.tsx` home composition | **REPLACE** | Composes old parallax landing plus `SeoContent`; contains old scene data and Tailwind presentation | New server page composes the approved chapters and normal-flow content; retain only verified product facts/metadata responsibilities |
| Home `moments`, `seoHighlights`, trust copy | **REFACTOR** as content, not layout | Potentially useful product information, coupled to old five-moment story | Verify facts and map content into the locked reference storyboard; do not reuse old IDs, sequence, colors, or panel schema automatically |
| Home JSON-LD and metadata | **REFACTOR** | Useful SEO responsibility mixed into old home file | Preserve safe serialization/canonical intent; update accurately to final visible content; no fabricated claims |
| `app/_components/parallax-landing-experience.tsx` | **REPLACE** | Manual scroll owner, fixed five-scene schema, CSS variable transforms, canvas/background drawing and old UI are bundled | New chapter components and GSAP owners; delete old component after home switch, not an adapter around it |
| `app/_components/parallax/scenes.ts` | **REMOVE** | Canvas drawings serve the old constellation/mix/fade presentation | Remove with old landing; author any genuinely needed new illustration independently |
| `app/_components/parallax/sky.ts` | **REMOVE** | Time-based sky/stars/nebula rendering belongs to prior art direction | New atmosphere uses CSS planes; do not keep old background canvas beneath it |
| `app/_components/parallax/types.ts` | **REMOVE** | Old moments, stars, path points, orb annotation contracts | New scene/pose types follow actual new requirements |
| `app/_components/parallax/scene-state.ts` | **REMOVE** | Equal segmentation and fixed crossfade model for old scene list | New labelled chapters have authored phase proportions and independent travel |
| `app/_components/oryvelle-orb-canvas.tsx` | **REMOVE** | Only found production consumer is old landing; owns another animation loop | No orb-driven replacement of reference scenes in Phase 1; a later explicitly approved adaptation selects its technique afresh |
| `app/_components/canvas-utils.ts` | **REMOVE** by default | Production consumers found only in legacy canvas/landing tree | Reuse a tiny function only if an actual target consumer independently needs it; move to that owner and remove unused exports; no legacy utility bundle |
| Legacy `scene-state.test.ts` and `canvas-utils.test.ts` | **REMOVE** with removed modules | Tests specify old segmentation/helpers, not new story behavior | Author focused tests for new contracts when meaningful; do not port obsolete expectations |
| `sceneText` keyframe in `app/globals.css` | **REMOVE** | Searches found uses inside legacy landing only | New motion grammar owns any required entrance; no duplicate hidden animation path |

### Verified legacy consumer boundary

```text
app/page.tsx
  └── parallax-landing-experience.tsx
      ├── parallax/types.ts
      ├── parallax/scene-state.ts
      ├── parallax/sky.ts
      ├── parallax/scenes.ts
      ├── oryvelle-orb-canvas.tsx
      └── canvas-utils.ts

legacy tests → scene-state.ts / canvas-utils.ts
```

No legal/support production consumer of this canvas/scene tree was found. Therefore the tree can be removed as a coherent replacement unit after the home page is switched. Future Canvas/WebGL support must not use a renamed wrapper around this legacy controller.

## 5. Shared presentation and production routes

| Existing code | Decision | What survives | What changes |
|---|---|---|---|
| `app/layout.tsx` | **REFACTOR** | Root HTML, language, children, metadata boundary, useful skip-link behavior | Fonts, theme/viewport colors, global class ownership and skip-link styles follow new visual system |
| `app/globals.css` | **REPLACE** | Necessary reset/accessibility responsibilities | Remove old theme, utility integration and landing animation; create minimal reset/tokens with scene-specific CSS in modules |
| `app/_components/site-header.tsx` | **REPLACE** for cinematic home; **REFACTOR** non-landing navigation | Home/legal/support destinations and real store action | New floating home nav; minimal normal-flow header for information routes if needed. Do not preserve top-fixed glass header as a cinematic compatibility layer |
| `app/privacy/page.tsx` | **KEEP** route and authoritative content; **REFACTOR** presentation | Public URL, metadata intent, policy text, semantic sections | Migrate Tailwind styles and shared-header dependency without editing policy meaning |
| `app/terms/page.tsx` | **KEEP** route/content; **REFACTOR** presentation | Terms URL/text, heading anchors and links | Same style/navigation migration |
| `app/support/page.tsx` | **KEEP** route/content responsibility; **REFACTOR** presentation | Support/contact functionality and FAQ structure | Migrate styles/navigation; independently verify product facts when content is revised |
| `app/not-found.tsx` | **REFACTOR** | 404 route behavior and home/support destinations | Remove old decorative scene styling and header coupling; simple new visual language |
| `app/error.tsx` / `app/global-error.tsx` | **REFACTOR** | Appropriate error-boundary/retry responsibilities | New CSS ownership; remove old decorative theme. Preserve the installed framework’s actual error API rather than copying an older example blindly |
| `app/opengraph-image.tsx` | **REFACTOR** | Social image endpoint, dimensions/content-type responsibility | Render new identity/message rather than retain old artwork |
| `app/twitter-image.tsx` | **KEEP** if shared social output remains correct | Small re-export avoids needless duplicate renderer | Revisit only if Twitter artwork needs a different composition |

### Real shared consumer boundary

```text
SiteHeader
  ← home, privacy, terms, support, not-found

Tailwind theme/utilities
  ← layout, home, header, policy/support pages, error/404 pages

site-config
  ← home, layout, policy/support metadata, header, social image,
     manifest, robots, sitemap
```

The active policy/support consumers are why styling cannot be removed by deleting a package alone. Migrate them to the target stylesheet ownership, then remove the old style system. This is necessary migration of production consumers, not a requirement to accommodate the old landing.

Do not wrap the old header in the new nav, override its classes until it looks different, or make information pages import cinematic controllers. A simple information-route header and a cinematic navigation component have different legitimate responsibilities; share only real common data/small controls where useful.

The README identifies Android `doc/PRIVACY_POLICY.md`, `doc/TERMS_OF_SERVICE.md`, and `doc/SUPPORT.md` as the content authority. Preserve that synchronization contract. This audit did not inspect those external source documents, so it does not certify the current wording as synchronized.

## 6. Infrastructure disposition

| Item | Decision | Reason / scope |
|---|---|---|
| Next.js, React, React DOM, TypeScript | **KEEP** | Fit ideal SSR/product-site architecture; no unnecessary framework churn |
| `app/site-config.ts` | **KEEP** useful domain/name/URL helper; **REFACTOR** messaging if needed | Central real product destinations fit; not a visual theme or scroll store |
| `app/robots.ts` | **KEEP** | Existing crawlability/sitemap responsibility fits; verify final domain/routes |
| `app/sitemap.ts` | **KEEP** route registry; **REFACTOR** dates if appropriate | Preserve public URLs; final update metadata should reflect real publication policy |
| `app/manifest.ts` | **REFACTOR** | Keep web-app metadata responsibility if wanted; theme colors/icons must fit final identity |
| `next.config.ts` | **KEEP** useful headers/config; conditional **REFACTOR** asset policy | Do not loosen CSP broadly to accommodate speculative renderers/CDNs; adjust only for selected loading requirements |
| `tsconfig.json` | **KEEP** | Strict typing/bundler aliases fit; no rewrite for its own sake |
| `eslint.config.mjs` | **KEEP** | Useful checks and ignore rules; inspect compatibility when dependencies actually change |
| `.env.example` | **KEEP** | Public site URL configuration remains useful |
| `.gitignore` | **KEEP** appropriate rules | Repository hygiene; revise only for real new asset/tool outputs |
| `.github/dependabot.yml` | **KEEP** useful update infrastructure | No relation to old landing composition; inspect policy before future package changes |
| `README.md` | **KEEP** policy-source contract; **REFACTOR** development/architecture notes | Describe final responsibilities and new blueprint after implementation |
| Lockfile | **KEEP**, update through package manager when needed | Reproducibility; no manual broad rewrite |

Existing SEO and security functionality is useful infrastructure, not a reason to preserve old typography or component hierarchy. Keep responsibilities only where still appropriate and validate integrations after replacement.

## 7. Dependency disposition

Current runtime packages are only `next`, `react`, and `react-dom`. No installed GSAP, Motion, Lenis, Three.js, R3F, Lottie, or state-management package was found in the manifest. There is therefore no existing third-party animation library to remove in this checkout; the redundant animation owners are application code.

| Package / config | Decision | Legitimate responsibility / exit condition |
|---|---|---|
| `next`, `react`, `react-dom` | **KEEP** | Server framework, UI lifecycle and DOM rendering |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | **KEEP** | Build-time types; not browser runtime dependencies |
| `eslint`, `eslint-config-next` | **KEEP** | Static quality checks; resolve actual compatibility concerns when needed |
| `vitest` | **KEEP** if new meaningful tests exist | Useful testing infrastructure, not justification to preserve old canvas behavior. Revisit if the final project has no suitable consumers |
| `tailwindcss`, `@tailwindcss/postcss` | **REMOVE** after all active consumers migrate | No role in ideal final CSS Modules/global-reset system |
| `postcss.config.mjs` | **REMOVE** if still Tailwind-only at migration completion | Current sole configured plugin is Tailwind; no replacement config merely for symmetry |
| `gsap`, `@gsap/react` | **ADD later**, when implementation begins | One choreography/lifecycle system; ScrollTrigger is a GSAP plugin, not a separate competing library |
| All optional animation/render packages | **OMIT until justified** | Follow blueprint renderer/interaction gates; no package added solely for premium-site convention |

For each final package record responsibility, owner/import consumer, overlap with other tools, and why the browser is insufficient. No unused dependency survives as “we might need it later.” A temporary migrated/unmigrated route coexistence is acceptable during work; it is not the final architecture.

## 8. Assets and typography disposition

Tracked public inventory found: two manifest PNG icons and a Google Play badge. App-level image assets include favicon, icon, and apple icon. No production phone renders, environmental photos, image sequence, GLB, or video was found in this public inventory.

| Asset/system | Decision | Requirement |
|---|---|---|
| Manifest icons / favicon / apple icon | **KEEP conditionally** | Real brand identity assets may fit independently of old landing; inspect appearance/resolution/usage before final selection |
| `public/google-play-badge.png` | **KEEP conditionally** | Real download action remains useful; validate current approved artwork, aspect and destination before publishing |
| Generated Open Graph art | **REFACTOR** | Endpoint stays; artwork follows final identity |
| Geist / Geist Mono selection | **REPLACE or KEEP only after typography selection** | Choose ideal display/body system first. The fonts’ presence in layout does not make them requirements |
| Legacy procedural stars/nebula/orb artwork | **REMOVE** with old modules | No automatic visual carryover or mandatory orb renderer |
| New device/photographic assets | **REQUIRED later** | Asset inventory/renderer gate in blueprint; current code cannot substitute for missing art direction |

Do not delete identity assets while manifest/header/icon routes still use them. Do not retain unused experimental assets or font families after final consumer checks. New assets must meet format, licensing, crop, and decoded-memory requirements.

## 9. Replacement order and deletion gates

1. Freeze target responsibilities and the reference beat order/composition; select a capable renderer and record asset gaps. Refresh this audit against actual Git state; protect unrelated changes.
2. Build the new semantic/static home and minimal styles in the target hierarchy. Extract only verified content/destinations from old files.
3. Switch home composition to the new hierarchy and remove the old parallax landing tree plus its obsolete tests. Do not retain a hidden alternate home or wrapper around old progress logic.
4. Migrate the legal/support/header/error/layout consumers to target CSS ownership. Preserve URLs, content authority, metadata behavior, and working links.
5. Remove old global theme/keyframes, Tailwind/PostCSS packages and Tailwind-only configuration after the last consumer is gone; update lockfile normally.
6. Add selected GSAP chapter orchestration. Add a special renderer only after its gate passes. No old scroll controller or background canvas remains underneath it.
7. Audit imports, exports, packages, public asset references, animation owners, and styles. Remove orphaned files and speculative abstractions immediately.
8. Validate build/static checks and meaningful new contracts; inspect all active routes, complete cinematic journey, reduced-motion/static modes, focus behavior, mobile and performance separately.

Implementation milestones can be adjusted for atomic commits, but the completion gates cannot be skipped. Keeping old CSS during an in-progress route migration is not permission to ship it permanently or force the cinematic scenes through it.

## 10. Final acceptance

- Home composes the new scenes directly; no imports from the legacy parallax tree.
- One progress owner per cinematic chapter and one atmosphere owner; any renderer loop has a clear purpose/lifecycle.
- No old constellation/sky/orb loop remains. New orb/constellation concepts require a later explicitly approved adaptation after the reference baseline succeeds.
- CSS Modules and small globals have explicit ownership; no Tailwind-only package/config or old theme survives without a current approved responsibility.
- Legal/support routes and authoritative content contracts survive the presentation migration.
- SEO, security, domain configuration, icons and real download links are preserved where useful and verified.
- No compatibility wrapper exists just to keep obsolete landing code alive.
- No dead code, unused assets, speculative state layer, duplicate motion package, or tests of removed behavior remain.
- Final documentation describes the actual implemented architecture and any justified deviations.

The clean-slate requirement is about the final responsibility model, not erasing production functionality or changing frameworks for appearance. Reuse is an outcome of architectural fit, never the starting objective.
