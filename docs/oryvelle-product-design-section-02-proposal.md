# Oryvelle product design inspection and Section 02 proposal

Status: research and composition proposal only. No website implementation or Android source modification.

## Scope and evidence

The final steering narrowed the emphasis to the app's design, orb, constellations and theme. Those are the primary design references below; the feature inventory supports truthful storytelling rather than specifying a recreation of every app screen.

- Hands-on: connected Samsung SM_S948B, actual installed `com.nekodesk.oryvelle`, version 1.0 / code 32, 1440×3120 device captures. Launched through ADB and navigated the app, rather than inferring behavior from promotional images.
- Source: `/Users/yami/Documents/Android/AURA-Sleep`, HEAD `00aa2049a9eb85db0dc7348d71604d27afbae0a7`. Source declares the same version; exact binary-to-commit provenance is not established.
- Device Settings showed Premium **Active** and personalization **Skipped**. The inspected UI is therefore not a clean free-user trial. Free limits below are explicitly source-derived.
- Local catalogs: sounds v5, meditations v9, under `backend/oryvelle-worker/restless-feather-44ea/content/v2`. These are local definitions, not a claim that today's published catalog was independently verified. A read-only request to the public production catalog returned HTTP 403; no access restriction was bypassed.
- ADB documentation was checked using Context7 (`/websites/developer_android_tools`); [Android ADB documentation](https://developer.android.com/tools/adb). No library implementation work was required.
- Capture evidence is in `docs/captures/product-inspection/`. PNGs and corresponding UI XML are internal analysis artifacts; they are not automatically website-ready marketing assets. A 12-second breathing recording is also retained.

Evidence labels: **observed** = device interaction/screenshot; **source** = inspected implementation; **proposal** = website design recommendation. Source support does not imply full runtime, auditory, billing or long-term validation.

## Recommendation

**Section 02 — Your night. Your mix.**

Introduce Oryvelle's actual visual world: sounds appear as stars in illustrated constellations, then selected sound layers gather around the dark ringed orb. Anchor that visual story with a simple product explanation: choose sounds, balance their volumes, set a sleep timer.

The orb and constellation are meaningful product interfaces. They should be the subject of this section, not a decorative cosmic wallpaper behind unrelated claims. This is a proposed new chapter after the approved opening releases; it does not change the hero, stand, loader, phone or opening atmosphere.

Use Flowty's restraint, spatial continuity and pacing. Let Oryvelle supply the content and identity. Do not inherit Flowty's wrist photography, productivity statistics or hardware ecosystem as the next story.

## 1. The app's visual identity

### The orb: a dark center with light around it

**Observed:** Tonight gives a large portion of the screen to a near-black center, flattened luminous rings and curved orbital paths. Its darkness is intentional: the eye reads the object through surrounding light, not through a solid glowing sphere. Selected sounds appear as small photographic circular satellites with colored rims. The field remains spacious even with multiple sounds.

The composition uses:

- a dark, soft-edged event-horizon center;
- elliptical rings crossing in front and behind it;
- faint curved paths and thin orbital strokes;
- teal/blue illumination spreading into a violet night field;
- sparse stars with varied sizes and brightness;
- sound-specific colored rims and image thumbnails;
- pale, lightweight typography separated from the object by generous space.

**Source:** `ui/components/OryvelleOrb.kt`, `OryvelleOrbRendering.kt`, `OryvelleOrbGeometry.kt`, `BlackHoleField.kt`, `OrbMixerScene.kt`, `OrbMixerLayout.kt`, `OrbMixerPhysics.kt`. The runtime orb is Compose Canvas drawing with layered paths/gradients, accretion disks, lensing bands and coordinated motion—not a single reusable 3D model or simply `splash_oryvelle_orb.png`.

**Important functional link:** `OrbMixerScene.kt` maps sound-avatar dragging to volume by radial distance and stereo pan by horizontal displacement. It freezes orbit progression while dragging and resumes afterward. This is source-confirmed; this pass exercised the explicit track-control sliders, not a complete quantitative avatar-drag test. Do not claim the orbital layout is arbitrary decoration, but do not market it as a scientifically meaningful spatial simulation.

**Website takeaway:** preserve the dark center, ring occlusion and quiet light hierarchy. A bright neon ball, full-screen particle storm or generic wireframe planet would lose the app's identity. The satellites should represent actual sound layers, not invented celestial navigation.

### Explore: illustrated sound constellations

**Observed:** Explore is a movable sound map, not a conventional list of rectangular cards. Categories sit along a thin horizontal guide with a teal active node. In the field, playable sounds are bright star nodes with names. Category artwork forms recognizable motifs: a rain cloud/lightning/droplets, a nature motif, and circular wave geometry. Lines are dimmer than nodes and labels.

- Selecting Rain & Storms moves the map toward that cluster.
- Dragging pans the map; this was exercised on the device.
- Double-tapping zooms it; a timed double tap visibly enlarged/reframed the map.
- Source also supports pinch zoom, clamped to 0.6–2.0; pinch itself was not exercised through single-pointer ADB input.
- Search expands a compact top-right control and filters names; typing `rain` removed nonmatching nodes.
- Selected sound nodes gain rings; the dock changes to playback/mixer controls.
- Tonight's Path draws a warm gold connection between suggested sounds and provides `Load →`; tapping it produced `Loaded ✓` and a three-sound mix on this Premium-active device.
- A visible star is not proof of availability. Tapping Midnight Rain produced `"Midnight Rain" — coming soon`.

**Source:** `ui/explore/ExploreScreen.kt`, `StellarMapCanvas.kt`, `StellarMapGeometry.kt`, `StellarMapRendering.kt`, `StellarMapOverlays.kt`, `StellarMapControls.kt`, `OrbLayout.kt`, `ConstellationPathCache.kt`, `TonightsPathOverlay.kt`.

Artwork is Android vector drawable path data, parsed by named `edge_N` / `node_N` paths and mapped into constellation geometry:

- `res/drawable/rain_audio_constellation.xml`
- `res/drawable/nature_audio_constellation.xml`
- `res/drawable/wave_audio_constellation.xml`

Do not treat every category as having unique supplied artwork: there are three drawable templates, with additional layout/rendering logic. The illustrated constellation and tappable sound nodes are coordinated layers.

**Website takeaway:** a sparse, legible constellation can explain sound discovery while retaining the cinematic grammar. Show two clearly named, actually available sounds. Avoid reproducing the entire scrollable map, every category and all labels at once.

### Atmosphere and depth

**Observed:** the app is not uniformly purple. Its light changes with time of day and selected sound content. Empty Tonight is quiet; an active mix has stronger teal/blue or warm accents. Compare the supplied evening Campfire/Forest Night capture with this inspection's late-night Rain/Brown Noise state before calling palette differences outdated.

**Source:** `ui/home/sky/HourPalette.kt` defines day, dusk, twilight, deep night and pre-dawn bands, with a 30-minute crossfade window at boundaries. `SkyScene.kt` and the deep-field/nebula/starfield/shooting-star planes separate atmosphere from foreground UI. `ui/home/motion/MotionEngine.kt` coordinates motion; the home passes playback/timer context to it. This source behavior was not observed across an entire day.

Depth is created by overlapping rings, translucent broad nebula light, tiny stars, occasional larger soft points, crisp foreground avatars and dark translucent controls. The orb is the focal object; most stars are quieter than the text.

**Website takeaway:** let a restrained teal light join the existing lavender field as Section 02 introduces the real product. Do not implement a whole night-to-dawn site journey or restore the discarded old landing architecture merely because the app supports time-based sky colors.

### Color, surfaces and typography

Source tokens in `ui/theme/Palette2026.kt`:

| Role | Token/value | Website interpretation |
|---|---|---|
| Deep background | Void `#080510` | Dark violet undertone, not featureless absolute black everywhere |
| Elevated backgrounds | `#0D0A18`, `#130F1E` | Subtle separation without bright cards |
| Active/action | AuroraTeal `#00E0C7` | Reserve for selected sound/state or concise interaction |
| Secondary atmosphere | NebulaViolet `#8F82E8`, AuroraLavender `#B89AFF` | Soft light, quiet secondary accents |
| Text | Moonlight `#EDEAF5` | Pale readable type |
| Supporting text | Stardust `#B8B5C7`, Silver `#7C8094` | Hierarchy; verify contrast when used on the website |
| Suggested path | StarlightGold `#F0C060` | A specific recommendation cue, not a general gold theme |
| Other accents | Amber, rose, cyan | Sound/time context; do not use every accent simultaneously |

`Brushes.kt`: restrained radial light, default alpha 0.08; `auroraSky` combines subdued teal/violet/rose vertical colors at alpha 0.12. `Shape.kt`: 8/12/16/24/32dp rounded hierarchy. These values describe Android, not mandatory website pixels.

`Type.kt`: Plus Jakarta Sans, lightweight display headings, regular body and medium/semibold controls. Examples: display 48sp/56sp line-height; headline 32/40; body 15/24. Rounded, open letterforms soften the technical constellation imagery. Retain the approved website type; carry forward its air and hierarchy rather than swapping fonts during the next gate.

### Motion grammar

Observed ambient orbital/ring movement continues in active playback and breathing. Breathing uses the same object in an expanded composition with phase labels and dots, instead of introducing a separate visual identity. Immersive mode expands the orb and removes surrounding chrome; tapping reveals compact playback/timer/save/exit controls that later hide again.

Source includes shared orb transitions, approximately 800ms palette adaptation on mix changes, 420ms avatar transitions, and 2.4s/3s stellar pulse cycles. Breathing is Box (4/4/4/4 seconds) or 4-7-8 (4/7/8 seconds). These are product implementation facts, not timings to copy wholesale onto the website.

Website grammar: slow ambient life, clear selection, restrained spatial movement, readable pauses. Do not synchronize every star to scroll or animate each letter. Keep the visual alive only while visible, and provide a static reduced-motion composition.

## 2. Representative visual evidence

Paths below are relative to this document. Full-resolution captures include device/system chrome; crop and recapture deliberately before production use.

| Evidence | Why it matters |
|---|---|
| [Tonight with two sound layers](captures/product-inspection/11-tonight-mix.png) | Orb, satellite imagery, ring occlusion, active atmosphere, normal UI hierarchy |
| [Explore](captures/product-inspection/52-explore-clean.png) | Real constellation library and category navigation |
| [Rain cluster after panning](captures/product-inspection/54-constellation-panned.png) | Legible illustrative motif and node/label hierarchy |
| [Selected multi-sound state](captures/product-inspection/04-multi-sound-field.png) | Product connection from stars to layer controls |
| [Manual volume/pan](captures/product-inspection/06-volume-pan.png) | Actual functional detail behind the atmospheric metaphor |
| [Automatic panning](captures/product-inspection/07-auto-pan.png) | Verified advanced controls, not a fake equalizer |
| [Breathing](captures/product-inspection/22-breathing-active.png) | Same identity expanded into a focused practice |
| [Active meditation](captures/product-inspection/28-meditation-active.png) | Distinct arched artwork and calm editorial hierarchy |
| [Meditation with sound field](captures/product-inspection/30-player-sound-field.png) | Voice plus ambient layers |
| [Routine breathing](captures/product-inspection/76-routine-breathing.png) | Orb reused within a real sequence |
| [Routine timer arrival](captures/product-inspection/77-routine-timer-step.png) | Verified mix → breathing → timer handoff |
| [Journal empty state](captures/product-inspection/39-sleep-notes.png) | Actual reflection UI; not automatic sleep tracking |
| [Insights empty state](captures/product-inspection/42-sleep-trends.png) | Data-dependent content, not a permanently populated dashboard |
| [Local artwork contact sheet](captures/product-inspection/local-artwork-contact-sheet.jpg) | Comparison of all twelve located supplied captures |

Some numbered captures record unsuccessful taps, intermediate transitions or repeated cleanup states. They are not recommended art: notably 08/09 still show track controls, 14 does not show a timer, 19 is immersive, 25 is still the meditation library, and 35 is another session setup. Use the named evidence above rather than assuming filenames certify screen identity.

## 3. Product-content inventory

| Feature and actual function | Navigation/state exercised | Strongest visual/interaction | Website suitability and qualifications |
|---|---|---|---|
| Tonight: playback hub, suggested actions, mix/timer/practice entry | Launch → Tonight; empty and active two/three-layer states | Dark ringed orb with sound satellites; immersive expansion | Very high. Greeting/suggestions depend on time, profile and history; not fixed copy |
| Explore: category/search sound discovery | Dock Explore → Rain category → pan/zoom → search `rain` | Illustrated constellation nodes; selection rings | Very high. Explain that stars are sounds. Some displayed nodes are unavailable |
| Multi-audio mix: simultaneous selected layers | Calming Rain → Brown Noise → Open sound field; later Tonight's Path | Two named layers and independent volumes | Best immediate functional story. Source limit two free/five Premium; Premium-active runtime supports >2 |
| Per-layer controls | Sound field → Track controls for Brown Noise → volume/pan/reset | Volume 29%, manual pan 58% left; reset back | Useful supporting detail, not hero-scale dense panel. Stereo pan/auto-pan are Premium + remote flag gated |
| Automatic panning | Track controls → Automatic panning on | Width Subtle/Balanced/Wide; sweep speed 10s observed | Strong differentiator but needs explanation/headphones for meaningful audible demonstration. Source range 4–20s. Do not call it head tracking or surround sound |
| Orb sound-avatar control | Tonight selected satellites; gesture mapping inspected in source | Radial volume + horizontal stereo mapping | Visually distinctive. Mapping source-confirmed; precision/avatar-drag behavior not fully exercised |
| Saved mixes | Tonight bookmark → Save Mix sheet; dismissed without save | Named blend, 0/5 saved | Useful later. Source storage caps saved mixes at five; do not promise unlimited presets |
| Sleep timer | Active mix clock / immersive Timer → 30m → Start → Pause → Cancel | Circular timer picker/countdown; optional fade | High as end of mix story. Source 5–600 minutes and final two-minute fade. Countdown tested; full expiry not waited out |
| Breathing | Tonight Breathe → Box/4-7-8 → Start → phase → stop | Orb expands/contracts with phase label | High alternative/subsequent story. Rhythm guidance, not treatment or guaranteed sleep outcome |
| Meditation library/programs | Dock Meditation → journey → session → setup | Aurora header, real illustrated covers, progress | High but a different content chapter. Three locally defined programs/17 sessions, first session of each public/free preview, others Premium |
| Guided session + companion mix | Arriving in the Present → Keep current mix → Begin → Pause → sound field → End | Arched artwork, voice volume, independent ambient layers | High later. Source/observed controls; exact spoken narration/audio quality not evaluated. End-session dialog stops meditation and all active sounds |
| Tonight Routine | Tonight scroll → Build → Tonight's Path + Box +30m → Start now → Done → Timer → Stop | Genuine mix → breathing → timer sequence | High later because it ties toolkit together. Saved a temporary inspection routine, then removed only that routine. Reminder disabled for this test |
| Sleep Notes / Sleep Journal | Dock Sleep notes → Add entry → fields → Cancel | Calendar, rating, optional duration/mood/note | Moderate later. Entirely self-reported; no fabricated entry saved |
| Sleep Trends / Sleep Insights | Journal top-right trend icon | Empty state observed; charts/eligibility source inspected | Later, with labeled illustrative history if needed. Ratings/trends are not sleep-stage sensing; bedtime consistency reflects playback starts |
| Personalization / Tonight's Path | Settings Skipped; Explore Load path | Gold path joins suggestions, loaded mix | Useful but don't call it clinical/AI sleep diagnosis. Rules use explicit profile and local behavior/history |
| Settings | Tonight gear → playback/timer/routine/history/backup/Premium/language | Calm rounded panels, teal selected state | Supports trust/feature accuracy, not Section 02 focus. Duck notifications, default volume, 0.5–5s saved-mix crossfade; backups are sleep-notes backup, not whole-app sync |
| Premium | Settings Active; session Free preview/Premium labels | Restrained feature/access labeling | Do not invent price/free trial or imply every sound/practice is free. No purchase made or entitlement changed |

### Implemented versus unavailable/unverified

Core routes, mixer controls, breathing, guided playback, timer and routine sequencing are wired to real implementations, not presentation mockups. Hands-on behavior supports the rows above. This is not an Android reliability audit or exhaustive feature test.

Local sound catalog: **22 entries, 19 active, three coming soon**. Coming soon: Midnight Rain, Rustling Leaves, Gamma Focus. Active catalog: 18 public audio references and one Premium (Cosmic Drone). Actual current published total remains unverified independently. Never use a visible unavailable star as a playable website-demo sound.

Volume-drift fields/engine support exist in `SoundMix.kt` / `OryvelleAudioManager.kt`, but no current user-facing toggle was found in the inspected controls. Treat as internal capability, not an advertised accessible feature. `ExperimentalMaterial3Api` annotations are library opt-ins, not proof a product feature is unfinished.

Data-rich Sleep Trends is source-implemented but was not exercised with a populated user history; the device had zero notes. Source requires enough entries for graphs/weekday comparisons and at least three matched nights for a saved-mix association. The source explicitly says this is exploratory local association, not clinical confidence. Playback-based bedtime consistency requires qualifying history; copy states: “This reflects playback start times, not when you fell asleep.”

Paywall strings include “Unlimited soundscapes” / “Hundreds of sounds across all categories.” The inspected catalog does not substantiate hundreds. Do not reuse these claims on the website. Price, future catalog expansion, medical benefit, improved sleep and superiority claims are not established by this inspection.

## 4. Source and asset map for later work

All paths in this section are inside the Android project. No Android files were changed.

| Concern | Source/assets | Use later |
|---|---|---|
| Routes / names | `ui/navigation/OryvelleRoutes.kt`, `MainAppHost.kt`, `res/values/strings.xml` | Exact terminology; Tonight, Explore, Sleep notes, Meditation; secondary Trends/settings destinations |
| Home / orb transitions | `ui/home/HomeScreen.kt`, `HomeBreathingContent.kt`, `ui/components/OrbMixerScene.kt` | Observe shared object and semantic controls; don't transplant Android code |
| Orb geometry / light | `ui/components/OryvelleOrb*.kt`, `BlackHoleField.kt` | Translate the visual motif deliberately; real runtime is procedural |
| Sky layers | `ui/home/sky/SkyScene.kt`, `HourPalette.kt`, plane files, `ui/home/motion/MotionEngine.kt` | Layer hierarchy, quiet light, time/context coloration |
| Constellation templates | Three drawable XMLs listed above, `ConstellationPathCache.kt`, `OrbLayout.kt` | Own product artwork; convert named paths carefully if future SVG needed |
| Palette / type / rounding | `ui/theme/Palette2026.kt`, `Type.kt`, `Brushes.kt`, `Shape.kt`, `Theme.kt` | Product identity reference, not an authorization to change approved website tokens |
| Sound controls / engine | `ui/playback/SoundFieldTrackControlsSheet.kt`, `audio/PanAudioProcessor.kt`, `OryvelleAudioManager.kt`, `PlaybackController.kt` | Real volume/stereo controls; equal-power pan; future factual labels |
| Timer / routine | `audio/SleepTimerManager.kt`, `domain/model/TimerDurationPolicy.kt`, `ui/home/RoutineBuilderHome.kt`, `ui/viewmodel/SleepRoutineViewModel.kt` | State sequence and qualification |
| Meditation artwork | `res/drawable-nodpi/meditation_library_aurora.webp` (941×1672); catalog public cover refs | Actual library aurora and session/program artwork |
| Other bundled art | `splash_oryvelle_orb.png` (1024²), premium aurora/moon (1086×1448) | Splash/upgrade-specific; do not mistake for interactive orb renderer |
| Notification art | rain/nature/noise/mix WebP, 1024×576 +320×180 variants | Secondary imagery, not the main app background |
| Remote product art/audio | `content/v2/{sounds,meditations}/catalog.json` and `assets.json` | Hashed public cover keys and public/Premium audio separation |
| Journal/trends | `ui/journal/*`, `ui/stats/*`, `domain/model/MixCorrelationEngine.kt`, `FeaturedInsight.kt` | Truthful self-report and evidence thresholds |

Catalog manifests define 22 sound covers/19 audio files and 18 meditation covers/17 audio files. They reference source-relative filenames and hashes; the asset-master directory itself was not identified in this checkout. Runtime loads covers through image URLs. Do not substitute contract-test fixture programs for real catalog content.

Icons primarily use Material rounded vectors (music, meditation, timer, bookmark, settings); notification/launcher icons are supplied Android vector assets. Stars, thin constellation paths and rounded dark UI surfaces are the more distinctive identity elements—not a new unrelated icon family.

## 5. Supplied promotional/capture comparison

Located eight PNGs in `play-store-assets` and four root `oryvelle-screenshot*.png` files. These are raw product captures, not verified final published Play Store compositions. Their filenames are often misleading. Final composited store artwork, if different, still needs an explicit asset mapping; no claim is made that all current published promotional artwork was inspected.

| Supplied file | Actual visible subject | Classification / website use |
|---|---|---|
| `play-store-assets/01-current.png` | Empty Tonight, afternoon sky | Accurately represents the inspected design family. Time-based palette differs legitimately; recapture for the chosen story |
| `02-meditation.png` | Explore map | Accurate Explore representation; **not factual meditation representation despite filename** |
| `03-player.png` | Explore map | Accurate Explore representation; **not active player proof** |
| `03-sound-mixer.png` | Explore map with no expanded mixer | Accurate discovery visual; **not factual advanced mixer representation** |
| `03-mixer.png` | Explore/playback dock | Faithful map/playback state; does not demonstrate independent mixing controls |
| `03-search.png` | Explore expanded search/keyboard | Faithful search state; current search expansion/filtering exercised |
| `04-routines.png` | Meditation library | Faithful meditation design; **not factual routine representation** |
| `05-breathe.png` | Empty Sleep Journal | Faithful journal; **not factual breathing representation** |
| `oryvelle-screenshot.png` | Tonight Campfire + Forest Night | Faithful active-mix composition; warm palette differs with context, not evidence of obsolescence |
| `oryvelle-screenshot-2.png` | Explore map, different framing | Faithful navigable constellation concept; current map pan/zoom confirmed |
| `oryvelle-screenshot-3.png` | Meditation, Overthinking continuation | Faithful history-dependent library state. Program order/continuation is not universal; newer catalog also includes Closing Ritual |
| `oryvelle-screenshot-4.png` | Breathing Hold phase | Faithful breathing/orb composition; current phases exercised |

No inspected file needs to be called outdated solely because the palette, greeting, map position or continuation differs. None of these files justifies screenshots of unsupported iOS/watch/desktop products. Rename/map only in a future asset preparation gate; no originals were altered.

## 6. Section 02 composition proposal

### Purpose

After the physical phone spectacle, answer: **what is distinctive about using Oryvelle?** A visitor should leave with a simple idea: explore sounds, combine them into a personal mix, let them fade on a timer. The orb provides a recognizable visual identity for that mix.

### Proposed journey

1. **Quiet editorial bridge.** Let the approved stand scene release normally. A large but restrained line, “Your night. Your mix.”, enters normal flow with generous space. Representative supporting copy: “Choose your sounds. Balance each layer. Set a sleep timer.” No efficacy claim.
2. **Discover a sound world.** Introduce one sparse illustrated constellation with clearly labeled Calming Rain and Brown Noise. Use the real app visual language. Show selected states rather than pretending every visible star is available. Keep the background sparse and darker than the active nodes.
3. **Gather the mix.** Two selected sound avatars visually gather around the ringed orb. This is an editorial translation of Explore → Tonight, not a claim the Android navigation literally morphs these screens together. Keep a small actual UI excerpt/capture to establish product truth.
4. **Make control legible.** Briefly show genuine independent volume adjustment or a real captured sound-field panel. This is the point where the atmospheric metaphor gains meaning. Do not overwhelm with all Premium stereo settings.
5. **Settle.** Introduce the actual timer/fade-out state as a concise endpoint. Light softens; the composition holds long enough to understand. Release into later content without a second long hardware turn.

The constellation and orb should be the primary visual, not a tiny screenshot inside another feature card. However, decorative motion must never obscure the three real actions. The section can be visually cosmic while remaining practical.

### Structural wireframe

```text
APPROVED LANDSCAPE / STAND RELEASE — unchanged
                  ↓
┌────────────────────────────────────────────────────────────┐
│  Your night. Your mix.                                     │
│  Choose your sounds. Balance each layer.                    │
│  Set a sleep timer.                                        │
│                                                            │
│     dim illustrated constellation                          │
│       ✦ Calming Rain         ✦ Brown Noise                  │
│               \              /                             │
│                selected sound layers                       │
│                                                            │
│                  dark ringed ORB                           │
│                small real sound avatars                    │
│                                                            │
│    concise product annotation / actual mix-control excerpt  │
│                         ↓ timer / fade-out                  │
└────────────────────────────────────────────────────────────┘
                  ↓ normal-flow continuation
```

This diagram describes successive compositions, not all elements on screen at once.

### Pacing and implementation direction — provisional, no code

Prefer a calm normal-flow introduction plus **one bounded product demonstration**. If a pin improves readability, evaluate roughly 1.5–2.5 viewport heights of useful progress on desktop, rather than another opening-length sequence. This distance is a starting design proposal, not an approved timing or architecture change.

Keep one understandable visual transition from discovery to mix. Avoid portals, repeated zoom-through-space, night-to-dawn narrative, unrestricted particle effects, or resurrecting the old orb/parallax controllers. The app's orb is legitimate product content; reuse of an old website orb implementation must earn its place independently.

Simplest future asset approach: real captured app interaction for factual UI, plus selectively extracted product artwork for a spacious editorial presentation. Static orb art and SVG constellation paths may be sufficient; don't require another Three.js scene merely because the phone uses one. Complex orbital reproduction/Canvas should be considered only if the approved visual prototype actually needs it. Screen capture loops should not force users to wait for autoplay to understand the content.

Mobile: vertically compose headline → constellation detail → orb/mix → timer. Fewer simultaneous labels, no tiny full-screen phone screenshot, no long pinned scene. Reduced motion: static selected nodes/orb, readable control/timer examples, complete text. No autoplay audio. A future opt-in listening demonstration is a separate product/interaction decision, not assumed scope.

### Why this before other features

- **Mix/orb/constellations:** distinctive Oryvelle identity, immediate visitor understanding, naturally fulfills the existing hero support promise.
- **Breathing:** excellent later visual continuity using the same orb, but opening with only breathing could misrepresent the breadth of the product.
- **Meditation:** compelling art and guided content; suitable next toolkit chapter after sound mixing is established.
- **Routines:** valuable connective story but needs understanding of its component steps first.
- **Insights:** requires explanatory data provenance and sufficient history; a weak first demonstration on an empty installation.

### What should remain quiet

Do not fill the section with all five categories, all 22 catalog nodes, every slider, a paywall, statistics, badges or repeated CTAs. Leave dark space around the orb and constellations. Keep the existing opening as the only hardware-dominant chapter at this point.

## 7. Decisions needed before implementation

1. Approve the central idea: constellation discovery → ringed orb mix → timer, with the real app as content authority.
2. Choose presentation fidelity: literal app capture as main visual, or editorial enlargement of the app's actual motifs with a clear UI excerpt. Recommendation: the latter, with explicit distinction between editorial transition and literal app behavior.
3. Locate approved cover masters/public asset exports; choose exactly two currently playable sounds. Recommendation: Calming Rain + Brown Noise, avoiding unavailable stars and Premium-only audio.
4. Decide whether the future section is a silent authored demonstration or an actual opt-in web interaction. Default proposal: silent, understandable, no fake functional controls.
5. Approve a static composition before scroll choreography. Use the approved opening as the unchanged preceding boundary.

## 8. Inspection state and preservation

Android Git status stayed unchanged: only pre-existing untracked `.wrangler/` and `sample-data/`; no tracked diff. Website implementation, CSS and dependencies were not modified. Website remains on `feat/flowty-fidelity-redesign` with its existing dirty work preserved. New work is this report and internal capture artifacts only.

Device interactions intentionally changed playback state. The temporary routine created by `Start now` was subsequently reset using the app's explicit routine-only reset after verifying the original routine was `Not set`. No journal notes or saved mixes were created. Timer was canceled; meditation ended; all test sound layers removed; Box selected again; device left on Tonight with `Nothing playing`. Exploration naturally recorded listening/progress history (Night 1 stopped at approximately 3:44 and may offer continuation); it was not erased or presented as evidence of user sleep outcomes. No purchase, backup, restore or profile reset was performed.

No website build/tests were run: no production code changed. No Android rebuild/install was required. This report is ready for composition review, not authorization to implement Section 02.
