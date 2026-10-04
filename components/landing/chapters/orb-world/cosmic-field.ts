import { cosmicEnergy, horizonInfluence, shootingStarAt, starLife } from "./cosmic-life";

// Far-field atmosphere only. The existing orb is drawn over this field, so its
// opaque core occludes stars rather than acquiring a decorative star texture.
export type FieldStar = { x: number; y: number; size: number; light: number; phase: number };
export function fieldStars(count: number): FieldStar[] {
  let seed = 48173;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  return Array.from({ length: count }, () => ({ x: random(), y: random(), size: .55 + random() * .85, light: .28 + random() * .48, phase: random() * Math.PI * 2 }));
}

export function drawCosmicField(context: CanvasRenderingContext2D, width: number, height: number, stars: FieldStar[], elapsed: number, strength: number, settle: number, mobileComposition = false, ambient?: { life: number; reduced: boolean }) {
  const t = elapsed / 1000;
  const life = ambient?.life ?? 0;
  const energy = cosmicEnergy(settle);
  const x = width * (mobileComposition ? .60 : width < 760 ? .85 : .70), y = height * (mobileComposition ? .57 : .67);
  const radius = mobileComposition ? Math.max(width * .72, height * .46) : Math.max(width * .55, height * (width < 760 ? .67 : width < height ? .73 : .95));
  context.save();
  context.globalCompositeOperation = 'destination-over';
  context.globalAlpha = strength * (1 - settle * .12);
  for (const star of stars) {
    const sx = star.x * width, sy = star.y * height;
    const dx = sx - x, dy = sy - y;
    const distance = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
    const originalHorizon = Math.exp(-Math.pow((distance / radius - .93) / .13, 2));
    const horizon = originalHorizon * (1 - life) + horizonInfluence(distance, radius) * life;
    const sampled = starLife(star.phase, elapsed, settle);
    // Small tangential displacement and elongated light near the horizon imply
    // lensing without another sphere outline or an animated orbital diagram.
    const bend = horizon * (.035 + life * .045 + (.0015 + life * .012 * energy) * Math.sin(t / 3.8 + star.phase));
    const lensedDistance = distance + radius * horizon * life * (.008 - .018 * energy * Math.sin(t / 4.7 + star.phase));
    const drift = life * sampled.depth * energy;
    const px = x + Math.cos(angle + bend) * lensedDistance + Math.sin(t / 71 + star.phase) * drift;
    const py = y + Math.sin(angle + bend) * lensedDistance + Math.sin(t / 97 + star.phase * 1.7) * drift * .6;
    const legacyShimmer = 1 + .16 * Math.sin(t / (4 + star.phase) + star.phase);
    const shimmer = legacyShimmer * (1 - life) + sampled.shimmer * life;
    const depthLight = 1 + life * (sampled.depth - .65) * .25;
    context.globalAlpha = Math.min(.92, strength * star.light * shimmer * depthLight * (1 - settle * .14));
    context.fillStyle = '#bdc8df';
    context.beginPath(); context.ellipse(px, py, star.size * (1 + horizon * (2.8 + life * .8)), star.size * (.65 - life * .12 * (1 - sampled.depth)), angle + Math.PI / 2, 0, Math.PI * 2); context.fill();
    if (star.size > 1.05) {
      const pointAlpha = context.globalAlpha;
      context.globalAlpha *= .14 + life * sampled.sparkle * .48;
      const glowRadius = 5 + life * sampled.sparkle * 7;
      const glow = context.createRadialGradient(px, py, 0, px, py, glowRadius);
      glow.addColorStop(0, '#c5d4e8'); glow.addColorStop(1, 'rgba(197,212,232,0)');
      context.fillStyle = glow; context.fillRect(px - glowRadius, py - glowRadius, glowRadius * 2, glowRadius * 2);
      if (life > 0 && sampled.depth > .65 && sampled.sparkle > .15) {
        // Brief optical glints on a few points, not permanently bright crosses.
        const arm = star.size * (2 + 4 * sampled.sparkle);
        const glint = context.createRadialGradient(px, py, 0, px, py, arm);
        glint.addColorStop(0, 'rgba(223,231,246,.8)');
        glint.addColorStop(1, 'rgba(223,231,246,0)');
        context.globalAlpha = pointAlpha * life * sampled.sparkle * .65;
        context.strokeStyle = glint; context.lineWidth = .55;
        context.beginPath(); context.moveTo(px - arm, py); context.lineTo(px + arm, py);
        context.moveTo(px, py - arm * .75); context.lineTo(px, py + arm * .75); context.stroke();
      }
    }
  }
  if (life > 0 && !ambient?.reduced) drawInfallLight(context, x, y, radius, t, strength * life, energy);
  const meteor = life > 0 ? shootingStarAt(elapsed, settle, ambient?.reduced ?? true) : null;
  if (meteor) {
    const px = (meteor.x + meteor.dx * meteor.progress) * width;
    const py = (meteor.y + meteor.dy * meteor.progress) * height;
    const angle = Math.atan2(meteor.dy * height, meteor.dx * width);
    const tail = Math.min(width * .09, 72) * Math.sin(meteor.progress * Math.PI);
    const tx = px - Math.cos(angle) * tail, ty = py - Math.sin(angle) * tail;
    const trail = context.createLinearGradient(tx, ty, px, py);
    trail.addColorStop(0, 'rgba(183,201,221,0)');
    trail.addColorStop(.72, 'rgba(183,201,221,.40)');
    trail.addColorStop(1, 'rgba(209,218,232,.90)');
    context.globalAlpha = strength * life * meteor.light * .65;
    context.lineWidth = 1.1; context.lineCap = 'round'; context.strokeStyle = trail;
    context.beginPath(); context.moveTo(tx, ty); context.lineTo(px, py); context.stroke();
    const head = context.createRadialGradient(px, py, 0, px, py, 4);
    head.addColorStop(0, 'rgba(220,232,246,.8)'); head.addColorStop(1, 'rgba(220,232,246,0)');
    context.fillStyle = head; context.fillRect(px - 4, py - 4, 8, 8);
  }
  context.restore();
}

// Short moving pieces of curved illumination converge toward the horizon.
// Full paths are never stroked: the eye sees light being pulled inward, not a
// spiral diagram. The existing opaque core naturally hides their inner ends.
function drawInfallLight(context: CanvasRenderingContext2D, x: number, y: number, radius: number, time: number, strength: number, energy: number) {
  const angles = [-2.55, -1.65, 2.65];
  for (let i = 0; i < angles.length; i++) {
    const travel = ((time / (9.5 + i * 3.1) + i * .31) % 1 + 1) % 1;
    const visibility = Math.sin(travel * Math.PI) ** 2;
    const points = Array.from({ length: 18 }, (_, index) => {
      const u = Math.max(0, travel - .16 + index / 17 * .16);
      const distance = radius * (.94 - .49 * u);
      const angle = angles[i] + .88 * u * u;
      return { x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance };
    });
    const tail = points[0], head = points[points.length - 1];
    const light = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
    light.addColorStop(0, 'rgba(160,148,203,0)');
    light.addColorStop(.5, i === 1 ? 'rgba(120,191,200,.40)' : 'rgba(176,157,210,.40)');
    light.addColorStop(1, 'rgba(220,209,236,.70)');
    context.save(); context.lineCap = 'round'; context.strokeStyle = light;
    for (const [width, opacity] of [[4, .075], [1.15, .32]] as const) {
      context.globalAlpha = strength * visibility * energy * opacity;
      context.lineWidth = width; context.beginPath();
      points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
      context.stroke();
    }
    context.restore();
  }
}
