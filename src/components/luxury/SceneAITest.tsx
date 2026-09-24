"use client";

import { useEffect, useRef, useState } from "react";
import "./SceneAITest.css";

const HOUSE_VIDEO =
  process.env.NEXT_PUBLIC_LUXURY_HOUSE_VIDEO_URL ||
  "/assets/luxury-house-cinematic.mp4";

const chapters = [
  { at: 0, no: "01", label: "ARRIVAL", detail: "A residence shaped by light, stone and space." },
  { at: 0.18, no: "02", label: "THE THRESHOLD", detail: "Architecture meets landscape through glass and shadow." },
  { at: 0.38, no: "03", label: "LIGHT / FORM", detail: "Quiet geometry, natural materials, controlled light." },
  { at: 0.60, no: "04", label: "PRIVATE SPACES", detail: "Interiors designed for stillness and proportion." },
  { at: 0.78, no: "05", label: "WATER / LANDSCAPE", detail: "A continuous relationship between house and horizon." },
  { at: 0.92, no: "06", label: "THE FINAL FRAME", detail: "The residence returns to the landscape." },
];

function getChapter(progress: number) {
  let active = chapters[0];
  for (const chapter of chapters) {
    if (progress >= chapter.at) active = chapter;
  }
  return active;
}

export default function SceneAITest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetProgress = useRef(0);
  const renderedProgress = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateTarget = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      targetProgress.current =
        maxScroll > 0
          ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
          : 0;
    };

    const tick = () => {
      renderedProgress.current +=
        (targetProgress.current - renderedProgress.current) * 0.095;

      const video = videoRef.current;
      if (
        video &&
        ready &&
        Number.isFinite(video.duration) &&
        video.duration > 0
      ) {
        const nextTime =
          renderedProgress.current * Math.max(0, video.duration - 0.04);

        if (Math.abs(video.currentTime - nextTime) > 0.012) {
          try {
            video.currentTime = nextTime;
          } catch {
            // Browser can reject seeks while metadata is changing.
          }
        }
      }

      setProgress(renderedProgress.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  const chapter = getChapter(progress);

  return (
    <main className="sceneai-test">
      <div className="sceneai-media" aria-hidden="true">
        <video
          ref={videoRef}
          className={`sceneai-video ${hasVideo ? "" : "sceneai-video--hidden"}`}
          src={HOUSE_VIDEO}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          onError={() => setHasVideo(false)}
        />
        <div className="sceneai-fallback">
          <div className="fallback-sky" />
          <div className="fallback-house">
            <div className="fallback-roof" />
            <div className="fallback-volume fallback-volume--left" />
            <div className="fallback-volume fallback-volume--right" />
            <div className="fallback-glass" />
            <div className="fallback-pool" />
          </div>
        </div>
      </div>

      <div className="sceneai-atmosphere" />
      <div className="sceneai-grain" />
      <div className="sceneai-vignette" />

      <header className="sceneai-nav">
        <span className="sceneai-brand">PRIVATE RESIDENCE</span>
        <span className="sceneai-meta">DUBAI · ARCHITECTURAL FILM</span>
      </header>

      <aside className="sceneai-progress" aria-hidden="true">
        <span>{chapter.no}</span>
        <div className="sceneai-progress-track">
          <i style={{ transform: `scaleY(${Math.max(0.025, progress)})` }} />
        </div>
        <span>06</span>
      </aside>

      <section className="sceneai-copy">
        <p>ARCHITECTURE / {chapter.no}</p>
        <h1 key={chapter.no}>{chapter.label}</h1>
        <span>{chapter.detail}</span>
      </section>

      <div className="sceneai-scroll-hint">
        <span>SCROLL TO EXPLORE</span>
        <i />
      </div>

      <div className="sceneai-spacer" />
      <div className="sceneai-spacer" />
      <div className="sceneai-spacer" />
      <div className="sceneai-spacer" />
      <div className="sceneai-spacer" />
      <div className="sceneai-spacer" />

      <footer className="sceneai-footer">
        <span>SCROLL / SCRUB / REVERSE</span>
        <span>PRIVATE RESIDENCE — 2026</span>
      </footer>
    </main>
  );
}
