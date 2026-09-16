"use client";

import dynamic from "next/dynamic";
import { CinematicChapter } from "@/components/cinematic/CinematicChapter";

const CinematicEngine = dynamic(
  () => import("@/components/cinematic/CinematicEngine"),
  { ssr: false }
);

const chapters = [
  {
    id: "section1",
    eyebrow: "01 / ARRIVAL",
    title: "A living canvas.",
    text: "Scroll controls the cinematic journey while the artifact keeps moving on its own.",
    textId: "text-1",
  },
  {
    id: "section2",
    eyebrow: "02 / MOTION",
    title: "Two timelines. One scene.",
    text: "The camera and GLB choreography follow scroll. Rotation, transmission, particles and atmosphere continue independently.",
    textId: "text-2",
  },
  {
    id: "section3",
    eyebrow: "03 / DEPTH",
    title: "Built for real 3D.",
    text: "The engine accepts production GLB assets, PBR materials, HDR environments, post-processing and future pre-rendered film plates.",
    textId: "text-3",
  },
  {
    id: "section4",
    eyebrow: "04 / PERFORMANCE",
    title: "Cinematic without wasting frames.",
    text: "Adaptive DPR, reduced-motion behavior, lazy asset loading and mobile-aware quality keep the experience resilient.",
  },
] as const;

export default function Home() {
  return (
    <main>
      <CinematicEngine />

      <div className="cinematic-ui">
        <header className="topbar" aria-label="Cinematic engine status">
          <span>CINEMATIC ENGINE</span>
          <span>SCROLL / INTERACT</span>
        </header>

        <section className="hero chapter" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow">NEXT-GEN WEBGL EXPERIENCE</p>
            <h1 id="hero-title">
              SCROLL THE
              <br />
              FILM. MOVE
              <br />
              THE WORLD.
            </h1>
            <p className="lede">
              A reusable cinematic engine for super-realistic, interactive websites.
            </p>
          </div>
          <span className="scroll-cue">↓ SCROLL TO EXPLORE</span>
        </section>

        {chapters.map((chapter) => (
          <CinematicChapter
            key={chapter.id}
            id={chapter.id}
            eyebrow={chapter.eyebrow}
            title={chapter.title}
            text={chapter.text}
          >
            {chapter.textId ? (
              <span id={chapter.textId} className="chapter-anchor-copy" aria-hidden="true" />
            ) : null}
          </CinematicChapter>
        ))}
      </div>
    </main>
  );
}
