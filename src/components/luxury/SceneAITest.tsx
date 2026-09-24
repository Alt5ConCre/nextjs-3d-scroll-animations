"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { ContactShadows, Environment, Html, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "./SceneAITest.css";

const HOUSE_MODEL =
  "https://raw.githubusercontent.com/qduoduo-hwh/gptblender_demo/main/gptblender-house-lite.glb";

const CAMERA_FOV = 34;
const CAMERA_LIFT = 0.025;

const chapters = [
  { at: 0, no: "01", label: "ARRIVAL", detail: "A cinematic approach to the residence." },
  { at: 0.16, no: "02", label: "THE THRESHOLD", detail: "Stone, glass and shadow establish the entrance." },
  { at: 0.32, no: "03", label: "LIGHT / FORM", detail: "The architecture reveals itself through movement." },
  { at: 0.50, no: "04", label: "THE INTERIOR", detail: "A quiet passage into the living spaces." },
  { at: 0.68, no: "05", label: "WATER / LANDSCAPE", detail: "Architecture dissolves into the garden and pool." },
  { at: 0.84, no: "06", label: "THE FINAL FRAME", detail: "A wide architectural portrait of the residence." },
];

type Waypoint = { camera: THREE.Vector3; target: THREE.Vector3 };

function chapterFor(progress: number) {
  let active = chapters[0];
  for (const chapter of chapters) if (progress >= chapter.at) active = chapter;
  return active;
}

function House({ onReady }: { onReady: (box: THREE.Box3) => void }) {
  const { scene: sourceScene } = useGLTF(HOUSE_MODEL);
  const scene = useMemo(() => sourceScene.clone(true), [sourceScene]);
  const normalizedOnce = useRef(false);

  useEffect(() => {
    if (normalizedOnce.current) return;
    normalizedOnce.current = true;

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);

    scene.position.sub(center);
    scene.scale.setScalar(12 / maxDim);

    scene.traverse((object) => {
      if (!(object as THREE.Mesh).isMesh) return;
      const mesh = object as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const material = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const item of material) {
        const mat = item as THREE.MeshStandardMaterial;
        if (mat?.isMeshStandardMaterial) {
          mat.envMapIntensity = 1.05;
          mat.roughness = Math.max(0.18, mat.roughness);
        }
      }
    });

    onReady(new THREE.Box3().setFromObject(scene));
  }, [scene, onReady]);

  return <primitive object={scene} />;
}

class PostFXBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[LuxuryHouse] Post-processing isolated:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function CinematicGrade() {
  return (
    <PostFXBoundary>
      <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
        <Bloom
          luminanceThreshold={1.15}
          luminanceSmoothing={0.55}
          intensity={0.08}
          radius={0.35}
          mipmapBlur
        />
        <Noise premultiply opacity={0.012} />
        <Vignette eskil={false} offset={0.28} darkness={0.48} />
      </EffectComposer>
    </PostFXBoundary>
  );
}\n\nfunction CameraDirector({
  scrollTarget,
  bounds,
}: {
  scrollTarget: React.MutableRefObject<number>;
  bounds: THREE.Box3 | null;
}) {
  const { camera } = useThree();
  const smoothed = useRef(0);
  const currentCamera = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  const waypoints = useMemo<Waypoint[]>(() => {
    const b = bounds ?? new THREE.Box3(
      new THREE.Vector3(-6, -6, -6),
      new THREE.Vector3(6, 6, 6)
    );
    const c = b.getCenter(new THREE.Vector3());
    const size = b.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.z, 1) * 0.5;
    const halfHeight = Math.max(size.y * 0.5, 1);
    const safe = Math.max(3.2, radius * 0.82);
    const elevated = Math.max(1.3, halfHeight * 0.30);
    const target = (x = 0, y = 0, z = 0) =>
      new THREE.Vector3(c.x + x * radius, c.y + y * halfHeight, c.z + z * radius);

    return [
      { camera: new THREE.Vector3(c.x + safe * 1.70, c.y + elevated * 1.90, c.z + safe * 1.90), target: target(0, 0.05, 0) },
      { camera: new THREE.Vector3(c.x + safe * 1.38, c.y + elevated * 1.48, c.z + safe * 1.48), target: target(0.04, 0.02, 0) },
      { camera: new THREE.Vector3(c.x + safe * 1.10, c.y + elevated * 1.12, c.z + safe * 1.10), target: target(0, 0.04, 0) },
      { camera: new THREE.Vector3(c.x + safe * 0.90, c.y + elevated * 0.88, c.z + safe * 0.78), target: target(-0.08, 0.08, -0.04) },
      { camera: new THREE.Vector3(c.x - safe * 0.78, c.y + elevated * 0.95, c.z + safe * 0.72), target: target(-0.12, 0.10, -0.08) },
      { camera: new THREE.Vector3(c.x - safe * 1.15, c.y + elevated * 1.30, c.z + safe * 1.15), target: target(0.08, 0.06, 0) },
      { camera: new THREE.Vector3(c.x - safe * 1.65, c.y + elevated * 1.82, c.z + safe * 1.60), target: target(0, 0.02, 0) },
      { camera: new THREE.Vector3(c.x + safe * 1.85, c.y + elevated * 2.00, c.z + safe * 1.85), target: target(0, 0.02, 0) },
    ];
  }, [bounds]);

  useFrame((_, delta) => {
    const next = THREE.MathUtils.clamp(scrollTarget.current, 0, 1);
    smoothed.current = THREE.MathUtils.damp(smoothed.current, next, 6.5, delta);

    const scaled = smoothed.current * (waypoints.length - 1);
    const i = Math.min(waypoints.length - 2, Math.max(0, Math.floor(scaled)));
    const t = THREE.MathUtils.smootherstep(scaled - i, 0, 1);
    const a = waypoints[i];
    const b = waypoints[i + 1];

    currentCamera.current.lerpVectors(a.camera, b.camera, t);
    currentTarget.current.lerpVectors(a.target, b.target, t);
    currentCamera.current.y += Math.sin(smoothed.current * Math.PI * 4) * CAMERA_LIFT;

    if (!initialized.current) {
      camera.position.copy(currentCamera.current);
      initialized.current = true;
    } else {
      camera.position.lerp(currentCamera.current, Math.min(1, delta * 10));
    }
    camera.lookAt(currentTarget.current);
  });

  return null;
}

