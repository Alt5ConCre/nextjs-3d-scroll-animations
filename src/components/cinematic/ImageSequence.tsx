"use client";

import { useEffect, useRef } from "react";

export type ImageSequenceProps = {
  frames: string[];
  progress: number;
  poster?: string;
  priority?: number;
  className?: string;
};

export function ImageSequence({
  frames,
  progress,
  poster,
  priority = 8,
  className = "",
}: ImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());

  useEffect(() => {
    if (!frames.length) return;

    const cache = imagesRef.current;
    const load = (index: number) => {
      if (index < 0 || index >= frames.length || cache.has(index)) return;
      const image = new Image();
      image.decoding = "async";
      image.src = frames[index];
      cache.set(index, image);
    };

    load(0);
    for (let i = 1; i <= Math.min(priority, frames.length - 1); i += 1) load(i);

    return () => {
      cache.clear();
    };
  }, [frames, priority]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frames.length) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const index = Math.min(
      frames.length - 1,
      Math.max(0, Math.round(progress * (frames.length - 1)))
    );

    const loadFrame = (frameIndex: number) => {
      let image = imagesRef.current.get(frameIndex);
      if (!image) {
        image = new Image();
        image.decoding = "async";
        image.src = frames[frameIndex];
        imagesRef.current.set(frameIndex, image);
      }

      if (!image.complete) {
        image.onload = () => draw(image!);
        return;
      }
      draw(image);
    };

    const draw = (image: HTMLImageElement) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      const scale = Math.max(rect.width / image.width, rect.height / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      const x = (rect.width - width) / 2;
      const y = (rect.height - height) / 2;
      context.drawImage(image, x, y, width, height);
    };

    loadFrame(index);

    for (let i = 1; i <= Math.min(priority, frames.length - 1); i += 1) {
      const next = index + i;
      const previous = index - i;
      if (next < frames.length) loadFrame(next);
      if (previous >= 0) loadFrame(previous);
    }
  }, [frames, progress, priority]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        backgroundImage: poster ? `url(${poster})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-hidden="true"
    />
  );
}
