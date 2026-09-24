"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import "./SceneAITest.css";

function Villa() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.025; });
  return (
    <group ref={group}>
      <mesh position={[0, 0.15, 0]}><boxGeometry args={[5.8, 0.35, 3.2]} /><meshStandardMaterial color="#b8a88d" roughness={0.72} /></mesh>
      <mesh position={[-0.65, 1.0, 0]}><boxGeometry args={[4.0, 1.45, 2.7]} /><meshStandardMaterial color="#e8e1d6" roughness={0.5} /></mesh>
      <mesh position={[1.85, 1.35, 0]}><boxGeometry args={[1.9, 2.15, 2.65]} /><meshStandardMaterial color="#d5c9b5" roughness={0.52} /></mesh>
      <mesh position={[0.35, 1.15, 1.37]}><boxGeometry args={[2.6, 1.55, 0.06]} /><meshPhysicalMaterial color="#dfe7e8" metalness={0.08} roughness={0.08} transmission={0.55} thickness={0.35} /></mesh>
      <mesh position={[-1.35, 0.38, 1.75]}><boxGeometry args={[5.0, 0.04, 2.0]} /><meshStandardMaterial color="#536f78" metalness={0.1} roughness={0.15} /></mesh>
      <mesh position={[-1.2, 0.5, 2.35]}><boxGeometry args={[4.9, 0.08, 0.08]} /><meshStandardMaterial color="#8f8778" metalness={0.65} roughness={0.28} /></mesh>
    </group>
  );
}

function Scene() {
  return (<>
    <PerspectiveCamera makeDefault position={[8.5, 4.7, 10.5]} fov={38} />
    <ambientLight intensity={0.55} />
    <directionalLight position={[5, 8, 5]} intensity={2.6} />
    <directionalLight position={[-6, 3, -4]} intensity={1.1} />
    <Float speed={0.45} rotationIntensity={0.03} floatIntensity={0.08}><Villa /></Float>
    <Environment preset="sunset" />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
  </>);
}

export default function SceneAITest() {
  return (<main className="sceneai-test">
    <div className="sceneai-canvas"><Canvas dpr={[1, 1.75]} gl={{ antialias: true }}><Scene /></Canvas></div>
    <header className="sceneai-nav"><span>PRIVATE RESIDENCE</span><span>DUBAI · 01</span></header>
    <section className="sceneai-copy sceneai-copy--hero"><p>ARCHITECTURE / 01</p><h1>THE<br/><em>RESIDENCE</em></h1><span>Scroll to enter</span></section>
    <section className="sceneai-copy sceneai-copy--middle"><p>CRAFTED FOR LIVING</p><h2>LIGHT<br/>MEETS FORM</h2><span>Material · Space · Silence</span></section>
    <section className="sceneai-copy sceneai-copy--end"><p>PRIVATE RESIDENCE · DUBAI</p><h2>AN<br/>ARCHITECTURAL<br/><em>EXPERIENCE</em></h2></section>
  </main>);
}
