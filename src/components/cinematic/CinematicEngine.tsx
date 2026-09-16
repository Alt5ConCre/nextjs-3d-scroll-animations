'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function ScrollCamera() {
  const { camera } = useThree()
  const target = useRef(0)
  const current = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target.current = max > 0 ? window.scrollY / max : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame((_, delta) => {
    current.current = THREE.MathUtils.damp(current.current, target.current, 4, delta)
    const p = current.current
    camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(p * Math.PI * 2) * 0.65, 2.5, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.15 + Math.sin(p * Math.PI) * 0.8, 2.5, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.8 - p * 1.2, 2.5, delta)
    camera.lookAt(0, 0, 0)
  })

  return null
}

function HeroArtifact() {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  // Keep the material strongly typed while retaining access to the custom thickness property.
  const material = useRef<THREE.MeshPhysicalMaterial & { thickness: number }>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    // Independent animation continues even when scrolling stops.
    group.current.rotation.y += delta * 0.32
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.12
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.12

    if (ring.current) {
      ring.current.rotation.z -= delta * 0.7
      ring.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.25
    }

    if (material.current) material.current.thickness = 0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08
  })

  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => i), [])

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh castShadow receiveShadow>
          <torusKnotGeometry args={[1.05, 0.24, 180, 32, 2, 3]} />
          <MeshTransmissionMaterial ref={material} backside samples={8} resolution={512} thickness={0.55} roughness={0.08} chromaticAberration={0.045} anisotropy={0.25} transmission={1} />
        </mesh>
      </Float>
      <mesh ref={ring} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.72, 0.025, 16, 160]} />
        <meshStandardMaterial metalness={1} roughness={0.14} envMapIntensity={2.2} />
      </mesh>
      {particles.map((i) => (
        <mesh key={i} position={[Math.cos(i) * 2.1, Math.sin(i * 1.7) * 1.6, Math.sin(i) * 1.4]}>
          <sphereGeometry args={[0.018 + (i % 3) * 0.008, 8, 8]} />
          <meshBasicMaterial toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export default function CinematicEngine() {
  return (
    <div className="cinematic-canvas" aria-hidden="true">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.15, 5.8], fov: 38 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.25} />
        <spotLight position={[4, 5, 6]} intensity={85} angle={0.34} penumbra={1} />
        <pointLight position={[-4, -1, 3]} intensity={35} />
        <Environment preset="studio" />
        <Sparkles count={90} scale={7} size={1.4} speed={0.25} />
        <HeroArtifact />
        <ScrollCamera />
      </Canvas>
    </div>
  )
}