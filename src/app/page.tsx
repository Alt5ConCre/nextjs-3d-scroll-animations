"use client";

import dynamic from "next/dynamic";

const HouseWalkthrough = dynamic(
  () => import("@/components/house/HouseWalkthrough"),
  { ssr: false }
);

export default function Home() {
  return <HouseWalkthrough />;
}
