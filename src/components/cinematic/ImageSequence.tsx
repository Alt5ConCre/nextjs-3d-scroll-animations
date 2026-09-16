"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

export type ImageSequenceHoldZone = {
  start: number;
  end: number;
  amplitude?: number;
  frequency?: number;
  driftX?: number;
  driftY?: number;
};

export type ImageSequenceProps = {
  frames: string[];
  progress: number;
  poster?: string;
  priority?: number;
  prefetchRadius?: number;
  backgroundBatch?: number;
  mobileFrames?: string[];
  mobileBreakpoint?: number;
  mobileFrameStep?: number;
  quality?: "auto" | "high" | "low";
  fit?: "cover" | "contain";
  holdZones?: ImageSequenceHoldZone[];
  time?: number;
  onFrameChange?: (frameIndex: number, totalFrames: number) => void;
  onLoadStage?: (stage: 1 | 2 | 3) => void;
  className?: string;
};

type DrawOptions = {
  rect: DOMRect;
  dpr: number;
  fit: "cover" | "contain";
  offsetX: number;
  offsetY: number;
  scaleBoost: number;
};

type IdleCallbackWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function findHoldZone(progress: number, zones: ImageSequenceHoldZone[]) {
  return zones.find((zone) => progress >= zone.start && progress <= zone.end);
}

function isLowTier(quality: "auto" | "high" | "low", breakpoint: number) {
  if (quality === "high") return false;
  if (quality === "low") return true;
  return window.innerWidth <= breakpoint || window.matchMedia("(pointer: coarse)").matches;
}

