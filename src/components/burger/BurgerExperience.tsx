"use client";

import {Canvas,useFrame} from "@react-three/fiber";
import {ContactShadows,Environment,Float,PerspectiveCamera,useGLTF,Loader} from "@react-three/drei";
import {EffectComposer,Bloom,Vignette,Noise} from "@react-three/postprocessing";
import {Suspense,useEffect,useMemo,useRef,useState} from "react";
import * as THREE from "three";

const MODEL="https://cdn.3dassets.dev/assets/34314/v1/model.glb";

function PhotorealBurger({progress}:{progress:number}){
  const root=useRef<THREE.Group>(null);
  const {scene}=useGLTF(MODEL);
  const model=useMemo(()=>{
    const clone=scene.clone(true);
    clone.traverse((child)=>{
      if(child instanceof THREE.Mesh){
        child.castShadow=true;
        child.receiveShadow=true;
        const materials=Array.isArray(child.material)?child.material:[child.material];
        materials.forEach((material)=>{
          if("roughness" in material && typeof material.roughness==="number"){
            material.roughness=Math.min(.82,Math.max(.2,material.roughness));
          }
          if("envMapIntensity" in material && typeof material.envMapIntensity==="number"){
            material.envMapIntensity=1.35;
          }
        });
      }
    });
    return clone;
  },[scene]);

  const parts=useMemo(()=>{
    const list:THREE.Mesh[]=[];
    model.traverse((child)=>{
      if(child instanceof THREE.Mesh)list.push(child);
    });
    return list.map((o,i)=>({o,base:o.position.clone(),i}));
  },[model]);

  useFrame((state,delta)=>{
    if(!root.current)return;
    const p=THREE.MathUtils.smoothstep(progress,0,1);
    root.current.rotation.y=THREE.MathUtils.damp(root.current.rotation.y,-.14+p*.55,4,delta);
    root.current.rotation.x=THREE.MathUtils.damp(root.current.rotation.x,Math.sin(state.clock.elapsedTime*.45)*.018,3,delta);
    root.current.position.y=THREE.MathUtils.damp(root.current.position.y,Math.sin(state.clock.elapsedTime*.8)*.025,4,delta);
    parts.forEach(({o,base,i})=>{
      const spread=(.15+((i*37)%7)*.055)*p;
      const side=((i%3)-1)*.12*p;
      o.position.y=base.y+spread;
      o.position.x=base.x+side;
      o.rotation.z=Math.sin(state.clock.elapsedTime*.7+i)*.012*p;
    });
  });

  return <group ref={root} scale={5.3} position={[0,-.72,0]}>
    <primitive object={model}/>
  </group>;
}

function CameraDirector({progress}:{progress:number}){
  const target=useRef(new THREE.Vector3());
  useFrame(({camera},delta)=>{
    const p=progress;
    const x=Math.sin(p*Math.PI*.9)*.32;
    const y=.18+Math.sin(p*Math.PI)*.22;
    const z=6.5-p*.75;
    camera.position.x=THREE.MathUtils.damp(camera.position.x,x,3.5,delta);
    camera.position.y=THREE.MathUtils.damp(camera.position.y,y,3.5,delta);
    camera.position.z=THREE.MathUtils.damp(camera.position.z,z,3.5,delta);
    target.current.set(0,.05,0);
    camera.lookAt(target.current);
  });
  return null;
}

function Scene({progress}:{progress:number}){
 return <Canvas shadows dpr={[1,2]} gl={{antialias:true,powerPreference:"high-performance",toneMapping:THREE.ACESFilmicToneMapping}}>
   <PerspectiveCamera makeDefault position={[0,.18,6.5]} fov={32}/>
   <color attach="background" args={["#0a0a09"]}/>
   <fog attach="fog" args={["#0a0a09",6,14]}/>
   <ambientLight intensity={.22}/>
   <spotLight castShadow position={[3.5,5.5,5]} intensity={95} angle={.32} penumbra={1} shadow-mapSize={[2048,2048]}/>
   <spotLight position={[-4,2,1]} intensity={38} angle={.5} penumbra={1}/>
   <pointLight position={[0,-1,4]} intensity={18}/>
   <Environment preset="studio" environmentIntensity={1.2}/>
   <Float speed={.9} rotationIntensity={.025} floatIntensity={.04}>
     <PhotorealBurger progress={progress}/>
   </Float>
   <mesh position={[0,-1.45,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
     <planeGeometry args={[18,18]}/>
     <meshStandardMaterial color="#151311" roughness={.78} metalness={.08}/>
   </mesh>
   <ContactShadows position={[0,-1.43,0]} opacity={.6} scale={7} blur={2.2} far={5}/>
   <CameraDirector progress={progress}/>
   <EffectComposer multisampling={2}>
     <Bloom intensity={.34} luminanceThreshold={.85} mipmapBlur/>
     <Noise opacity={.025}/>
     <Vignette eskil={false} offset={.14} darkness={.55}/>
   </EffectComposer>
 </Canvas>
}

export default function BurgerExperience(){
 const[progress,setProgress]=useState(0);
 useEffect(()=>{
   let raf=0;
   const update=()=>{
     cancelAnimationFrame(raf);
     raf=requestAnimationFrame(()=>{
       const max=document.documentElement.scrollHeight-innerHeight;
       setProgress(max?THREE.MathUtils.clamp(scrollY/max,0,1):0);
     });
   };
   update();
   addEventListener("scroll",update,{passive:true});
   addEventListener("resize",update);
   return()=>{cancelAnimationFrame(raf);removeEventListener("scroll",update);removeEventListener("resize",update)};
 },[]);
 return <main className="burger-site">
   <div className="burger-webgl"><Suspense fallback={null}><Scene progress={progress}/></Suspense></div>
   <Loader/>
   <header className="burger-header"><b>ALL★STAR / BURGERS</b><span>THE CINEMATIC STACK</span></header>
   <div className="burger-meta"><span>SCROLL</span><i style={{transform:`scaleX(${Math.max(.02,progress)})`}}/><b>{String(Math.round(progress*100)).padStart(3,"0")}</b></div>
   <section className="burger-hero"><small>01 / THE BURGER</small><h1>BUILT<br/><em>LIKE</em><br/>AN ALL-STAR.</h1><p>Scroll through the hero film. The real-time 3D meal separates, breathes and recomposes under your control.</p></section>
   <section className="burger-spacer"><div><small>02 / THE STACK</small><h2>SEE<br/>EVERY<br/>LAYER.</h2></div></section>
   <section className="burger-dark"><small>03 / THE CLOSE-UP</small><h2>HOT.<br/>JUICY.<br/>REAL.</h2><p>Photoreal PBR materials, studio lighting, cinematic depth and controlled motion.</p></section>
   <section className="burger-end"><small>04 / REPLAY</small><h2>MAKE IT<br/>A MOMENT.</h2><button onClick={()=>scrollTo({top:0,behavior:"smooth"})}>REPLAY THE FILM ↗</button></section>
   <footer className="burger-footer">CINEMATIC BURGER EXPERIENCE · WEBGL / GLB / SCROLL DIRECTOR</footer>
 </main>
}
useGLTF.preload(MODEL);
