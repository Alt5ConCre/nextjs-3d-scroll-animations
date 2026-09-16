"use client";

import { useEffect, useRef, useState } from "react";
import CinematicDirector from "@/components/cinematic/CinematicDirector";
import type { CinematicScrollRuntime } from "@/lib/cinematic/scroll-state";
import { HOUSE_CHAPTERS, HOUSE_SEQUENCE } from "./house-config";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function HouseWalkthrough() {
  const runtimeRef = useRef<CinematicScrollRuntime>({ progress: 0, velocity: 0, scroll: 0, limit: 0, time: 0 });
  const storyRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rafRef = useRef<number | null>(null);
  const targetProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(HOUSE_CHAPTERS[0].id);
  const [mediaError, setMediaError] = useState(false);

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
    const video = desktopVideoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setLoadProgress(0.8);
      video.currentTime = 0;
      setLoadProgress(1);
      setReady(true);
      document.body.style.overflow = "";
    };
    const onCanPlay = () => {
      setLoadProgress(1);
      setReady(true);
      document.body.style.overflow = "";
    };
    const onError = () => {
      setMediaError(true);
      setReady(true);
      document.body.style.overflow = "";
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);
    if (video.readyState >= 1) onLoadedMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      document.body.style.overflow = "";
    };
  }, [mobile]);

  useEffect(() => {
    if (!ready || mobile) return;
    const loop = () => {
      const story = storyRef.current;
      const video = desktopVideoRef.current;
      if (story && video && video.duration) {
        const start = story.getBoundingClientRect().top + runtimeRef.current.scroll;
        const end = start + story.offsetHeight - window.innerHeight;
        const p = clamp((runtimeRef.current.scroll - start) / Math.max(end - start, 1));
        targetProgressRef.current = p;
        displayProgressRef.current = lerp(displayProgressRef.current, p, 0.14);

        const targetTime = displayProgressRef.current * Math.max(video.duration - 0.02, 0);
        if (Math.abs(video.currentTime - targetTime) > 0.012) video.currentTime = targetTime;

        const chapter = HOUSE_CHAPTERS.find((item) => p >= item.start && p <= item.end) || HOUSE_CHAPTERS[HOUSE_CHAPTERS.length - 1];
        if (chapter.id !== activeChapter) setActiveChapter(chapter.id);
        HOUSE_CHAPTERS.forEach((item) => {
          const node = overlayRefs.current[item.id];
          if (!node) return;
          const local = clamp((p - item.start) / Math.max(item.end - item.start, 0.001));
          const opacity = item.id === chapter.id ? Math.min(clamp(local / 0.12), clamp((1 - local) / 0.16)) : 0;
          node.style.opacity = String(opacity);
          node.style.transform = `translate3d(0, ${lerp(22, 0, opacity)}px, 0)`;
        });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeChapter, mobile, ready]);

  useEffect(() => {
    if (!ready || mobile) return;
    const sync = () => {
      const video = desktopVideoRef.current;
      if (!video || !video.duration) return;
      const ratio = window.innerWidth / window.innerHeight;
      if (ratio > 1.3) video.style.objectPosition = "50% 50%";
      else video.style.objectPosition = "54% 50%";
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [mobile, ready]);

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

  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="house-site">
      <CinematicDirector runtimeRef={runtimeRef} />
      {!mobile && <div className={`house-preloader ${ready ? "house-preloader--done" : ""}`} aria-hidden={ready}><div className="house-preloader__brand">PRIVATE RESIDENCE / 01</div><div className="house-preloader__title">Preparing the walkthrough</div><div className="house-preloader__bar"><span style={{ transform: `scaleX(${loadProgress})` }} /></div><div className="house-preloader__meta">{mediaError ? "POSTER FALLBACK" : `${Math.round(loadProgress * 100)}% / 4K WALKTHROUGH`}</div></div>}
      {!mobile && <div className="house-film" aria-hidden="true"><video ref={desktopVideoRef} className="house-film__video" muted playsInline preload="metadata" poster={HOUSE_SEQUENCE.poster} src={HOUSE_SEQUENCE.desktopVideo} /><div className="house-film__vignette" /><div className="house-film__grain" /></div>}
      <header className="house-header"><div>ATELIER RESIDENCE</div><div>PRIVATE VIEWING</div></header>
      {!mobile && <aside className="house-nav" aria-label="House rooms">{HOUSE_CHAPTERS.slice(0, -1).map((chapter, index) => <button key={chapter.id} type="button" className={chapter.id === activeChapter ? "is-active" : ""} onClick={() => jumpTo(chapter.id)} aria-label={`Go to ${chapter.navLabel}`}><span>{String(index + 1).padStart(2, "0")}</span><i /><strong>{chapter.navLabel}</strong></button>)}</aside>}
      <section className="house-intro" id="top"><div className="house-intro__copy"><p>MODERN LUXURY / TWO STOREYS / PRIVATE RESIDENCE</p><h1>LIVE<br />ABOVE<br />EXPECTATION.</h1><span>Scroll to enter the house.</span></div></section>
      <div className="house-story" ref={storyRef}>
        {HOUSE_CHAPTERS.map((chapter, index) => <section id={chapter.id} key={chapter.id} className={`house-chapter ${index === HOUSE_CHAPTERS.length - 1 ? "house-chapter--cta" : ""}`} style={{ minHeight: `${Math.max((chapter.end - chapter.start) * HOUSE_SEQUENCE.scrollHeightVh, 54)}vh` }}>
          {!mobile && <div ref={(node) => { overlayRefs.current[chapter.id] = node; }} className="house-chapter__overlay"><p>{chapter.kicker}</p><h2>{chapter.title}</h2><span>{chapter.description}</span></div>}
          {mobile && <div className="house-mobile-shot"><div className="house-mobile-shot__media"><video ref={(node) => { mobileVideoRefs.current[chapter.id] = node; }} muted loop playsInline preload="metadata" poster={HOUSE_SEQUENCE.poster} src={chapter.mobileVideo} /></div><div className="house-mobile-shot__copy"><p>{chapter.kicker}</p><h2>{chapter.title}</h2><span>{chapter.description}</span></div></div>}
          {index === 0 && !mobile && <span className="house-scroll-meter">SCROLL / 00—08</span>}
        </section>)}
      </div>
      <footer className="house-footer"><div><p>PRIVATE RESIDENCE</p><strong>Schedule a Private Tour</strong><span>Walk the spaces, materials and proportions in person.</span></div><div className="house-footer__actions"><a href="mailto:hello@example.com?subject=Private%20Tour%20Inquiry">Inquire Now</a><a href="tel:+000000000">Call the Residence</a></div></footer>
    </main>
  );
}
