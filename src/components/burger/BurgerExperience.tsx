'use client';

import {Canvas,useFrame} from "@react-three/fiber";
import {Environment,Float,ContactShadows,OrbitControls,PerspectiveCamera} from "@react-three/drei";
import {EffectComposer,Bloom,Vignette} from "@react-three/postprocessing";
import * as THREE from "three";
import {useEffect,useMemo,useRef,useState} from "react";

function Bun({top=false,bottom=false}:{top?:boolean;bottom?:boolean}){
 const g=useRef<THREE.Group>(null);
 const seeds=useMemo(()=>Array.from({length:42},()=>({x:(Math.random()-.5)*2.5,z:(Math.random()-.5)*1.9,r:.025+Math.random()*.025,a:Math.random()*Math.PI})),[]);
 useFrame((_,d)=>{if(g.current)g.current.rotation.y+=d*.02});
 return <group ref={g} position={[0,top?1.25:bottom?-1.18:0,0]}>
  <mesh castShadow receiveShadow><sphereGeometry args={[1.5,64,32,0,Math.PI*2,0,top?Math.PI*.48:Math.PI*.18]}/><meshPhysicalMaterial color="#c87525" roughness={.45} clearcoat={.2}/></mesh>
  {top&&seeds.map((s,i)=><mesh key={i} position={[s.x,.35,s.z]} rotation={[s.a,0,s.a]} scale={[1,.35,.55]}><sphereGeometry args={[s.r,10,6]}/><meshStandardMaterial color="#f4d68e" roughness={.5}/></mesh>)}
 </group>
}
function Patty({y,scale=1}:{y:number;scale?:number}){const r=useRef<THREE.Mesh>(null);useFrame((_,d)=>{if(r.current)r.current.rotation.y+=d*.025});return <mesh ref={r} position={[0,y,0]} scale={[1.47,scale*.28,1.47]} castShadow receiveShadow><cylinderGeometry args={[1,1,32,1]}/><meshPhysicalMaterial color="#30130d" roughness={.82} clearcoat={.08}/></mesh>}
function Cheese({y,rot=0}:{y:number;rot?:number}){return <mesh position={[0,y,0]} rotation={[0,0,rot]} scale={[1.55,.055,1.55]} castShadow><boxGeometry args={[1,1,1]}/><meshPhysicalMaterial color="#f4b719" roughness={.3} clearcoat={.15}/></mesh>}
function Greens({y}:{y:number}){return <mesh position={[0,y,0]} scale={[1.55,.09,1.55]} castShadow><torusGeometry args={[1.04,.18,12,64]}/><meshPhysicalMaterial color="#739d25" roughness={.7}/></mesh>}
function Sauce({y}:{y:number}){return <mesh position={[0,y,0]} scale={[1.34,.055,1.34]}><torusGeometry args={[.72,.13,16,64]}/><meshPhysicalMaterial color="#9d1710" roughness={.38} clearcoat={.15}/></mesh>}
function Burger({p}:{p:number}){
 const sep=(y:number,amount:number)=>y+p*amount;
 return <group scale={1.08}>
  <Bun top/><Cheese y={sep(1.0,1.0)} rot={.14}/><Greens y={sep(.76,.9)}/><Patty y={sep(.52,.75)}/><Sauce y={sep(.31,.6)}/><Cheese y={sep(.08,.45)} rot={-.12}/><Patty y={sep(-.28,.25)} scale={1.05}/><Greens y={sep(-.56,.12)}/><Bun bottom/>
 </group>
}
function Fries({p}:{p:number}){const fs=useMemo(()=>Array.from({length:20},()=>({x:(Math.random()-.5)*.9,z:(Math.random()-.5)*.65,h:.6+Math.random()*.65,r:(Math.random()-.5)*.35})),[]);return <group position={[3,-1,0]} scale={p*.95}><mesh castShadow><boxGeometry args={[1.5,.5,1.05]}/><meshPhysicalMaterial color="#111" roughness={.35}/></mesh>{fs.map((f,i)=><mesh key={i} position={[f.x,f.h/2-.05,f.z]} rotation={[0,f.r,0]} castShadow><boxGeometry args={[.12,f.h,.12]}/><meshPhysicalMaterial color="#e4a72b" roughness={.55}/></mesh>)}</group>}
function Shake({p}:{p:number}){return <group position={[-3,-.3,0]} scale={p*.9}><mesh castShadow><cylinderGeometry args={[.57,.5,1.6,48]}/><meshPhysicalMaterial color="#d9c7b5" roughness={.24}/></mesh><mesh position={[0,.87,0]}><sphereGeometry args={[.62,32,16]}/><meshPhysicalMaterial color="#efd5c0" roughness={.32}/></mesh><mesh position={[0,1.24,0]} scale={[.5,.12,.5]}><sphereGeometry args={[1,24,12]}/><meshPhysicalMaterial color="#693b28" roughness={.48}/></mesh></group>}
function Scene({p}:{p:number}){return <Canvas shadows dpr={[1,1.75]} gl={{antialias:true,powerPreference:"high-performance"}}><PerspectiveCamera makeDefault position={[0,.3,7.2]} fov={38}/><color attach="background" args={["#f4f0e8"]}/><ambientLight intensity={1.1}/><directionalLight castShadow position={[3,5,5]} intensity={3.2} shadow-mapSize-width={2048} shadow-mapSize-height={2048}/><directionalLight position={[-4,2,-3]} intensity={1.2}/><spotLight position={[0,4,2]} angle={.55} penumbra={.9} intensity={3}/><Environment preset="studio" environmentIntensity={.65}/><Float speed={1.1} rotationIntensity={.06} floatIntensity={.06}><Burger p={p}/></Float><Fries p={p}/><Shake p={p}/><mesh position={[0,-1.55,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[14,14]}/><meshStandardMaterial color="#d9d1c4" roughness={.92}/></mesh><ContactShadows position={[0,-1.5,0]} opacity={.3} scale={8} blur={2.5} far={4}/><EffectComposer><Bloom intensity={.16} luminanceThreshold={1.1} mipmapBlur/><Vignette eskil={false} offset={.18} darkness={.28}/></EffectComposer><OrbitControls enableZoom={false} enablePan={false}/></Canvas>}
export default function BurgerExperience(){
 const[p,setP]=useState(0);
 useEffect(()=>{let f=0;const on=()=>{cancelAnimationFrame(f);f=requestAnimationFrame(()=>{const m=document.documentElement.scrollHeight-innerHeight;setP(m?scrollY/m:0)})};on();addEventListener("scroll",on,{passive:true});addEventListener("resize",on);return()=>{cancelAnimationFrame(f);removeEventListener("scroll",on);removeEventListener("resize",on)}},[]);
 return <main className="burger-site"><div className="burger-webgl"><Scene p={Math.min(1,p*1.35)}/><div className="burger-vignette"/></div><header className="burger-header"><b>ALL★STAR / BURGERS</b><span>CRAFTED FOR THE CAMERA</span></header><div className="burger-progress"><span>{String(Math.round(p*100)).padStart(3,"0")}</span><i style={{transform:`scaleX(${Math.max(.02,p)})`}}/></div><section className="burger-hero"><small>SMASHED / LOADED / CINEMATIC</small><h1>BUILT<br/><em>LIKE</em><br/>AN ALL-STAR.</h1><p>Scroll to pull the burger apart, inspect every layer, then bring the full meal into frame.</p></section><section className="burger-chapter"><small>01 — THE STACK</small><h2>REAL-TIME 3D.<br/>NOT A VIDEO.</h2><p>WebGL keeps the burger spatial and interactive while scroll controls the cinematic choreography.</p></section><section className="burger-chapter burger-light"><small>02 — THE LINEUP</small><h2>THE STACK<br/>GETS LOUDER.</h2><p>PBR food materials, soft studio lighting, contact shadows and bloom push the scene toward commercial food photography.</p></section><section className="burger-chapter burger-dark"><small>03 — OVERTIME</small><h2>BURGER.<br/>FRIES.<br/>SHAKE.</h2><p>The composition expands around the hero without cutting away from the 3D scene.</p></section><section className="burger-chapter burger-end"><small>04 — THE BOX</small><h2>MAKE IT<br/>A MOMENT.</h2><button onClick={()=>scrollTo({top:0,behavior:"smooth"})}>REPLAY THE FILM ↗</button></section><footer className="burger-footer">© 2026 ALL★STAR BURGERS — CINEMATIC WEBGL EXPERIENCE</footer></main>
}