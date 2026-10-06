export const SLEEP_TIMER_SECONDS = 8 * 60 * 60;

export function formatSleepTimer(seconds: number) {
  const value = Math.max(0, Math.ceil(seconds));
  return [Math.floor(value / 3600), Math.floor(value / 60) % 60, value % 60].map(n => String(n).padStart(2, "0")).join(":");
}

// Landscape artwork rotates into the model's portrait UV layout, just like the
// static landscape source. This is drawn UI, never an app screenshot.
export function drawSleepTimer(context: CanvasRenderingContext2D, remaining: number, endsAt?: number) {
  context.save();
  context.setTransform(0, -1, 1, 0, 0, 1266);
  context.fillStyle = "#090b14"; context.fillRect(0, 0, 1266, 600);
  const haze = context.createRadialGradient(930, 130, 20, 930, 130, 630);
  haze.addColorStop(0, "#242039"); haze.addColorStop(1, "#090b14");
  context.fillStyle = haze; context.fillRect(0, 0, 1266, 600);
  const text = (value: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "left") => {
    context.font = `400 ${size}px Arial, sans-serif`; context.textAlign = align; context.fillStyle = color;
    context.fillText(value, x, y);
  };
  const pill = (x: number, y: number, w: number, h: number, color: string) => {
    context.beginPath(); context.roundRect(x, y, w, h, h / 2); context.fillStyle = color; context.fill();
  };
  text("ORYVELLE", 62, 62, 18, "#a99fbd");
  text("SLEEP TIMER", 1204, 62, 18, "#a99fbd", "right");
  text(remaining > 0 ? "Drifting off soon…" : "Rest well.", 633, 102, 27, "#00cdbd", "center");
  const end = endsAt ? `Ends at ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(endsAt)}` : "8 hours of quiet";
  text(end, 633, 140, 18, "#aaa2bd", "center");
  const start = Math.PI * .75, span = Math.PI * 1.5;
  context.lineWidth = 12; context.lineCap = "round";
  context.beginPath(); context.arc(633, 327, 173, start, start + span); context.strokeStyle = "#25243b"; context.stroke();
  const arc = context.createLinearGradient(460, 327, 806, 327);
  arc.addColorStop(0, "#b09aff"); arc.addColorStop(.48, "#78b7e5"); arc.addColorStop(1, "#00d0be");
  if (remaining > 0) {
    context.beginPath(); context.arc(633, 327, 173, start, start + span * Math.min(1, remaining / SLEEP_TIMER_SECONDS));
    context.strokeStyle = arc; context.stroke();
  }
  text(formatSleepTimer(remaining), 633, 339, 76, "#e1dbe9", "center");
  text("TIME REMAINING", 633, 376, 13, "#827c96", "center");
  text("YOUR EVENING MIX", 62, 248, 14, "#a99fbd");
  text("Campfire +", 62, 291, 25, "#d6cfdf");
  text("Forest Night", 62, 325, 25, "#d6cfdf");
  text("2 sounds · 50% volume", 62, 367, 16, "#8f879f");
  text("FADE OUT", 1000, 260, 14, "#9dd6d0");
  text("Gently quiet", 1000, 301, 21, "#d6cfdf");
  text("your sounds.", 1000, 330, 21, "#d6cfdf");
  pill(1000, 355, 54, 29, "#00cdbd");
  context.beginPath(); context.arc(1038, 369.5, 10.5, 0, Math.PI * 2); context.fillStyle = "#0b1420"; context.fill();
  pill(560, 464, 146, 48, "#00cdbd");
  context.fillStyle = "#092020"; context.fillRect(589, 480, 4, 16); context.fillRect(598, 480, 4, 16);
  text("Pause", 650, 496, 18, "#092020", "center");
  text("A softer end to your evening.", 633, 556, 16, "#9389a5", "center");
  context.restore();
}
