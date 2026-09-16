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
| vnglst/scroll-video | https://github.com/vnglst/scroll-video | Svelte scroll position mapped directly to video currentTime | Reference for the simplest reactive video-time mapping model |
| davillafer/airpods | https://github.com/davillafer/airpods | Astro + GSAP + Tailwind; AirPods-style scroll animation with Canvas | Reference for a recent AirPods-specific cinematic composition and integration style |
| shajith23/bmw | https://github.com/shajith23/bmw | Next.js + Canvas image sequence + Framer Motion + Lenis + Web Audio | Reference for a premium real-world product showcase using a production-style image sequence and telemetry UI |
| basementstudio/scrollytelling | https://github.com/basementstudio/scrollytelling | React + GSAP ScrollTrigger; ImageSequenceCanvas, Waypoints, labels and Lenis examples | Reference for abstracting ScrollTrigger into React-friendly chapter/waypoint primitives; includes live demo and StackBlitz/CodeSandbox examples |
| sagarparmarr/genx | https://github.com/sagarparmarr/genx | Next.js + Canvas + 192-frame WebP sequence; lerp/spring, CDN-ready assets | Reference for ref-based animation state, CDN asset loading and responsive product-sequence architecture |
| pdrohp/scroll-frame-hero | https://github.com/pdrohp/scroll-frame-hero | Canvas frame-sequence hero + FFmpeg extractor + asset inliner | Reference for a tiny portable film-plate build and media preparation pipeline |
| artem-techman/scroll-attached-website | https://github.com/artem-techman/scroll-attached-website | Next.js-oriented reusable skill; AI video -> extracted frames -> Canvas scroll hero | Reference for automating the entire source-video-to-scroll-site pipeline and reusable hero structure |
| zero-to-mastery/coding_challenge-23 | https://github.com/zero-to-mastery/coding_challenge-23 | Apple AirPods reverse-engineering challenge with scroll-driven animation ideas | Historical reference for AirPods-style interaction patterns; use technique only, not Apple assets |
| NickMezacapa/Apple-AirPod-Pro-Rebuild | https://github.com/NickMezacapa/Apple-AirPod-Pro-Rebuild | HTML canvas + requestAnimationFrame + image sequence | Direct AirPods-style Canvas frame rendering reference and indexing model |
| loopspeed/loopspeed-blog | https://github.com/loopspeed/loopspeed-blog | Next.js/React Canvas image sequence with ScrollTrigger and sticky pinned content | Reference for async frame loading, ScrollTrigger progress-to-frame updates, and product-header composition |
| freshtechbro/claudedesignskills | https://github.com/freshtechbro/claudedesignskills | GSAP reference patterns including Canvas imageSequence + ScrollTrigger | Reference for canonical GSAP playhead/snap implementation and reusable timeline patterns |
| TidyFactor/Cinematic | https://github.com/TidyFactor/Cinematic | Luxury cinematic landing-page workflow with GSAP, Lenis and scrubbed Canvas films | Reference for reusable command/workflow organization and cinematic product-page authoring |
| tsogjavklann/awwwards-3d | https://github.com/tsogjavklann/awwwards-3d | Three.js + GSAP + Lenis; GLB, spline-camera, glass/transmission, post-processing templates | Reference for real 3D product/world archetypes, HDR/ACES effects and single-canvas cinematic rendering |
| ShAuRyA-Noodle/ThreeJS-Celestial-Forge | https://github.com/ShAuRyA-Noodle/ThreeJS-Celestial-Forge | Three.js + GSAP ScrollTrigger + Lenis + particles + clip-path transitions | Reference for cinematic 3D hero choreography, particle fields and section transitions |
| Rohithpranov07/Portfolio-cinematic | https://github.com/Rohithpranov07/Portfolio-cinematic | React/Next-style cinematic chapter architecture with Lenis + GSAP and lazy-loaded heavy scenes | Reference for persistent scroll transport, scene/chapter composition and code splitting |
| aidansoto/Animated-Website-Designer | https://github.com/aidansoto/Animated-Website-Designer | React + R3F + GSAP + ScrollTrigger + Lenis, with engineering guardrails | Reference for reusable prompts/patterns, mobile performance tiers and reduced-motion guardrails |
| Kavtuai/lattice-drift | https://github.com/Kavtuai/lattice-drift | React + TypeScript + GSAP + Lenis + Three.js with mutable motion state and instancing | Reference for keeping animation state out of React renders and efficient repeated geometry |
| prompt-craft/references/artistic-website-dna.md | https://github.com/xcsweb/prompt-craft/blob/main/references/artistic-website-dna.md | Documented HTML5 video scrub + Canvas frame-sequence scrub + physics transition patterns | Reference for choosing between video scrub, frame plates, and physics-driven transformations |

