"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import "./SceneAITest.css";

function House() {
  const trees = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    x: -7 + (i * 1.07) % 14,
    z: -4.8 - ((i * 1.71) % 3.5),
    s: 0.65 + (i % 4) * 0.12,
  })), []);

  return (
    <group>
      {/* terrace / ground */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[14, 0.3, 10]} />
        <meshStandardMaterial color="#777064" roughness={0.9} />
      </mesh>

      {/* main architectural volumes */}
      <mesh position={[-1.3, 1.55, 0]}>
        <boxGeometry args={[7.8, 3.1, 5.2]} />
        <meshStandardMaterial color="#d8d0c3" roughness={0.55} />
      </mesh>
      <mesh position={[3.7, 2.15, -0.1]}>
        <boxGeometry args={[3.2, 4.3, 4.8]} />
        <meshStandardMaterial color="#b7ad9c" roughness={0.48} />
      </mesh>

      {/* cantilever */}
      <mesh position={[-0.4, 3.35, 0.25]}>
        <boxGeometry args={[6.6, 0.32, 5.7]} />
        <meshStandardMaterial color="#c7bdad" roughness={0.5} />
      </mesh>

      {/* dark glass facade */}
      <mesh position={[-0.7, 1.7, 2.64]}>
        <boxGeometry args={[6.8, 2.8, 0.08]} />
        <meshStandardMaterial color="#263136" metalness={0.18} roughness={0.12} />
      </mesh>
      <mesh position={[3.72, 2.2, 2.42]}>
        <boxGeometry args={[3.0, 3.9, 0.08]} />
        <meshStandardMaterial color="#1f292d" metalness={0.2} roughness={0.1} />
      </mesh>

      {/* vertical mullions */}
      {[-3.2, -1.55, 0.1, 1.75, 3.15].map((x) => (
        <mesh key={x} position={[x, 1.7, 2.69]}>
          <boxGeometry args={[0.035, 2.75, 0.08]} />
          <meshStandardMaterial color="#8f887b" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}

      {/* entrance */}
      <mesh position={[1.85, 1.25, 2.78]}>
        <boxGeometry args={[1.45, 2.5, 0.12]} />
        <meshStandardMaterial color="#302d29" roughness={0.34} />
      </mesh>
      <mesh position={[1.85, 2.52, 2.86]}>
        <boxGeometry args={[2.0, 0.08, 0.75]} />
        <meshStandardMaterial color="#9c9180" roughness={0.35} />
      </mesh>

      {/* pool */}
      <mesh position={[-1.7, 0.04, 5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.4, 3.5]} />
        <meshStandardMaterial color="#466c70" metalness={0.18} roughness={0.08} />
      </mesh>
      <mesh position={[-1.7, 0.09, 5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.9, 3.0]} />
        <meshStandardMaterial color="#82999a" metalness={0.05} roughness={0.12} transparent opacity={0.5} />
      </mesh>

      {/* sculptural landscaping */}
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.s}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 1.8, 8]} />
            <meshStandardMaterial color="#40372d" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <sphereGeometry args={[0.62, 12, 8]} />
            <meshStandardMaterial color="#344139" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* warm architectural lights */}
      {[[-3.1, 1.4, 2.95], [-1.0, 1.4, 2.95], [1.1, 1.4, 2.95], [3.1, 1.9, 2.95]].map((p, i) => (
        <pointLight key={i} position={p as [number, number, number]} intensity={5} distance={5} color="#ffd9a1" />
      ))}
    </group>
  );
}

function CameraDirector({ progress }: { progress: number }) {
  const target = useRef(new THREE.Vector3());
  useFrame(({ camera }, delta) => {
    const p = THREE.MathUtils.clamp(progress, 0, 1);
    const shot = p < 0.25 ? p / 0.25 : p < 0.52 ? (p - 0.25) / 0.27 : p < 0.76 ? (p - 0.52) / 0.24 : (p - 0.76) / 0.24;

    let x = 10 - p * 12;
    let y = 5.1 - Math.sin(p * Math.PI) * 2.2;
    let z = 13 - p * 10;

    if (p < 0.25) {
      x = 11 - shot * 5;
      y = 4.8 - shot * 0.7;
      z = 13 - shot * 2;
      target.current.set(0, 1.8, 0);
    } else if (p < 0.52) {
      x = 6 - shot * 6;
      y = 2.8 - shot * 0.4;
      z = 10 - shot * 4;
      target.current.set(0, 1.6, 1.4);
    } else if (p < 0.76) {
      x = -2.8 + shot * 1.8;
      y = 1.75 + shot * 0.35;
      z = 5.6 - shot * 2.2;
      target.current.set(-0.5, 1.5, 1.8);
    } else {
      x = -1 + shot * 9;
      y = 3.1 + shot * 1.2;
      z = 5 + shot * 7;
      target.current.set(0, 1.3, 1);
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 2.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 2.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 2.8, delta);
    camera.lookAt(target.current);
  });
  return null;
}

function Scene({ progress }: { progress: number }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [10, 5, 13], fov: 38 }}
    >
      <color attach="background" args={["#11110f"]} />
      <fog attach="fog" args={["#11110f", 9, 28]} />
      <ambientLight intensity={0.38} />
      <directionalLight position={[6, 10, 8]} intensity={2.5} />
      <directionalLight position={[-8, 5, -5]} intensity={0.75} />
      <pointLight position={[-1, 5, 6]} intensity={18} color="#f3c98d" distance={15} />
      <Suspense fallback={null}>
        <House />
      </Suspense>
      <CameraDirector progress={progress} />
    </Canvas>
  );
}

const shots = [
  ["01", "ARRIVAL", "A cinematic approach to the residence."],
  ["02", "THE THRESHOLD", "Architecture, glass and shadow."],
  ["03", "LIGHT MEETS FORM", "A slow journey through the living spaces."],
  ["04", "THE FINAL FRAME", "Residence, water and landscape."],
];

export default function SceneAITest() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const shotIndex = Math.min(3, Math.floor(progress * 4));
  const shot = shots[shotIndex];

  return (
    <main className="sceneai-test">
      <div className="sceneai-canvas"><Scene progress={progress} /></div>
      <div className="sceneai-grain" />
      <div className="sceneai-vignette" />

      <header className="sceneai-nav">
        <span>PRIVATE RESIDENCE</span>
        <span>DUBAI · CINEMATIC STUDY</span>
      </header>

      <div className="sceneai-progress">
        <span>{shot[0]}</span><i style={{ transform: `scaleY(${Math.max(0.04, (shotIndex + 1) / 4)})` }} /><span>04</span>
      </div>

      <section className="sceneai-copy sceneai-copy--hero">
        <p>ARCHITECTURE / {shot[0]}</p>
        <h1>{shot[1]}</h1>
        <span>{shot[2]}</span>
      </section>

      <section className="sceneai-spacer" aria-hidden="true" />
      <section className="sceneai-spacer" aria-hidden="true" />
      <section className="sceneai-spacer" aria-hidden="true" />

      <footer className="sceneai-footer">
        <span>SCROLL TO DIRECT THE CAMERA</span>
        <span>BLENDER / THREE.JS / CINEMATIC WALKTHROUGH</span>
      </footer>
    </main>
  );
}
