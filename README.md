# Oryvelle

Oryvelle's public website: an interactive phone journey, meditation, breathing,
sound mixing, sleep features, and download, support and policy pages.

## Routes

- `/`: the complete public site.
- `/privacy`, `/terms`, `/support`: policy and support pages.

## Development

```bash
npm install
npm run dev
```

`npm run lint` checks the source, and `npm run build` creates a production build.
Copy `.env.example` to `.env.local` when overriding the public site URL.

## Source and assets

- `components/landing/chapters/opening/`: scroll choreography, navigation,
  download panel, meditation, breathing and footer.
- `components/landing/device/`: phone model, video playback, interactive Explorer
  and generated sleep timer. Rendering pauses when previews are inactive or hidden.
- `components/landing/features/`: sound mixer and audio/sleep feature showcase.
- `app/_components/`: shared orb drawing and policy-page layout.
- `public/models/`: runtime phone model.
- `public/opening/`, `public/explore/`, `public/meditation/`: active media and artwork.

Reduced motion and renderer failure use static phone posters. Sound and meditation
provenance lives alongside their assets. Apache-licensed constellation geometry
includes its license in `public/explore/`. The footer retains the phone model's
CC BY 4.0 attribution.

## Policy content

Keep the public pages aligned with `doc/PRIVACY_POLICY.md`,
`doc/TERMS_OF_SERVICE.md` and `doc/SUPPORT.md` in the Oryvelle Android repository.
