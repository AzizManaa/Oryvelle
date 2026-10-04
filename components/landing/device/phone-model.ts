import { Box3, DataTexture, Float32BufferAttribute, FrontSide, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, LinearMipmapLinearFilter, RepeatWrapping, RGBAFormat, Vector3, type Group, type Material, type Texture } from "three";

export const PHONE_URL = "/assests/oryvelle-phone.glb";
import type { ScreenState } from "./screen-sources";
export type { ScreenState } from "./screen-sources";
export type PhonePose = { yaw: number; pitch: number; roll: number; scale: number; y: number; x?: number };
export type PhoneController = { apply: (pose: PhonePose, screen: ScreenState) => void; setAmbientProgress: (progress: number) => void; setScreen: (texture: Texture) => void; setScreenSource: (state: ScreenState, texture: Texture) => void; invalidate: () => void };

// Asset-specific adaptation of existing surfaces, never an added screen plane.
export function preparePhone(source: Group, initialScreen: Texture) {
  // Microvariation affects roughness only, not geometry, normal vectors or color.
  const grain = new Uint8Array(128 * 128 * 4);
  let seed = 726;
  for (let i = 0; i < grain.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const value = 210 + (seed % 46);
    grain[i] = grain[i + 1] = grain[i + 2] = value; grain[i + 3] = 255;
  }
  const finish = new DataTexture(grain, 128, 128, RGBAFormat);
  finish.wrapS = finish.wrapT = RepeatWrapping;
  finish.repeat.set(8, 8); finish.generateMipmaps = true;
  finish.minFilter = LinearMipmapLinearFilter; finish.needsUpdate = true;
  const scene = source.clone(true);
  scene.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(scene);
  const center = bounds.getCenter(new Vector3());
  const resources: { materials: Material[]; geometries: Mesh["geometry"][] } = { materials: [], geometries: [] };
  scene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.material = Array.isArray(object.material) ? object.material.map(m => m.clone()) : object.material.clone();
    resources.materials.push(...(Array.isArray(object.material) ? object.material : [object.material]));
    if ((object.material as MeshStandardMaterial).isMeshStandardMaterial) {
      const material = object.material as MeshStandardMaterial;
      // Surface-specific calibration; retain the exported geometry and normals.
      if (["Object_48", "Object_49"].includes(object.name)) {
        material.color.set("#222327"); material.metalness = 0.65; material.roughness = 0.28;
      } else if (object.name === "Object_46") {
        material.color.set("#0d0d11"); material.metalness = 0.12; material.roughness = 0.6;
      } else if (object.name === "Object_4") {
        material.color.set("#45454b"); material.metalness = 0.23; material.roughness = 0.46; material.roughnessMap = finish;
      } else if (object.name === "Object_8") {
        material.color.set("#25262b"); material.metalness = 0.6; material.roughness = 0.26;
      } else if (["Object_10", "Object_12", "Object_14", "Object_16", "Object_18"].includes(object.name)) {
        material.color.set("#393a40"); material.metalness = 0.92; material.roughness = 0.20;
      } else if (["Object_20", "Object_26", "Object_28", "Object_34", "Object_42"].includes(object.name)) {
        // Recessed black barrels must not acquire diffuse gray shading.
        material.color.set("#030405"); material.metalness = 0.84; material.roughness = 0.32;
      } else if (["Object_22", "Object_24", "Object_30", "Object_32", "Object_36", "Object_40"].includes(object.name)) {
        // Preserve the export's cool optical coating with restrained saturation.
        material.color.multiplyScalar(0.3); material.metalness = 0.68; material.roughness = 0.055;
      } else if (object.name === "Object_38") {
        material.color.set("#c5c6cd"); material.metalness = 0; material.roughness = 0.38;
      } else if (object.name === "Object_65") {
        // Black metal around the front optic: suppress diffuse gray shading,
        // retaining the exported normals and restrained environment highlights.
        material.color.set("#020304"); material.metalness = 0.84; material.roughness = 0.30;
      } else if (object.name === "Object_67") {
        // Independent inner optic, using the source's cool coating in linear
        // color space. Match the rear optics without emissive blue or an
        // additional transmission pass. This does not change camera geometry.
        material.color.multiplyScalar(0.3); material.metalness = 0.68; material.roughness = 0.055;
      } else if (object.name === "Object_69") {
        material.color.set("#101015"); material.metalness = 0; material.roughness = 0.75;
      }
    }
  });
  // Inspection found exact duplicate lens/ring geometry and transforms.
  // Hide duplicate copies on our instance; keep the supplied GLB untouched.
  ["Object_61", "Object_63"].forEach(name => { const object = scene.getObjectByName(name); if (object) object.visible = false; });
  // The original border shares a plane with chassis faces. Separate the
  // existing border slightly, avoiding coplanar depth noise at hero scale.
  const border = scene.getObjectByName("Object_46");
  if (border) border.position.y += 0.0015;
  const display = scene.getObjectByName("Object_6");
  const glass = scene.getObjectByName("Object_44");
  if (!(display instanceof Mesh) || !(glass instanceof Mesh)) throw new Error("Supplied model no longer has the inspected display/glass surfaces.");
  display.geometry = display.geometry.clone();
  resources.geometries.push(display.geometry);
  const screenBox = new Box3().setFromObject(display);
  const screenSize = screenBox.getSize(new Vector3());
  const positions = display.geometry.attributes.position;
  const uv = new Float32Array(positions.count * 2);
  for (let i = 0; i < positions.count; i++) {
    const p = new Vector3().fromBufferAttribute(positions, i).applyMatrix4(display.matrixWorld);
    // Front faces -Z in the asset. After the normalization Y half-turn, left is +X.
    uv[i * 2] = (screenBox.max.x - p.x) / screenSize.x;
    uv[i * 2 + 1] = (screenBox.max.y - p.y) / screenSize.y;
  }
  display.geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  const displayMaterial = new MeshBasicMaterial({ map: initialScreen, side: FrontSide, toneMapped: false });
  display.material = displayMaterial;
  resources.materials.push(displayMaterial);
  // The export makes two coincident front surfaces opaque. Retain the second
  // matching rounded surface as glass, lifted along its existing local normal.
  glass.position.y += 0.003;
  glass.material = new MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.018, roughness: 0.24, metalness: 0, clearcoat: 0.45, clearcoatRoughness: 0.2, depthWrite: false, side: FrontSide });
  resources.materials.push(glass.material);
  scene.position.copy(center).multiplyScalar(-1);
  return {
    scene,
    display,
    displayAspect: screenSize.x / screenSize.y,
    setScreen(texture: Texture) {
      if (displayMaterial.map === texture) return;
      displayMaterial.map = texture;
      // Image and video maps use different sRGB decoding shader variants.
      // Re-select the program on a source change, never on every pose/frame.
      displayMaterial.needsUpdate = true;
    },
    dispose() { finish.dispose(); resources.materials.forEach(m => m.dispose()); resources.geometries.forEach(g => g.dispose()); },
  };
}
