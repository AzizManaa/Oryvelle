import {
  ParallaxLandingExperience,
  type ParallaxMoment,
} from "./_components/parallax-landing-experience";

const trustItems = ["Privacy", "Support", "Terms"] as const;

const moments: ParallaxMoment[] = [
  {
    id: "arrival",
    label: "Arrival",
    eyebrow: "Obsidian Sleep",
    title: "Build a softer path into sleep.",
    body: "Layer calming sounds, set a gentle timer, and leave a small note for morning. Oryvelle keeps the ritual quiet.",
    accent: "#00E0C7",
    secondary: "#B89AFF",
    cue: "Enter the night",
    panelBody: "The first layer is atmosphere: dark space, a living orb, and a ritual that does not rush you.",
  },
  {
    id: "constellations",
    label: "Constellations",
    eyebrow: "Layer the night",
    title: "Sound becomes a small constellation.",
    body: "Rain, cabin air, forest hush, and soft noise connect into a sky you can shape without opening another control panel.",
    accent: "#67D7FF",
    secondary: "#8F82E8",
    cue: "Stars align",
    panelBody: "Each sound is treated like a point in the night, close enough to guide you and quiet enough to disappear.",
  },
  {
    id: "mix",
    label: "Active Mix",
    eyebrow: "Mix without friction",
    title: "The ritual gathers around the orb.",
    body: "A living mix sits in reach while the rest of the page keeps its distance: visible, calm, and never crowded.",
    accent: "#00E0C7",
    secondary: "#67D7FF",
    cue: "Active mix",
    panelBody: "A soft glass preview comes forward only when it matters, then lets the night stay spacious.",
  },
  {
    id: "fade",
    label: "Fade Timer",
    eyebrow: "Fade without fuss",
    title: "Let the night close itself.",
    body: "Set a timer, let the mix fade, and leave the phone alone. The ritual keeps moving softly in the background.",
    accent: "#FFB87A",
    secondary: "#00E0C7",
    cue: "45 min fade",
    panelBody: "The constellation bends into time, then loosens its grip as the soundscape settles.",
  },
  {
    id: "final",
    label: "Invite",
    eyebrow: "First night soon",
    title: "Start with one softer night.",
    body: "Oryvelle is still arriving. The landing page should leave the same feeling as the app: quiet, curious, and close enough to return to.",
    accent: "#FF6B9D",
    secondary: "#B89AFF",
    cue: "Coming soon",
    panelBody: "No hard sell. Just a doorway into a calmer night ritual when the app is ready.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-[100svh] bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00E0C7] shadow-[0_0_18px_rgba(0,224,199,0.8)]" />
            <span className="text-sm font-medium tracking-[0.18em] text-[#EDEAF5] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
              Oryvelle
            </span>
          </div>

          <nav
            aria-label="Planned trust pages"
            className="hidden items-center gap-6 text-sm text-[#9A9CAF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:flex"
          >
            {trustItems.map((item) => (
              <span
                key={item}
                aria-disabled="true"
                className="cursor-not-allowed select-none transition-colors hover:text-[#B8B5C7]"
              >
                {item}
              </span>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <span
              aria-disabled="true"
              className="cursor-not-allowed select-none text-xs font-medium text-[#9A9CAF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:hidden"
            >
              Privacy
            </span>
            <button
              type="button"
              disabled
              className="h-9 rounded-full border border-[#00E0C7]/30 bg-[#00E0C7]/10 px-3 text-xs font-medium text-[#EDEAF5] shadow-[0_0_24px_rgba(0,224,199,0.1)] sm:px-4"
            >
              <span className="hidden sm:inline">Coming soon</span>
              <span className="sm:hidden">Soon</span>
            </button>
          </div>
        </div>
      </header>

      <ParallaxLandingExperience moments={moments} />
    </main>
  );
}
