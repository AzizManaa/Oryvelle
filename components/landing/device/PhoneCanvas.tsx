"use client";

import { addAfterEffect, Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Group, LinearFilter, LinearMipmapLinearFilter, PMREMGenerator, SRGBColorSpace, TextureLoader, type Scene, type Texture } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createPhoneEnvironment } from "./phone-lighting";
import { PHONE_URL, preparePhone, type PhoneController, type PhonePose, type ScreenState } from "./phone-model";

import { SCREEN_KEYS, SCREEN_SOURCES } from "./screen-sources";
import PhoneFloat from "./PhoneFloat";
import { fitScreenTexture, usePhoneScreenVideo } from "./usePhoneScreenVideo";
import { usePhoneExplore } from "./explore/usePhoneExplore";
import type { ExploreDemo, ExploreSnapshot } from "./explore/explore-demo";

function setEnvironment(scene: Scene, texture: Texture | null) {
  scene.environment = texture;
  scene.environmentIntensity = 0.6;
}

type Props = { onReady: (controller: PhoneController) => void; onLost: () => void; onStats?: (text: string) => void; onPresented?: () => void; ambientEnabled?: boolean; interactiveExplore?: boolean; onExploreReady?: (demo: ExploreDemo | null) => void; onExploreChange?: (snapshot: ExploreSnapshot) => void };
function Phone({ onReady, onStats, onPresented, ambientEnabled = false, interactiveExplore = false, onExploreReady, onExploreChange }: Props) {
  const model = useLoader(GLTFLoader, PHONE_URL);
  const loaded = useLoader(TextureLoader, SCREEN_KEYS.map(key => {
    const source = SCREEN_SOURCES[key];
    return source.kind === "video" ? source.poster : source.url;
  }));
  const screens = useMemo(() => {
    const textures = loaded.map(t => t.clone());
    textures.forEach(t => { t.flipY = false; t.colorSpace = SRGBColorSpace; t.minFilter = LinearMipmapLinearFilter; t.magFilter = LinearFilter; t.anisotropy = 4; t.needsUpdate = true; });
    return { portraitA: textures[0], portraitB: textures[1], landscapeC: textures[2] };
  }, [loaded]);
  const sources = useMemo<Record<ScreenState, Texture>>(() => ({ ...screens }), [screens]);
  const phone = useMemo(() => {
    const prepared = preparePhone(model.scene, screens.portraitA);
    SCREEN_KEYS.forEach(key => {
      if (SCREEN_SOURCES[key].kind !== "video") return;
      const image = screens[key].image;
      fitScreenTexture(screens[key], prepared.displayAspect, image.width / image.height);
    });
    return prepared;
  }, [model, screens]);
  const pivot = useRef<Group>(null);
  const ambientProgress = useRef(0);
  const pose = useRef<PhonePose>({ yaw: 0, pitch: 0, roll: 0, scale: 1, y: 0 });
  const screen = useRef<ScreenState>("portraitA");
  const { gl, scene, viewport, invalidate } = useThree();
  const tonightPlayback = usePhoneScreenVideo({ state: "portraitA", enabled: ambientEnabled, screen, pose, sources, phone });
  const explorePlayback = usePhoneScreenVideo({ state: "portraitB", enabled: ambientEnabled, screen, pose, sources, phone, replaced: interactiveExplore });
  const exploreInteraction = usePhoneExplore({ enabled: interactiveExplore, presented: ambientEnabled, screen, pose, sources, phone, onReady: onExploreReady, onChange: onExploreChange });
  const reported = useRef(false);
  const frameCount = useRef(0);
  useLayoutEffect(() => {
    const room = createPhoneEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room.scene, 0.06);
    setEnvironment(scene, target.texture);
    room.dispose(); generator.dispose(); invalidate();
    return () => { setEnvironment(scene, null); target.dispose(); };
  }, [gl, scene, invalidate]);
  useLayoutEffect(() => {
    const apply = (next: PhonePose, nextScreen: ScreenState) => {
      pose.current = { ...next }; screen.current = nextScreen;
      if (pivot.current) {
        pivot.current.rotation.set(next.pitch, next.yaw, next.roll, "ZYX");
        const base = Math.min(viewport.height * 0.78 / 4.9612, viewport.width * 0.82 / 4.9612);
        pivot.current.scale.setScalar(base * next.scale);
        pivot.current.position.set(0, viewport.height * next.y, 0);
      }
      phone.setScreen(sources[nextScreen]);
      tonightPlayback.current();
      explorePlayback.current();
      exploreInteraction.current();
      if (!document.hidden) invalidate();
    };
    onReady({
      apply, invalidate,
      setAmbientProgress: progress => { ambientProgress.current = progress; if (!document.hidden) invalidate(); },
      setScreen: texture => { sources[screen.current] = texture; phone.setScreen(texture); invalidate(); },
      setScreenSource: (state, texture) => {
        sources[state] = texture;
        if (screen.current === state) { phone.setScreen(texture); invalidate(); }
      },
    });
    apply(pose.current, screen.current);
    const visible = () => { if (!document.hidden) apply(pose.current, screen.current); };
    document.addEventListener("visibilitychange", visible);
    return () => document.removeEventListener("visibilitychange", visible);
  }, [viewport.height, viewport.width, phone, sources, invalidate, onReady, tonightPlayback, explorePlayback, exploreInteraction]);
  useLayoutEffect(() => {
    const startingFrame = frameCount.current;
    let presented = false;
    // R3F runs this after its renderer.render call. The local frame counter
    // prevents another canvas's global after-effect from announcing readiness.
    const unsubscribe = addAfterEffect(() => {
      if (!presented && frameCount.current > startingFrame && !gl.getContext().isContextLost() && pivot.current) {
        presented = true;
        onPresented?.();
      }
    });
    invalidate();
    return unsubscribe;
  }, [gl, invalidate, onPresented]);
  useEffect(() => () => { phone.dispose(); Object.values(screens).forEach(texture => texture.dispose()); }, [phone, screens]);
  useFrame(() => {
    frameCount.current += 1;
    if (!onStats) return;
    if (!reported.current) {
      reported.current = true;
      // Current render stats are reported on the next demand frame.
      invalidate();
    } else {
      onStats(`${gl.info.render.calls} draws · ${gl.info.render.triangles.toLocaleString()} triangles · DPR ${gl.getPixelRatio().toFixed(2)} · frames ${frameCount.current} · demand rendering`);
    }
  });
  return <group ref={pivot}><PhoneFloat enabled={ambientEnabled} progress={ambientProgress}><group rotation={[0, Math.PI, 0]}><primitive object={phone.scene} dispose={null} /></group></PhoneFloat></group>;
}

function RendererLifecycle({ onLost }: { onLost(): void }) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    // Mounted outside the asset Suspense boundary: loss while loading also
    // releases the global entry through the static fallback readiness path.
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl, onLost]);
  return null;
}

export default function PhoneCanvas(props: Props) {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 32, near: 0.1, far: 50 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => {
    gl.toneMappingExposure = 0.95;
  }} fallback={<span>3D preview unavailable</span>}>
    <RendererLifecycle onLost={props.onLost} />
    <ambientLight intensity={0.08} />
    <directionalLight position={[-4, 5, 6]} intensity={0.35} color="#edeaff" />
    <directionalLight position={[4, 1, -4]} intensity={0.25} color="#c2c9e3" />
    <directionalLight position={[1, -3, 4]} intensity={0.08} color="#ffffff" />
    <Suspense fallback={null}><Phone {...props} /></Suspense>
  </Canvas>;
}