## Direct implementation references

### GSAP official imageSequenceScrub helper
https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/

GSAP's official helper demonstrates the canonical pattern: animate a `frame` playhead from 0 to the final frame with `ease: none`, attach a scrubbed ScrollTrigger, and draw the corresponding frame to Canvas on update. This is the conceptual baseline; our production player adds staged loading, mobile tiers, nearest-frame fallback and hold micro-motion. citeturn358914search12

### GSAP + Canvas sequence example
https://gist.github.com/wllcyg/4e0c2341328871baf92df18d5703e248

The example is explicitly a CodePen/GSAP image-sequence helper and demonstrates a reusable `imageSequence()` playhead plus Canvas rendering. citeturn358914search12

## Search coverage requested on 2026-09-16

Queries reviewed:
1. `"scroll scrubbing" video github`
2. `"apple style scroll" canvas animation github`
3. `GSAP ScrollTrigger video currentTime github`
4. `"frame by frame scroll" canvas sequence github`
5. `"scrollytelling" video javascript`
6. `apple airpods clone scroll animation github`
7. `"canvas image sequence" scroll github`

Additional targeted searches were run for:
- GSAP `video.currentTime` and scroll-driven video scrub
- AirPods/Apple-style Canvas implementations
- Next.js/React Canvas image sequences
- Lenis + GSAP + Canvas combinations
- Three.js/R3F cinematic product websites
- scroll velocity and mutable animation state
- CDN/frame extraction and mobile loading strategies
- reusable cinematic coding-agent/workflow repositories

## Key research conclusions

### 1. Canvas frame sequences are the preferred deterministic film plate
`FelixVerdianto17/canvas-scroll-sequence` uses Next.js App Router, Lenis and a numbered Canvas sequence for a product landing page. citeturn297535search0

`mkurtic/apfel-sequence` adds responsive breakpoint-specific sequences plus eager/lazy buffering. citeturn297535search4

`iam-saiteja/react-scroll-media` provides a production-style sticky container, direct progress-to-frame mapping, eager/lazy strategies, accessibility and reduced-motion behavior. citeturn515649search7

`SagarParmarr/genx` emphasizes bidirectional 192-frame WebP scrubbing, ref-based state with no React renders per frame, DPR clamping and CDN hosting. citeturn825710search2

`shajith23/bmw` demonstrates a complete product experience around a 192-frame Canvas sequence, Lenis, telemetry UI, responsive layout and audio. citeturn825710search0

### 2. Native sticky scrolling is an important default
The newer frame-sequence references repeatedly use a tall scroll track with a sticky viewport instead of replacing native scrolling with scroll-jacking. `react-scroll-media` explicitly derives progress from container/viewport geometry and updates the frame in an animation loop. citeturn515649search7

### 3. Video currentTime is useful, but it is a secondary adapter
`dkaoster/scrolly-video` supports externally controlled playback and documents HTML5 `currentTime` as a compatibility method; it notes that random seeking can require keyframe-every-frame encoding and has platform caveats. citeturn515649search4

`steveharrison/scroll-video` uses a sticky 700vh runway, direct `currentTime = progress * duration`, all-frame keyframes (`-g 1`) and blob loading for seekability. citeturn825710search6

`Heramb1221/shingeki` demonstrates `video.currentTime` scrubbing inside a React/GSAP cinematic composition. citeturn358914search8

