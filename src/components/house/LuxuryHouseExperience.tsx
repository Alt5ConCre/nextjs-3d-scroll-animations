"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import CinematicDirector from "@/components/cinematic/CinematicDirector";
import type { CinematicScrollRuntime } from "@/lib/cinematic/scroll-state";
import { HOUSE_CHAPTERS, HOUSE_SEQUENCE } from "./house-config";

const House3DScene = dynamic(() => import("./House3DScene"), { ssr: false });

export default function LuxuryHouseExperience() {
  const runtimeRef = useRef<CinematicScrollRuntime>({
    progress: 0,
    velocity: 0,
    scroll: 0,
    limit: 0,
    time: 0,
  });

  useEffect(() => {
    const previous = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = previous;
    };
  }, []);

  return (
    <main className="house-site house-site--real-model">
      <CinematicDirector runtimeRef={runtimeRef} />

      <House3DScene
        runtimeRef={runtimeRef}
        onReady={() => undefined}
      />

      <header className="house-header">
        <div className="house-brand">ATELIER RESIDENCE</div>
        <div className="house-header__mode">
          REAL MODEL / REAL-TIME 3D
        </div>
      </header>

      <aside className="house-meta">
        <span>DUBAI / 2026</span>
        <i />
        <span>PRIVATE RESIDENCE</span>
      </aside>

      <section className="house-panel hero">
        <p className="house-kicker">Photorealism sample / existing house model</p>
        <h1 className="house-title">
          LIVE
          <br />
          <strong>ABOVE</strong>
          <br />
          EXPECTATION.
        </h1>
        <p className="house-copy">
          This sample now uses the existing luxury-house GLB and its
          established cinematic camera path rather than procedural placeholder
          geometry.
        </p>
      </section>

      <div
        className="house-story"
        style={{ minHeight: `${HOUSE_SEQUENCE.scrollHeightVh + 180}vh` }}
      >
        {HOUSE_CHAPTERS.map((chapter, index) => (
          <section className="house-panel center" key={chapter.id} id={chapter.id}>
            <p className="house-kicker">{chapter.kicker}</p>
            <h2 className="house-title">
              {chapter.title.split(".")[0]}
              {index < HOUSE_CHAPTERS.length - 1 && (
                <>
                  <br />
                  <strong>{chapter.title.split(".").slice(1).join(".").trim()}</strong>
                </>
              )}
            </h2>
            <p className="house-copy">{chapter.description}</p>
          </section>
        ))}
      </div>

      <div className="house-scroll">Scroll to explore</div>

      <footer className="house-footer">
        <span>ATELIER RESIDENCE</span>
        <span>GLB / R3F / CINEMATIC CAMERA</span>
        <span>REAL-TIME ARCHITECTURAL STUDY</span>
      </footer>
    </main>
  );
}
