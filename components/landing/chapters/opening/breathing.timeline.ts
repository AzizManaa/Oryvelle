import { gsap } from "gsap";

export function createBreathingTimeline({ marker, stage }: { marker: HTMLElement; stage: HTMLElement }) {
  const meditation = stage.querySelector<HTMLElement>("[data-meditation-scene]")!;
  const scene = stage.querySelector<HTMLElement>("[data-breathing-scene]")!;
  const orbSurface = scene.querySelector<HTMLElement>("[data-breath-orb-surface]")!;
  const handoff = scene.querySelector<SVGSVGElement>("[data-breath-handoff]")!;
  const thread = scene.querySelector<SVGPathElement>("[data-breath-handoff-thread]")!;
  const guide = scene.querySelector<SVGGElement>("[data-breath-handoff-guide]")!;
  const meditationGuides = meditation.querySelectorAll("[data-meditation-guide]");
  const travel = { progress: 0, formation: 0 };
  let start = { x: 0, y: 0 }, center = { x: 0, y: 0 }, radius = 0;

  const measure = () => {
    const bounds = stage.getBoundingClientRect();
    const map = Array.from(meditation.querySelectorAll("svg")).find(svg => getComputedStyle(svg).display !== "none")!;
    const path = map.querySelector<SVGPathElement>("[data-meditation-thread]")!;
    const endpoint = path.getPointAtLength(path.getTotalLength());
    const matrix = map.getScreenCTM();
    if (matrix) {
      const point = new DOMPoint(endpoint.x, endpoint.y).matrixTransform(matrix);
      // Remove only this continuation's departure Y from responsive measurements.
      start = { x: point.x - bounds.left, y: point.y - bounds.top - Number(gsap.getProperty(meditation, "y")) };
    }
    const orb = orbSurface.getBoundingClientRect();
    center = { x: orb.left - bounds.left + orb.width / 2, y: orb.top - bounds.top + orb.height / 2 };
    radius = Math.min(orb.width, orb.height) / 2.25 * .86;
  };

  const pointAt = (progress: number) => {
    const growth = Math.max(.12, travel.formation);
    if (progress < .38) {
      const t = progress / .38, u = 1 - t;
      const end = { x: center.x - radius * growth, y: center.y };
      return {
        x: u ** 3 * start.x + 3 * u ** 2 * t * (start.x - radius * .4) + 3 * u * t ** 2 * (end.x - radius * .25) + t ** 3 * end.x,
        y: u ** 3 * start.y + 3 * u ** 2 * t * (start.y + radius * .3) + 3 * u * t ** 2 * (end.y - radius * .2) + t ** 3 * end.y,
      };
    }
    const angle = Math.PI + ((progress - .38) / .62) * Math.PI * 1.8;
    return { x: center.x + Math.cos(angle) * radius * growth, y: center.y + Math.sin(angle) * radius * growth * .18 };
  };

  const render = () => {
    const point = pointAt(travel.progress);
    guide.setAttribute("transform", `translate(${point.x} ${point.y})`);
    // A short inherited thread winds into the same flattened plane as the disk.
    const tailStart = Math.max(0, travel.progress - .35);
    thread.setAttribute("d", Array.from({ length: 40 }, (_, i) => {
      const tail = pointAt(tailStart + (travel.progress - tailStart) * i / 39);
      return `${i ? "L" : "M"}${tail.x.toFixed(2)} ${tail.y.toFixed(2)}`;
    }).join(" "));
    const value = travel.formation.toFixed(5);
    if (scene.dataset.breathFormation !== value) {
      scene.dataset.breathFormation = value;
      scene.style.setProperty("--breath-formation", value);
      scene.dispatchEvent(new Event("breathing-formation"));
    }
  };
  const activate = (progress: number) => {
    const next = String(progress >= .72);
    if (scene.dataset.breathActive === next) return;
    scene.dataset.breathActive = next;
    scene.dispatchEvent(new Event("breathing-activation"));
  };
  measure(); render();
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    onUpdate: render,
    scrollTrigger: { trigger: marker, start: "top top", end: () => `+=${marker.offsetHeight}`, scrub: true, invalidateOnRefresh: true,
      onUpdate: self => activate(self.progress),
      onRefresh: self => { measure(); render(); activate(self.progress); },
    },
  });
  timeline.set(scene, { visibility: "visible" }, 0)
    .set(scene.querySelector("[data-breath-form]"), { autoAlpha: 1 }, 0)
    .set(handoff, { autoAlpha: 1 }, .02)
    .fromTo(meditationGuides, { autoAlpha: 1 }, { autoAlpha: 0, duration: .02, immediateRender: false }, .02)
    .to(travel, { progress: 1, duration: .62, ease: "sine.inOut" }, .02)
    .to(meditation, { y: () => -stage.offsetHeight * 1.1, duration: .55, ease: "sine.inOut" }, .08)
    // Formation changes the renderer's physical radius; no orb opacity tween.
    .to(travel, { formation: 1, duration: .42, ease: "power2.inOut" }, .24)
    .to(handoff, { autoAlpha: 0, duration: .12 }, .62)
    .fromTo(scene.querySelector("[data-breath-copy]"), { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: .24, ease: "sine.out" }, .46)
    .to(scene.querySelector("[data-breath-cue]"), { autoAlpha: 1, duration: .16 }, .64)
    .to({}, { duration: .04 }, .96);
  return timeline;
}
