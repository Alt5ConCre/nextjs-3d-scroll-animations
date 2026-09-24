"use client";

import dynamic from "next/dynamic";

const FreshLuxuryHouse = dynamic(
  () => import("@/components/luxury/FreshLuxuryHouse"),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh", background: "#11110f" }} /> }
);

export default function FreshLuxuryHousePage() {
  return <FreshLuxuryHouse />;
}
