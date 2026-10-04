# Gate 02.7 — subtle persistent phone float

Date: 2026-10-03. Review: http://localhost:3000/new

## Scope and preservation

Implemented only additive ambient product motion on `feat/flowty-fidelity-redesign`. The pre-existing dirty working tree was preserved. No dependency, model, master Blender, screen asset, camera, lighting, material, layout, loader, typography, stand or section changes.

Before editing, hashes were recorded for the approved pose configuration, GSAP timeline, opening CSS, stand, lighting, screen sources, entry components and source assets. All match after this change. `phone-model.ts` changes only the controller interface; `preparePhone()` is unchanged. Section 02 is not implemented.

## Flowty inspection before implementation

Personally inspected https://flowty.co/ in Brave at a 2560 × 1330 page viewport. Advanced slowly through the opening, stopped at the requested compositions, and compared screenshots separated by several seconds (approximately 5–8 seconds for several holds).

| Checkpoint | Direct visual observation |
| --- | --- |
| Hero | Phone corner position and top-edge slope change slightly while the large headline remains stationary. Idle motion is separate from the animated screen. |
| Three-quarter | Small edge/screen perspective changes continue without further scroll input. No quick bob or bounce. |
| Rear-facing | Phone corners and camera position drift slightly over a hold. Some captures immediately after scrolling also contain residual whole-page settling, so those are not valid measurements of independent float amplitude. |
| Returning front | Screen playback continues independently; phone edge slope/position also changes subtly. |
| Second rear/diagonal | A slight angular change persists after scrolling stops. |
| Landscape approach | Small idle movement remains before supported contact. |
| Settled stand | No clearly visible independent movement of the phone relative to its support across the longer hold. Screen digits continue animating. Initial whole-composition settling is distinguishable from product float. |

**Inference, not measured implementation:** the visual effect is consistent with mixed translation and very small rotational breathing added to a scroll pose. Different axes/phases could explain its irregular feel, but exact local axes, phase relationships, periods and internal ownership were not established. Slow changes suggest several-second motion and roughly 10–20-second breathing cycles; this is a visual estimate, not Flowty's authored values. Apparent silhouette displacement is a few to low tens of pixels on its large product, depending on viewpoint and residual scroll settling. No claim is made that our numbers match theirs. The contact behavior justifies stabilizing our supported phone.

## Architecture and ownership

```text
existing scroll pivot — existing controller.apply(), owned by GSAP
  phone-ambient-pivot — PhoneFloat/useFrame only
    existing model orientation correction
      prepared persistent GLB
```

The large authored pose continues to be applied exactly as before. The controller now additionally receives normalized chapter progress through `setAmbientProgress()`, used solely by the ambient attenuation envelope. It does not modify any timeline keyframe or threshold. Screen swaps do not reset the ambient phase. One persistent phone and one canvas remain.

New files: `device/PhoneFloat.tsx`, `device/phone-float.ts`, `device/phone-float.test.ts`. Integration is limited to `PhoneCanvas.tsx`, the controller type and `OpeningChapter.tsx`.

## Authored motion parameters

Offsets are local model units before the existing outer scale/rotation. Model height is approximately 4.9612 units. Translation direction therefore follows the phone's outer orientation; it is not a new camera/world movement.

| Axis | Maximum local amplitude | Period (seconds) | Phase (radians) |
| --- | --- | --- | --- |
| X translation | ±0.012 | 11.7 | 1.1 |
| Y translation | ±0.045 total bound | 8.8 and 15.3, weighted 78% / 22% | 0.4 and 2.2 |
| Z translation | ±0.009 | 17.1 | 2.4 |
| Pitch | ±0.010 rad ≈ 0.573° | 14.7 | 0.7 |
| Yaw | ±0.018 rad ≈ 1.031° | 12.3 | 2.0 |
| Roll | ±0.012 rad ≈ 0.688° | 10.1 | 1.4 |

The Y bound is about 0.91% of phone height: roughly 10–12 pixels at the large hero composition, with additional small corner movement from rotation. Narrow screens naturally have smaller pixel displacement under the existing scale. Distinct periods/phases and a mixed Y signal avoid a conspicuous single bobbing cycle. Smooth sinusoids have no keyframe corners or sudden direction changes.

Float begins after entry release, with an initial 1.2-second smooth amplitude ramp from identity. This is an ambient blend, not a loading delay; readiness and entry duration are unchanged. The phase remains continuous across all poses and scrolling starts/stops/reversals.

### Supported-state attenuation

Full strength through progress 0.78. Smoothly attenuates between 0.78 and 0.905:

```text
t = clamp((progress - 0.78) / (0.905 - 0.78), 0, 1)
strength = 1 - smoothstep(t)
```

Zero with a zero-slope endpoint by the existing foreground/contact phase at 0.905, before the unchanged settled pose at 0.91. At and after contact the child is exact identity. Reverse scroll reconstructs the same smooth envelope, reintroducing motion before leaving approach. This envelope belongs to the float system; the approved GSAP timeline is untouched.

