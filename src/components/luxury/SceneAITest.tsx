"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import {
  ContactShadows,
  Environment,
  Html,
  Preload,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import "./SceneAITest.css";

const HOUSE_MODEL =
  "https://raw.githubusercontent.com/qduoduo-hwh/gptblender_demo/main/gptblender-house-lite.glb";

const CAMERA_LIFT = 0.035;
const CAMERA_FOV = 34;

const chapters = [
  { at: 0, no: "01", label: "ARRIVAL", detail: "A cinematic approach to the residence." },
  { at: 0.16, no: "02", label: "THE THRESHOLD", detail: "Stone, glass and shadow establish the entrance." },
  { at: 0.32, no: "03", label: "LIGHT / FORM", detail: "The architecture reveals itself through movement." },
  { at: 0.50, no: "04", label: "THE INTERIOR", detail: "A quiet passage into the living spaces." },
  { at: 0.68, no: "05", label: "WATER / LANDSCAPE", detail: "Architecture dissolves into the garden and pool." },
  { at: 0.84, no: "06", label: "THE FINAL FRAME", detail: "A wide architectural portrait of the residence." },
];

type Waypoint = {
  camera: THREE.Vector3;
  target: THREE.Vector3;
};

function chapterFor(progress: number) {
  let active = chapters[0];
  for (const chapter of chapters) if (progress >= chapter.at) active = chapter;
  return active;
}

function House({ onReady }: { onReady: (box: THREE.Box3) => void }) {
  const { scene: sourceScene } = useGLTF(HOUSE_MODEL);
  const scene = useMemo(() => sourceScene.clone(true), [sourceScene]);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    scene.position.sub(center);
    scene.scale.setScalar(12 / maxDim);

    const normalized = new THREE.Box3().setFromObject(scene);
    onReady(normalized);

    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material?.isMeshStandardMaterial) {
        material.envMapIntensity = 1.05;
        material.roughness = Math.max(0.18, material.roughness);
      }
    });
  }, [scene, onReady]);

  return <group ref={group}><primitive object={scene} /></group>;
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
    console.warn("[LuxuryHouse] Post-processing isolated after client render error:", error);
  }

  render() {
    // Keep the architectural scene alive if a browser/GPU rejects an effect.
    // The cinematic CSS atmosphere/vignette/grain remains active underneath.
    return this.state.failed ? null : this.props.children;
  }
}

function CinematicGrade() {
  return (
    <PostFXBoundary>
      <EffectComposer multisampling={2}>
        <Bloom luminanceThreshold={1.05} mipmapBlur intensity={0.12} radius={0.5} />
        <Noise premultiply opacity={0.018} />
        <Vignette eskil={false} offset={0.22} darkness={0.62} />
      </EffectComposer>
    </PostFXBoundary>
  );
}

