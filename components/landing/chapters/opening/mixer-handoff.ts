import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const smooth = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };

// Normal document flow owns the mixer. Only the travelling lights occupy the viewport.
export function createMixerHandoff(stage: HTMLElement, mixer: HTMLElement, overlay: SVGSVGElement) {
  const breath = stage.querySelector<HTMLElement>("[data-breathing-scene]")!;
  const orb = breath.querySelector<HTMLElement>("[data-breath-orb-surface]")!;
  const lights = Array.from(overlay.querySelectorAll<SVGGElement>("[data-mixer-light]"));
  const threads = Array.from(overlay.querySelectorAll<SVGPathElement>("[data-mixer-thread]"));
  const heading = mixer.querySelector<HTMLElement>("[data-mixer-heading]")!;
  const editorial = mixer.querySelector<HTMLElement>("[data-mixer-editorial]")!;
  const panel = mixer.querySelector<HTMLElement>("[data-mixer-panel]")!;
  let center = { x: 0, y: 0 }, radius = 0;
  const measure = () => {
    const bounds = orb.getBoundingClientRect(), frame = stage.getBoundingClientRect();
    center = { x: bounds.left + bounds.width / 2, y: bounds.top - frame.top + bounds.height / 2 };
    radius = Math.min(bounds.width, bounds.height) / 2.25 * .75;
  };
  const render = (progress: number) => {
    const active = progress > 0 && progress < 1;
    overlay.style.visibility = active ? "visible" : "hidden";
    const departure = smooth((progress - .34) / .42);
    breath.dataset.breathDeparture = String(departure);
    breath.dispatchEvent(new Event("breathing-departure"));
    gsap.set(breath.querySelectorAll("[data-breath-copy], [data-breath-cue]"), { opacity: 1 - smooth(progress / .22) });
    gsap.set(heading, { y: 36 * (1 - smooth(progress / .65)) });
    gsap.set(editorial, { opacity: smooth((progress - .15) / .45), y: 24 * (1 - smooth(progress / .7)) });
    gsap.set(panel, { opacity: smooth((progress - .3) / .4) });
    const slots = Array.from(mixer.querySelectorAll<HTMLElement>("[data-mixer-art]"));
    if (!slots.length) overlay.style.visibility = "hidden";
    slots.forEach((slot, i) => {
      const target = slot.getBoundingClientRect();
      const angle = Math.PI * (.8 + i * .65);
      const end = { x: target.left + target.width / 2, y: target.top + target.height / 2 };
      const release = .34 + i * .035;
      const turn = Math.PI * 1.8;
      const orbitAt = (t: number) => ({
        x: center.x + Math.cos(angle + turn * t) * radius,
        y: center.y + Math.sin(angle + turn * t) * radius * .32,
      });
      const start = orbitAt(1);
      const exitAngle = angle + turn;
      // Peel off in the orbit's tangent direction, then bend down toward the sound.
      const c1 = { x: start.x - Math.sin(exitAngle) * radius * .95, y: start.y + Math.cos(exitAngle) * radius * .32 * .95 };
      const c2 = { x: end.x + radius * (i === 1 ? -.35 : .35), y: end.y - Math.min(window.innerHeight * .3, radius * 1.2) };
      const pointAt = (p: number) => {
        if (p <= release) return orbitAt(Math.max(0, p / release));
        const t = Math.max(0, Math.min(1, (p - release) / (.92 - release)));
        const u = 1 - t;
        return {
          x: u ** 3 * start.x + 3 * u ** 2 * t * c1.x + 3 * u * t ** 2 * c2.x + t ** 3 * end.x,
          y: u ** 3 * start.y + 3 * u ** 2 * t * c1.y + 3 * u * t ** 2 * c2.y + t ** 3 * end.y,
        };
      };
      const { x, y } = pointAt(progress);
      // Geometric birth at the ring, not an opacity fade out of the core.
      lights[i].setAttribute("transform", `translate(${x} ${y}) scale(${smooth(progress / .035)})`);
      lights[i].style.opacity = String(1 - smooth((progress - .9) / .1));
      slot.style.opacity = String(smooth((progress - .88) / .12));
      const tailStart = Math.max(0, progress - .075);
      threads[i].setAttribute("d", Array.from({ length: 20 }, (_, sample) => {
        const point = pointAt(tailStart + (progress - tailStart) * sample / 19);
        return `${sample ? "L" : "M"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      }).join(" "));
      threads[i].style.opacity = String(Math.sin(progress * Math.PI) * .32);
    });
  };
  measure();
  const trigger = ScrollTrigger.create({
    trigger: mixer, start: () => `top bottom+=${window.innerHeight * .5}`, end: () => `+=${Math.max(window.innerHeight * 1.5, panel.getBoundingClientRect().bottom - mixer.getBoundingClientRect().top + window.innerHeight * .7)}`,
    onUpdate: self => render(self.progress), onRefresh: self => { measure(); render(self.progress); },
  });
  render(trigger.progress);
  return () => {
    trigger.kill(); overlay.style.visibility = "hidden";
    delete breath.dataset.breathDeparture;
    breath.dispatchEvent(new Event("breathing-departure"));
    gsap.set([heading, editorial, panel, ...mixer.querySelectorAll("[data-mixer-art]"), ...breath.querySelectorAll("[data-breath-copy], [data-breath-cue]")], { clearProps: "opacity,transform" });
  };
}
