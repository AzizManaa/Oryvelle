# Gate 04A — Section 02 static composition

Status: implemented for visual review. No Section 02 scroll animation, pinning, playback, new ScrollTrigger or Section 03 was implemented.

Review: [http://localhost:3000/new](http://localhost:3000/new). Scroll past the approved opening and its existing release boundary to “Your night. Your mix.” The section is `#your-mix`; the existing refresh contract intentionally starts the page at the opening.

## Product authority and evidence

The Android app, not Flowty or the promotional artwork, supplies this section’s content. This builds on the hands-on ADB inspection recorded in `docs/oryvelle-product-design-section-02-proposal.md` and its PNG/UI XML evidence. The connected Samsung device was also checked through ADB during this gate; its current Tonight state was empty. The specific mixer/timer imagery below comes from the previously captured, inspected interaction states, not from that empty state.

Android project: `/Users/yami/Documents/Android/AURA-Sleep`, inspected HEAD `00aa2049a9eb85db0dc7348d71604d27afbae0a7`. No Android source was changed. Its existing untracked `.wrangler/` and `sample-data/` remain untouched.

- **Calming Rain** (`calming_rain`) and **Brown Noise** (`brown_noise`) were selected and played during the device inspection. The current local sounds catalog independently identifies both as `availability: active`, with public audio and cover access. Neither is a coming-soon or Premium-only sound. The device was Premium-active; public/free availability is source-derived, not a clean free-account billing test. No claim is made that the entire published catalog was revalidated online.
- `04-multi-sound-field.png` shows exactly those two layers, both at 50%, with Brown Noise selected and its independent volume slider. This is the actual mixer state used by the website.
- `16-timer-running.png` and its UI XML show a running 30-minute timer at 29:58, with Fade Out checked. The implementation’s `SleepTimerManager.kt` supports this timer/fade behavior. Full timer expiry was not waited out during the inspection.
- Explore illustrations come from `rain_audio_constellation.xml` and `wave_audio_constellation.xml`. The app coordinates illustration geometry and sound nodes separately; the website does not recreate catalog coordinates or the entire Explore screen.
- Orb identity was grounded in Tonight device captures and the source responsibilities in `OryvelleOrbRendering.kt`, `OryvelleOrbGeometry.kt`, `BlackHoleField.kt` and `OrbMixerScene.kt`. No Android rendering implementation was copied.

## Composition

Exact core copy:

> Your night. Your mix.
>
> Choose your sounds. Balance each layer. Set a sleep timer.

The static composition has three readable regions, allowing a later gate to reveal the story progressively:

1. **Discovery:** editorial headline/copy above two named selected nodes. Dim rain and wave constellation illustrations sit behind brighter nodes. Only Calming Rain and Brown Noise are represented as selected sounds.
2. **Mix:** a dominant dark ringed orb, two actual sound avatars and one quiet caption. The center is near-black; flattened rings and sparse surrounding paths define the object. SVG drawing order puts rear rings behind the center and foreground ring arcs over it. Six faint nearby dots replace a dense star field.
3. **Practical endpoint:** a small real mixer crop demonstrates independent volume control; a real timer crop and concise caption demonstrate a 30-minute fade-enabled timer. These are illustrations of app controls, not simulated website controls.

The background is near-black violet with restrained teal/violet radial illumination. The inherited Outfit typography connects the chapter to the approved website, while the orb/constellation replaces the opening’s hardware-dominant subject. No new phone, bright sphere, feature grid or galaxy wallpaper was added.

Desktop places the mixer and timer beside one another at the bottom. Their relative prominence can be sequenced later. Mobile puts the timer last in normal document flow. The existing 75svh opening boundary and model attribution remain unchanged; their spacing has not been redesigned in this gate.

## Literal UI versus editorial translation

| Element | Representation |
| --- | --- |
| Mixer excerpt | Literal crop of the actual two-sound app state; labels, selected track and volume slider retained |
| Timer excerpt | Literal crop of the actual countdown ring and 29:58 text |
| Sound avatars | Literal crops of the two real app avatars, including their rims |
| Rain/wave illustrations | Actual Android vector path geometry converted to SVG with website stroke/color treatment |
| Selected nodes and names | Editorial HTML/CSS arrangement inspired by Explore; not a screenshot or assertion of exact app map positions |
| Ringed orb | Original SVG translation of the product motif; not a literal Canvas snapshot or an interactive mixer |
| Headings/captions/30-minute label | Editorial explanation of verified functionality |

The static page does not play audio, move avatars, change volumes or count down. Raster controls are not focusable and contain no fake clickable controls. Descriptive image alternatives communicate the actual selected state; decorative paths/orb art use empty alternatives. Real headings and captions carry the story without requiring images.

## Assets and provenance

Assets are under `public/mix/`. Source device captures remain under `docs/captures/product-inspection/`.

| Asset | Dimensions / bytes | Source / treatment |
| --- | --- | --- |
| `rain-constellation.svg` | viewBox 1109.8×1044.4 / 9,535 B | Rain vector path conversion, muted blue strokes |
| `wave-constellation.svg` | viewBox 1076.5×947.7 / 3,910 B | Wave vector path conversion, muted violet strokes |
| `orb.svg` | viewBox 800×700 / 3,002 B | Original editorial artwork; layered paths/gradients, no SVG filters or animation |
| `calming-rain.webp` | 81×81 / 2,626 B | `04-multi-sound-field.png`, crop `(100,2399,181,2480)` |
| `brown-noise.webp` | 81×81 / 1,636 B | Same capture, crop `(640,2399,721,2480)` |
| `mixer-excerpt.webp` | 1340×490 / 24,472 B | Same capture, crop `(50,2320,1390,2810)` |
| `timer-excerpt.webp` | 840×700 / 19,560 B | `16-timer-running.png`, crop `(300,1680,1140,2380)` |

The source constellation vectors carry the Android Open Source Project’s Apache-2.0 notice. Conversion modifications and attribution are retained in `public/mix/ATTRIBUTION.md`, with the full license in `LICENSE-Apache-2.0.txt`. Product screenshots are separately identified as Oryvelle imagery.

## Architecture and opening boundary

- `MixChapter.tsx` is a Server Component: semantic HTML, `next/image`, and scoped CSS Modules.
- The existing `/new` Server Component supplies it as children to `OpeningChapter`. Next.js documentation consulted through Context7 (`/vercel/next.js`) confirms server-rendered children can be passed through a Client Component boundary; local image dimensions and `sizes` support stable responsive imagery.
- A single optional children slot appends the section after the existing opening boundary, inside the existing main landmark. This avoids creating another main or coupling the section to the opening pose controller.
- The static section has no hooks, GSAP import, progress state, RAF, new canvas or scroll listener. No package was installed.
- CSS owns only this chapter. No opening selector, global scrollbar rule, font definition or layout value was changed.

Pre-edit SHA-256 baseline: `docs/captures/gate-04a/baseline-sha256.json`. Comparison found changes only in `app/new/page.tsx` (import/pass the new section) and `OpeningChapter.tsx` (optional children/slot). Opening timeline, poses, CSS, entry, stand, phone renderer, materials, lighting, screen and float files retain their baseline hashes.

## Responsive structure

| Width | Composition |
| --- | --- |
| Above 1100px | Heading/copy share an editorial row; spacious constellation; centered orb up to 800px; mixer/timer columns |
| 761–1100px | Stacked heading/copy; smaller illustration field and orb up to 680px; explanatory discovery microcopy omitted; mixer/timer remain separate columns |
| 760px and below | Normal-flow vertical headline → constellation → orb/mix → mixer excerpt → timer; no fixed/pinned stage; cropped illustration margins preserve legibility of both selected names |

The orb’s image width reaches the viewport on mobile while the labels/copy retain 24px side margins. At 320px the headline intentionally wraps. The mix region has sufficient height for its caption to clear the control area; the static screenshot never overlays the orb. All content remains available under reduced motion because this section has no animation.

## Captures

Browser captures are complete **Section 02 crops** of the page, not a separate mockup. Next’s small development indicator may appear in a capture; it is not product UI.

### Desktop — 1440×900 viewport

![Desktop Section 02](/Users/yami/Documents/Next/noxelle/docs/captures/gate-04a/desktop-1440.jpg)

### Tablet — 1024×900 viewport

![Tablet Section 02](/Users/yami/Documents/Next/noxelle/docs/captures/gate-04a/tablet-1024.jpg)

### Mobile — 390×844 viewport

![Mobile Section 02](/Users/yami/Documents/Next/noxelle/docs/captures/gate-04a/mobile-390.jpg)

Additional small-phone capture: `docs/captures/gate-04a/mobile-320.jpg` (320×720 viewport).

## Validation and performance implications

Brave inspection covered 1440×900, 1440×700, 1920×1080, 1024×900, 390×844 and 320×720. Desktop/tablet/mobile section captures were inspected directly. Document width matched viewport width at measured 1920/1024/390/320 checkpoints; no horizontal overflow was present. Tablet sentence spacing was corrected after removing responsive line breaks. Mobile is a rearranged vertical composition, not a reduced desktop montage.

The normal page was refreshed: existing global entry released to the prepared hero. Forward scrolling checked the rear phone pose, settled stand and release to the new normal-flow content. The development poster fallback released correctly with zero canvases and Section 02 still present. The original context-loss/reduced-motion lifecycle files remain hash-identical; those failure mechanisms were not separately fault-injected again in this static gate.

The seven rendered source assets total **64,741 bytes (~63.2 KiB)** before HTTP compression/Next image delivery. License/notice files are not page media requests. Raster images use Next’s existing responsive optimization and default lazy loading; SVGs remain vector imagery. There is no additional client animation payload, render loop, audio request, font, GPU scene or video. No FPS, memory, battery or Core Web Vitals improvement is claimed.

Checks:

- ESLint: passed.
- TypeScript (`tsc --noEmit`): passed.
- Complete existing Vitest suite: **41 tests / 6 files passed**.
- Production build: passed; `/new` prerendered as static content.
- `git diff --check`: passed. New files were also checked for trailing whitespace.
- Browser console: no new Section 02 errors observed. Existing `THREE.Clock` deprecation warnings from the approved opening remain; no renderer change was made to address them.

## Asset gaps and review decisions

- Avatars are faithful 81px device crops. Approved original cover exports would improve future high-DPR artwork if they need to grow beyond their current small size.
- Mixer/timer crops are real UI suitable for this prototype. A production capture pass may refine sharpness/cropping and remove residual background specks without inventing UI. On the smallest screen the mixer labels are deliberately small; surrounding accessible text explains the functionality.
- The orb is a static editorial translation. Its precise ring luminance/path density requires visual approval, not a claim of pixel-perfect Android equivalence.
- Existing opening boundary spacing is retained. Any later transition change requires a separate approved gate.

## Opportunities for Gate 04B — not implemented

1. Reveal the dim constellation structure before the two selected nodes.
2. Carry those same two named layers toward the orb’s satellites without introducing more sounds.
3. Let ring/front-back occlusion and restrained light establish the active mix.
4. Reveal the actual volume excerpt only after the mix metaphor is understood.
5. Introduce the supported timer last and soften the atmosphere into a calm endpoint.

Desktop may warrant one deliberate scene timeline after static composition approval. Mobile should retain normal flow and avoid a long pinned chapter. Keep reduced-motion content complete and the approved opening’s progress owner independent. Audio playback and interactive website mixing remain separate product decisions.

**Stop gate:** static visual structure is ready for review. No Gate 04B choreography or Section 03 work has begun.
