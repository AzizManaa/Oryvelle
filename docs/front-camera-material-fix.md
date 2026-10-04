# Gate 02.6 follow-up — front camera material correction

Date: 2026-10-03. Branch: `feat/flowty-fidelity-redesign`.
Review: http://localhost:3000/new

## Diagnosis before editing

The front-camera surfaces were explicitly left unchanged during the rear-material calibration. `preparePhone()` still treated Object_65 (surround, Material.034) and Object_67 (inner optic, Material.035) identically: color #08090d, metalness 0.08, roughness 0.42. This removed the export's black-metal/glossy-optic separation and produced a diffuse gray, button-like surround in the actual hero.

Original GLB definitions, from the existing material inspection:

| Surface | Original linear color | Metalness | Roughness |
| --- | --- | --- | --- |
| Object_65 surround | 0, 0, 0 | 0.836461 | 0.5 |
| Object_67 inner optic | 0.000996017, 0.0473741, 0.0991472 | 0.680965 | 0 |

Geometry is a separate limitation. The exported surround genuinely protrudes in front of the display. At source scale its frontmost surface is approximately 0.02116 units before the original display, or 0.01816 before the adapted glass. The inner optic is also visible before the glass. World bounds and ray intersections established this during diagnosis: this is not a missing lens, a screen overlay covering it, or a central z-fighting problem. Materials cannot convert this modeled ring into a physically flush punch-hole. No geometry or master-asset edit was performed or implied.

## Exact correction

Only the Object_65/67 material branch in `components/landing/device/phone-model.ts` changed:

| Surface | Corrected runtime treatment |
| --- | --- |
| Surround | #020304, metalness 0.84, roughness 0.30 |
| Inner optic | original linear color multiplied by 0.3, metalness 0.68, roughness 0.055 |

The surround now responds as restrained black metal rather than a broadly lit gray dielectric. The inner optic retains a subtle cool coating and sharper reflected light, consistent with the rear optical calibration. This is an opaque optical approximation using the supplied surfaces, not a new transparent optical assembly. No emission, extra glass plane, transmission pass, normal replacement, or additional dependency.

Context7 was used with resolve-library-id followed by query-docs for `/mrdoob/three.js`. The current [Three.js material guide](https://github.com/mrdoob/three.js/blob/dev/manual/pages/materials.html) explains the distinct roughness and metalness responses. The [MeshPhysicalMaterial documentation](https://github.com/mrdoob/three.js/blob/dev/docs/pages/MeshPhysicalMaterial.html.md) describes the additional per-pixel cost of advanced features and the importance of environment lighting. The existing PMREM environment remains the reflection source. We did not introduce transmission to compensate for a material override issue.

## Preserved boundaries

Before/after file hashes match for PhoneCanvas, phone-lighting, every opening chapter component/CSS/timeline/pose/easing file, global entry component/CSS, screen sources, GLB and original blend. The phone-model diff is limited to the two front-camera material branches. Rear finish, camera framing/exposure, lights/environment, geometry/normals, duplicate visibility, front border/glass adaptation, display UVs, screen contract, loader, stand, responsive layout and choreography are unchanged.

Blender was not required for this material correction. If a genuinely flush camera is later required, a specifically reviewed source geometry adjustment/re-export is needed; this update does not claim that asset limitation is solved.

## Browser comparisons

Brave, actual website composition, desktop 2560-wide native window and responsive emulation 390 × 844:

- [Hero before](captures/front-camera/hero-before.png)
- [Hero after](captures/front-camera/hero-after.png)
- [Three-quarter after](captures/front-camera/quarter-after.png)
- [Returning front after](captures/front-camera/return-after.png)
- [Narrow hero after](captures/front-camera/hero-narrow-after.png)

The hero comparison uses the same viewport and existing authored hero checkpoint. The gray ring is suppressed; the inner optic remains distinct and subtly cool. The ring's original silhouette remains. Angled and returning-front compositions retain visible optical separation. Landscape stand composition was checked in the native scroll chapter; screen orientation and foreground occlusion remain intact.

## Validation and performance

- Normal entry → prepared real hero inspected; clean-route hard refresh also returned to the corrected hero. No poster shown on successful load.
- Existing native checkpoint controls, forward travel and a small reverse-wheel scrub inspected. Poses update without remounting or a visible camera-material pop.
- Narrow hero at 390 × 844 inspected in Brave device emulation.
- Context loss via existing debug control revealed the usable static fallback; clean reload recovered the renderer.
- Front: 30 draws / 12,419 triangles. Returning front and stand: 32 draws / 12,499 triangles. Desktop DPR 1.00. Demand frame counter settled at 2 on initialization and advanced only after interactions/resizing during checks.
- No textures, geometry, lights, render targets, animation schedulers or packages added. This correction has no additional draw calls or shader features.
- Console showed existing local manifest start_url/scope warnings, unsupported browsing-topics Permissions-Policy warning in device emulation, and THREE.Clock deprecation from the existing R3F canvas. No new material/shader/runtime errors were observed.
- ESLint passed; `tsc --noEmit` passed; 38 tests in 5 files passed; Next production build passed; diff whitespace check passed.
- Reduced-motion emulation and network throttling were not repeated for this two-material change; their lifecycle implementation is byte-for-byte unchanged.

The fallback poster was deliberately not regenerated: it retains the earlier camera finish and existing lifecycle. It is used only for failure/reduced-motion/static representation, not as an intermediate normal-load phone. Refreshing fallback artwork to the final reviewed material treatment remains an asset task.

## Stop point

Rendered front-camera material correction is ready for visual review. The raised source camera geometry and older fallback artwork are explicit remaining limitations. No Section 02 or other opening design work was undertaken.
