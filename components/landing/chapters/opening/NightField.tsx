'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './opening.module.css';

// Stable positions: resizing/hydration never randomly rearranges the sky.
function makeStars() {
  let seed = 73129;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  return Array.from({ length: 170 }, (_, i) => ({
    x: random(), y: random(), radius: .35 + random() * .8,
    brightness: .18 + random() * .42, phase: random() * Math.PI * 2,
    period: 4 + random() * 9, amplitude: .08 + random() * .16,
    bright: i % 13 === 0, cool: i % 3 === 0,
  }));
}
const STARS = makeStars();
const CLUSTERS = [
  [[.70,.09],[.78,.16],[.72,.25],[.88,.30],[.93,.21]],
  [[.08,.49],[.17,.56],[.12,.67],[.26,.73]],
  [[.59,.78],[.68,.71],[.78,.81],[.91,.75]],
];

export default function NightField({ animate }: { animate: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d', { alpha: true });
    if (!context) return; // CSS night/haze remains when Canvas is unavailable.
    let width = 0, height = 0, phase = 0, accumulated = 0;
    let visible = false, subscribed = false;
    const sprites = ['#b9b7ee', '#87bfd7'].map(color => {
      const sprite = document.createElement('canvas'); sprite.width = sprite.height = 64;
      const ctx = sprite.getContext('2d');
      if (ctx) {
        const glow = ctx.createRadialGradient(32,32,0,32,32,32);
        glow.addColorStop(0, '#edf2ff'); glow.addColorStop(.08, color);
        glow.addColorStop(.25, `${color}55`); glow.addColorStop(1, `${color}00`);
        ctx.fillStyle = glow; ctx.fillRect(0,0,64,64);
      }
      return sprite;
    });
    const draw = () => {
      context.clearRect(0,0,width,height);
      const narrow = width <= 760;
      // Keep the editorial heading area quieter, without a visible mask edge.
      const quiet = (x: number, y: number) => 1 - .68 * Math.exp(-((x / .56) ** 2 + (y / .38) ** 2));
      context.lineWidth = .7;
      for (const [index, points] of CLUSTERS.entries()) {
        if (narrow && index === 2) continue;
        context.globalAlpha = 1;
        context.strokeStyle = index === 1 ? '#739fa324' : '#a39ccc2d';
        context.beginPath();
        points.forEach(([x,y], i) => { if (i === 0) context.moveTo(x*width,y*height); else context.lineTo(x*width,y*height); });
        context.stroke();
        for (const [x,y] of points) {
          context.globalAlpha = .6 * quiet(x,y);
          context.drawImage(sprites[index % 2],x*width-8,y*height-8,16,16);
          context.beginPath(); context.arc(x*width,y*height,1,0,Math.PI*2);
          context.fillStyle = '#dbe5ff'; context.fill();
        }
      }
      const count = narrow ? 90 : STARS.length;
      for (let i = 0; i < count; i++) {
        const star = STARS[i];
        const shimmer = 1 + star.amplitude * Math.sin(phase * Math.PI * 2 / star.period + star.phase);
        context.globalAlpha = Math.min(1,star.brightness * shimmer * quiet(star.x,star.y));
        const x = star.x*width, y = star.y*height;
        if (star.bright) context.drawImage(sprites[star.cool ? 1 : 0],x-11,y-11,22,22);
        context.fillStyle = star.cool ? '#c2e0ea' : '#dfd9ef';
        context.beginPath(); context.arc(x,y,star.radius*(star.bright ? 1.5 : 1),0,Math.PI*2); context.fill();
      }
      context.globalAlpha = 1;
    };
    const tick = (_time: number, delta: number) => {
      accumulated += Math.min(delta,100)/1000;
      if (accumulated < 1/20) return;
      phase += accumulated; accumulated = 0; draw();
    };
    const sync = () => {
      const running = animate && visible && !document.hidden;
      if (running === subscribed) return;
      subscribed = running; accumulated = 0;
      if (running) gsap.ticker.add(tick); else gsap.ticker.remove(tick);
    };
    const resize = () => {
      const rect = element.getBoundingClientRect(); width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1,1.5);
      element.width = Math.round(width*dpr); element.height = Math.round(height*dpr);
      context.setTransform(dpr,0,0,dpr,0,0); draw();
    };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(element);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    visibility.observe(element);
    document.addEventListener('visibilitychange',sync);
    resize();
    return () => {
      gsap.ticker.remove(tick); resizeObserver.disconnect(); visibility.disconnect();
      document.removeEventListener('visibilitychange',sync);
      // Release owned backing stores; these are not shared loader resources.
      sprites.forEach(sprite => { sprite.width = sprite.height = 0; });
      element.width = element.height = 0;
    };
  }, [animate]);
  return <canvas ref={canvas} className={styles.nightField} aria-hidden="true" />;
}
