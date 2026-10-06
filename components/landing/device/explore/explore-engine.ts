import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three';
import artwork from './explore-art.json';

export const EXPLORE_SOUNDS = artwork.flatMap(category => category.sounds.map(sound => ({ ...sound, category: category.id, color: category.color })));
export type ExploreSnapshot = { active: boolean; available: boolean; selected: string[]; volumes: Record<string, number>; status: string; category: string };
export type ExploreEngine = ReturnType<typeof createExploreEngine>;
const W = 768, H = 1620, TOP = 270, BOTTOM = 1440;
const HOME = { x: 1200, y: 1100, zoom: .43 };

// Owns the interactive display and audio only. No phone/chapter transforms.
export function createExploreEngine(font: string, notify: (snapshot: ExploreSnapshot) => void) {
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Explore preview canvas unavailable');
  const context = ctx;
  const texture = new CanvasTexture(canvas);
  texture.flipY = false; texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter; texture.magFilter = LinearFilter; texture.generateMipmaps = false;
  const shapes = artwork.map(category => ({ ...category, paths: category.paths.map(path => new Path2D(path.d)) }));
  const sky = Array.from({ length: 48 }, (_, i) => ({ x: ((i * 227 + 113) % 757), y: TOP + ((i * 367 + 71) % 1160), size: i % 4 === 0 ? 1.8 : .8 }));
  const state: ExploreSnapshot = { active: false, available: false, selected: [], volumes: {}, status: 'Explore six real sound previews.', category: 'ALL' };
  const audio = new Map<string, HTMLAudioElement>();
  const camera = { ...HOME }, target = { ...HOME };
  let dirty = true, disposed = false, phase = 0;
  let dragging: { x: number; y: number; travel: number } | null = null;
  const snapshot = () => ({ ...state, selected: [...state.selected], volumes: { ...state.volumes } });
  const changed = () => { dirty = true; notify(snapshot()); };
  const centerY = (TOP + BOTTOM) / 2;
  const screenPoint = (position: number[]) => ({ x: W / 2 + (position[0] - camera.x) * camera.zoom, y: centerY + (position[1] - camera.y) * camera.zoom });
  function stop(status = 'Previews stopped.') {
    for (const element of audio.values()) { element.pause(); element.currentTime = 0; }
    state.selected = []; state.status = status; changed();
  }
  function activate() { if (!state.available) return; state.active = true; state.status = 'Drag the map. Tap a sound to listen.'; changed(); }
  function close() { stop(); state.active = false; dragging = null; changed(); }
  function availability(available: boolean) {
    if (state.available === available) return;
    state.available = available;
    if (!available) { stop('Previews paused as the phone leaves view.'); dragging = null; }
    changed();
  }
  function select(id: string) {
    if (!state.available) return;
    if (!state.active) activate();
    const sound = EXPLORE_SOUNDS.find(item => item.id === id);
    if (!sound) return;
    if (state.selected.includes(id)) {
      audio.get(id)?.pause(); state.selected = state.selected.filter(item => item !== id); state.status = `${sound.name} removed.`; changed(); return;
    }
    if (state.selected.length >= 2) { state.status = 'Stop a sound before adding another. This preview mixes two layers.'; changed(); return; }
    let element = audio.get(id);
    if (!element) {
      element = new Audio(); element.preload = 'none'; element.src = sound.audio; audio.set(id, element);
      element.addEventListener('ended', () => {
        if (disposed) return;
        state.selected = state.selected.filter(item => item !== id); state.status = `${sound.name} preview finished.`; changed();
      });
      element.addEventListener('error', () => {
        if (disposed || !state.selected.includes(id)) return;
        state.selected = state.selected.filter(item => item !== id); state.status = `${sound.name} could not load. Tap to retry.`; changed();
      });
    }
    const player = element;
    player.currentTime = 0; player.volume = state.volumes[id] ?? .3; state.volumes[id] = player.volume;
    state.selected.push(id); state.status = `Loading ${sound.name}…`; changed();
    // Called directly from a pointer/keyboard action to preserve autoplay permission.
    void player.play().then(() => {
      if (disposed || !state.available || !state.selected.includes(id)) { player.pause(); return; }
      state.status = `Playing ${sound.name} · 30-second preview`; changed();
    }).catch(() => {
      if (disposed || !state.selected.includes(id)) return;
      state.selected = state.selected.filter(item => item !== id); state.status = `${sound.name} could not play. Tap to retry.`; changed();
    });
  }
  function volume(id: string, value: number) {
    state.volumes[id] = Math.max(0, Math.min(1, value));
    const player = audio.get(id); if (player) player.volume = state.volumes[id]; changed();
  }
  function category(id: string) {
    state.category = id;
    const shape = artwork.find(item => item.id === id);
    Object.assign(target, shape ? { x: shape.center[0], y: shape.center[1], zoom: 1.05 } : HOME);
    changed();
  }
  function zoom(factor: number, x = W / 2, y = centerY) {
    const next = Math.max(.3, Math.min(1.65, target.zoom * factor));
    target.x += (x - W / 2) / target.zoom - (x - W / 2) / next;
    target.y += (y - centerY) / target.zoom - (y - centerY) / next;
    target.zoom = next; dirty = true;
  }
  function tap(x: number, y: number) {
    if (y < TOP && y > 175) { category(['ALL', 'RAIN', 'NATURE', 'NOISE'][Math.min(3, Math.floor(x / (W / 4)))]); return; }
    if (y > BOTTOM) {
      if (x > 575) stop();
      else if (x < 85) zoom(1 / 1.2);
      else if (x < 165) zoom(1.2);
      else category('ALL');
      return;
    }
    const sound = EXPLORE_SOUNDS.map(item => ({ item, p: screenPoint(item.position) }))
      .sort((a, b) => Math.hypot(a.p.x - x, a.p.y - y) - Math.hypot(b.p.x - x, b.p.y - y))[0];
    if (sound && Math.hypot(sound.p.x - x, sound.p.y - y) < 42) select(sound.item.id);
  }
  function down(x: number, y: number) { activate(); dragging = { x, y, travel: 0 }; }
  function move(x: number, y: number) {
    if (!dragging || !state.active) return;
    const dx = x - dragging.x, dy = y - dragging.y;
    dragging.travel += Math.hypot(dx, dy);
    if (y > TOP && y < BOTTOM && dragging.travel > 8) {
      camera.x = target.x = Math.max(0, Math.min(2400, camera.x - dx / camera.zoom));
      camera.y = target.y = Math.max(0, Math.min(2400, camera.y - dy / camera.zoom)); dirty = true;
    }
    dragging.x = x; dragging.y = y;
  }
  function up(x: number, y: number) { if (dragging && dragging.travel < 14) tap(x, y); dragging = null; }
  const cancel = () => { dragging = null; };
  function draw() {
    context.fillStyle = '#0e0c17'; context.fillRect(0, 0, W, H);
    for (const wash of [{ x: 120, y: 500, color: '#255c663b' }, { x: 650, y: 650, color: '#49376055' }, { x: 400, y: 1320, color: '#9b561839' }]) {
      const gradient = context.createRadialGradient(wash.x, wash.y, 0, wash.x, wash.y, 700);
      gradient.addColorStop(0, wash.color); gradient.addColorStop(1, '#00000000'); context.fillStyle = gradient; context.fillRect(0, 0, W, H);
    }
    for (const star of sky) {
      context.globalAlpha = .25 + .12 * Math.sin(phase * .35 + star.x);
      context.fillStyle = '#d8d4e5'; context.beginPath(); context.arc(star.x, star.y, star.size, 0, Math.PI * 2); context.fill();
    }
    context.globalAlpha = 1;
    context.save(); context.beginPath(); context.rect(0, TOP, W, BOTTOM - TOP); context.clip();
    for (const shape of shapes) {
      const point = screenPoint(shape.center);
      context.save(); context.translate(point.x - 240 * camera.zoom, point.y - 225 * camera.zoom);
      context.scale(camera.zoom * 480 / shape.width, camera.zoom * 451 / shape.height);
      context.strokeStyle = `${shape.color}42`; context.lineWidth = 2.5 / camera.zoom;
      shape.paths.forEach(path => context.stroke(path)); context.restore();
      context.fillStyle = `${shape.color}bb`; context.font = `400 25px ${font}`; context.textAlign = 'center';
      context.fillText(shape.name, point.x, point.y + 240 * camera.zoom + 30);
    }
    for (const sound of EXPLORE_SOUNDS) {
      const p = screenPoint(sound.position), selected = state.selected.includes(sound.id);
      if (selected) {
        const light = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, 150);
        light.addColorStop(0, `${sound.color}22`); light.addColorStop(1, `${sound.color}00`);
        context.fillStyle = light; context.fillRect(p.x - 150, p.y - 150, 300, 300);
      }
      const radius = selected ? 40 : 25;
      const glow = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      glow.addColorStop(0, '#f1f5ffe6');
      glow.addColorStop(.12, `${sound.color}a0`);
      glow.addColorStop(.4, `${sound.color}35`);
      glow.addColorStop(1, `${sound.color}00`);
      context.fillStyle = glow; context.fillRect(p.x - radius, p.y - radius, radius * 2, radius * 2);
      context.beginPath(); context.arc(p.x, p.y, selected ? 3 : 2.4, 0, Math.PI * 2); context.fillStyle = '#ecffff'; context.fill();
      if (selected) { context.beginPath(); context.arc(p.x, p.y, 17, 0, Math.PI * 2); context.strokeStyle = `${sound.color}90`; context.lineWidth = 1.2; context.stroke(); }
      if (camera.zoom > .62 || selected || sound.id === 'calming_rain') {
        context.font = `400 23px ${font}`; context.fillStyle = '#e0dbe9'; context.textAlign = 'center';
        context.fillText(sound.name, p.x, p.y + 39);
        if (selected) { context.font = `400 18px ${font}`; context.fillStyle = sound.color; context.fillText(`${Math.round((state.volumes[sound.id] ?? .3) * 100)}% · playing`, p.x, p.y + 65); }
      }
    }
    context.restore();
    context.fillStyle = '#100d1af2'; context.fillRect(0, 0, W, TOP);
    context.textAlign = 'left'; context.fillStyle = '#ddd7e7'; context.font = `300 50px ${font}`; context.fillText('Explore', 32, 76);
    context.font = `400 24px ${font}`; context.fillStyle = '#aaa1b9'; context.fillText('6 sounds to try · Discover more in the app', 32, 130);
    context.textAlign = 'right'; context.font = `400 19px ${font}`; context.fillStyle = '#aaa1b9'; context.fillText('INTERACTIVE PREVIEW', W - 32, 67);
    ['All', 'Rain & Storms', 'Nature', 'Noise'].forEach((label, i) => {
      const active = state.category === ['ALL', 'RAIN', 'NATURE', 'NOISE'][i];
      const x = W / 8 + i * W / 4;
      context.beginPath(); context.arc(x, 190, active ? 8 : 5, 0, Math.PI * 2); context.fillStyle = active ? '#00cdb8' : '#777080'; context.fill();
      context.font = `400 22px ${font}`; context.textAlign = 'center'; context.fillStyle = active ? '#eee7f3' : '#9e93ad'; context.fillText(label, x, 227);
    });
    context.fillStyle = '#171321f2'; context.fillRect(0, BOTTOM, W, H - BOTTOM);
    context.fillStyle = '#d4cbe2'; context.textAlign = 'left'; context.font = `400 22px ${font}`;
    context.fillText(state.active ? `${state.selected.length} sound previews` : 'Tap a sound to explore', 30, BOTTOM + 42);
    context.fillStyle = '#00cdb8'; context.font = `400 30px ${font}`; context.fillText('−', 40, BOTTOM + 105); context.fillText('+', 120, BOTTOM + 105);
    context.font = `400 23px ${font}`; context.fillText('Reset view', 200, BOTTOM + 103); context.fillText('Stop', 615, BOTTOM + 103);
    context.fillStyle = '#a198af'; context.font = `400 17px ${font}`; context.fillText('Drag to pan · + / − to zoom · two layers', 30, H - 24);
    texture.needsUpdate = true; dirty = false;
  }
  draw();
  return {
    texture, snapshot, isActive: () => state.active, activate, close, availability, select, stop, volume, category, zoom, down, move, up, cancel,
    frame(delta: number, reduced: boolean) {
      const alpha = reduced ? 1 : 1 - Math.exp(-delta * 7);
      const moving = Math.abs(camera.x - target.x) + Math.abs(camera.y - target.y) + Math.abs(camera.zoom - target.zoom) * 100 > .05;
      if (moving) { for (const key of ['x', 'y', 'zoom'] as const) camera[key] += (target[key] - camera[key]) * alpha; dirty = true; }
      if (!reduced && state.active && state.available) { phase += delta; dirty = true; }
      if (dirty) { draw(); return true; } return false;
    },
    dispose() {
      disposed = true;
      for (const player of audio.values()) { player.pause(); player.removeAttribute('src'); player.load(); }
      audio.clear(); texture.dispose();
    },
  };
}
