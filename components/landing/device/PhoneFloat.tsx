"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import type { Group } from "three";
import { floatStrength, samplePhoneFloat } from "./phone-float";

// Only this child owns ambient offsets. The parent remains exclusively GSAP's.
export default function PhoneFloat({ enabled, progress, children }: {
  enabled: boolean; progress: RefObject<number>; children: ReactNode;
}) {
  const pivot = useRef<Group>(null);
  const eligibility = useRef({ inView: false, visible: false, reduced: true });
  const elapsed = useRef(0);
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      eligibility.current.visible = !document.hidden;
      eligibility.current.reduced = motion.matches;
      invalidate(); // Wake once; useFrame decides whether another is needed.
    };
    const observer = new IntersectionObserver(([entry]) => {
      eligibility.current.inView = entry.isIntersecting;
      update();
    });
    observer.observe(gl.domElement);
    update();
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", update);
    };
  }, [gl, invalidate]);
  useEffect(() => { invalidate(); }, [enabled, invalidate]);
  useFrame((_, delta) => {
    if (!pivot.current) return;
    const { inView, visible, reduced } = eligibility.current;
    const strength = floatStrength(progress.current);
    if (!enabled || reduced || strength === 0) {
      pivot.current.position.set(0, 0, 0);
      pivot.current.rotation.set(0, 0, 0);
      return;
    }
    // Freeze phase/offset while unseen. Resume without counting paused time.
    if (!inView || !visible || gl.getContext().isContextLost()) return;
    elapsed.current += Math.min(delta, .05);
    const entrance = Math.min(elapsed.current / 1.2, 1);
    const ramp = entrance * entrance * (3 - 2 * entrance);
    const offset = samplePhoneFloat(elapsed.current, strength * ramp);
    pivot.current.position.set(offset.x, offset.y, offset.z);
    pivot.current.rotation.set(offset.pitch, offset.yaw, offset.roll, "ZYX");
    invalidate(); // R3F's existing scheduler, no independent RAF/ticker.
  });
  return <group ref={pivot} name="phone-ambient-pivot">{children}</group>;
}
