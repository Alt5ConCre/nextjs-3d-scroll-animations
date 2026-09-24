"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Scroll, ScrollControls, useGLTF, useScroll } from "@react-three/drei";
import * as THREE from "three";
import "./FreshLuxuryHouse.css";

const HOUSE_MODEL =
  "https://raw.githubusercontent.com/qduoduo-hwh/gptblender_demo/main/gptblender-house-lite.glb";

const chapters = [
  ["01", "ARRIVAL", "A slow architectural approach."],
  ["02", "THRESHOLD", "Stone, glass and shadow."],
  ["03", "LIVING ROOM", "A wider view across the room."],
  ["04", "BEDROOM", "A private interior reveal."],
  ["05", "RETURN", "Back through the living space."],
  ["06", "WATER", "Architecture meets landscape."],
  ["07", "FINAL FRAME", "The residence in full."],
] as const;

type Waypoint = { position: THREE.Vector3; target: THREE.Vector3 };

function normalizeHouse(source: THREE.Object3D) {
  const scene = source.clone(true);
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);

  scene.position.sub(center);
  scene.scale.setScalar(11 / maxDim);

  scene.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      const mat = material as THREE.MeshStandardMaterial;
      if (!mat?.isMeshStandardMaterial) return;

      const name = (mat.name || "").toLowerCase();
      // Preserve authored maps when present; improve untextured materials with
      // restrained architectural PBR colors instead of a generic gray model.
      if (!mat.map) {
        if (/glass|window|glazing/.test(name)) {
          mat.color.set("#8fa4a6");
          mat.roughness = 0.08;
          mat.metalness = 0.08;
          mat.transparent = true;
          mat.opacity = 0.72;
        } else if (/roof|slate/.test(name)) {
          mat.color.set("#34332f");
          mat.roughness = 0.48;
          mat.metalness = 0.04;
        } else if (/stone|concrete|cement|plaster|wall/.test(name)) {
          mat.color.set("#b8b0a2");
          mat.roughness = 0.66;
          mat.metalness = 0;
        } else if (/wood|oak|timber/.test(name)) {
          mat.color.set("#8a6247");
          mat.roughness = 0.5;
          mat.metalness = 0;
        } else if (/metal|steel|aluminium|aluminum/.test(name)) {
          mat.color.set("#4c5050");
          mat.roughness = 0.25;
          mat.metalness = 0.72;
        }
      }

      mat.envMapIntensity = 0.72;
      if (!/glass|window|glazing/.test(name)) {
        mat.roughness = Math.max(0.2, mat.roughness);
      }
    });
  });

  return scene;
}
function LoadedHouse({ onBounds }: { onBounds: (box: THREE.Box3) => void }) {
  const { scene: source } = useGLTF(HOUSE_MODEL);
  const scene = useMemo(() => normalizeHouse(source), [source]);

  useEffect(() => {
    onBounds(new THREE.Box3().setFromObject(scene));
  }, [scene, onBounds]);

  return <primitive object={scene} />;
}

function ProceduralHouse() {
  return (
    <group position={[0, -1.1, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[5.8, 1.8, 3.6]} />
        <meshStandardMaterial color="#b9b1a3" roughness={0.62} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 2.15, 0]}>
        <boxGeometry args={[6.5, 0.22, 4.2]} />
        <meshStandardMaterial color="#242321" roughness={0.38} metalness={0.08} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.85, 1.84]}>
        <boxGeometry args={[2.1, 1.55, 0.08]} />
        <meshStandardMaterial color="#182126" roughness={0.12} metalness={0.18} />
      </mesh>
      <mesh castShadow receiveShadow position={[-2.15, 0.85, 1.84]}>
        <boxGeometry args={[1.15, 1.55, 0.08]} />
        <meshStandardMaterial color="#182126" roughness={0.12} metalness={0.18} />
      </mesh>
      <mesh castShadow receiveShadow position={[2.15, 0.85, 1.84]}>
        <boxGeometry args={[1.15, 1.55, 0.08]} />
        <meshStandardMaterial color="#182126" roughness={0.12} metalness={0.18} />
      </mesh>
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[8.5, 0.15, 7]} />
        <meshStandardMaterial color="#5f5a51" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[0, -0.01, -3.5]}>
        <boxGeometry args={[11, 0.08, 0.9]} />
        <meshStandardMaterial color="#3c3832" roughness={0.8} />
      </mesh>
    </group>
  );
}

class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[FreshLuxuryHouse] 3D asset failed; using procedural fallback.", error);
  }

  render() {
    return this.state.failed ? <ProceduralHouse /> : this.props.children;
  }
}

