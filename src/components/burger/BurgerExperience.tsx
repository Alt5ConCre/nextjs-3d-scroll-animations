"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, PerspectiveCamera, useGLTF, Loader, useAnimations } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const MODEL = "/assets/burger_cinematic.glb";

function PhotorealBurger({ progress }: { progress: number }) {
  const root = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL);
  const { actions, mixer } = useAnimations(animations, root);

  useEffect(() => {
    const action = actions?.["BurgerAction"] ?? Object.values(actions ?? {})[0];
    if (!action) return;
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    return () => action.stop();
  }, [actions]);

  useEffect(() => {
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if ("envMapIntensity" in material && typeof material.envMapIntensity === "number") {
          material.envMapIntensity = 1.5;
        }
      });
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!root.current) return;
    const action = actions?.["BurgerAction"] ?? Object.values(actions ?? {})[0];
    if (action && action.getClip().duration > 0) {
      mixer.setTime(THREE.MathUtils.clamp(progress, 0, 1) * action.getClip().duration);
    }

    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      -0.10 + progress * 0.48,
      4,
      delta
    );
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      Math.sin(state.clock.elapsedTime * 0.45) * 0.012,
      3,
      delta
    );
  });

  return (
    <group ref={root} scale={1.42} position={[0, -0.72, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function CameraDirector({ progress }: { progress: number }) {
  const target = useRef(new THREE.Vector3());
  useFrame(({ camera }, delta) => {
    const p = progress;
    const x = Math.sin(p * Math.PI * 0.9) * 0.42;
    const y = 0.25 + Math.sin(p * Math.PI) * 0.28;
    const z = 7.2 - p * 1.15;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 3.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 3.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3.2, delta);
    target.current.set(0, 1.0, 0);
    camera.lookAt(target.current);
  });
  return null;
}

function Scene({ progress }: { progress: number }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.25, 7.2]} fov={31} />
      <color attach="background" args={["#080706"]} />
      <fog attach="fog" args={["#080706", 7, 15]} />
      <ambientLight intensity={0.12} />
      <spotLight castShadow position={[4.5, 5.5, 5]} intensity={110} angle={0.30} penumbra={0.95} shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-4.5, 3.0, 1.0]} intensity={45} angle={0.55} penumbra={1} />
      <pointLight position={[0, -1, 4]} intensity={12} />
      <Environment preset="studio" environmentIntensity={1.0} />
      <PhotorealBurger progress={progress} />
      <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#11100e" roughness={0.82} metalness={0.05} />
      </mesh>
      <ContactShadows position={[0, -1.43, 0]} opacity={0.62} scale={7} blur={2.4} far={5} />
      <CameraDirector progress={progress} />
      <EffectComposer multisampling={2}>
        <Bloom intensity={0.28} luminanceThreshold={0.82} mipmapBlur />
        <Noise opacity={0.018} />
        <Vignette eskil={false} offset={0.14} darkness={0.58} />
      </EffectComposer>
    </Canvas>
  );
}

export default function BurgerExperience() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setProgress(max ? THREE.MathUtils.clamp(scrollY / max, 0, 1) : 0);
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, []);

  return (
    <main className="burger-site">
      <div className="burger-webgl">
        <Suspense fallback={null}><Scene progress={progress} /></Suspense>
      </div>
      <Loader />
      <header className="burger-header"><b>ALL★STAR / BURGERS</b><span>THE CINEMATIC STACK</span></header>
      <div className="burger-meta"><span>SCROLL</span><i style={{ transform: `scaleX(${Math.max(0.02, progress)})` }} /><b>{String(Math.round(progress * 100)).padStart(3, "0")}</b></div>
      <section className="burger-hero"><small>01 / THE BURGER</small><h1>BUILT<br /><em>LIKE</em><br />AN ALL-STAR.</h1><p>A high-detail Blender burger, rendered for the web as an animation-ready GLB. Scroll to pull the ingredients apart and bring them back together.</p></section>
      <section className="burger-spacer"><div><small>02 / THE STACK</small><h2>SEE<br />EVERY<br />LAYER.</h2></div></section>
      <section className="burger-dark"><small>03 / THE CLOSE-UP</small><h2>HOT.<br />JUICY.<br />REAL.</h2><p>Procedural micro-detail, toasted brioche, charred beef, melted cheese, fresh vegetables, sesame and cinematic studio lighting.</p></section>
      <section className="burger-end"><small>04 / REPLAY</small><h2>MAKE IT<br />A MOMENT.</h2><button onClick={() => scrollTo({ top: 0, behavior: "smooth" })}>REPLAY THE FILM ↗</button></section>
      <footer className="burger-footer">BLENDER / CYCLES-READY SOURCE · GLB / WEBGL / SCROLL DIRECTOR</footer>
    </main>
  );
}

useGLTF.preload(MODEL);
