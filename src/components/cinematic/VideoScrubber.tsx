"use client";

import { useEffect, useRef } from "react";

export type VideoScrubberProps = {
  src: string;
  progress: number;
  poster?: string;
  preload?: "none" | "metadata" | "auto";
  className?: string;
  muted?: boolean;
  loop?: boolean;
  smoothing?: number;
  onReady?: (duration: number) => void;
  onError?: (error: Event) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function VideoScrubber({
  src,
  progress,
  poster,
  preload = "metadata",
  className = "",
  muted = true,
  loop = false,
  smoothing = 0.2,
  onReady,
  onError,
}: VideoScrubberProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const syncTarget = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        targetTimeRef.current = clamp(progress, 0, 1) * video.duration;
        onReady?.(video.duration);
      }
    };
    video.addEventListener("loadedmetadata", syncTarget);
    syncTarget();
    return () => video.removeEventListener("loadedmetadata", syncTarget);
  }, [onReady, progress, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      targetTimeRef.current = clamp(progress, 0, 1) * video.duration;
    }
  }, [progress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tick = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        const target = clamp(targetTimeRef.current, 0, video.duration);
        const delta = target - video.currentTime;
        if (Math.abs(delta) > 0.002) {
          const amount = clamp(smoothing, 0.01, 1);
          const next = Math.abs(delta) < 0.05 ? target : video.currentTime + delta * amount;
          try {
            video.currentTime = clamp(next, 0, video.duration);
          } catch {
            // Media may not be seekable until the browser has buffered metadata/ranges.
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothing]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      preload={preload}
      muted={muted}
      loop={loop}
      playsInline
      controls={false}
      onError={onError}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}