export function ImageSequence({
  frames,
  progress,
  poster,
  priority = 8,
  prefetchRadius = 5,
  backgroundBatch = 12,
  mobileFrames,
  mobileBreakpoint = 768,
  mobileFrameStep = 2,
  quality = "auto",
  fit = "cover",
  holdZones = [],
  time = 0,
  onFrameChange,
  onLoadStage,
  className = "",
}: ImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingRef = useRef<Set<number>>(new Set());
  const activeFramesRef = useRef<string[]>(frames);
  const frameStepRef = useRef(1);
  const requestedFrameRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const drawRafRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const qualityFrames = useMemo(() => {
    if (quality === "high" || !mobileFrames?.length) return frames;
    if (quality === "low") return mobileFrames;
    return frames;
  }, [frames, mobileFrames, quality]);

  useEffect(() => {
    activeFramesRef.current = qualityFrames;
  }, [qualityFrames]);

  const draw = useCallback((image: HTMLImageElement, options: DrawOptions) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const { rect, dpr, fit: fitMode, offsetX, offsetY, scaleBoost } = options;
    const renderDpr = Math.max(0.75, Math.min(2, dpr * scaleBoost));
    const pixelWidth = Math.max(1, Math.round(rect.width * renderDpr));
    const pixelHeight = Math.max(1, Math.round(rect.height * renderDpr));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    context.setTransform(renderDpr, 0, 0, renderDpr, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);

    const scale = fitMode === "contain"
      ? Math.min(rect.width / image.width, rect.height / image.height)
      : Math.max(rect.width / image.width, rect.height / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const x = (rect.width - width) / 2 + offsetX;
    const y = (rect.height - height) / 2 + offsetY;

    context.drawImage(image, x, y, width, height);
  }, []);

  const loadFrame = useCallback((index: number) => {
    const active = activeFramesRef.current;
    const cache = imagesRef.current;
    const loading = loadingRef.current;
    if (!mountedRef.current || index < 0 || index >= active.length || cache.has(index) || loading.has(index)) return;

    const src = active[index];
    if (!src) return;

    const image = new Image();
    image.decoding = "async";
    loading.add(index);
    image.onload = () => {
      loading.delete(index);
      cache.set(index, image);
    };
    image.onerror = () => loading.delete(index);
    image.src = src;
  }, []);

  const requestFrame = useCallback((index: number, force = false) => {
    const active = activeFramesRef.current;
    if (!active.length || !canvasRef.current) return;

    const clamped = clamp(Math.round(index), 0, active.length - 1);
    requestedFrameRef.current = clamped;

    const render = () => {
      drawRafRef.current = null;
      const requested = requestedFrameRef.current;
      const cache = imagesRef.current;
      let image = cache.get(requested);

      if (!image) {
        for (let distance = 1; distance < active.length; distance += 1) {
          const before = cache.get(requested - distance);
          const after = cache.get(requested + distance);
          if (before) {
            image = before;
            break;
          }
          if (after) {
            image = after;
            break;
          }
          if (distance > prefetchRadius + 2) break;
        }
      }

      if (!image) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const zone = findHoldZone(clamp(progress, 0, 1), holdZones);
      const amplitude = zone?.amplitude ?? 0;
      const phase = time * Math.PI * 2;
      const frequency = zone?.frequency ?? 0.25;
      const offsetX = Math.sin(phase * frequency) * (zone?.driftX ?? 0) + Math.sin(phase * 0.18) * amplitude;
      const offsetY = Math.cos(phase * frequency) * (zone?.driftY ?? 0);
      const scaleBoost = 1 + Math.sin(phase * 0.24) * amplitude * 0.002;
      const low = isLowTier(quality, mobileBreakpoint);

      draw(image, {
        rect,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        fit,
        offsetX,
        offsetY,
        scaleBoost: (low ? 0.92 : 1) * scaleBoost,
      });

      if (requested !== renderedFrameRef.current) {
        renderedFrameRef.current = requested;
        onFrameChange?.(requested, active.length);
      }
    };

    if (force) {
      if (drawRafRef.current != null) cancelAnimationFrame(drawRafRef.current);
      render();
    } else if (drawRafRef.current == null) {
      drawRafRef.current = requestAnimationFrame(render);
    }
  }, [draw, fit, holdZones, mobileBreakpoint, onFrameChange, prefetchRadius, progress, quality, time]);

  useEffect(() => {
    if (!frames.length) return;

    mountedRef.current = true;
    const active = qualityFrames;
    const cache = imagesRef.current;
    const loading = loadingRef.current;
    const low = isLowTier(quality, mobileBreakpoint);
    frameStepRef.current = low ? Math.max(1, mobileFrameStep) : 1;

    cache.clear();
    loading.clear();
    renderedFrameRef.current = -1;
    onLoadStage?.(1);

    loadFrame(0);
    const firstCount = Math.min(priority, Math.max(0, active.length - 1));
    for (let i = 1; i <= firstCount; i += 1) loadFrame(i * frameStepRef.current);

    let disposed = false;
    const stageTwo = window.setTimeout(() => {
      if (disposed) return;
      onLoadStage?.(2);
      const center = clamp(Math.round(clamp(progress, 0, 1) * Math.max(0, active.length - 1)), 0, Math.max(0, active.length - 1));
      for (let offset = 1; offset <= prefetchRadius; offset += 1) {
        loadFrame(center + offset * frameStepRef.current);
        loadFrame(center - offset * frameStepRef.current);
      }
    }, 100);

    let idleId: number | null = null;
    let timerId: number | null = null;
    let cursor = 0;
    const stageThree = () => {
      if (disposed) return;
      onLoadStage?.(3);
      const browser = window as IdleCallbackWindow;
      const pump = (deadline?: IdleDeadline) => {
        if (disposed) return;
        let added = 0;
        while (cursor < active.length && added < Math.max(1, backgroundBatch)) {
          if (deadline && deadline.timeRemaining() <= 0 && added > 0) break;
          const index = cursor++;
          if (index % frameStepRef.current === 0) {
            loadFrame(index);
            added += 1;
          }
        }
        if (cursor < active.length) {
          if (browser.requestIdleCallback) {
            idleId = browser.requestIdleCallback(pump, { timeout: 250 });
          } else {
            timerId = window.setTimeout(() => pump(), 16);
          }
        }
      };
      pump();
    };

    const stageThreeDelay = window.setTimeout(stageThree, 350);

    return () => {
      disposed = true;
      window.clearTimeout(stageTwo);
      window.clearTimeout(stageThreeDelay);
      const browser = window as IdleCallbackWindow;
      if (idleId != null && browser.cancelIdleCallback) browser.cancelIdleCallback(idleId);
      if (timerId != null) window.clearTimeout(timerId);
      cache.clear();
      loading.clear();
    };
  }, [backgroundBatch, frames.length, loadFrame, mobileBreakpoint, mobileFrameStep, onLoadStage, prefetchRadius, priority, progress, quality, qualityFrames]);

  useEffect(() => {
    const active = activeFramesRef.current;
    if (!active.length) return;
    const index = clamp(Math.round(clamp(progress, 0, 1) * Math.max(0, active.length - 1)), 0, Math.max(0, active.length - 1));
    requestFrame(index);

    for (let offset = 1; offset <= prefetchRadius; offset += 1) {
      loadFrame(index + offset * frameStepRef.current);
      loadFrame(index - offset * frameStepRef.current);
    }
  }, [loadFrame, prefetchRadius, progress, requestFrame, qualityFrames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const active = activeFramesRef.current;
      if (!active.length) return;
      requestFrame(clamp(Math.round(clamp(progress, 0, 1) * (active.length - 1)), 0, active.length - 1), true);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });

    let raf: number | null = null;
    const animateHold = () => {
      if (!mountedRef.current) return;
      if (findHoldZone(clamp(progress, 0, 1), holdZones)) {
        const active = activeFramesRef.current;
        if (active.length) requestFrame(clamp(Math.round(clamp(progress, 0, 1) * (active.length - 1)), 0, active.length - 1));
        raf = requestAnimationFrame(animateHold);
      }
    };
    animateHold();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      if (raf != null) cancelAnimationFrame(raf);
      if (drawRafRef.current != null) cancelAnimationFrame(drawRafRef.current);
    };
  }, [holdZones, progress, requestFrame]);

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
