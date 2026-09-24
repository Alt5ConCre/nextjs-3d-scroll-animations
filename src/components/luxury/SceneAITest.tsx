"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import "./SceneAITest.css";

function Villa() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[5.8, 0.35, 3.2]} />
        <meshStandardMaterial color="#b8a88d" roughness={0.72} />
      </mesh>
      <mesh position={[-0.65, 1, 0]}>
        <boxGeometry args={[4, 1.45, 2.7]} />
        <meshStandardMaterial color="#e8e1d6" roughness={0.5} />
      </mesh>
      <mesh position={[1.85, 1.35, 0]}>
        <boxGeometry args={[1.9, 2.15, 2.65]} />
        <meshStandardMaterial color="#d5c9b5" roughness={0.52} />
      </mesh>
      <mesh position={[0.35, 1.15, 1.37]}>
        <boxGeometry args={[2.6, 1.55, 0.06]} />
        <meshStandardMaterial color="#b9c8ca" metalness={0.05} roughness={0.15} />
      </mesh>
      <mesh position={[-1.35, 0.38, 1.75]}>
        <boxGeometry args={[5, 0.04, 2]} />
        <meshStandardMaterial color="#536f78" metalness={0.1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[8.5, 4.7, 10.5]} fov={38} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={2} />
      <directionalLight position={[-6, 3, -4]} intensity={0.8} />
      <Villa />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export default function SceneAITest() {
  return (
    <main className="sceneai-test">
      <div className="sceneai-canvas">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "default" }}
          fallback={<div className="sceneai-fallback">Loading residence…</div>}
        >
          <Scene />
        </Canvas>
      </div>

      <header className="sceneai-nav">
        <span>PRIVATE RESIDENCE</span>
        <span>DUBAI · 01</span>
      </header>

      <section className="sceneai-copy sceneai-copy--hero">
        <p>ARCHITECTURE / 01</p>
        <h1>THE<br /><em>RESIDENCE</em></h1>
        <span>Scroll to enter</span>
      </section>

      <section className="sceneai-copy sceneai-copy--middle">
        <p>CRAFTED FOR LIVING</p>
        <h2>LIGHT<br />MEETS FORM</h2>
        <span>Material · Space · Silence</span>
      </section>

      <section className="sceneai-copy sceneai-copy--end">
        <p>PRIVATE RESIDENCE · DUBAI</p>
        <h2>AN<br />ARCHITECTURAL<br /><em>EXPERIENCE</em></h2>
      </section>
    </main>
  );
}
