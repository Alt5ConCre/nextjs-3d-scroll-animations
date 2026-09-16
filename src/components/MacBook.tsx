import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const TOP_MODEL_URL = `${BASE_PATH}/assets/Macbook_Top.glb`;
const BOTTOM_MODEL_URL = `${BASE_PATH}/assets/Macbook_Bottom.glb`;

useGLTF.preload(TOP_MODEL_URL);
useGLTF.preload(BOTTOM_MODEL_URL);

export function MacBook() {
  const topModel = useGLTF(TOP_MODEL_URL);
  const bottomModel = useGLTF(BOTTOM_MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Mesh>(null);
  const bottomRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!groupRef.current || !topRef.current || !bottomRef.current) return;

    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#section1",
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        })
        .to(groupRef.current!.rotation, {
          x: 0.0,
          ease: "power2.inOut",
        })
        .to(
          groupRef.current!.rotation,
          {
            y: Math.PI - 0.4,
            ease: "power2.inOut",
          },
          ">"
        )
        .to(
          topRef.current!.rotation,
          {
            x: Math.PI / 2 + 0.1,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          groupRef.current!.position,
          {
            x: 1.3,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          groupRef.current!.scale,
          {
            x: 0.7,
            y: 0.7,
            z: 0.7,
            ease: "power2.inOut",
          },
          "<"
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#section2",
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        })
        .to(groupRef.current!.rotation, {
          y: Math.PI + 0.4,
          ease: "power2.inOut",
        })
        .to(
          groupRef.current!.position,
          {
            x: -1.3,
            ease: "power2.inOut",
          },
          "<"
        );
    });

    return () => context.revert();
  }, []);

  return (
    <group
      ref={groupRef}
      position={[0, -0.7, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={1.3}
    >
      <mesh ref={topRef}>
        <primitive object={topModel.nodes.Top} />
      </mesh>
      <mesh ref={bottomRef}>
        <primitive object={bottomModel.nodes.Bottom} />
      </mesh>
    </group>
  );
}
