import {
  RitualExperience,
  type RitualScene,
} from "./_components/ritual-experience";

const trustItems = ["Privacy", "Support", "Terms"] as const;

const scenes: RitualScene[] = [
  {
    id: "arrive",
    label: "Arrival",
    eyebrow: "Obsidian Sleep",
    title: "Build a softer path into sleep.",
    body: "Layer calming sounds, set a gentle timer, and leave a small note for morning. Oryvelle keeps the ritual quiet.",
    accent: "#00E0C7",
    secondary: "#B89AFF",
    cue: "Enter the night",
    satellites: ["Rain", "Cabin", "Forest"],
  },
  {
    id: "sounds",
    label: "Gather",
    eyebrow: "Layer the night",
    title: "Sounds gather without asking for attention.",
    body: "A mix can start as one sound, then become a small constellation: rain, cabin air, forest hush, soft noise.",
    accent: "#67D7FF",
    secondary: "#8F82E8",
    cue: "Active mix forming",
    satellites: ["Rain", "Cabin", "Forest", "Noise"],
  },
  {
    id: "timer",
    label: "Fade",
    eyebrow: "Fade without fuss",
    title: "Let the night close itself.",
    body: "Set a timer, let the mix fade, and leave the phone alone. The ritual keeps moving softly in the background.",
    accent: "#FFB87A",
    secondary: "#00E0C7",
    cue: "45 min fade",
    satellites: ["Rain", "Cabin", "Forest"],
  },
  {
    id: "notes",
    label: "Morning",
    eyebrow: "Wake softly",
    title: "Leave only what feels useful.",
    body: "A rating, a few tags, or one quiet note. No pressure, no dashboard noise, no demand to measure the whole night.",
    accent: "#FF6B9D",
    secondary: "#B89AFF",
    cue: "Small note saved",
    satellites: ["Mood", "Tags", "Note"],
  },
];

export default function Home() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/[0.06] bg-[#080510]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00E0C7] shadow-[0_0_18px_rgba(0,224,199,0.8)]" />
            <span className="text-sm font-medium tracking-[0.18em] text-[#EDEAF5] uppercase">
              Oryvelle
            </span>
          </div>

          <nav
            aria-label="Planned trust pages"
            className="hidden items-center gap-6 text-sm text-[#7C8094] sm:flex"
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled
              className="hidden h-9 rounded-full border border-[#00E0C7]/30 bg-[#00E0C7]/10 px-4 text-xs font-medium text-[#EDEAF5] shadow-[0_0_24px_rgba(0,224,199,0.1)] sm:block"
            >
              Coming soon
            </button>

            <span className="text-xs text-[#7C8094] sm:hidden">Soon</span>
          </div>
        </div>
      </header>

      <RitualExperience scenes={scenes} />
    </main>
  );
}
