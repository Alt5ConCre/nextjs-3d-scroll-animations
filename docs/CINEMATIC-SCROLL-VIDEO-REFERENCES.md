# Cinematic Scroll-Video & Apple-Style Scrubbing References

## Purpose
These repositories are approved technical references for the Cinematic Engine. The target behavior is scroll-controlled cinematic playback: scroll position drives video time or an exact frame index, while the real-time 3D scene can continue animating independently.

## Reference repos

| Repository | URL | Technique | Use in our engine |
|---|---|---|---|
| dkaoster/scrolly-video | https://github.com/dkaoster/scrolly-video | React/JS scrolly video; external progress drives video time; Canvas/WebCodecs with HTML5 video fallback | Reference for real-video scrubbing, decoding strategy, reusable API and fallback design |
| btahir/react-kino | https://github.com/btahir/react-kino | React VideoScroll; scroll-controlled HTML5 video/currentTime | Reference for a reusable React component API and pinned Apple-like product narratives |
| tangyistudio/scroll-frame-sequence | https://github.com/tangyistudio/scroll-frame-sequence | Exact scroll-to-frame sequence with loading tiers, hold loops and mobile fit/fill/follow modes | Primary reference for deterministic film-plate behavior and asset loading |
| FelixVerdianto17/canvas-scroll-sequence | https://github.com/FelixVerdianto17/canvas-scroll-sequence | Next.js + Lenis + Canvas + numbered JPG frame sequence | Closest reference to our Next.js canvas film-plate integration |
| Relaxkartikey/prior-gsap-animation-portfolio-website-template | https://github.com/Relaxkartikey/prior-gsap-animation-portfolio-website-template | GSAP + Canvas frame scrub + video transitions | Reference for combining Canvas sequences with normal GSAP chapter choreography |
| abhijeet-builds/neverland-agency | https://github.com/abhijeet-builds/neverland-agency | Vanilla Canvas + preloaded WebP frame sequence | Reference for a minimal direct scroll-normalization-to-frame renderer |
| KubeezMedia/kubeez-scroll-world-video | https://github.com/KubeezMedia/kubeez-scroll-world-video | Vanilla JS video currentTime; chained pre-rendered clips; lazy loading/crossfades | Reference for multi-shot cinematic video narratives and clip transitions |
| Heramb1221/shingeki | https://github.com/Heramb1221/shingeki | React + GSAP + video currentTime | Reference for integrating scroll-scrub video into a cinematic React composition |
| azhagan-creator/sih-26 | https://github.com/azhagan-creator/sih-26 | Vanilla JS + GSAP; scroll mapped to video.currentTime with smooth interpolation/fallback | Reference for simple video-time mapping and fallback still imagery |
| itsjwill/motion-primitives-website | https://github.com/itsjwill/motion-primitives-website | Next.js + GSAP + Canvas ImageSequenceScroll | Reference for reusable React/Next.js Canvas sequence components and velocity effects |
| danhnm1203/scrollytelling | https://github.com/danhnm1203/scrollytelling | Video-to-frame extraction/generation for scroll-scrubbed sites | Reference for a tooling pipeline that turns source video into deployable frame sequences |
| mattseq/how-to-scrollytell | https://github.com/mattseq/how-to-scrollytell | Practical GSAP currentTime + Canvas sequence examples | Reference for implementation patterns and educational comparison of both approaches |

## What we should implement

### Preferred production path: Canvas film plate
1. Source animation/video is rendered offline into numbered JPG/WebP frames.
2. Scroll progress is normalized from 0..1.
3. Progress maps directly to `frameIndex`.
4. Canvas renders the exact frame.
5. Preloading uses poster/low-res -> nearby frames -> full sequence.
6. Reverse scrolling is naturally deterministic.
7. Mobile uses lower-resolution and/or reduced-frame tiers.

### Secondary path: real video scrub
1. Scroll progress is normalized from 0..1.
2. `video.currentTime = progress * video.duration` (with throttling/interpolation as appropriate).
3. Use Canvas/WebCodecs where supported for smoother seeking/decoding.
4. Keep HTML5 video fallback for compatibility.
5. Use this for long footage where a frame sequence would be too large.

## Integration rule
Do not replace the current engine with a copied repository. Preserve the existing MacBook GLBs, legacy Scene concepts, CinematicDirector, R3F independent `useFrame` motion, centralized scroll state, performance director, chapter system and postprocessing. Integrate proven ideas through adapters/components.

## Architecture reference

```text
Lenis
  -> normalized scroll state
  -> CinematicDirector / GSAP ScrollTrigger
      -> camera waypoints
      -> chapter timeline
      -> Canvas film plate frame index OR video currentTime
      -> HTML typography / UI
  + R3F useFrame
      -> independent object motion
      -> particles / shaders / lighting / camera breathing
  -> render/postprocessing
  -> adaptive performance tiers
```

## Licensing
Treat every repo as a technical reference unless its license is verified. Before copying code, inspect the repository license and preserve required notices/attribution. Implement our own architecture by default. Do not copy Apple assets, branding or proprietary code.

## Research status
Reviewed as part of the Cinematic Engine reference pass on 2026-09-16. This document is the canonical list to consult before implementing or refactoring scroll-video / frame-sequence features.
