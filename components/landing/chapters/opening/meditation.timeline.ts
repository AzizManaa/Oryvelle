import { gsap } from "gsap";
import styles from "./opening.module.css";

export function createMeditationTimeline({ marker, stage }: { marker: HTMLElement; stage: HTMLElement }) {
  const scene = stage.querySelector<HTMLElement>("[data-meditation-scene]")!;
  const product = stage.querySelector(`.${styles.product}`);
  const stands = [styles.rear, styles.foreground].map(key => stage.querySelector(`.${key}`));
  const desk = stage.querySelector(`.${styles.deskCopy}`);
  const routes = Array.from(scene.querySelectorAll("svg")).map(map => {
    const thread = map.querySelector<SVGPathElement>("[data-meditation-thread]")!;
    const guide = map.querySelector<SVGGElement>("[data-meditation-guide]")!;
    return { thread, guide, length: thread.getTotalLength() };
  });
  const travel = { progress: 0 };
  const followThread = () => {
    routes.forEach(({ thread, guide, length }) => {
      const point = thread.getPointAtLength(length * travel.progress);
      guide.setAttribute("transform", `translate(${point.x} ${point.y})`);
      thread.style.strokeDashoffset = String(1 - travel.progress);
    });
  };
  // ViewBox coordinates remain stable across resize; each responsive map owns
  // its authored route. The guide and the drawn endpoint use the same distance.
  followThread();
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: marker, start: "top top", end: () => `+=${marker.offsetHeight}`, scrub: true, invalidateOnRefresh: true,
      // Refresh may restore the scrub position without tween callbacks.
      onRefresh: followThread,
    },
  });
  // Opening owns the product's pixel Y clearance and the stands' yPercent
  // settlement. Depart using the other transform so framing refreshes cannot
  // restore a phone that has already left the stage.
  timeline.set(scene, { visibility: "visible" }, 0)
    .to(routes.map(route => route.guide), { autoAlpha: 1, duration: .08 }, .02)
    .to(travel, { progress: 1, duration: .48, ease: "sine.inOut", onUpdate: followThread }, .08)
    .fromTo(product, { yPercent: 0 }, { yPercent: -120, duration: .49, ease: "sine.inOut", immediateRender: false }, .12)
    .fromTo(stands, { y: 0 }, { y: () => -stage.offsetHeight * 1.2, duration: .49, ease: "sine.inOut", immediateRender: false }, .12)
    .fromTo(desk, { y: 0 }, { y: () => -stage.offsetHeight, duration: .36, ease: "sine.in", immediateRender: false }, .10)
    .to(scene.querySelectorAll('[data-meditation-path="0"]'), { strokeDashoffset: 0, duration: .23 }, .50)
    .to(scene.querySelectorAll('[data-meditation-path="1"]'), { strokeDashoffset: 0, duration: .27 }, .55)
    .to(scene.querySelectorAll('[data-meditation-path="2"]'), { strokeDashoffset: 0, duration: .23 }, .69)
    .fromTo(scene.querySelector("[data-meditation-copy]"), { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, duration: .28, ease: "sine.out" }, .48);
  scene.querySelectorAll("svg").forEach(map => {
    map.querySelectorAll("[data-meditation-star]").forEach((star, i) => {
      timeline.to(star, { opacity: 1, duration: .075 }, .49 + i * .03);
    });
  });
  // The featured journey leads; secondary paths stay quieter and arrive later.
  for (const [key, start] of [["wind", .28], ["thought", .62], ["ritual", .72]] as const) {
    const journey = scene.querySelector(`[data-meditation-journey="${key}"]`)!;
    timeline.fromTo(journey.querySelector("[data-meditation-art]"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: key === "wind" ? .30 : .22, ease: "sine.out" }, start)
      .fromTo(journey.querySelector("[data-meditation-label]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .15 }, key === "wind" ? .49 : start + .10);
  }
  timeline.to({}, { duration: .04 }, .96);
  return timeline;
}
