import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Mesh, MeshBasicMaterial, Texture } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { preparePhone } from "./phone-model";

describe("supplied phone asset contract", () => {
  it("maps the existing display independently while preserving the cached source", async () => {
    const bytes = readFileSync("public/assests/oryvelle-phone.glb");
    const { scene } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), "");
    const original = scene.getObjectByName("Object_6") as Mesh;
    const originalUV = Array.from(original.geometry.attributes.uv.array);
    const screens = { A: new Texture(), B: new Texture() };
    const phone = preparePhone(scene, screens.A);
    const display = phone.scene.getObjectByName("Object_6") as Mesh;
    const glass = phone.scene.getObjectByName("Object_44") as Mesh;
    expect(display.geometry.attributes.uv.count).toBe(display.geometry.attributes.position.count);
    const u = Array.from(display.geometry.attributes.uv.array).filter((_, i) => i % 2 === 0);
    expect(Math.min(...u)).toBeCloseTo(0); expect(Math.max(...u)).toBeCloseTo(1);
    expect(display.material).not.toBe(glass.material);
    phone.setScreen(screens.B);
    expect((display.material as MeshBasicMaterial).map).toBe(screens.B);
    expect(Array.from(original.geometry.attributes.uv.array)).toEqual(originalUV);
    expect(original.material).not.toBe(display.material);
    expect(scene.getObjectByName("Object_61")!.visible).toBe(true);
    expect(phone.scene.getObjectByName("Object_61")!.visible).toBe(false);
    // Only instance-owned GPU resources are disposed. Cached geometry/material
    // and caller-owned screen textures must remain usable by future mounts.
    let sharedDisposed = 0, ownedDisposed = 0, screenDisposed = 0;
    original.geometry.addEventListener("dispose", () => sharedDisposed++);
    (original.material as MeshBasicMaterial).addEventListener("dispose", () => sharedDisposed++);
    display.geometry.addEventListener("dispose", () => ownedDisposed++);
    (display.material as MeshBasicMaterial).addEventListener("dispose", () => ownedDisposed++);
    screens.B.addEventListener("dispose", () => screenDisposed++);
    phone.dispose();
    expect(sharedDisposed).toBe(0);
    expect(screenDisposed).toBe(0);
    expect(ownedDisposed).toBe(2);
    screens.A.dispose(); screens.B.dispose();
  });
});
