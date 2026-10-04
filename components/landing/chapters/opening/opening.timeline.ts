import { gsap } from "gsap";
import type { PhonePose } from "../../device/phone-model";
import { OPENING_POSES } from "./opening-poses";
import { poseEase } from "./pose-ease";
import styles from "./opening.module.css";

// One chapter owns both DOM staging and the renderer's normalized pose.
// CSS sticky supplies pinning; ScrollTrigger only maps travel to this timeline.
export function createOpeningTimeline({ chapter, stage, pose, onUpdate }: {
  chapter: HTMLElement; stage: HTMLElement; pose: PhonePose;
  onUpdate(progress: number): void;
}) {
  const find = (key: keyof typeof styles) => stage.querySelector(`.${styles[key]}`)!;
  const hero = find("hero"), returning = find("returnCopy"), desk = find("deskCopy");
  const rear = find("rear"), front = find("foreground");
  gsap.set(hero, { autoAlpha: 1, yPercent: 0 });
  gsap.set(returning, { autoAlpha: 0, yPercent: 85 });
  gsap.set(desk, { autoAlpha: 0, yPercent: 110 });
  gsap.set(rear, { opacity: 0, yPercent: 80 });
  gsap.set(front, { opacity: 0, yPercent: 0 });
  let refreshing = false;
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: chapter, start: "top top",
      end: () => `+=${chapter.offsetHeight - stage.offsetHeight}`,
      scrub: true, invalidateOnRefresh: true,
      // Refresh rewinds scrubbed animations internally. Publish only the final
      // restored pose, even when progress is unchanged and callbacks are suppressed.
      onRefreshInit() { refreshing = true; },
      onRefresh(self) { refreshing = false; if (self.animation) onUpdate(self.animation.progress()); },
    },
    onUpdate() { if (!refreshing) onUpdate(timeline.progress()); },
  });
  addPhonePoseTrack(timeline, pose);
  timeline.to(hero, { yPercent: -110, duration: .28 }, .02)
    .set(hero, { autoAlpha: 0 }, .30)
    .to(find("brand"), { autoAlpha: 0, y: -20, duration: .15 }, .10)
    .set(returning, { autoAlpha: 1 }, .23)
    .to(returning, { yPercent: 0, duration: .26 }, .23)
    .to(returning, { yPercent: -110, duration: .15 }, .61)
    .set(returning, { autoAlpha: 0 }, .76)
    .set(desk, { autoAlpha: 1 }, .69)
    .to(desk, { yPercent: 0, duration: .20 }, .69)
    .to(rear, { opacity: 1, yPercent: 0, duration: .15, ease: "power1.out" }, .73)
    .to(front, { opacity: 1, duration: .025, ease: "power1.out" }, .905)
    .to(find("beam"), { opacity: .52, xPercent: -8, duration: .22 }, .76)
    .to(find("deskGlow"), { opacity: .8, duration: .2 }, .78);
  return timeline;
}

// Explicit authored start values survive invalidation of the live mutable pose.
export function addPhonePoseTrack(timeline: gsap.core.Timeline, pose: PhonePose) {
  OPENING_POSES.slice(1).forEach((next, i) => {
    const previous = OPENING_POSES[i];
    timeline.addLabel(next.name, next.at);
    for (const field of ["yaw", "pitch", "roll", "scale", "x", "y"] as const) {
      timeline.fromTo(pose, { [field]: previous[field] }, {
        [field]: next[field], duration: next.at - previous.at, immediateRender: false,
        ease: poseEase(OPENING_POSES.map(p => ({ at: p.at, value: p[field] })), i),
      }, previous.at);
    }
  });
}