function WebGLGuard({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", handleLost, { passive: false });
    return () => canvas.removeEventListener("webglcontextlost", handleLost);
  }, [gl, onContextLost]);

  return null;
}

function ArchitecturalScene({
  scrollTarget,
  onReady,
  onContextLost,
}: {
  scrollTarget: React.MutableRefObject<number>;
  onReady: (box: THREE.Box3) => void;
  onContextLost: () => void;
}) {
  const [bounds, setBounds] = useState<THREE.Box3 | null>(null);

  const handleReady = useCallback((box: THREE.Box3) => {
    setBounds(box);
    onReady(box);
  }, [onReady]);

  return (
    <>
      <color attach="background" args={["#11100d"]} />
      <fog attach="fog" args={["#11100d", 18, 46]} />

      <ambientLight intensity={0.42} />
      <directionalLight
        castShadow
        position={[8, 12, 10]}
        intensity={3}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00015}
      />
      <directionalLight position={[-8, 5, -6]} intensity={1.25} />
      <spotLight position={[0, 10, 4]} angle={0.55} penumbra={0.9} intensity={18} distance={30} />

      <Environment preset="city" environmentIntensity={0.55} />

      <Suspense fallback={<Html center><div className="sceneai-loader">LOADING ARCHITECTURE</div></Html>}>
        <House onReady={handleReady} />
        <ContactShadows position={[0, -5.9, 0]} opacity={0.38} scale={28} blur={2.8} far={18} />
      </Suspense>

      <CameraDirector scrollTarget={scrollTarget} bounds={bounds} />
      <CinematicGrade />
      <WebGLGuard onContextLost={onContextLost} />
      <Preload all />
    </>
  );
}

export default function SceneAITest() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const target = useRef(0);
  const current = useRef(0);

  const updateScrollTarget = useCallback(() => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    target.current = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
  }, []);

  useEffect(() => {
    updateScrollTarget();
    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("resize", updateScrollTarget);
    return () => {
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", updateScrollTarget);
    };
  }, [updateScrollTarget]);

  useEffect(() => {
    let frame = 0;
    const syncUI = () => {
      current.current = target.current;
      setProgress((value) => Math.abs(value - target.current) > 0.002 ? target.current : value);
      frame = requestAnimationFrame(syncUI);
    };
    frame = requestAnimationFrame(syncUI);
    return () => cancelAnimationFrame(frame);
  }, []);

  const chapter = chapterFor(progress);
  const handleReady = useCallback((_box: THREE.Box3) => setLoaded(true), []);

  return (
    <main className="sceneai-test">
      <div className="sceneai-canvas">
        <Canvas
          shadows
          camera={{ fov: CAMERA_FOV, near: 0.05, far: 100 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          onCreated={() => setLoaded(true)}
        >
          <ArchitecturalScene
            scrollTarget={target}
            onReady={handleReady}
            onContextLost={() => setContextLost(true)}
          />
        </Canvas>
      </div>

      <div className="sceneai-atmosphere" />
      <div className="sceneai-vignette" />
      <div className="sceneai-grain" />

      <header className="sceneai-nav">
        <span className="sceneai-brand">PRIVATE RESIDENCE</span>
        <span className="sceneai-meta">ARCHITECTURAL FILM / 2026</span>
      </header>

      <aside className="sceneai-progress">
        <span>{chapter.no}</span>
        <div className="sceneai-progress-track"><i style={{ transform: `scaleY(${Math.max(0.02, progress)})` }} /></div>
        <span>06</span>
      </aside>

      <section className="sceneai-copy">
        <p>ARCHITECTURE / {chapter.no}</p>
        <h1 key={chapter.no}>{chapter.label}</h1>
        <span>{chapter.detail}</span>
      </section>

      {(!loaded || contextLost) && (
        <div className="sceneai-loading">
          <span>{contextLost ? "WEBGL CONTEXT LOST — RELOAD TO RESTORE" : "PREPARING THE SCENE"}</span>
        </div>
      )}

      <div className="sceneai-scroll-hint">
        <span>SCROLL TO DIRECT THE CAMERA</span>
        <i />
      </div>

      {chapters.map((chapter, index) => (
        <div className="sceneai-spacer" key={chapter.no} data-scene={index} />
      ))}

      <footer className="sceneai-footer">
        <span>SCROLL / SCRUB / REVERSE</span>
        <span>PRIVATE RESIDENCE</span>
      </footer>
    </main>
  );
}

useGLTF.preload(HOUSE_MODEL);
