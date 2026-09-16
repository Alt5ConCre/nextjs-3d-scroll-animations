"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { CinematicScrollRuntime } from "@/lib/cinematic/scroll-state";
import { HOUSE_SEQUENCE } from "./house-config";

const MODEL_URL = HOUSE_SEQUENCE.model;

type Waypoint = { progress: number; position: [number, number, number]; target: [number, number, number] };

const WAYPOINTS: Waypoint[] = [
  { progress: 0.00, position: [10.5, -13.0, 4.2], target: [0, 0, 2.7] },
  { progress: 0.12, position: [-5.4, -2.0, 2.25], target: [-1.2, 0.8, 2.3] },
  { progress: 0.25, position: [-4.7, -1.0, 1.7], target: [0.8, -0.2, 1.7] },
  { progress: 0.39, position: [1.8, 3.9, 2.0], target: [0.8, 2.15, 1.25] },
  { progress: 0.52, position: [0.0, -7.6, 4.65], target: [0.0, -1.8, 3.4] },
  { progress: 0.66, position: [-2.8, 0.8, 5.15], target: [-1.2, 1.9, 4.35] },
  { progress: 0.79, position: [5.7, -4.2, 5.0], target: [4.8, -1.9, 4.15] },
  { progress: 0.93, position: [8.8, -11.5, 5.5], target: [0, -0.5, 3.1] },
  { progress: 1.00, position: [11.5, -14.5, 5.8], target: [0, 0, 3.0] },
];

function samplePath(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  for (let i = 0; i < WAYPOINTS.length - 1; i += 1) {
    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];
    if (p <= b.progress) {
      const span = Math.max(b.progress - a.progress, 0.0001);
      const t = THREE.MathUtils.smoothstep((p - a.progress) / span, 0, 1);
      return {
        position: new THREE.Vector3().fromArray(a.position).lerp(new THREE.Vector3().fromArray(b.position), t),
        target: new THREE.Vector3().fromArray(a.target).lerp(new THREE.Vector3().fromArray(b.target), t),
      };
    }
  }
  const last = WAYPOINTS[WAYPOINTS.length - 1];
  return { position: new THREE.Vector3().fromArray(last.position), target: new THREE.Vector3().fromArray(last.target) };
}

function ResidenceModel({ onReady }: { onReady?: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material?.isMeshStandardMaterial) {
        material.envMapIntensity = 1.25;
        material.needsUpdate = true;
      }
    });
    onReady?.();
  }, [onReady, scene]);
  return <primitive object={scene} />;
}

function CinematicCamera({ runtimeRef }: { runtimeRef: MutableRefObject<CinematicScrollRuntime> }) {
  const { camera } = useThree();
  const position = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const path = samplePath(runtimeRef.current.progress);
    position.copy(path.position);
    target.copy(path.target);
    const inertia = 0.075 + Math.min(Math.abs(runtimeRef.current.velocity) * 0.018, 0.06);
    camera.position.lerp(position, inertia);
    look.lerp(target, inertia);
    camera.lookAt(look);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, THREE.MathUtils.clamp(runtimeRef.current.velocity * -0.0012, -0.018, 0.018), 0.08);
  });

  return null;
}

function SceneContent({ runtimeRef, onReady }: { runtimeRef: MutableRefObject<CinematicScrollRuntime>; onReady: () => void }) {
  return (
    <>
      <color attach="background" args={["#11110f"]} />
      <hemisphereLight intensity={0.7} groundColor="#1b1712" color="#fff7e8" />
      <directionalLight position={[8, -6, 12]} intensity={3.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-8, 5, 7]} intensity={1.6} color="#9fc4ff" />
      <pointLight position={[0, 1, 2.6]} intensity={2.2} distance={10} color="#ffd8a3" />
      <pointLight position={[4, -4, 5]} intensity={1.2} distance={8} color="#8fd2ff" />
      <ResidenceModel onReady={onReady} />
      <ContactShadows position={[0, 0.18, 0]} opacity={0.38} scale={24} blur={2.8} far={18} resolution={1024} />
      <CinematicCamera runtimeRef={runtimeRef} />
      <Preload all />
    </>
  );
}

export default function House3DScene({ runtimeRef, onReady }: { runtimeRef: MutableRefObject<CinematicScrollRuntime>; onReady: () => void }) {
  const [mediaError, setMediaError] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const start = () => video.play().catch(() => undefined);
    video.addEventListener("canplay", start);
    start();
    return () => video.removeEventListener("canplay", start);
  }, []);

  useEffect(() => {
    if (modelReady) onReady();
  }, [modelReady, onReady]);

  return (
    <div className="house-3d" aria-hidden="true">
      <div className="house-3d__media" aria-hidden="true">
        {!mediaError && (
          <video
            ref={videoRef}
            className="house-3d__video"
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            poster={HOUSE_SEQUENCE.poster}
            onError={() => setMediaError(true)}
          >
            <source src={HOUSE_SEQUENCE.desktopVideo} type="video/mp4" />
          </video>
        )}
        <img className="house-3d__poster" src={HOUSE_SEQUENCE.poster} alt="" />
      </div>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: WAYPOINTS[0].position, fov: 38, near: 0.1, far: 100 }}
        shadows
      >
        <Suspense fallback={null}>
          <SceneContent runtimeRef={runtimeRef} onReady={() => setModelReady(true)} />
        </Suspense>
      </Canvas>
      <div className="house-3d__vignette" />
      <div className="house-3d__grain" />
    </div>
  );
}

useGLTF.preload(MODEL_URL);
