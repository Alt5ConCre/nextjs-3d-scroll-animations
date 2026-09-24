import dynamic from "next/dynamic";

const SceneAITest = dynamic(() => import("@/components/luxury/SceneAITest"), {
  ssr: false,
});

export default function SceneAITestPage() {
  return <SceneAITest />;
}
