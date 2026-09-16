# Cinematic Scroll-Video & Apple-Style Scrubbing References

## Purpose
These repositories and implementation references are approved technical references for the Cinematic Engine. The target behavior is scroll-controlled cinematic playback: scroll position drives video time or an exact frame index, while the real-time 3D scene can continue animating independently.

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
| mkurtic/apfel-sequence | https://github.com/mkurtic/apfel-sequence | Framework-agnostic HTML5 Canvas image-sequence scroller with breakpoint-specific sequences and eager/lazy buffering | Reference for a reusable sequence engine with responsive asset selection and buffering |
| iam-saiteja/react-scroll-media | https://github.com/iam-saiteja/react-scroll-media | React cinematic image sequences using sticky positioning, deterministic progress-to-frame mapping and lazy/eager loading | Reference for production-friendly React sequence APIs and native sticky scrolling |
| alfzilham/apple-scroll-hud | https://github.com/alfzilham/apple-scroll-hud | Apple-style Canvas frame sequencer with Lenis, React App Router and mobile fallback | Reference for HUD overlays, decoupled RAF rendering and responsive Apple-style composition |
| steveharrison/scroll-video | https://github.com/steveharrison/scroll-video | Vanilla JS sticky video scrub using currentTime, rAF scroll handling and keyframe-optimized video | Reference for instant-seek video encoding and chapter-based scroll-video narratives |
| vnglst/scroll-video | https://github.com/vnglst/scroll-video | Svelte scroll position mapped directly to video currentTime | Reference for the simplest vanilla reactive video-time mapping model |
| davillafer/airpods | https://github.com/davillafer/airpods | Astro + GSAP + Tailwind; AirPods-style scroll animation with Canvas | Reference for a recent AirPods-specific cinematic composition and integration style |
| shajith23/bmw | https://github.com/shajith23/bmw | Next.js + Canvas image sequence + Framer Motion + Lenis + Web Audio | Reference for a premium real-world product showcase using a production-style image sequence and telemetry UI |
| prompt-craft scroll-video references | https://github.com/xcsweb/prompt-craft/blob/main/references/artistic-website-dna.md | Documented patterns for HTML5 video scrub and Canvas frame-sequence scrub | Reference for reusable visual-system decisions and parameter ranges |

## Direct implementation references

### GSAP official imageSequenceScrub helper
https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/

GSAP's official helper demonstrates the canonical pattern: animate a `frame` playhead from 0 to the final frame with `ease: none`, attach a scrubbed ScrollTrigger, and draw the corresponding frame to Canvas on update. This is the baseline we should preserve conceptually while adding our production loading/performance layers. citeturn432230search8

### GSAP + Canvas sequence example
https://gist.github.com/wllcyg/4e0c2341328871baf92df18d5703e248

The example is explicitly based on a CodePen/GSAP helper and demonstrates Apple AirPods-style scroll image sequencing, with a reusable `imageSequence()` helper and a fixed Canvas. citeturn432230search1

## What the latest research adds

### Canvas sequence is still the primary film-plate path
Felix's Next.js example uses a sticky Canvas, a numbered frame sequence, Lenis and direct scroll-to-frame mapping. citeturn284879search2

`mkurtic/apfel-sequence` strengthens the architecture with breakpoint-specific sequences and eager/lazy buffering, which maps directly to our responsive asset-tier plan. citeturn432230search6

`iam-saiteja/react-scroll-media` reinforces native sticky positioning, deterministic 1:1 scroll-to-frame control and eager/lazy loading as a production-friendly React pattern. citeturn432230search9

`alfzilham/apple-scroll-hud` adds a useful interaction layer: decoupled RAF rendering, Lenis, React App Router and mobile fallback, while keeping the Apple-style Canvas sequence as the central film mechanism. citeturn432230search4

### Video scrubbing remains a secondary adapter
`steveharrison/scroll-video` shows a pure HTML5-video architecture where scroll progress maps to `video.currentTime` and the source video is encoded with every frame as a keyframe (`-g 1`) to improve random seeking. It also uses blob loading to keep the video readily seekable. citeturn284879search0

`Heramb1221/shingeki` demonstrates the same `currentTime` technique inside React + GSAP and notes the need to wait for usable video metadata before creating the ScrollTrigger. citeturn284879search3

`vnglst/scroll-video` provides the minimal formula `currentTime = duration * scrollY / total scroll height`, making it a clean fallback/reference implementation. citeturn284879search1

## Search coverage requested on 2026-09-16

Queries reviewed:
1. `"scroll scrubbing" video github`
2. `"apple style scroll" canvas animation github`
3. `GSAP ScrollTrigger video currentTime github`
4. `"frame by frame scroll" canvas sequence github`
5. `"scrollytelling" video javascript`
6. `apple airpods clone scroll animation github`
7. `"canvas image sequence" scroll github`

Additional targeted searches were run for GSAP `video.currentTime`, AirPods/canvas implementations, Lenis/canvas sequence combinations, and React/Next.js variants.

## What we should implement

### Preferred production path: Canvas film plate
1. Source animation/video is rendered offline into numbered JPG/WebP frames.
2. Scroll progress is normalized from 0..1.
3. Progress maps directly to `frameIndex`.
4. Canvas renders the exact frame.
5. Preloading uses poster/low-resolution -> nearby frames -> full sequence.
6. Reverse scrolling is naturally deterministic.
7. Mobile uses lower-resolution and/or reduced-frame tiers.
8. Breakpoint-specific sequences can be supplied when composition/aspect ratio changes materially.
9. Native sticky positioning remains the default layout strategy so browser scrolling is not replaced with a custom scroll-jacking implementation.

### Secondary path: real video scrub
1. Scroll progress is normalized from 0..1.
2. `video.currentTime = progress * video.duration` with guarded seeking.
3. Use throttling/interpolation or a seek-serialization strategy when needed.
4. Prefer all-keyframe encoding for sequences where random seeking is critical.
5. Use Canvas/WebCodecs when supported for smoother decoding and to reduce visible seek stalls.
6. Keep HTML5 video as the compatibility fallback.
7. Use this for longer footage where a full frame sequence would be too large.

## Current implementation mapping in our repo

- `src/components/cinematic/ImageSequence.tsx`: production Canvas film-plate component; now includes staged loading, adjacent prefetch, resize-safe rendering, mobile frame tiers, hold zones and micro-animation.
- `src/components/cinematic/VideoScrubber.tsx`: production video-currentTime adapter.
- `src/components/cinematic/CinematicDirector.tsx`: Lenis + GSAP transport and centralized normalized progress.
- `src/components/cinematic/CinematicEngine.tsx`: persistent R3F renderer with independent `useFrame` motion, MacBook GLB, particles, lighting and postprocessing.
- `src/lib/cinematic/scroll-state.ts`: shared runtime state contract.

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
Expanded search coverage reviewed and integrated on 2026-09-16. This document is the canonical reference list to consult before implementing or refactoring scroll-video / frame-sequence features.
