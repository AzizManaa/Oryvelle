'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import { Raycaster, Vector2, type Mesh, type Texture } from 'three';
import type { PhonePose, ScreenState } from '../phone-model';
import { createExploreEngine, type ExploreEngine, type ExploreSnapshot } from './explore-engine';

export function usePhoneExplore({ presented, screen, pose, sourcesRef, phone, onReady, onChange }: {
  presented: boolean; screen: RefObject<ScreenState>; pose: RefObject<PhonePose>;
  sourcesRef: RefObject<Record<ScreenState, Texture>>;
  phone: { display: Mesh; setScreen(texture: Texture): void };
  onReady?: (demo: ExploreEngine | null) => void;
  onChange?: (snapshot: ExploreSnapshot) => void;
}) {
  const { gl, camera, invalidate } = useThree();
  const engine = useRef<ExploreEngine | null>(null);
  const sync = useRef<() => void>(() => {});
  const presentedRef = useRef(presented);
  const eligibility = useRef({ visible: false, reduced: false });
  const accumulated = useRef(0);
  useEffect(() => {
    const activeScreen = screen;
    const sourceTextures = sourcesRef.current;
    const original = sourceTextures.portraitB;
    let inView = false;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let demo: ExploreEngine;
    try {
      demo = createExploreEngine(getComputedStyle(gl.domElement).fontFamily, snapshot => { onChange?.(snapshot); invalidate(); });
    } catch { return; } // Retain the real screen poster when Canvas 2D is unavailable.
    engine.current = demo;
    sourceTextures.portraitB = demo.texture;
    if (screen.current === 'portraitB') phone.setScreen(demo.texture);
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDistance = 0, pinched = false;
    const update = () => {
      const visible = inView && !document.hidden && presentedRef.current && screen.current === 'portraitB'
        && Math.cos(pose.current.yaw) > .08 && !gl.getContext().isContextLost();
      eligibility.current = { visible, reduced: motion.matches };
      if (!visible) { pointers.clear(); pinchDistance = 0; pinched = false; }
      demo.availability(visible); invalidate();
    };
    sync.current = update;
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(gl.domElement);
    const ray = new Raycaster(), pointer = new Vector2();
    const pick = (event: PointerEvent | WheelEvent) => {
      if (!eligibility.current.visible) return null;
      const rect = gl.domElement.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObject(phone.display, false)[0];
      if (!hit?.uv) return null;
      const uv = hit.uv.clone(); demo.texture.updateMatrix(); demo.texture.transformUv(uv);
      return { x: uv.x * 768, y: uv.y * 1620 };
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || (event.target instanceof Element && event.target.closest('button,a,input,select'))) return;
      const point = pick(event); if (!point) return;
      if (event.pointerType === 'touch' && !demo.snapshot().active) return; // Explicit mobile entry preserves native page scrolling.
      event.preventDefault(); pointers.set(event.pointerId, point);
      if (pointers.size === 1) { pinched = false; demo.down(point.x, point.y); }
      else { demo.cancel(); pinchDistance = 0; pinched = true; }
      invalidate();
    };
    const move = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      const point = pick(event); if (!point) return;
      event.preventDefault(); pointers.set(event.pointerId, point);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance > 0) demo.zoom(distance / pinchDistance, (a.x + b.x) / 2, (a.y + b.y) / 2);
        pinchDistance = distance;
      } else if (!pinched) demo.move(point.x, point.y);
      invalidate();
    };
    const up = (event: PointerEvent) => {
      const last = pointers.get(event.pointerId); if (!last) return;
      if (event.type !== 'pointercancel' && !pinched) { const point = pick(event) ?? last; demo.up(point.x, point.y); }
      else demo.cancel();
      pointers.delete(event.pointerId); if (!pointers.size) { pinchDistance = 0; pinched = false; } invalidate();
    };
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey || !demo.snapshot().active) return;
      const point = pick(event); if (!point) return;
      event.preventDefault(); demo.zoom(Math.exp(-event.deltaY * .002), point.x, point.y); invalidate();
    };
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Escape' && demo.snapshot().active) { demo.close(); pointers.clear(); invalidate(); } };
    window.addEventListener('pointerdown', down, { capture: true, passive: false });
    window.addEventListener('pointermove', move, { capture: true, passive: false });
    window.addEventListener('pointerup', up, true); window.addEventListener('pointercancel', up, true);
    window.addEventListener('wheel', wheel, { passive: false }); window.addEventListener('keydown', keyboard);
    document.addEventListener('visibilitychange', update); motion.addEventListener('change', update);
    onReady?.(demo); onChange?.(demo.snapshot()); update();
    return () => {
      engine.current = null; sync.current = () => {}; observer.disconnect(); pointers.clear();
      window.removeEventListener('pointerdown', down, true); window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', up, true); window.removeEventListener('pointercancel', up, true);
      window.removeEventListener('wheel', wheel); window.removeEventListener('keydown', keyboard);
      document.removeEventListener('visibilitychange', update); motion.removeEventListener('change', update);
      sourceTextures.portraitB = original;
      if (activeScreen.current === 'portraitB') phone.setScreen(original);
      demo.dispose(); onReady?.(null);
    };
  }, [gl, camera, invalidate, phone, pose, screen, sourcesRef, onReady, onChange]);
  useEffect(() => { presentedRef.current = presented; sync.current(); }, [presented]);
  useFrame((_, delta) => {
    if (!engine.current || !eligibility.current.visible) return;
    accumulated.current += Math.min(delta, .1);
    if (accumulated.current >= 1 / 30) {
      const painted = engine.current.frame(accumulated.current, eligibility.current.reduced);
      accumulated.current = 0;
      if (painted) invalidate();
    }
    if (engine.current.isActive() && !eligibility.current.reduced) invalidate();
  });
  return sync;
}
