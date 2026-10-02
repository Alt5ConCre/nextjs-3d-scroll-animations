"use client";

import dynamic from "next/dynamic";

const LuxuryHouseExperience = dynamic(
  () => import("@/components/house/LuxuryHouseExperience"),
  { ssr: false }
);

export default function Home() {
  return <LuxuryHouseExperience />;
}
