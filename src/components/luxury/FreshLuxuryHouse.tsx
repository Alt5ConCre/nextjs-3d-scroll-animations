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
  const { camera, gl } = useThree();
  const scroll = useScroll();
  const smoothed = useRef(0);
  const pointer = useRef(new THREE.Vector2());
  const pointerSmooth = useRef(new THREE.Vector2());

  useEffect(() => {
    const element = gl.domElement;
    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onLeave = () => pointer.current.set(0, 0);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

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

    // Keep interior camera positions well inside the footprint. The previous
    // path used footprint-scaled coordinates for every waypoint, which could
    // put the camera beside/inside perimeter walls. These interior coordinates
    // are intentionally compact and use wide look targets to reveal rooms.
    const ix = radius * 0.34;
    const iz = radius * 0.34;
    const floorY = center.y - height * 0.16;
    const eyeY = floorY + height * 0.22;
    const interior = (x: number, z: number, y = 0) =>
      new THREE.Vector3(center.x + x * ix, eyeY + y * height, center.z + z * iz);
    const look = (x: number, z: number, y = 0.02) =>
      new THREE.Vector3(center.x + x * radius * 0.52, eyeY + y * height, center.z + z * radius * 0.52);

    return [
      { position: p(2.25, 0.72, 2.45), target: t(0, 0.02, 0) },
      { position: p(1.62, 0.48, 1.72), target: t(0.06, 0.05, 0) },

      // Threshold.
      { position: interior(0.72, 0.72), target: look(0.15, 0.18) },
      { position: interior(0.20, 0.18), target: look(-0.25, -0.05) },

      // Living room: stay central and rotate across both sides.
      { position: interior(0.02, -0.02), target: look(0.55, -0.08, 0.04) },
      { position: interior(0.02, -0.02), target: look(-0.55, -0.08, 0.04) },
      { position: interior(0.04, -0.02), target: look(-0.48, 0.40, 0.03) },

      // Other side / interior opening.
      { position: interior(-0.18, 0.10), target: look(0.48, 0.35, 0.03) },
      { position: interior(0.18, 0.18), target: look(-0.42, 0.48, 0.04) },

      // Bedroom reveal.
      { position: interior(-0.24, 0.30), target: look(-0.48, 0.55, 0.02) },
      { position: interior(-0.34, 0.36), target: look(-0.12, 0.62, 0.02) },
      { position: interior(-0.24, 0.28), target: look(0.45, 0.42, 0.03) },

      // Return through living room, showing the opposite axis.
      { position: interior(0.00, 0.16), target: look(0.52, -0.45, 0.03) },
      { position: interior(0.08, -0.04), target: look(-0.52, -0.42, 0.03) },
      { position: interior(0.46, 0.20), target: look(0, 0, 0.05) },

      { position: p(2.05, 0.86, 2.20), target: t(0, 0.02, 0) },
    ];  }, [bounds]);

  const a = useRef(new THREE.Vector3());
  const b = useRef(new THREE.Vector3());
  const hoverPosition = useRef(new THREE.Vector3());
  const hoverTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    smoothed.current = THREE.MathUtils.damp(smoothed.current, scroll.offset, 6.5, delta);

    const scaled = smoothed.current * (waypoints.length - 1);
    const index = Math.min(waypoints.length - 2, Math.max(0, Math.floor(scaled)));
    const local = THREE.MathUtils.smootherstep(scaled - index, 0, 1);

    a.current.lerpVectors(waypoints[index].position, waypoints[index + 1].position, local);
    b.current.lerpVectors(waypoints[index].target, waypoints[index + 1].target, local);

    pointerSmooth.current.x = THREE.MathUtils.damp(pointerSmooth.current.x, pointer.current.x, 7, delta);
    pointerSmooth.current.y = THREE.MathUtils.damp(pointerSmooth.current.y, pointer.current.y, 7, delta);

    // Hover controls the house view with a restrained cinematic parallax.
    // Scroll remains the primary movement; hover adds orientation/position.
    const hx = pointerSmooth.current.x;
    const hy = pointerSmooth.current.y;
    const interiorWeight = smoothed.current > 0.12 && smoothed.current < 0.88 ? 1 : 0.55;
    hoverPosition.current.set(hx * 0.34 * interiorWeight, hy * 0.12 * interiorWeight, -hx * 0.16 * interiorWeight);
    hoverTarget.current.set(hx * 0.22, hy * 0.10, hx * 0.08);

    const desiredPosition = a.current.clone().add(hoverPosition.current);
    const desiredTarget = b.current.clone().add(hoverTarget.current);

    const follow = 1 - Math.exp(-8 * delta);
    camera.position.lerp(desiredPosition, follow);
    camera.lookAt(desiredTarget);

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
          camera={{ fov: 42, near: 0.018, far: 100 }}
          gl={{ antialias: true, powerPreference: "default", alpha: false }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
            setReady(true);
          }}
        >
          <ScrollControls pages={12} damping={0.22} distance={1.6} maxSpeed={0.035}>
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
