"use client";

import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Float,
  MeshTransmissionMaterial,
  PerformanceMonitor,
  Sparkles,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import CinematicDirector from "./CinematicDirector";
import { MacBook } from "../MacBook";
import type { CinematicScrollRuntime } from "@/lib/cinematic/scroll-state";

function ScrollCamera({
  runtimeRef,
  pointerRef,
}: {
  runtimeRef: MutableRefObject<CinematicScrollRuntime>;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera, performance } = useThree();
  const current = useRef(0);

  useFrame((state, delta) => {
    const p = runtimeRef.current.progress;
    current.current = THREE.MathUtils.damp(current.current, p, 7, delta);

    const breathing = Math.sin(state.clock.elapsedTime * 0.38) * 0.035;
    const pointerX = pointerRef.current.x * 0.12;
    const pointerY = pointerRef.current.y * 0.08;

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      Math.sin(current.current * Math.PI * 2) * 0.65 + pointerX,
      2.5,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.15 + Math.sin(current.current * Math.PI) * 0.8 + pointerY,
      2.5,
      delta
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      5.8 - current.current * 1.2 + breathing,
      2.5,
      delta
    );

    camera.lookAt(0, 0, 0);

    if (Math.abs(runtimeRef.current.velocity) > 2.5) {
      performance.regress();
    }
  });

  return null;
}

function HeroArtifact({
  pointerRef,
}: {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  // Drei's transmission material exposes a specialized ref type; keep the underlying
  // Three.js material instance locally so the runtime thickness animation remains intact.
  const material = useRef<THREE.MeshPhysicalMaterial | null>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Autonomous actor: this timeline is intentionally independent from scroll.
    group.current.rotation.y += delta * 0.32;
    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.45) * 0.12 + pointerRef.current.y * 0.04;
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      pointerRef.current.x * 0.22,
      3,
      delta
    );
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.7) * 0.12;

    if (ring.current) {
      ring.current.rotation.z -= delta * 0.7;
      ring.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.25;
    }

    if (material.current) {
      material.current.thickness =
        0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    }
  });

  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => i), []);

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh castShadow receiveShadow>
          <torusKnotGeometry args={[1.05, 0.24, 180, 32, 2, 3]} />
          <MeshTransmissionMaterial
            ref={(instance) => {
              material.current = instance as unknown as THREE.MeshPhysicalMaterial | null;
            }}
            backside
            samples={8}
            resolution={512}
            thickness={0.55}
            roughness={0.08}
            chromaticAberration={0.045}
            anisotropy={0.25}
            transmission={1}
          />
        </mesh>
      </Float>

      <mesh ref={ring} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.72, 0.025, 16, 160]} />
        <meshStandardMaterial metalness={1} roughness={0.14} envMapIntensity={2.2} />
      </mesh>

      {particles.map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i) * 2.1,
            Math.sin(i * 1.7) * 1.6,
            Math.sin(i) * 1.4,
          ]}
        >
          <sphereGeometry args={[0.018 + (i % 3) * 0.008, 8, 8]} />
          <meshBasicMaterial toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function CinematicEngine() {
  const runtimeRef = useRef<CinematicScrollRuntime>({
    progress: 0,
    velocity: 0,
    scroll: 0,
    limit: 0,
    time: 0,
  });
  const pointerRef = useRef({ x: 0, y: 0 });
  const [dpr, setDpr] = useState(1.6);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <>
      <CinematicDirector runtimeRef={runtimeRef} />
      <div className="cinematic-canvas" aria-hidden="true">
        <Canvas
          dpr={dpr}
          shadows
          camera={{ position: [0, 0.15, 5.8], fov: 38 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.08;
          }}
        >
          <color attach="background" args={["#050505"]} />
          <fog attach="fog" args={["#050505", 8, 18]} />
          <ambientLight intensity={0.25} />
          <spotLight
            position={[4, 5, 6]}
            intensity={85}
            angle={0.34}
            penumbra={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-4, -1, 3]} intensity={35} />
          <Environment preset="studio" />
          <Sparkles count={90} scale={7} size={1.4} speed={0.25} />

          <HeroArtifact pointerRef={pointerRef} />

          <group
            position={[1.65, -1.15, -1.05]}
            rotation={[0, -0.12, 0]}
            scale={0.72}
          >
            <MacBook />
          </group>
          <ContactShadows
            opacity={0.28}
            position={[0, -1.35, -0.65]}
            scale={8}
            blur={2.4}
            far={4.5}
          />

          <PerformanceMonitor
            factor={1}
            bounds={(refreshRate) =>
              refreshRate > 90 ? [50, 90] : [45, 60]
            }
            onChange={({ factor }) => {
              setDpr(Math.min(2, Math.max(0.8, 0.8 + factor * 1.2)));
            }}
            onFallback={() => setDpr(0.8)}
          />
          <AdaptiveDpr />

          <ScrollCamera runtimeRef={runtimeRef} pointerRef={pointerRef} />

          <EffectComposer multisampling={2}>
            <Bloom intensity={0.7} luminanceThreshold={1.05} mipmapBlur />
            <Noise opacity={0.035} />
            <Vignette eskil={false} offset={0.16} darkness={0.62} />
          </EffectComposer>
        </Canvas>
      </div>
    </>
  );
}