## Rendering and lifecycle

Retained `frameloop="demand"` and existing DPR cap. No extra RAF, GSAP ticker or animation scheduler. A `useFrame` callback updates the child refs and calls R3F `invalidate()` to request its next frame only while eligible.

Eligibility requires entry released, an intersecting canvas, a visible document, no reduced-motion preference, a valid WebGL context and positive float strength. IntersectionObserver, visibility and media-query events request a single wake-up frame; eligibility determines whether rendering continues. Fallback unmounts the renderer and cleans up subscriptions.

While unseen, active phase and transform freeze. Resume excludes paused wall time and caps frame delta at 50ms to avoid a jump after suspension. At contact the child is reset to identity and stops requesting frames. Scroll and resize can still legitimately request isolated frames. Loading retains the prepared-first-frame contract; ambient motion remains disabled under the entry.

**Performance consequence:** the unsupported visible phone now renders at display cadence even when scrolling is stationary. This intentionally costs GPU work compared with the previous frozen demand renderer. The visible chapter is scoped; this does not enable an application-wide permanent loop. No new geometry, textures, lights, render targets or postprocessing. Observed counts remain 30–32 draws and 12,419–12,499 triangles depending on viewpoint. This is a sanity check, not a hardware energy or full performance benchmark.

Context7 documentation consulted before implementation:

- [R3F demand rendering and invalidation](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx)
- [R3F frame mutation and performance guidance](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/pitfalls.mdx)
- [R3F scheduler implementation](https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/loop.ts)

## Browser validation

Brave, actual `/new` and its existing debug checkpoint route:

| Test | Result |
| --- | --- |
| Idle hero | Subtle motion and continuing frame counter; no typography movement. |
| Idle three-quarter / rear | Slight position/angle changes remain; full physical back preserved. |
| Returning front | Screen B retained; motion continues without screen-threshold reset. |
| Second turn | Same persistent phone; tiny additive movement remains. |
| Slow / normal native wheel scroll | Large approved choreography remains dominant. |
| Rapid forward/back input and stopping | No visible transform competition or snap observed. |
| Landscape approach | Amplitude diminishes as contact approaches. |
| Stand settlement | Frame count held at 5292 across a six-second idle interval; phone is stable on support. |
| Reverse from stand | Frames resume; motion returns smoothly through the envelope. |
| Hidden tab | Counter 1673 before tab switch and 1693 shortly after return despite the intervening multi-second hold: only transition/resume frames, rather than continuous hidden rendering. No phase jump visible. |
| 390 × 844 mobile emulation | Reloaded entry/hero, scroll through turn and stand; DPR 1.5 cap retained. Motion stays restrained. |
| Reduced-motion emulation | Existing static representation shown on reload; console confirms zero canvas elements. Ambient rendering absent. |
| Context loss | Existing test control switches to static poster; frame counter stops at 1751. Normal reload recovers. |
| Clean route after tests | Restored `/new`, emulation disabled, entry and prepared real phone verified. |

Desktop page viewport was 2560 × 1330; DevTools docking also exercised a shorter page. Mobile is browser emulation, not a physical-device benchmark. Crossing the desktop/mobile breakpoint resets the existing chapter layout; reload in the target viewport was used for clean composition validation. This pre-existing layout behavior was not redesigned in this motion-only gate.

Console contains existing manifest start_url/scope warnings and Three.Clock deprecation from R3F. Mobile emulation additionally reports the existing unrecognized browsing-topics header warning. No new ambient-motion exception observed. These unrelated warnings were not changed.

## Static checks

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm test`: passed, 41 tests across six files, including three new attenuation/bounds/continuity tests.
- `npm run build`: passed, Next.js 16.3.3 production build.
- Protected-file hashes: all unchanged.

## Captures and review limits

- `captures/gate-02-7/hero-a.png`, `hero-b.png`: clean hero at different ambient phases (not a calibrated displacement measurement).
- `captures/gate-02-7/rear-idle.png`: existing rear composition during idle motion.
- `captures/gate-02-7/stand.png`: stable supported composition.
- `captures/gate-02-7/context-loss-fallback.png`: retained static fallback after context loss.

Still images cannot establish animation quality by themselves; review the live route and pause at checkpoints. Our motion deliberately uses independent authored values, rather than claiming exact reference reproduction. No other visual refinement or later section work was performed. Stop here for visual review.

## Review revision — stronger ambient presence

After user review found the first pass too subtle, increased translation approximately threefold and rotation approximately threefold; periods shortened modestly to 8.8–17.1 seconds. The table above now reflects the current values. No lifecycle, float attenuation, scroll timeline or approved composition changes. Hero and rear idle movement is now visibly readable over a short hold. Brave checks repeated hero/rear holds, native forward/reverse scrolling, approach and supported stand: no visible snap; stand counter remained at 1852 during idle. Rendering cadence and geometry cost unchanged. Lint, TypeScript, 41 tests and build passed again. Earlier captures document the initial pass, not this stronger tuning.
