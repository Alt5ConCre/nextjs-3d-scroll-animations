"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import CinematicDirector from "@/components/cinematic/CinematicDirector";
import type { CinematicScrollRuntime } from "@/lib/cinematic/scroll-state";
import { HOUSE_CHAPTERS, HOUSE_SEQUENCE } from "./house-config";

const House3DScene = dynamic(() => import("./House3DScene"), { ssr: false });
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function HouseWalkthrough() {
  const runtimeRef = useRef<CinematicScrollRuntime>({ progress: 0, velocity: 0, scroll: 0, limit: 0, time: 0 });
  const storyRef = useRef<HTMLDivElement>(null);
  const mobileVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rafRef = useRef<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(HOUSE_CHAPTERS[0].id);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (mobile) {
      setReady(true);
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [mobile]);

  useEffect(() => {
    if (!ready || mobile) return;
    const loop = () => {
      const story = storyRef.current;
      if (story) {
        const start = story.getBoundingClientRect().top + runtimeRef.current.scroll;
        const end = start + story.offsetHeight - window.innerHeight;
        const p = clamp((runtimeRef.current.scroll - start) / Math.max(end - start, 1));
        const chapter = HOUSE_CHAPTERS.find((item) => p >= item.start && p <= item.end) || HOUSE_CHAPTERS[HOUSE_CHAPTERS.length - 1];
        if (chapter.id !== activeChapter) setActiveChapter(chapter.id);
        HOUSE_CHAPTERS.forEach((item) => {
          const node = overlayRefs.current[item.id];
          if (!node) return;
          const local = clamp((p - item.start) / Math.max(item.end - item.start, 0.001));
          const opacity = item.id === chapter.id ? Math.min(clamp(local / 0.12), clamp((1 - local) / 0.16)) : 0;
          node.style.opacity = String(opacity);
          node.style.transform = `translate3d(0, ${lerp(24, 0, opacity)}px, 0)`;
        });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [activeChapter, mobile, ready]);

  useEffect(() => {
    if (!mobile) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      });
    }, { threshold: 0.35 });
    Object.values(mobileVideoRefs.current).forEach((video) => video && observer.observe(video));
    return () => observer.disconnect();
  }, [mobile]);

  const handleSceneReady = () => {
    setLoadProgress(1);
    setReady(true);
    document.body.style.overflow = "";
  };

  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="house-site">
      <CinematicDirector runtimeRef={runtimeRef} />
      {!mobile && <div className={`house-preloader ${ready ? "house-preloader--done" : ""}`} aria-hidden={ready}><div className="house-preloader__brand">PRIVATE RESIDENCE / 01</div><div className="house-preloader__title">Loading the residence</div><div className="house-preloader__bar"><span style={{ transform: `scaleX(${loadProgress})` }} /></div><div className="house-preloader__meta">{Math.round(loadProgress * 100)}% / REAL-TIME 3D</div></div>}
      {!mobile && <House3DScene runtimeRef={runtimeRef} onReady={handleSceneReady} />}
      <header className="house-header"><div>ATELIER RESIDENCE</div><div>REAL-TIME ARCHITECTURAL WALKTHROUGH</div></header>
      {!mobile && <aside className="house-nav" aria-label="House rooms">{HOUSE_CHAPTERS.slice(0, -1).map((chapter, index) => <button key={chapter.id} type="button" className={chapter.id === activeChapter ? "is-active" : ""} onClick={() => jumpTo(chapter.id)} aria-label={`Go to ${chapter.navLabel}`}><span>{String(index + 1).padStart(2, "0")}</span><i /><strong>{chapter.navLabel}</strong></button>)}</aside>}
      <section className="house-intro" id="top"><div className="house-intro__copy"><p>MODERN LUXURY / TWO STOREYS / PRIVATE RESIDENCE</p><h1>LIVE<br />ABOVE<br />EXPECTATION.</h1><span>Scroll to enter the house.</span></div></section>
      <div className="house-story" ref={storyRef}>
        {HOUSE_CHAPTERS.map((chapter, index) => <section id={chapter.id} key={chapter.id} className={`house-chapter ${index === HOUSE_CHAPTERS.length - 1 ? "house-chapter--cta" : ""}`} style={{ minHeight: `${Math.max((chapter.end - chapter.start) * HOUSE_SEQUENCE.scrollHeightVh, 54)}vh` }}>
          {!mobile && <div ref={(node) => { overlayRefs.current[chapter.id] = node; }} className="house-chapter__overlay"><p>{chapter.kicker}</p><h2>{chapter.title}</h2><span>{chapter.description}</span></div>}
          {mobile && <div className="house-mobile-shot"><div className="house-mobile-shot__media"><video ref={(node) => { mobileVideoRefs.current[chapter.id] = node; }} muted loop playsInline preload="metadata" poster={HOUSE_SEQUENCE.poster} src={chapter.mobileVideo} /></div><div className="house-mobile-shot__copy"><p>{chapter.kicker}</p><h2>{chapter.title}</h2><span>{chapter.description}</span></div></div>}
          {index === 0 && !mobile && <span className="house-scroll-meter">SCROLL / 3D CAMERA</span>}
        </section>)}
      </div>
      <footer className="house-footer"><div><p>PRIVATE RESIDENCE</p><strong>Schedule a Private Tour</strong><span>Explore the architecture, materials and proportions in person.</span></div><div className="house-footer__actions"><a href="mailto:hello@example.com?subject=Private%20Tour%20Inquiry">Inquire Now</a><a href="tel:+000000000">Call the Residence</a></div></footer>
    </main>
  );
}
