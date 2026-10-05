# Mobile opening staging refinement

## Reference and scope

Live comparison in Brave at 427×952 showed Flowty grouping each headline, paragraph and product into successive mobile beats. The phone starts cropped below the initial copy, rises into view and clears before subsequent product compositions. Its broad lavender atmosphere also gives the intervening space more visual continuity.

Oryvelle retained desktop-like fixed-stage turns but spread its headline and paragraph across opposite ends of the viewport. Increasing phone scale/rightward offset then cropped the interactive display and layered app content against website copy.

This revision is mobile-only, using the existing ≤760px policy. Desktop CSS and authored physical pose/timing tracks are unchanged. No Section 02, navigation, new canvas or animation scheduler was added.

## Implemented composition

- Mobile support copy is now in the headline's local flow, separated by 22px, rather than absolutely anchored at the viewport bottom. This changes only internal staging, not chapter height.
- The initial cropped phone entrance remains. Initial supporting copy and Android availability now sit together with a more legible 44px-minimum-height primary download action.
- Returning/desk mobile headlines use a bounded 42–64px scale. Returning text no longer needs a foreground z-index/text-shadow workaround over the app screen.
- Returning Explore removes the extra 6.5vw right shift and extra scale increment. A smooth existing-yaw envelope centers it and places it below the grouped copy. The portrait scale multiplier remains 1.65; the returning phone is not reduced to the former small renderer-proof size.
- Landscape mobile scale multiplier increases from 0.88 to 1.08; its center moves to approximately 51% viewport height. Rear/foreground stand width uses `min(84.24svh,88.56vw)` and the same 51% center anchor, keeping the supported assembly together.
- Mobile atmosphere receives two broad transparent lavender/indigo washes and a wider existing diagonal beam. There are no stars, extra assets or autonomous gradient animations.
- Chapter height remains the previously shortened 460svh, giving 360svh native travel. Normalized physical poses, screen thresholds, float attenuation and typography timeline timing remain unchanged.

## Lifecycle / fallback

The same persistent phone, native scroll owner, readiness/entry, interactive screen adapter and GSAP timeline remain. Existing responsive reconstruction applies the new composition; no resize scroll reset or timeout was introduced.

The static mobile poster keeps its previous dimensions explicitly, independent of the new stand width variable. It has not been regenerated to depict the revised live framing. Reduced-motion/WebGL-failure poster ownership remains unchanged.

## Changed files

- `components/landing/chapters/opening/opening-poses.ts`: mobile composition mapping only.
- `components/landing/chapters/opening/opening.module.css`: mobile local copy layout, CTA, atmosphere and supported assembly fit.
- This report. Earlier mobile refinement reports describe preceding iterations; this document supersedes their returning-copy foreground-layer workaround and final stand-fit values.

## Review status

Entrance-edge correction following user screenshots: the mobile hero's existing entrance envelope now reduces its roll by up to 55%, reduces the portrait scale multiplier by 0.16 and shifts its center 2.5vw left. These adjustments taper to zero by the front checkpoint, leaving subsequent turn, Explore and stand compositions unchanged. The bottom remains deliberately cropped; the goal is to show the right chassis edge instead of an apparently borderless screen. No browser or automated tests were run for this correction.

No browser testing, automated checks or builds were run after these edits, following the user's testing preference. The earlier live comparison was research, before implementation.

Review initial CTA access, cropped-to-full phone reveal, full rear, returning Explore's right edge and footer, reverse scrolling, grouped type departure, second turn and stand contact. Check short/tall mobile sizes and the static fallback. This is a composition revision awaiting user visual review, not a claim of measured collision-free behavior.