function CameraRig({
  bounds,
  uiRef,
}: {
  bounds: THREE.Box3 | null;
  uiRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const { camera } = useThree();
  const scroll = useScroll();
  const smoothed = useRef(0);

  const waypoints = useMemo<Waypoint[]>(() => {
    const b =
      bounds ??
      new THREE.Box3(new THREE.Vector3(-4, -2, -4), new THREE.Vector3(4, 3, 4));
    const center = b.getCenter(new THREE.Vector3());
    const size = b.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.z) * 0.5;
    const height = Math.max(size.y, 2);

    const p = (x: number, y: number, z: number) =>
      new THREE.Vector3(center.x + x * radius, center.y + y * height, center.z + z * radius);
    const t = (x = 0, y = 0, z = 0) =>
      new THREE.Vector3(center.x + x * radius, center.y + y * height, center.z + z * radius);

    return [
      // Exterior arrival: wide, low and slow.
      { position: p(2.25, 0.72, 2.45), target: t(0, 0.02, 0) },
      { position: p(1.62, 0.48, 1.72), target: t(0.06, 0.05, 0) },
      // Threshold: camera crosses the facade instead of stopping outside.
      { position: p(0.72, 0.30, 0.82), target: t(0.02, 0.10, 0.02) },
      { position: p(0.20, 0.18, 0.36), target: t(-0.10, 0.12, -0.18) },
      // Enter the living room and hold the eye-line longer.
      { position: p(-0.28, 0.16, -0.12), target: t(-0.10, 0.16, -0.62) },
      { position: p(-0.62, 0.20, -0.72), target: t(0.28, 0.18, -0.58) },
      // Continue across the other side of the living room.
      { position: p(0.34, 0.18, -0.82), target: t(0.68, 0.18, -0.38) },
      { position: p(0.78, 0.20, -0.48), target: t(0.30, 0.20, 0.02) },
      // Turn deeper into the residence for a bedroom reveal.
      { position: p(0.82, 0.22, 0.10), target: t(0.30, 0.20, 0.72) },
      { position: p(0.28, 0.20, 0.68), target: t(-0.18, 0.20, 0.86) },
      { position: p(-0.12, 0.20, 0.92), target: t(-0.52, 0.20, 0.58) },
      // Bedroom exit: reverse through the living room instead of teleporting.
      { position: p(0.18, 0.18, 0.56), target: t(0.52, 0.18, -0.12) },
      { position: p(0.56, 0.18, -0.30), target: t(-0.18, 0.18, -0.66) },
      // Interior-to-exterior transition and final hero frame.
      { position: p(0.42, 0.34, 0.48), target: t(0, 0.08, 0) },
      { position: p(2.05, 0.86, 2.20), target: t(0, 0.02, 0) },
    ];
  }, [bounds]);

  const a = useRef(new THREE.Vector3());
  const b = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    smoothed.current = THREE.MathUtils.damp(smoothed.current, scroll.offset, 6.5, delta);

    const scaled = smoothed.current * (waypoints.length - 1);
    const index = Math.min(waypoints.length - 2, Math.max(0, Math.floor(scaled)));
    const local = THREE.MathUtils.smootherstep(scaled - index, 0, 1);

    a.current.lerpVectors(waypoints[index].position, waypoints[index + 1].position, local);
    b.current.lerpVectors(waypoints[index].target, waypoints[index + 1].target, local);

    const follow = 1 - Math.exp(-10 * delta);
    camera.position.lerp(a.current, follow);
    camera.lookAt(b.current);

    if (uiRef.current) {
      const value = smoothed.current;
      uiRef.current.style.setProperty("--progress", value.toFixed(4));
      uiRef.current.style.setProperty("--chapter", String(Math.min(6, Math.floor(value * 7))));
    }
  });

  return null;
}

function Lighting() {
  return (
    <>
      <color attach="background" args={["#11110f"]} />
      <fog attach="fog" args={["#11110f", 15, 42]} />
      <ambientLight intensity={0.34} />
      <directionalLight
        castShadow
        position={[7, 10, 6]}
        intensity={3.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={35}
      />
      <directionalLight position={[-7, 4, -5]} intensity={1.15} />
      <pointLight position={[-4, 3, 3]} intensity={6} distance={18} color="#ffd8b0" />
      <pointLight position={[4, 2, -4]} intensity={4} distance={16} color="#b9d4ff" />
      <pointLight position={[0, 2.1, 0]} intensity={2.2} distance={8} color="#fff1dc" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]} receiveShadow>
        <planeGeometry args={[45, 45]} />
        <meshStandardMaterial color="#171613" roughness={0.92} />
      </mesh>
    </>
  );
}

function FreshScene({ uiRef }: { uiRef: React.MutableRefObject<HTMLDivElement | null> }) {
  const [bounds, setBounds] = useState<THREE.Box3 | null>(null);

  return (
    <>
      <Lighting />
      <Suspense
        fallback={
          <Html center>
            <div className="fresh-loader">LOADING RESIDENCE</div>
          </Html>
        }
      >
        <SceneErrorBoundary>
          <LoadedHouse onBounds={setBounds} />
        </SceneErrorBoundary>
      </Suspense>
      <CameraRig bounds={bounds} uiRef={uiRef} />
    </>
  );
}

export default function FreshLuxuryHouse() {
  const uiRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="fresh-house">
      <div className="fresh-canvas">
        <Canvas
          shadows
          dpr={[1, 1.25]}
          camera={{ fov: 35, near: 0.018, far: 100 }}
          gl={{ antialias: true, powerPreference: "default", alpha: false }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
            setReady(true);
          }}
        >
          <ScrollControls pages={7} damping={0.12} distance={1} maxSpeed={0.12}>
            <FreshScene uiRef={uiRef} />
            <Scroll html>
              <div className="fresh-scroll-space" />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>

      <div ref={uiRef} className="fresh-ui" data-ready={ready ? "true" : "false"}>
        <header className="fresh-header">
          <span>PRIVATE RESIDENCE</span>
          <span>ARCHITECTURAL FILM / 2026</span>
        </header>

        <div className="fresh-progress">
          <span>01</span>
          <i><b /></i>
          <span>07</span>
        </div>

        <section className="fresh-title">
          <small>ARCHITECTURE / <span className="fresh-chapter">01</span></small>
          <h1>ARRIVAL</h1>
          <p>Scroll slowly. The camera is the story.</p>
        </section>

        <div className="fresh-grain" />
        <div className="fresh-vignette" />

        <div className="fresh-bottom">
          <span>SCROLL / SCRUB / REVERSE</span>
          <span>PRIVATE RESIDENCE</span>
        </div>

        {!ready && <div className="fresh-loading">PREPARING THE SCENE</div>}
      </div>
    </main>
  );
}

useGLTF.preload(HOUSE_MODEL);
