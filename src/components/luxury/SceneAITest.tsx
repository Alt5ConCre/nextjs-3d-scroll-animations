"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
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
  const { scene } = useGLTF(HOUSE_MODEL);
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

function CinematicGrade() {
  return (
    <EffectComposer multisampling={2}>
      <Bloom luminanceThreshold={1.05} mipmapBlur intensity={0.12} radius={0.5} />
      <Noise premultiply opacity={0.018} />
      <Vignette eskil={false} offset={0.22} darkness={0.62} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

function CameraDirector({
  progress,
  bounds,
}: {
  progress: number;
  bounds: THREE.Box3 | null;
}) {
  const { camera } = useThree();
  const smoothed = useRef(0);
  const currentCamera = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3());

  const waypoints = useMemo<Waypoint[]>(() => {
    const b = bounds ?? new THREE.Box3(
      new THREE.Vector3(-6, -2, -5),
      new THREE.Vector3(6, 5, 5)
    );
    const c = b.getCenter(new THREE.Vector3());
    const h = Math.max(1, b.max.y - b.min.y);
    const z = Math.max(1, b.max.z - b.min.z);

    return [
      { camera: new THREE.Vector3(c.x + 11, c.y + h * 0.46, c.z + 17), target: new THREE.Vector3(c.x - 0.4, c.y + h * 0.22, c.z) },
      { camera: new THREE.Vector3(c.x + 7.4, c.y + h * 0.31, c.z + 11), target: new THREE.Vector3(c.x, c.y + h * 0.23, c.z) },
      { camera: new THREE.Vector3(c.x + 4.0, c.y + h * 0.23, c.z + 7.0), target: new THREE.Vector3(c.x - 0.1, c.y + h * 0.24, c.z) },
      { camera: new THREE.Vector3(c.x + 1.1, c.y + h * 0.19, c.z + Math.max(2.4, z * 0.43)), target: new THREE.Vector3(c.x - 0.45, c.y + h * 0.22, c.z - 0.15) },
      { camera: new THREE.Vector3(c.x - 1.8, c.y + h * 0.21, c.z + Math.max(2.8, z * 0.56)), target: new THREE.Vector3(c.x - 0.8, c.y + h * 0.25, c.z - 0.2) },
      { camera: new THREE.Vector3(c.x - 5.8, c.y + h * 0.39, c.z + 9.5), target: new THREE.Vector3(c.x + 0.2, c.y + h * 0.25, c.z) },
      { camera: new THREE.Vector3(c.x - 9.8, c.y + h * 0.58, c.z + 14.5), target: new THREE.Vector3(c.x, c.y + h * 0.22, c.z) },
      { camera: new THREE.Vector3(c.x + 12.5, c.y + h * 0.54, c.z + 18.5), target: new THREE.Vector3(c.x, c.y + h * 0.22, c.z) },
    ];
  }, [bounds]);

  useFrame((_, delta) => {
    smoothed.current = THREE.MathUtils.damp(
      smoothed.current,
      progress,
      5.5,
      delta
    );

    const scaled = smoothed.current * (waypoints.length - 1);
    const i = Math.min(waypoints.length - 2, Math.floor(scaled));
    const t = THREE.MathUtils.smootherstep(scaled - i, 0, 1);
    const a = waypoints[i];
    const b = waypoints[i + 1];

    currentCamera.current.lerpVectors(a.camera, b.camera, t);
    currentTarget.current.lerpVectors(a.target, b.target, t);
    currentCamera.current.y += Math.sin(smoothed.current * Math.PI * 6) * CAMERA_LIFT;
    camera.position.copy(currentCamera.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

function ArchitecturalScene({
  progress,
  onReady,
}: {
  progress: number;
  onReady: (box: THREE.Box3) => void;
}) {
  const [bounds, setBounds] = useState<THREE.Box3 | null>(null);

  const handleReady = (box: THREE.Box3) => {
    setBounds(box);
    onReady(box);
  };

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

      <CameraDirector progress={progress} bounds={bounds} />
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
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.current = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    };

    const tick = () => {
      current.current = THREE.MathUtils.damp(current.current, target.current, 7, 1 / 60);
      setProgress(current.current);
      raf.current = requestAnimationFrame(tick);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
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
          <ArchitecturalScene progress={progress} onReady={setBounds} />
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
