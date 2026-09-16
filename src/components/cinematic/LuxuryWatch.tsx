"use client";

import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import type { CinematicScrollRuntime } from "@/lib/cinematic/scroll-state";

type Props = {
  runtimeRef: MutableRefObject<CinematicScrollRuntime>;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
};

const GOLD = "#c8a45a";
const STEEL = "#d7d7d2";
const DARK = "#111214";
const DIAL = "#0a0b0d";

function Part({
  position,
  rotation,
  children,
  explode,
  refGroup,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  children: React.ReactNode;
  explode?: [number, number, number];
  refGroup?: React.MutableRefObject<THREE.Group | null>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (refGroup) refGroup.current = groupRef.current;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      userData={{ explode }}
    >
      {children}
    </group>
  );
}

function Markers() {
  const marks = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  return (
    <group position={[0, 0, 0.16]}>
      {marks.map((i) => {
        const a = (i / 12) * Math.PI * 2;
        const major = i % 3 === 0;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.88, Math.cos(a) * 0.88, 0]}
            rotation={[0, 0, -a]}
          >
            <boxGeometry args={[major ? 0.055 : 0.028, major ? 0.13 : 0.075, 0.024]} />
            <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

export function LuxuryWatch({ runtimeRef, pointerRef }: Props) {
  const root = useRef<THREE.Group>(null);
  const caseGroup = useRef<THREE.Group>(null);
  const bezelGroup = useRef<THREE.Group>(null);
  const dialGroup = useRef<THREE.Group>(null);
  const crystalGroup = useRef<THREE.Group>(null);
  const crownGroup = useRef<THREE.Group>(null);
  const handGroup = useRef<THREE.Group>(null);
  const braceletGroup = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!root.current) return;
    const p = runtimeRef.current.progress;
    const t = state.clock.elapsedTime;
    const explode = THREE.MathUtils.smoothstep(p, 0.28, 0.62);
    const settle = 1 - THREE.MathUtils.smoothstep(p, 0.72, 0.96);
    const e = Math.max(explode, 1 - settle);

    root.current.rotation.y += delta * 0.18;
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      pointerRef.current.y * 0.12,
      3.2,
      delta
    );
    root.current.rotation.z = THREE.MathUtils.damp(
      root.current.rotation.z,
      pointerRef.current.x * -0.06,
      3.2,
      delta
    );
    root.current.position.x = THREE.MathUtils.damp(
      root.current.position.x,
      pointerRef.current.x * 0.16,
      3,
      delta
    );
    root.current.position.y = Math.sin(t * 0.65) * 0.055;

    const move = (ref: React.MutableRefObject<THREE.Group | null>, base: THREE.Vector3, amount: THREE.Vector3) => {
      if (!ref.current) return;
      ref.current.position.set(
        base.x + amount.x * e,
        base.y + amount.y * e,
        base.z + amount.z * e,
      );
    };

    move(caseGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
    move(bezelGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0.22));
    move(dialGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0.42));
    move(crystalGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0.68));
    move(crownGroup, new THREE.Vector3(1.16, 0, 0), new THREE.Vector3(0.38, 0, 0.18));
    move(handGroup, new THREE.Vector3(0, 0, 0.2), new THREE.Vector3(-0.08, 0.04, 0.56));

    if (braceletGroup.current) {
      braceletGroup.current.position.y = -e * 0.1;
      braceletGroup.current.rotation.z = Math.sin(t * 0.45) * 0.01;
    }

    const sweep = Math.sin(t * 0.55) * 0.2;
    if (handGroup.current) handGroup.current.rotation.z = sweep;
  });

  const links = useMemo(() => Array.from({ length: 13 }, (_, i) => i), []);

  return (
    <group ref={root} scale={1.12}>
      <group ref={braceletGroup} position={[0, -1.35, -0.05]}>
        {links.map((i) => (
          <mesh key={i} position={[0, -i * 0.18, 0]} castShadow>
            <roundedBoxGeometry args={[0.86 - Math.min(i, 5) * 0.012, 0.145, 0.19]} radius={0.035} smoothness={3} />
            <meshStandardMaterial color={STEEL} metalness={0.94} roughness={0.17} />
          </mesh>
        ))}
        {links.slice().reverse().map((_, i) => (
          <mesh key={`r-${i}`} position={[0, i * 0.18, 0]} castShadow>
            <roundedBoxGeometry args={[0.86 - Math.min(i, 5) * 0.012, 0.145, 0.19]} radius={0.035} smoothness={3} />
            <meshStandardMaterial color={STEEL} metalness={0.94} roughness={0.17} />
          </mesh>
        ))}
      </group>

      <group ref={caseGroup}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.34, 1.38, 0.34, 96]} />
          <meshStandardMaterial color={STEEL} metalness={0.98} roughness={0.15} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.04]}>
          <torusGeometry args={[1.27, 0.07, 20, 96]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.14} />
        </mesh>
      </group>

      <group ref={bezelGroup}>
        <mesh position={[0, 0, 0.18]}>
          <cylinderGeometry args={[1.24, 1.27, 0.13, 96]} />
          <meshStandardMaterial color="#7f8285" metalness={1} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0, 0.26]}>
          <torusGeometry args={[1.08, 0.115, 24, 96]} />
          <meshStandardMaterial color={DARK} metalness={0.86} roughness={0.18} />
        </mesh>
      </group>

      <group ref={dialGroup}>
        <mesh position={[0, 0, 0.28]}>
          <cylinderGeometry args={[1.06, 1.06, 0.08, 96]} />
          <meshStandardMaterial color={DIAL} metalness={0.25} roughness={0.34} />
        </mesh>
        <Markers />
        <mesh position={[0, 0.38, 0.305]}>
          <planeGeometry args={[0.34, 0.08]} />
          <meshBasicMaterial color="#d9d4ca" toneMapped={false} />
        </mesh>
      </group>

      <group ref={handGroup} position={[0, 0, 0.34]}>
        <mesh position={[0.0, 0.32, 0]}>
          <boxGeometry args={[0.055, 0.6, 0.025]} />
          <meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.18} />
        </mesh>
        <mesh position={[0.18, 0.06, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <boxGeometry args={[0.04, 0.82, 0.022]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.15} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.12} />
        </mesh>
      </group>

      <group ref={crownGroup} position={[1.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.27, 40]} />
          <meshStandardMaterial color={STEEL} metalness={0.98} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <torusGeometry args={[0.1, 0.018, 10, 32]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.16} />
        </mesh>
      </group>

      <group ref={crystalGroup}>
        <mesh position={[0, 0, 0.45]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[1.02, 1.02, 0.045, 96]} />
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.08}
            roughness={0.05}
            ior={1.46}
            chromaticAberration={0.02}
            anisotropy={0.08}
            samples={6}
            resolution={256}
          />
        </mesh>
      </group>

      <pointLight position={[2.4, 2.2, 2.5]} intensity={16} distance={8} />
    </group>
  );
}
