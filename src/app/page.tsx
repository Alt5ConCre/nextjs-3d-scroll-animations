"use client";
import dynamic from "next/dynamic";
const BurgerExperience=dynamic(()=>import("@/components/burger/BurgerExperience"),{ssr:false});
export default function Home(){return <BurgerExperience/>;}