function CameraDirector({
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

  const waypoints = useMemo<Waypoint[]>(() => {
    // Build the path from the actual normalized house bounds. The previous
    // path used hard-coded world offsets that could send the camera through
    // the model or past the near clipping plane when the GLB dimensions/origin
    // differed. These positions stay outside the house and keep a consistent
    // architectural framing.
    const b = bounds ?? new THREE.Box3(
      new THREE.Vector3(-6, -6, -6),
      new THREE.Vector3(6, 6, 6)
    );
    const c = b.getCenter(new THREE.Vector3());
    const size = b.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.z) * 0.5;
    const halfHeight = Math.max(1, size.y * 0.5);
    const safe = Math.max(2.5, radius * 0.72);
    const elevated = Math.max(1.2, halfHeight * 0.28);

    const target = (x = 0, y = 0, z = 0) =>
      new THREE.Vector3(
        c.x + x * radius,
        c.y + y * halfHeight,
        c.z + z * radius
      );

    return [
      { camera: new THREE.Vector3(c.x + safe * 1.55, c.y + elevated * 1.9, c.z + safe * 1.9), target: target(0, 0.05, 0) },
      { camera: new THREE.Vector3(c.x + safe * 1.25, c.y + elevated * 1.35, c.z + safe * 1.45), target: target(0.05, 0.02, 0) },
      { camera: new THREE.Vector3(c.x + safe * 0.95, c.y + elevated * 1.05, c.z + safe * 1.05), target: target(0, 0.04, 0) },
      { camera: new THREE.Vector3(c.x + safe * 0.78, c.y + elevated * 0.82, c.z + safe * 0.72), target: target(-0.08, 0.08, -0.04) },
      { camera: new THREE.Vector3(c.x - safe * 0.72, c.y + elevated * 0.9, c.z + safe * 0.62), target: target(-0.12, 0.1, -0.08) },
      { camera: new THREE.Vector3(c.x - safe * 1.05, c.y + elevated * 1.25, c.z + safe * 1.1), target: target(0.08, 0.06, 0) },
      { camera: new THREE.Vector3(c.x - safe * 1.5, c.y + elevated * 1.8, c.z + safe * 1.55), target: target(0, 0.02, 0) },
      { camera: new THREE.Vector3(c.x + safe * 1.7, c.y + elevated * 1.95, c.z + safe * 1.7), target: target(0, 0.02, 0) },
    ];
  }, [bounds]);

  useFrame((_, delta) => {
    smoothed.current = THREE.MathUtils.damp(smoothed.current, scrollTarget.current, 7, delta);

    const scaled = smoothed.current * (waypoints.length - 1);
    const i = Math.min(waypoints.length - 2, Math.max(0, Math.floor(scaled)));
    const t = THREE.MathUtils.smootherstep(scaled - i, 0, 1);
    const a = waypoints[i];
    const b = waypoints[i + 1];

    currentCamera.current.lerpVectors(a.camera, b.camera, t);
    currentTarget.current.lerpVectors(a.target, b.target, t);

    // Tiny organic vertical movement, kept deliberately below architectural
    // framing scale so it never makes the camera appear to jump.
    currentCamera.current.y +=
      Math.sin(smoothed.current * Math.PI * 4) * CAMERA_LIFT;

    camera.position.copy(currentCamera.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

function ArchitecturalScene({
  scrollTarget,
  onReady,
}: {
  scrollTarget: React.MutableRefObject<number>;
  onReady: (box: THREE.Box3) => void;
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
        intensity={3.0}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00015}
      />
      <directionalLight position={[-8, 5, -6]} intensity={1.25} />
      <spotLight position={[0, 10, 4]} angle={0.55} penumbra={0.9} intensity={18} distance={30} />

      <Environment preset="city" environmentIntensity={0.55} />

      <Suspense fallback={<Html center><div className="sceneai-loader">LOADING ARCHITECTURE</div></Html>}>
        <House onReady={handleReady} />
        <ContactShadows
          position={[0, -5.9, 0]}
          opacity={0.38}
          scale={28}
          blur={2.8}
          far={18}
        />
      </Suspense>

      <CameraDirector scrollTarget={scrollTarget} bounds={bounds} />
      <CinematicGrade />
      <Preload all />
    </>
  );
}

export default function SceneAITest() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [bounds, setBounds] = useState<THREE.Box3 | null>(null);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;
    let lastChapter = "";
    let lastUpdate = 0;

    const syncUI = (time: number) => {
      const next = chapterFor(current.current);
      if (next.no !== lastChapter && time - lastUpdate > 80) {
        lastChapter = next.no;
        lastUpdate = time;
        setProgress(current.current);
      }
      frame = requestAnimationFrame(syncUI);
    };

    frame = requestAnimationFrame(syncUI);
    return () => cancelAnimationFrame(frame);
  }, []);

  const chapter = chapterFor(progress);

  return (
    <main className="sceneai-test">
      <div className="sceneai-canvas">
        <Canvas
          shadows
          camera={{ fov: CAMERA_FOV, near: 0.05, far: 100 }}
          gl={{ antialias: true, powerPreference: "high-performance", logarithmicDepthBuffer: true }}
          dpr={[1, 1.75]}
          onCreated={() => setLoaded(true)}
        >
          <ArchitecturalScene scrollTarget={target} onReady={setBounds} />
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
        <div className="sceneai-progress-track">
          <i style={{ transform: `scaleY(${Math.max(0.02, progress)})` }} />
        </div>
        <span>06</span>
      </aside>

      <section className="sceneai-copy">
        <p>ARCHITECTURE / {chapter.no}</p>
        <h1 key={chapter.no}>{chapter.label}</h1>
        <span>{chapter.detail}</span>
      </section>

      {!loaded && (
        <div className="sceneai-loading">
          <span>PREPARING THE SCENE</span>
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
