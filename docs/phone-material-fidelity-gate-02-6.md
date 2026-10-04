# Gate 02.6 — Phone material fidelity

Date: 2026-10-03. Branch: `feat/flowty-fidelity-redesign`.

Review: http://localhost:3000/new — unchanged opening chapter.
Exact comparison checkpoint: http://localhost:3000/new?pose=back (existing development pose selector, progress 0.32).
Status: renderer-side material/lighting improvements implemented, awaiting visual review. No Section 02.

## Diagnosis before editing

Inspected the current website back pose, the publicly displayed [Sketchfab model preview](https://sketchfab.com/3d-models/samsung-s-26-ultra-3d-model-3356099ca99d488d95a6a253d05577f7), and the supplied screenshot. The displayed preview matched the supplied image's dark graphite surface, nested black optics, pale flash and cool lens details against a bright environment. This does not establish the interactive viewer's authored light/environment/shader settings: those remain unknown. The web fetch returned 403; the preview was inspected normally in Brave.

Before editing, parsed the GLB JSON and loaded it with GLTFLoader to inspect every original material, mesh bounds and normals; compared against every branch in `preparePhone()`. Exact original definitions are retained as inspection metadata in [phone-original-materials.json](phone-original-materials.json). Model and Blender master were not edited.

The dominant problems were renderer choices:

1. A broad runtime branch changed metal rings, black camera barrels, blue internal optics **and the flash** to the same near-black, low-metalness, moderately rough material. This destroyed material separation. Dielectric specular response over the curved geometry made the barrels/rings look like diffuse clay bowls rather than black recesses and metal rims.
2. The rear panel's exported linear base color was approximately `[0.09541, 0.09541, 0.11012]` (sRGB equivalent `#57575d`). The runtime `#0d0d11` corresponds to much darker linear values. Roughness increased 0.355 → 0.6. Its response became broadly diffuse and visually featureless.
3. Lens color was completely replaced, not merely restrained. Exported blue coating `[0.001, 0.04737, 0.09915]`, metalness 0.681 and roughness 0 became `#08090d`, metalness 0.08 and roughness 0.42.
4. The original pale flash became black through that same branch.
5. Material `envMapIntensity` values 0.03–0.1 were intended to suppress reflections but were ineffective for our scene environment. In installed Three.js 0.186.1, WebGLRenderer uses **scene.environmentIntensity** when `material.envMap === null` and `scene.environment` exists. It does not multiply the two values. The actual environment control was scene intensity 0.26.
6. The stock RoomEnvironment supplied broad bright room reflections; three fairly strong directional lights and ambient 0.15 contributed to white/diffuse-looking camera surfaces. Simply restoring source materials in this lighting produced a silver/lavender phone, proving material restoration alone was insufficient.

Current documentation was retrieved with Context7 and confirmed against installed `WebGLRenderer.js`. Relevant primary references: [Scene.environmentIntensity](https://threejs.org/docs/#Scene.environmentIntensity), [MeshStandardMaterial](https://threejs.org/docs/#MeshStandardMaterial), [PMREMGenerator](https://threejs.org/docs/#PMREMGenerator).

## Original materials and complete runtime comparison

Colors below are sRGB hex equivalents for readability; source GLB factors themselves are linear. M/R means metalness/roughness. Node numbers abbreviate `Object_N`.

| Surface / nodes / materials | GLB color; M/R | Previous Gate 02 override | Gate 02.6 |
| --- | --- | --- | --- |
| Rear panel 4 / .001 | #57575d; .233/.355 | #0d0d11; .18/.6 | #45454b; .23/.46 with fine roughness map |
| Camera island 8 / .002 | #4c4c51; .322/.060 | #101014; .3/.4 | #25262b; .6/.26 |
| Large and small metal rims 10,12,14,16,18 / .003–.007 | #707078; .322/.060 | #08090d; .08/.42 | #393a40; .92/.20 |
| Black recessed barrels 20,26,28,34,42 / .009,.011,.012,.015,.019 | #000000; .836/.5 | #08090d; .08/.42 | #030405; .84/.32 |
| Cool inner optics 22,24,30,32,36,40 / .010,.008,.013,.014,.016,.018 | #033d59; .681/0 | #08090d; .08/.42 | source linear RGB × .3; .68/.055 |
| Flash 38 / .017 | #fff2f9; .078/.177 | #08090d; .08/.42 | #c5c6cd; 0/.38 |
| Chassis halves 48,49 / .026,.024 | #5f5f65; .147/0 | #0d0d11; .12/.6 | #222327; .65/.28 |
| Front border 46 / .025 | #000000; 0/0 | #0d0d11; .12/.6 | retained exactly |
| Front camera 65 / .034 | #000000; .836/.5 | #08090d; .08/.42 | retained exactly |
| Front camera inner detail 67 / .035 | #033d59; .681/0 | #08090d; .08/.42 | retained exactly |
| Branding 69 / .022 | #63636a; .828/0 | #101015; 0/.75 | retained exactly; no added emphasis |
| Edge/port details 51,57,59 / .027,.030,.031 | #c1c1cf; .185/0 | PBR unchanged | PBR unchanged |
| Port interiors 53,55 / .028,.029 | #000000; .078/0 | PBR unchanged | PBR unchanged |
| Duplicate optics 61 / .032 | #033d59; .681/0 | hidden on clone | remains hidden |
| Duplicate barrel 63 / .033 | #000000; .836/.5 | hidden on clone | remains hidden |
| Display 6 / .021 | #0f0f1e; 0/0; opaque | existing display UV projection + untonemapped MeshBasicMaterial screen | exact existing contract retained |
| Front glass 44 / .023 | #131426; 0/0; opaque | physical glass, opacity .018, roughness .24, clearcoat .45, coat roughness .2, depthWrite false | exact existing configuration retained |

The previous blanket material environment override was .1; chassis/border .03, rear .06 and camera branch .04. Those misleading overrides were removed. Materials continue using the scene environment rather than separate maps. No imported texture, material normal map, or tangent was replaced. Only rear roughness received a new map.

## Asset versus renderer limitations

Direct asset evidence:

- 34 meshes/materials, all with normals. Normal lengths range 0.99999995–1.00000013; no zero or invalid normals were found. Length validation does not prove ideal authored smoothing at every seam.
- GLB contains no source image maps, normal maps, roughness textures, environment textures or physical-glass extensions.
- Separate rings, recessed barrels and inner optics are real nested geometry. Restoring differentiated materials makes their spatial relationship legible without adding meshes.
- Rear panel is planar; it cannot gain a curved geometric lighting gradient from material tuning. Soft reflections and a fine roughness finish provide response without changing its shape.
- Lens materials are exported opaque metallic PBR surfaces, not an optically calibrated transparent/refractive multi-element lens assembly. Current optical-depth cues come from the existing nested geometry and reflections, not simulated refraction.
- Some rim/chassis faceting and seams remain at hero scale. Geometry, vertex normals and transforms were deliberately preserved.

Unknown: whether the preview's fine grain is authored surface texture/procedural shading, offline sampling noise, or image treatment. With no exported maps, we cannot claim lost texture information solely from that screenshot. No speculative Blender changes were made.

**Blender was not required for this correction.** If later review requires the precise faceted internal optics or true refractive lens construction of another source render, that needs a specific asset/shading investigation rather than stronger lights. This gate does not claim pixel equivalence to the bright source preview.

## Controlled comparison loop

All comparison images used the existing website `back` checkpoint, same camera, poses, stage framing, desktop dimensions and content. These are native browser captures, not isolated viewer renders or retouched images.

| Configuration | Outcome / capture |
| --- | --- |
| Original Gate 02 materials + RoomEnvironment | Clay-like rings/barrels; black flash; flat dark rear. [Before](captures/gate-02-6/back-before.png) |
| Exported rear PBR restored + original lighting | Separation and blue optics returned, but body/rims too silver/bright. [Restored / room](captures/gate-02-6/back-exported-room.png) |
| Exported rear PBR + dark reflection cards, reduced direct lights | Better black optics, but rear/rims too dim. [Restored / dark cards](captures/gate-02-6/back-exported-cards.png) |
| Surface calibration + stronger broad card | Rear separation improved; flat card made metal rims too uniformly pale. [Calibrated cards](captures/gate-02-6/back-calibrated-cards.png) |
| Narrower neutral cards | Highlights restrained but rings/body insufficiently readable. [Neutral narrow cards](captures/gate-02-6/back-neutral-cards.png) |
| Soft reflection cards + final graphite material balance | Selected: neutral dark body, more restrained rims, black recesses, pale flash and subtle cool optics. [After](captures/gate-02-6/back-after.png) |

Softboxes are procedural intensity fields, not external artwork. The final comparison is intentionally darker than the source's bright environment. Slight turn-dependent highlight variation is physically expected; no progress-dependent lighting changes were added.

## Final lighting and material treatment

- Replace stock RoomEnvironment with a small controlled environment bake: broad neutral key, narrow cool side strip, neutral rear card, soft top fill and dark neutral background. These cards exist only during PMREM generation, never in the visible scene.
- One 128 × 128 radial intensity texture softens reflection cards; disposed after bake. Its grayscale values intentionally act as a linear intensity mask rather than a color photograph.
- Existing PMREM fromScene architecture retained; blur parameter .04 → .06. One environment target remains; no extra offscreen rendering during scroll.
- Scene environment intensity .26 → .6. This value is not directly comparable as brightness because the environment source changed completely.
- Ambient .15 → .08. Existing directional positions unchanged: key intensity 1 → .35, cool rear/side .75 → .25, lower fill .28 → .08. Key color becomes more neutral #edeaff and cool light #c2c9e3. No runtime area-light library, shadows or postprocessing added.
- R3F default ACES filmic tone mapping and explicit exposure .95 remain unchanged. Camera position/FOV/near/far unchanged.
- Graphite panel has a deterministic 128 × 128 roughness-only texture, repeated 8 × 8, mipmapped. Roughness varies approximately .379–.46. No bump, normal, displacement, diffuse grain or silhouette change. The finish is deliberately subtle rather than matching screenshot noise.
- Metal rims use darker graphite with high metalness and low/moderate roughness for controlled reflections instead of diffuse gray shading.
- Exported black barrel metal response restored approximately; inner blue coating retained at 30% of original linear color with low roughness. No emissive/glowing lenses.
- Flash restored to a pale dielectric, distinct from black sensor recesses.
- Chassis gets restrained metallic edge response. Front border, front camera and glass adaptation are unchanged.

## Scope and lifecycle preservation

Only `phone-model.ts` material preparation, `PhoneCanvas.tsx` environment/light setup and new local `phone-lighting.ts` changed in implementation.

Before/after hashes were checked and matched for all opening components/CSS, poses/timeline/easing, stand, entry component/CSS, screen-source contract and both source assets. The camera configuration and pose/application/screen/first-frame code within PhoneCanvas were not changed.

Same persistent model/canvas, display UV adaptation, duplicate visibility, front glass lift, initial pose, first-frame readiness, native scroll, screens A/B/C, typography, loader, stand and responsive coordinates. No fallback/poster assets were regenerated; static fallback retains the previous lighting representation. Successful loads still reveal real prepared WebGL directly.

## Browser validation and performance

Brave local development server:

- Before/after comparison at 2560 px wide native browser window, 1330 px page viewport height. Identical unchanged website back pose. DevTools was closed for the principal captures.
- Normal entry then native forward/back wheel scrub inspected; front, first rear, rear hold, second rear and stand checked using existing checkpoints.
- 390 × 844 responsive back pose inspected at DPR 1.5. [Narrow capture](captures/gate-02-6/back-narrow.png). No responsive composition changes.
- First-frame gate still completes before normal entry release. Pose checkpoint routes intentionally bypass normal entry as the existing debug mechanism.
- Context-loss button exercised in narrow emulation; canvas unmounted and existing static poster became visible. Expected context-loss messages observed. No lifecycle changes.
- Back: 32 draws / 12,499 triangles; front: 30 draws / 12,419 triangles. Counts unchanged. Demand frame counters settle at two initialization frames, update with scrolling/resize and remain idle afterward.
- Same one canvas, DPR cap 1.5, same model transfer size, same visible mesh count and material classes. One additional rear roughness texture/sample; 64 KiB raw RGBA data, approximately 85 KiB including full mip chain. One temporary 128 × 128 softbox map; disposed with generation scene after bake. Existing single PMREM target retained and disposed on cleanup.
- No new dependencies, network assets, continuous animation, render targets during scrolling, transmission pass or custom shader.
- No new runtime/hydration errors. Existing local manifest start_url/scope, Permissions-Policy, THREE.Clock deprecation and unused root-font preload warnings remain outside scope. Forced context loss produces expected messages.
- Lint, TypeScript, all 38 tests / 5 files, production build and git diff --check passed after final values.

This is a renderer sanity check, not a measured GPU frame-time, memory-pressure or physical-device benchmark. Narrow emulation is not physical mobile validation. Reduced-motion branching was unchanged rather than re-emulated in this gate.

## Remaining fidelity gaps and review

- Exact source-preview lighting/smoothing/shader setup is not established; ours deliberately retains a dark environment.
- Existing geometric faceting and simplified lens assembly remain. Material improvements cannot manufacture physical optical construction or missing authored normals/maps.
- Metal highlights vary through the turn; assess their brightness across the whole approved journey, not only the single selected frame.
- Roughness finish is subtle; source screenshot grain is not assumed to be an asset texture.
- Branding remains actual geometry, subdued by the retained material; no source edit or affiliation claim.
- Static fallback image retains its previous lighting. This does not affect successful normal-load entry → prepared renderer reveal.

Review http://localhost:3000/new, or the exact back checkpoint above. This gate ends here. No Section 02, further choreography or source-asset modifications are authorized by this work.
