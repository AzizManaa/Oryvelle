import { CanvasTexture, Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Scene } from "three";

// Reflection cards are baked into the existing PMREM once. They never enter
// the visible scene, add draw calls to the phone, or require a render loop.
export function createPhoneEnvironment() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.45, "#aaaaaa");
  gradient.addColorStop(1, "#000000");
  context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
  const softbox = new CanvasTexture(canvas);
  const scene = new Scene();
  scene.background = new Color("#353537");
  const geometry = new PlaneGeometry(1, 1);
  const materials: MeshBasicMaterial[] = [];
  const card = (position: [number, number, number], size: [number, number], color: string, strength: number) => {
    const material = new MeshBasicMaterial({ color: new Color(color).multiplyScalar(strength), map: softbox, side: DoubleSide, toneMapped: false });
    materials.push(material);
    const mesh = new Mesh(geometry, material);
    mesh.position.set(...position); mesh.scale.set(size[0], size[1], 1); mesh.lookAt(0, 0, 0);
    scene.add(mesh);
  };
  card([-2, 2, 6], [6, 8], "#f4f3f1", 6);
  card([4, 2, 4], [0.7, 6], "#b9c6df", 2);
  card([-3, 2, -5], [3, 5], "#e8e8ea", 3);
  card([0, 6, 1], [6, 2], "#eeeeef", 1);
  return { scene, dispose() { geometry.dispose(); softbox.dispose(); materials.forEach(material => material.dispose()); } };
}
