"use client";

import { useEffect, useRef, useState } from "react";
import { HOUSE_CHAPTERS, HOUSE_SEQUENCE } from "./house-config";

export default function HouseWalkthrough() {
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [activeChapter, setActiveChapter] = useState(HOUSE_CHAPTERS[0].id);

  useEffect(() => {
    const videos = Object.values(videoRefs.current).filter(Boolean) as HTMLVideoElement[];
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            setActiveChapter(video.dataset.chapter ?? HOUSE_CHAPTERS[0].id);
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.45 }
    );

    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="house-site house-site--video-only">
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

      <section className="house-intro house-intro--video">
        <div className="house-intro__copy">
          <p>MODERN LUXURY / TWO STOREYS / PRIVATE RESIDENCE</p>
          <h1>LIVE<br />ABOVE<br />EXPECTATION.</h1>
          <span>Scroll to explore the residence.</span>
        </div>
      </section>

      <div className="house-story house-story--video">
        {HOUSE_CHAPTERS.map((chapter, index) => (
          <section
            id={chapter.id}
            key={chapter.id}
            className={`house-chapter house-chapter--video ${index === HOUSE_CHAPTERS.length - 1 ? "house-chapter--cta" : ""}`}
          >
            <div className="house-video-card">
              <div className="house-video-card__media">
                <video
                  ref={(node) => {
                    videoRefs.current[chapter.id] = node;
                  }}
                  data-chapter={chapter.id}
                  muted
                  loop
                  playsInline
                  preload={index === 0 ? "auto" : "metadata"}
                  poster={HOUSE_SEQUENCE.poster}
                  src={chapter.mobileVideo}
                />
                <div className="house-video-card__shade" />
              </div>
              <div className="house-video-card__copy">
                <p>{chapter.kicker}</p>
                <h2>{chapter.title}</h2>
                <span>{chapter.description}</span>
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="house-footer">
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