### 4. Decouple scroll state from rendering
`alfzilham/apple-scroll-hud` explicitly separates scroll/index updates from the RAF drawing loop; it combines Lenis, App Router, Canvas and responsive fallback behavior. citeturn358914search4

`Kavtuai/lattice-drift` similarly keeps mutable motion state outside React rendering and updates Three.js instances in place. citeturn660434search3

### 5. Reusable chapter/waypoint abstractions are valuable
`basementstudio/scrollytelling` abstracts GSAP ScrollTrigger for React, exposes `Waypoint`, labels, an `ImageSequenceCanvas` helper and has a live demo plus StackBlitz/CodeSandbox examples. citeturn825710search3

### 6. The real 3D layer should remain separate from the film plate
`tsogjavklann/awwwards-3d` provides reusable Three.js/GSAP/Lenis patterns for GLB product showcases, spline-camera walkthroughs, glass transmission and cinematic post-processing. citeturn660434search0turn660434search7

`ShAuRyA-Noodle/ThreeJS-Celestial-Forge` combines particles, GSAP, Lenis and section transitions and is useful as a reference for the real-time scene layer, not as code to copy. citeturn660434search1

### 7. Media preparation deserves to be part of the engine
`pdrohp/scroll-frame-hero` packages FFmpeg frame extraction and an asset-inlining pipeline around a Canvas scroll hero. citeturn825710search4

`artem-techman/scroll-attached-website` goes further by treating video/image generation, frame extraction and Next.js scaffolding as one reusable pipeline. citeturn825710search1

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
9. Native sticky positioning remains the default layout strategy so browser scrolling is not replaced with custom scroll-jacking.
10. RAF handles rendering while scroll state only changes the desired frame.
11. Hold zones can keep a chosen film frame visually alive with subtle independent micro-motion.

### Secondary path: real video scrub
1. Scroll progress is normalized from 0..1.
2. `video.currentTime = progress * video.duration` with guarded seeking.
3. Use throttling/interpolation or seek serialization when needed.
4. Prefer all-keyframe encoding for sequences where random seeking is critical.
5. Use Canvas/WebCodecs where supported for smoother decoding.
6. Keep HTML5 video as compatibility fallback.
7. Use this for longer footage where a full frame sequence would be too large.

### Real-time 3D layer
1. Keep R3F `useFrame` independent from scroll.
2. Scroll can drive camera waypoints and chapter transforms, but object idle motion continues after scrolling stops.
3. Use GLB + Draco/Meshopt/KTX2 where appropriate.
4. Use one persistent/shared WebGL canvas rather than creating competing render contexts.
5. Use post-processing selectively: bloom, vignette, grain, depth-of-field only where the visual benefit justifies cost.
6. Use instancing/LOD/adaptive DPR for repeated or heavy scenes.

## Current implementation mapping in our repo

- `src/components/cinematic/ImageSequence.tsx`: production Canvas film-plate component; staged loading, adjacent prefetch, resize-safe rendering, mobile frame tiers, hold zones and micro-animation.
- `src/components/cinematic/VideoScrubber.tsx`: production video-currentTime adapter.
- `src/components/cinematic/CinematicDirector.tsx`: Lenis + GSAP transport and centralized normalized progress.
- `src/components/cinematic/CinematicEngine.tsx`: persistent R3F renderer with independent `useFrame` motion, MacBook GLB, particles, lighting and postprocessing.
- `src/lib/cinematic/scroll-state.ts`: shared runtime state contract.

## Integration rule
Do not replace the current engine with a copied repository. Preserve the existing MacBook GLBs, legacy Scene concepts, CinematicDirector, R3F independent `useFrame` motion, centralized scroll state, performance director, chapter system and postprocessing. Integrate proven ideas through adapters/components.

## Licensing
Treat every repo as a technical reference unless its license is verified. Before copying code, inspect the repository license and preserve required notices/attribution. Implement our own architecture by default. Do not copy Apple assets, branding or proprietary code.

## Research status
Expanded GitHub search coverage reviewed and integrated on 2026-09-16. This document is the canonical reference list to consult before implementing or refactoring scroll-video, frame-sequence, cinematic WebGL, or Apple-style product-page features.
