"use client";

import type { MutableRefObject } from "react";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type CinematicScrollRuntime,
  setCinematicScroll,
} from "@/lib/cinematic/scroll-state";

export type CinematicDirectorProps = {
  runtimeRef: MutableRefObject<CinematicScrollRuntime>;
};

gsap.registerPlugin(ScrollTrigger);

export default function CinematicDirector({ runtimeRef }: CinematicDirectorProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      const updateNativeScroll = () => {
        const limit = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          0
        );
        const scroll = window.scrollY;
        const progress = limit > 0 ? scroll / limit : 0;
        runtimeRef.current = {
          ...runtimeRef.current,
          progress,
          scroll,
          limit,
          velocity: 0,
        };
        setCinematicScroll(runtimeRef.current);
      };

      updateNativeScroll();
      window.addEventListener("scroll", updateNativeScroll, { passive: true });
      window.addEventListener("resize", updateNativeScroll);

      return () => {
        window.removeEventListener("scroll", updateNativeScroll);
        window.removeEventListener("resize", updateNativeScroll);
      };
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });

    const onScroll = (event: {
      scroll: number;
      limit: number;
      velocity: number;
    }) => {
      const limit = Math.max(event.limit, 0);
      const progress = limit > 0 ? event.scroll / limit : 0;
      runtimeRef.current = {
        ...runtimeRef.current,
        progress,
        scroll: event.scroll,
        limit,
        velocity: event.velocity,
      };
      setCinematicScroll(runtimeRef.current);
      ScrollTrigger.update();
    };

    lenis.on("scroll", onScroll);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
      runtimeRef.current = {
        ...runtimeRef.current,
        time,
      };
      setCinematicScroll(runtimeRef.current);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [runtimeRef]);

  return null;
}
