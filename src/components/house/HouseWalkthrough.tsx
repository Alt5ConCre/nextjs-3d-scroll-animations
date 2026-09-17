"use client";

import { useEffect, useRef, useState } from "react";
import { HOUSE_CHAPTERS, HOUSE_SEQUENCE } from "./house-config";

export default function HouseWalkthrough() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [activeChapter, setActiveChapter] = useState(HOUSE_CHAPTERS[0].id);

  useEffect(() => {
    const sections = Object.values(sectionRefs.current).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const id = (visible.target as HTMLElement).dataset.chapter;
        if (!id) return;

        setActiveChapter(id);
        const video = videoRefs.current[id];
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => undefined);
        }
      },
      { threshold: [0.35, 0.55, 0.75], rootMargin: "-8% 0px -8% 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (!video) return;
      if (id === activeChapter) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeChapter]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="house-site house-site--video-only house-site--immersive">
      <div className="house-immersive-stage" aria-hidden="true">
        <div className="house-immersive-stage__videos">
          {HOUSE_CHAPTERS.map((chapter, index) => (
            <video
              key={chapter.id}
              ref={(node) => {
                videoRefs.current[chapter.id] = node;
              }}
              className={chapter.id === activeChapter ? "is-active" : ""}
              muted
              loop
              playsInline
              preload={index === 0 ? "auto" : "metadata"}
              poster={HOUSE_SEQUENCE.poster}
              src={chapter.mobileVideo}
            />
          ))}
        </div>
        <div className="house-immersive-stage__veil" />
        <div className="house-immersive-stage__vignette" />
        <div className="house-immersive-stage__grain" />
      </div>

      <header className="house-header">
        <div>ATELIER RESIDENCE</div>
        <div>REAL-ESTATE CINEMATIC WALKTHROUGH</div>
      </header>

      <aside className="house-nav" aria-label="House rooms">
        {HOUSE_CHAPTERS.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            className={chapter.id === activeChapter ? "is-active" : ""}
            onClick={() => jumpTo(chapter.id)}
            aria-label={`Go to ${chapter.navLabel}`}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i />
            <strong>{chapter.navLabel}</strong>
          </button>
        ))}
      </aside>

      <section className="house-intro house-intro--video house-intro--immersive">
        <div className="house-intro__copy">
          <p>MODERN LUXURY / TWO STOREYS / PRIVATE RESIDENCE</p>
          <h1>LIVE<br />ABOVE<br />EXPECTATION.</h1>
          <span>Scroll slowly to move through the residence.</span>
        </div>
        <div className="house-intro__scroll">SCROLL TO ENTER / 01—08</div>
      </section>

      <div className="house-story house-story--video house-story--immersive">
        {HOUSE_CHAPTERS.map((chapter, index) => (
          <section
            id={chapter.id}
            key={chapter.id}
            data-chapter={chapter.id}
            ref={(node) => {
              sectionRefs.current[chapter.id] = node;
            }}
            className={`house-chapter house-chapter--video house-chapter--immersive ${index === HOUSE_CHAPTERS.length - 1 ? "house-chapter--cta" : ""}`}
          >
            <div className="house-immersive-copy">
              <p>{chapter.kicker}</p>
              <h2>{chapter.title}</h2>
              <span>{chapter.description}</span>
              <small>{String(index + 1).padStart(2, "0")} / {String(HOUSE_CHAPTERS.length).padStart(2, "0")}</small>
            </div>
          </section>
        ))}
      </div>

      <footer className="house-footer house-footer--immersive">
        <div>
          <p>PRIVATE RESIDENCE</p>
          <strong>Schedule a Private Tour</strong>
          <span>Explore the architecture, materials and proportions in person.</span>
        </div>
        <div className="house-footer__actions">
          <a href="mailto:hello@example.com?subject=Private%20Tour%20Inquiry">Inquire Now</a>
          <a href="tel:+000000000">Call the Residence</a>
        </div>
      </footer>
    </main>
  );
}
