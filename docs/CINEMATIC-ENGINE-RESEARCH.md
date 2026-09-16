# Cinematic Engine Research & Architecture

## Goal
Build a reusable, premium web experience that can feel like a cinematic video while scrolling, while keeping real-time 3D motion independent from scroll. Scroll must be reversible and scrub-able; when scrolling stops, the 3D scene continues animating.

## Current repository review
The current project is a Next.js App Router project using React 19, React Three Fiber 9 RC, Three.js 0.170, Drei, and GSAP. The current `CinematicEngine` already demonstrates two separate timelines: a scroll-derived camera timeline and an independent `useFrame` animation loop. It currently uses a procedural torus-knot artifact, a ring, particles, transmission material, environment lighting, and Lenis code in the source.

### Current strengths
- Next.js/Vercel-ready structure.
- Client-only WebGL scene isolated from SSR.
- React Three Fiber + Drei foundation.
- Independent render-loop animation already separated from scroll state.
- Scroll progress already affects camera position.
- Responsive CSS and reduced-motion baseline.

### Current gaps
- No production GLB/glTF asset pipeline.
- No DRACO, Meshopt, or KTX2 loader setup.
- No HDRI asset strategy.
- No proper GSAP ScrollTrigger cinematic timeline.
- No R3F scroll-rig / DOM-to-WebGL synchronization.
- No image-sequence canvas system for pre-rendered cinematic shots.
- No post-processing pipeline.
- No adaptive quality/performance monitor.
- No asset preloading/cache strategy.
- No scene/chapter abstraction for reusable client projects.
- No mobile quality tiers.
- No automated visual/performance verification yet.

## Research references

### 1. @14islands/r3f-scroll-rig
https://github.com/14islands/r3f-scroll-rig
Use for DOM/WebGL synchronization, shared GlobalCanvas architecture, viewport tracking, responsive scaling, lazy loading, and Lenis integration. MIT licensed.

### 2. Lenis
https://github.com/darkroomengineering/lenis
Use for smooth scrolling and WebGL synchronization. MIT licensed. Keep scroll handling independent from the real-time 3D animation loop.

### 3. GSAP ScrollTrigger
https://gsap.com/docs/v3/Plugins/ScrollTrigger/
Use for pinned cinematic chapters, scrubbed timelines, labels, reversible progress, snapping where appropriate, and camera/object choreography.

### 4. Three.js GLTFLoader
https://threejs.org/docs/pages/GLTFLoader.html
Production loader supports Draco, Meshopt, KTX2/Basis, WebP/AVIF, transmission, volume, clearcoat, anisotropy, iridescence and other glTF extensions.

### 5. pmndrs/postprocessing
https://github.com/pmndrs/postprocessing
Use selectively for bloom, depth of field, vignette, chromatic aberration, color grading and other cinematic effects. Zlib licensed. Prefer a small effect budget rather than stacking expensive passes.

### 6. React Three Fiber performance guidance
https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx
Use adaptive DPR/performance regression, LOD, nested loading, and on-demand rendering where scenes can rest. Our main scene is intentionally continuously animated, so adaptive quality is more important than demand rendering for the hero.

### 7. Canvas image-sequence references
https://github.com/FelixVerdianto17/canvas-scroll-sequence
https://github.com/ad1tyac0des/Frame-Sequence-Animation
Use the image-sequence technique when the visual must look like a pre-rendered film: numbered frames rendered to a canvas, with scroll position mapped to frame index. This is the primary technique for the most photorealistic 'video while scrolling' moments.

### 8. Scroll-frame-sequence
https://github.com/tangyistudio/scroll-frame-sequence
Reference for scroll-as-frame architecture and multi-stage asset loading. Use the concept, not copied code.

## Chosen architecture

### Layer A — Cinematic Director
GSAP ScrollTrigger controls a normalized `scrollProgress` from 0..1. It drives camera waypoints, section transitions, object transforms that are intentionally scroll-linked, HTML chapter visibility, and image-sequence frames.

### Layer B — Real-Time Actor
R3F `useFrame` runs continuously. It drives independent rotation, mechanical sub-movements, particles, shader uniforms, light animation, subtle camera breathing, and other time-based behavior. This continues when scrolling stops.

### Layer C — Photorealistic Render
Three.js PBR materials + HDR environment lighting + ACES/modern color management + carefully budgeted postprocessing. GLB assets are compressed with Draco/Meshopt and textures with KTX2/Basis where appropriate.

### Layer D — Film Plate
A sticky canvas image-sequence renderer provides pre-rendered Blender/Cinema4D-quality shots for maximum realism. It is reversible and scrub-able because scroll controls the frame rather than video playback.

### Layer E — Performance Director
Use device capability detection, R3F PerformanceMonitor/adaptive DPR, LOD, lazy loading, responsive texture resolution, mobile scene simplification, and reduced-motion fallback. Heavy effects should regress during fast interaction and recover after motion settles.

## Planned project structure

```text
src/
  app/
    page.tsx
    globals.css
  components/
    cinematic/
      CinematicEngine.tsx
      CinematicCanvas.tsx
      CinematicDirector.tsx
      CinematicChapter.tsx
      ScrollTimeline.tsx
      ImageSequence.tsx
      SceneAsset.tsx
      PerformanceDirector.tsx
      effects/
      scenes/
  lib/
    cinematic/
      timeline.ts
      performance.ts
      assets.ts
      device.ts
      math.ts
public/
  models/
  textures/
  hdr/
  sequences/
```

## Build phases

### Phase 1 — Foundation
- Keep Next.js + R3F + Drei + Three.js.
- Install Lenis and synchronize its RAF with the animation system.
- Add GSAP ScrollTrigger and one normalized timeline.
- Create a central cinematic state containing scroll progress, velocity and time.

### Phase 2 — Real asset pipeline
- Add GLTFLoader/DRACO/Meshopt/KTX2 support.
- Add GLB scene abstraction and disposal strategy.
- Add HDR environment loading.
- Add model LOD and responsive asset variants.

### Phase 3 — Film-quality rendering
- Add postprocessing with bloom/DOF/vignette/color grading only where useful.
- Add custom shader hooks.
- Add film grain and subtle lens effects as optional layers.
- Tune exposure, tone mapping, roughness, transmission and reflections.

### Phase 4 — Video-like scroll
- Add sticky canvas image sequence.
- Three-stage loading: poster/low-res -> nearby frames -> full sequence.
- Use WebP/AVIF frames where supported and keep frame count/resolution device-aware.
- Map scroll progress directly to frame index so reverse scrolling is exact.

### Phase 5 — Advanced interaction
- Pointer parallax.
- Raycast hover/selection.
- Touch interaction.
- Camera breathing and independent motion.
- Optional gyroscope/device orientation on supported mobile devices.

### Phase 6 — Production quality
- Mobile quality tiers.
- Reduced-motion fallback.
- Error/loading states.
- Performance telemetry in development.
- Browser visual verification.
- Vercel deployment.

## Critical design rule
Never make the entire experience one giant scroll-controlled animation. The premium effect comes from combining deterministic scroll choreography with autonomous real-time motion. The scene should still feel alive if the user stops scrolling.

## Licensing rule
Use researched repositories as technical references. Copy code only when the source license permits it and preserve required attribution. Prefer implementing our own engine from the documented architecture rather than copying entire projects. GSAP licensing must be checked for the intended commercial distribution before shipping client work.
