"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  PerformanceMonitor,
  Sparkles,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type HouseExperienceProps = {
  scroll: number;
  pointer: { x: number; y: number };
};

function Ground() {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.8, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#181714" roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.76, -0.4]} receiveShadow>
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial color="#7d7a73" roughness={0.8} metalness={0.08} />
      </mesh>
    </>
  );
}

function GlassWall({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshPhysicalMaterial
        color="#31414b"
        roughness={0.08}
        metalness={0.22}
        transmission={0.52}
        thickness={0.08}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function WarmInterior({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[3.5, 2.15, 0.08]} />
      <meshStandardMaterial
        color="#d6b987"
        emissive="#c8904c"
        emissiveIntensity={2.2}
        roughness={0.5}
      />
    </mesh>
  );
}

function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.13, 2.2, 8]} />
        <meshStandardMaterial color="#4b4035" roughness={1} />
      </mesh>
      <mesh position={[0, 2.35, 0]} castShadow>
        <dodecahedronGeometry args={[0.82, 1]} />
        <meshStandardMaterial color="#354034" roughness={0.95} />
      </mesh>
    </group>
  );
}

function Pool() {
  return (
    <group position={[0, -0.56, 1.9]}>
      <mesh receiveShadow>
        <boxGeometry args={[5.8, 0.18, 2.15]} />
        <meshStandardMaterial color="#8d8a82" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[5.45, 0.04, 1.82]} />
        <meshPhysicalMaterial
          color="#79a6ad"
          roughness={0.08}
          transmission={0.25}
          transparent
          opacity={0.82}
        />
      </mesh>
    </group>
  );
}

function HouseModel({ scroll, pointer }: HouseExperienceProps) {
  const group = useRef<THREE.Group>(null);
  const currentScroll = useRef(0);
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;

    currentScroll.current = THREE.MathUtils.damp(
      currentScroll.current,
      scroll,
      4.2,
      delta
    );

    const p = currentScroll.current;
    const breath = Math.sin(state.clock.elapsedTime * 0.32) * 0.025;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      -0.14 + p * 0.62 + pointer.x * 0.035,
      3.8,
      delta
    );

    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      -0.25 + p * 0.8,
      3.8,
      delta
    );

    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      breath - p * 0.1 + pointer.y * 0.04,
      3.8,
      delta
    );

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      6.9 - p * 2.55 + pointer.x * 0.18,
      2.6,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      3.0 + Math.sin(p * Math.PI) * 0.75 + pointer.y * 0.12,
      2.6,
      delta
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      11.6 - p * 5.0,
      2.6,
      delta
    );

    camera.lookAt(0.1 + p * 0.25, 0.2, 0);
  });

  return (
    <group ref={group}>
      <Ground />

      <mesh position={[0, 0.05, -0.45]} castShadow receiveShadow>
        <boxGeometry args={[7.4, 2.5, 4.0]} />
        <meshStandardMaterial color="#d8d4ca" roughness={0.58} metalness={0.04} />
      </mesh>

      <mesh position={[1.1, 1.75, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 1.15, 3.2]} />
        <meshStandardMaterial color="#e5e0d6" roughness={0.5} metalness={0.04} />
      </mesh>

      <mesh position={[-0.55, 0.72, 1.46]} castShadow receiveShadow>
        <boxGeometry args={[5.3, 0.15, 1.45]} />
        <meshStandardMaterial color="#77736b" roughness={0.72} />
      </mesh>

      <mesh position={[1.6, 0.72, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 0.15, 2.2]} />
        <meshStandardMaterial color="#8b877e" roughness={0.68} />
      </mesh>

      <GlassWall position={[0.15, 0.02, 1.59]} scale={[5.0, 2.18, 0.12]} />
      <GlassWall position={[2.98, 0.02, -0.2]} scale={[0.12, 2.15, 3.12]} />
      <GlassWall position={[-2.78, 0.02, -0.2]} scale={[0.12, 2.15, 3.12]} />
      <GlassWall position={[1.45, 1.58, 1.03]} scale={[3.95, 0.95, 0.12]} />

      <WarmInterior position={[0.15, 0.12, 1.5]} />
      <WarmInterior position={[2.91, 0.12, -0.2]} />

      <mesh position={[0, 1.37, -2.03]} castShadow receiveShadow>
        <boxGeometry args={[7.9, 0.16, 0.35]} />
        <meshStandardMaterial color="#b2aea4" roughness={0.38} />
      </mesh>

      <mesh position={[0.92, 2.38, -0.72]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 0.12, 3.75]} />
        <meshStandardMaterial color="#56534e" roughness={0.38} metalness={0.18} />
      </mesh>

      <mesh position={[-1.25, 0.92, 1.9]} castShadow>
        <boxGeometry args={[0.25, 1.85, 1.25]} />
        <meshStandardMaterial color="#9b978d" roughness={0.6} />
      </mesh>

      <mesh position={[-1.55, 0.44, 1.12]} castShadow>
        <boxGeometry args={[0.85, 0.08, 0.85]} />
        <meshStandardMaterial color="#6d6a64" roughness={0.75} />
      </mesh>

      <Pool />

      <Tree position={[-4.05, -0.78, -1.2]} scale={1.15} />
      <Tree position={[4.1, -0.76, -1.6]} scale={1.35} />
      <Tree position={[4.55, -0.76, 1.55]} scale={0.9} />

      <pointLight position={[0, 0.5, 1.45]} intensity={18} distance={5} />
      <pointLight position={[2.9, 0.3, -0.2]} intensity={12} distance={4} />
    </group>
  );
}

