# Mobile opening composition refinement

The supplied screenshots showed an undersized returning phone and excessive quiet scroll travel. Source inspection found two contributing choices: the width-limited renderer fit was further multiplied by 0.88 on mobile, and mobile retained desktop's 660svh chapter height.

## Changes

- Mobile only (`max-width:760px`): journey/chapter height 660svh → 460svh. Native scrub travel becomes 360svh instead of 560svh. Existing normalized pose/screen/type thresholds are unchanged.
- Portrait mobile pose multiplier moves toward 1.65 instead of 0.88, and its vertical anchor moves upward. The phone may overlap typography intentionally rather than occupying a separate small illustration slot.
- Squared cosine of authored roll blends portrait emphasis continuously into the existing 0.88 landscape multiplier and supported vertical anchor. At final landscape settlement, the prior phone/stand relationship is unchanged.
- Static/reduced-motion chapter height remains 100svh. Existing poster artwork/framing is retained; it has not been regenerated to match the revised live portrait framing.

Desktop values, physical rotation tracks, materials, lighting, entry, sound-preview interactions and stand geometry were not changed. The mobile world still uses the same deterministic timeline; no new ScrollTrigger or scheduler was introduced.

## Review status

Returning-front refinement: a smooth yaw-local envelope around the existing first returning front adds up to 0.20 to the mobile scale multiplier, shifts the phone 6.5% viewport width right and 9% viewport height down. It is zero at the adjacent edge phases and all subsequent stand poses. Mobile returning copy now layers above the phone with a restrained readability shadow, so intentional overlap does not erase the headline/supporting text. Desktop stacking is unchanged. This refinement remains untested per the requested user-side review workflow.

Following screenshot feedback, the initial large phone now starts lower, with its bottom intentionally outside the viewport. An additional downward offset of up to 28% viewport height eases away across the existing hero-to-front vertical movement. At the front checkpoint and all later poses this extra offset is zero. This restores the intended progression: readable opening copy → cropped product entrance → full product reveal, without shrinking the phone or changing desktop.

Per user preference, no browser QA or automated checks were run. Review on `/new`, especially hero overlap/CTA access, full rear visibility, returning Explore scale, second-turn edge cropping and final stand contact at short and tall mobile sizes. These are authored adjustments awaiting user visual review, not measured collision-free layouts.
