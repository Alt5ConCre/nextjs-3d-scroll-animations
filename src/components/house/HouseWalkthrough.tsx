"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CinematicDirector from "@/components/cinematic/CinematicDirector";
import type { CinematicScrollRuntime } from "@/lib/cinematic/scroll-state";
import { HOUSE_CHAPTERS, HOUSE_SEQUENCE, frameSrc } from "./house-config";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function HouseWalkthrough() {
  const runtimeRef = useRef<CinematicScrollRuntime>({ progress: 0, velocity: 0, scroll: 0, limit: 0, time: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const requestedFrameRef = useRef(0);
  const renderedFrameRef = useRef(0);
  const renderRafRef = useRef<number | null>(null);
  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(HOUSE_CHAPTERS[0].id);

  const frames = useMemo(() => Array.from({ length: HOUSE_SEQUENCE.frameCount }, (_, i) => frameSrc(i)), []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const image = imagesRef.current[index] || imagesRef.current.find(Boolean);
    if (!canvas || !image?.naturalWidth) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const targetWidth = Math.floor(width * dpr);
    const targetHeight = Math.floor(height * dpr);
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const viewportRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;
    if (imageRatio > viewportRatio) {
      drawHeight = height;
      drawWidth = height * imageRatio;
    } else {
      drawWidth = width;
      drawHeight = width / imageRatio;
    }
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    renderedFrameRef.current = index;
  }, []);

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
    let cancelled = false;
    document.body.style.overflow = "hidden";

    const loadAllFrames = async () => {
      let cursor = 0;
      let completed = 0;
      const loaded = new Array<HTMLImageElement>(frames.length);
      const worker = async () => {
        while (!cancelled) {
          const index = cursor++;
          if (index >= frames.length) return;
          const image = new Image();
          image.decoding = "async";
          image.src = frames[index];
          try {
            await image.decode();
          } catch {
            await new Promise<void>((resolve) => {
              image.onload = () => resolve();
              image.onerror = () => resolve();
            });
          }
          if (image.naturalWidth) loaded[index] = image;
          completed += 1;
          if (!cancelled) setLoadProgress(completed / frames.length);
        }
      };
      await Promise.all(Array.from({ length: 8 }, worker));
      if (cancelled) return;
      imagesRef.current = loaded;
      setReady(true);
      document.body.style.overflow = "";
    };
    void loadAllFrames();
    return () => {
      cancelled = true;
      document.body.style.overflow = "";
    };
  }, [frames, mobile]);

  useEffect(() => {
    if (!ready || mobile) return;
    const loop = () => {
      const current = renderedFrameRef.current;
      const target = requestedFrameRef.current;
      const next = Math.round(lerp(current, target, 0.2));
      if (next !== current || !imagesRef.current[current]) drawFrame(next);
      renderRafRef.current = requestAnimationFrame(loop);
    };
    renderRafRef.current = requestAnimationFrame(loop);
    return () => {
      if (renderRafRef.current) cancelAnimationFrame(renderRafRef.current);
    };
  }, [drawFrame, mobile, ready]);

  useEffect(() => {
    if (!ready || mobile) return;
    let raf = 0;
    const tick = () => {
      const p = clamp(runtimeRef.current.progress);
      requestedFrameRef.current = Math.round(p * (HOUSE_SEQUENCE.frameCount - 1));
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
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeChapter, mobile, ready]);

  useEffect(() => {
    if (!ready || mobile) return;
    const resize = () => drawFrame(renderedFrameRef.current);
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame, mobile, ready]);

  useEffect(() => {
    if (!mobile) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      });
    }, { threshold: 0.35 });
    Object.values(videoRefs.current).forEach((video) => video && observer.observe(video));
    return () => observer.disconnect();
  }, [mobile]);

  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="house-site">
      <CinematicDirector runtimeRef={runtimeRef} />
      {!mobile && <div className={`house-preloader ${ready ? "house-preloader--done" : ""}`} aria-hidden={ready}>
        <div className="house-preloader__brand">PRIVATE RESIDENCE / 01</div>
        <div className="house-preloader__title">Preparing the walkthrough</div>
        <div className="house-preloader__bar"><span style={{ transform: `scaleX(${loadProgress})` }} /></div>
        <div className="house-preloader__meta">{Math.round(loadProgress * 100)}% / 4K FRAME SEQUENCE</div>
      </div>}

      {!mobile && <div className="house-film" aria-hidden="true"><canvas ref={canvasRef} className="house-film__canvas" /><div className="house-film__vignette" /><div className="house-film__grain" /></div>}

      <header className="house-header"><div>ATELIER RESIDENCE</div><div>PRIVATE VIEWING</div></header>

      {!mobile && <aside className="house-nav" aria-label="House rooms">
        {HOUSE_CHAPTERS.slice(0, -1).map((chapter, index) => (
          <button key={chapter.id} type="button" className={chapter.id === activeChapter ? "is-active" : ""} onClick={() => jumpTo(chapter.id)} aria-label={`Go to ${chapter.navLabel}`}>
            <span>{String(index + 1).padStart(2, "0")}</span><i /><strong>{chapter.navLabel}</strong>
          </button>
        ))}
      </aside>}

      <section className="house-intro" id="top"><div className="house-intro__copy"><p>MODERN LUXURY / TWO STOREYS / PRIVATE RESIDENCE</p><h1>LIVE<br />ABOVE<br />EXPECTATION.</h1><span>Scroll to enter the house.</span></div></section>

      <div className="house-story">
        {HOUSE_CHAPTERS.map((chapter, index) => (
          <section id={chapter.id} key={chapter.id} className={`house-chapter ${index === HOUSE_CHAPTERS.length - 1 ? "house-chapter--cta" : ""}`} style={{ minHeight: `${Math.max((chapter.end - chapter.start) * HOUSE_SEQUENCE.scrollHeightVh, 54)}vh` }}>
            {!mobile && <div ref={(node) => { overlayRefs.current[chapter.id] = node; }} className="house-chapter__overlay"><p>{chapter.kicker}</p><h2>{chapter.title}</h2><span>{chapter.description}</span></div>}
            {mobile && <div className="house-mobile-shot"><div className="house-mobile-shot__media"><video ref={(node) => { videoRefs.current[chapter.id] = node; }} muted loop playsInline preload="metadata" poster={HOUSE_SEQUENCE.poster} src={chapter.mobileVideo} /></div><div className="house-mobile-shot__copy"><p>{chapter.kicker}</p><h2>{chapter.title}</h2><span>{chapter.description}</span></div></div>}
            {index === 0 && !mobile && <span className="house-scroll-meter">SCROLL / 00—08</span>}
          </section>
        ))}
      </div>

      <footer className="house-footer"><div><p>PRIVATE RESIDENCE</p><strong>Schedule a Private Tour</strong><span>Walk the spaces, materials and proportions in person.</span></div><div className="house-footer__actions"><a href="mailto:hello@example.com?subject=Private%20Tour%20Inquiry">Inquire Now</a><a href="tel:+000000000">Call the Residence</a></div></footer>
    </main>
  );
}