function Scene({
  scroll,
  pointer,
  onPerformance,
}: HouseExperienceProps & { onPerformance: (factor: number) => void }) {
  return (
    <Canvas
      shadows
      dpr={1.4}
      camera={{ position: [6.9, 3, 11.6], fov: 34 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.15;
      }}
    >
      <color attach="background" args={["#0b0b0a"]} />
      <fog attach="fog" args={["#0b0b0a", 10, 26]} />

      <hemisphereLight args={["#d8e3ee", "#2f2a24", 1.55]} />
      <directionalLight
        castShadow
        position={[-7, 8, 5]}
        intensity={5.5}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[8, 3, -5]} intensity={1.5} />

      <Sparkles count={65} scale={14} size={1.2} speed={0.18} />
      <HouseModel scroll={scroll} pointer={pointer} />
      <ContactShadows
        position={[0, -0.78, 0]}
        scale={14}
        opacity={0.42}
        blur={2.8}
        far={5}
      />

      <PerformanceMonitor
        bounds={(refreshRate) => (refreshRate > 90 ? [50, 90] : [40, 60])}
        onChange={({ factor }) => onPerformance(factor)}
        onFallback={() => onPerformance(0.35)}
      />
      <AdaptiveDpr pixelated />

      <EffectComposer multisampling={2}>
        <Bloom intensity={0.85} luminanceThreshold={1.12} mipmapBlur />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.14} darkness={0.62} />
      </EffectComposer>
    </Canvas>
  );
}

export default function LuxuryHouseExperience() {
  const [scroll, setScroll] = useState(0);
  const [dpr, setDpr] = useState(1.4);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const update = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      setScroll(Math.min(1, Math.max(0, window.scrollY / max)));
    };

    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <main className="house-site">
      <header className="house-header">
        <div className="house-brand">CASA / 01</div>
        <nav className="house-nav" aria-label="Primary">
          <a href="#approach">Approach</a>
          <a href="#materials">Materials</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <div className="house-meta">
        <span>Dubai / 2026</span>
        <i />
        <span>Architectural Study</span>
      </div>

      <div className="house-canvas" aria-hidden="true">
        <Scene
          scroll={scroll}
          pointer={pointer.current}
          onPerformance={(factor) =>
            setDpr(Math.min(1.7, Math.max(0.75, 0.85 + factor * 0.85)))
          }
        />
      </div>
      <div className="house-noise" />

      <section className="house-panel hero">
        <p className="house-kicker">Cinematic 3D house study</p>
        <h1 className="house-title">
          <strong>LIGHT</strong>
          <br />
          LIVES HERE.
        </h1>
        <p className="house-copy">
          A self-contained WebGL architectural scene built for a premium
          scrolling experience: limestone, glass, water, warm interiors and
          slow camera movement.
        </p>
        <button
          className="house-button"
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight * 1.15,
              behavior: "smooth",
            })
          }
        >
          Enter the house
        </button>
      </section>

      <section className="house-panel center" id="approach">
        <p className="house-kicker">01 — Approach</p>
        <h2 className="house-title">
          ARRIVE
          <br />
          <strong>SOFTLY.</strong>
        </h2>
        <p className="house-copy">
          The camera closes the distance as the architecture rotates
          imperceptibly, keeping the structure alive while the scroll controls
          the cinematic progression.
        </p>
      </section>

      <section className="house-panel center" id="materials">
        <p className="house-kicker">02 — Materials</p>
        <h2 className="house-title">
          STONE.
          <br />
          GLASS.
          <br />
          WATER.
        </h2>
        <p className="house-copy">
          Neutral limestone planes, deep graphite roof geometry, translucent
          glazing and a warm interior core create the restrained material
          palette.
        </p>
      </section>

      <section className="house-panel center" id="contact">
        <p className="house-kicker">03 — Night study</p>
        <h2 className="house-title">
          <strong>COME</strong>
          <br />
          CLOSER.
        </h2>
        <p className="house-copy">
          This sample is designed as the visual foundation for a larger
          production site using the same cinematic engine with final Blender
          assets, hero films and refined interactions.
        </p>
        <div className="house-side-note">
          Production target: photoreal asset replacement, richer lighting,
          detailed landscaping, interior staging and mobile-specific quality
          controls.
        </div>
      </section>

      <div className="house-scroll">Scroll to explore</div>

      <footer className="house-footer">
        <span>Casa / 01</span>
        <span>Real-time architectural experience</span>
        <span>WebGL / R3F / GSAP-ready</span>
      </footer>
    </main>
  );
}
