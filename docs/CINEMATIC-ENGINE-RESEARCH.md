# Cinematic Engine Research & Architecture

## Goal
Build a reusable, premium web experience that can feel like a cinematic video while scrolling, while keeping real-time 3D motion independent from scroll. Scroll must be reversible and scrub-able; when scrolling stops, the 3D scene continues animating.

## Current repository review
The project is a Next.js App Router experience using React, React Three Fiber, Three.js, Drei, GSAP, Lenis and `@react-three/postprocessing`. The engine deliberately separates a deterministic cinematic timeline from autonomous R3F motion.

## Integrated resources

### Preserved and active
- `public/assets/Macbook_Top.glb` and `public/assets/Macbook_Bottom.glb` remain intact and are now loaded by the primary cinematic canvas.
- `src/components/MacBook.tsx` remains intact in concept and preserves the original GSAP MacBook choreography. Its lifecycle and asset URLs were hardened for the shared engine.
- `src/components/Scene.tsx` remains preserved as an alternate/reference scene. Its important ideas are reused by the primary engine without mounting a second WebGL canvas.
- Existing procedural torus-knot, ring, particles, transmission material, environment lighting and independent `useFrame` motion remain part of the main hero.
- `ContactShadows` is integrated for grounding the GLB scene.
- Lenis is integrated as the smooth-scroll transport and synchronized with GSAP.
- GSAP ScrollTrigger is the cinematic timeline layer.
- `PerformanceMonitor` and `AdaptiveDpr` are integrated into the render loop.
- `@react-three/postprocessing` is integrated for a small cinematic effect chain.
- `ImageSequence.tsx` is implemented as the film-plate integration surface for future pre-rendered shots.
- Centralized scroll state is implemented in `src/lib/cinematic/scroll-state.ts`.
- `CinematicChapter.tsx` provides a reusable chapter abstraction.

## Research references

### 1. @14islands/r3f-scroll-rig
https://github.com/14islands/r3f-scroll-rig
Use for DOM/WebGL synchronization, shared GlobalCanvas architecture, viewport tracking, responsive scaling, lazy loading, and Lenis integration. MIT licensed.

### 2. Lenis
https://github.com/darkroomengineering/lenis
Use for smooth scrolling and WebGL synchronization. Current package is `1.3.26`. It explicitly supports custom RAF loops and GSAP ScrollTrigger synchronization. MIT licensed. citeturn847067search0

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
`CinematicDirector.tsx` owns the scroll transport. Lenis runs on the GSAP ticker, updates centralized scroll state, and calls `ScrollTrigger.update()` so all scrubbed timelines share one transport.

### Layer B — Real-Time Actor
R3F `useFrame` runs continuously. It drives independent rotation, mechanical sub-movements, particles, material animation, pointer parallax and camera breathing. This continues when scrolling stops.

### Layer C — Photorealistic Render
Three.js PBR materials + studio/HDR-style environment lighting + ACES filmic tone mapping + a small postprocessing chain. Current production dependencies are aligned to Fiber 9.7, Drei 10.7 and postprocessing 3.1.0; current Fiber is 9.7.0 and current Drei is 10.7.8. citeturn924123search0turn847067search1turn847067search2

### Layer D — Film Plate
`ImageSequence.tsx` maps normalized progress directly to frame index. This is intentionally present even before real frames are added, because pre-rendered frame sequences are the correct integration surface for a video-like scroll experience with exact reverse scrubbing.

### Layer E — Performance Director
The current engine uses `PerformanceMonitor`, `AdaptiveDpr`, velocity-based `performance.regress()`, reduced-motion handling and responsive CSS. Future steps can add device capability detection, LOD and texture resolution tiers.

## Dependency and security alignment

The original project used Next.js 15.0.3 with a React 19 release candidate and React Three Fiber 9 RC. That created peer mismatches once postprocessing was introduced. The package stack has now been aligned to:

```text
Next.js           15.5.25
React             19.2.4
React DOM         19.2.4
R3F               9.7.0
Drei              10.7.8
postprocessing    3.1.0
Three             0.186.0
Lenis             1.3.26
```

Next.js 15.5 is on the maintenance line, and the React/Next security advisories document patched 15.x releases. The August 2026 Next.js security release also lists 15.5.24 as a maintenance release, while the registry currently exposes 15.5.25. citeturn681234search0turn681234search1turn681234search8

React 19.2.4 is used rather than the old project RC so that the 3D stack does not depend on an obsolete React prerelease. React's security advisory documents fixed RSC releases in the 19.x lines. citeturn681234search4

## Dependency-install strategy

The repository uses pnpm and declares `packageManager: pnpm@10.28.0`. Vercel confirmed that it runs pnpm 10.x. The repository's GitHub Actions workflow now uses the same pnpm version and regenerates `pnpm-lock.yaml` when dependency metadata changes, then commits the regenerated lockfile with `[skip ci]` to prevent a workflow loop.

Until the synchronized lockfile is committed, Vercel uses `pnpm install --no-frozen-lockfile`. After the CI-generated lockfile is current, this can be tightened back to `--frozen-lockfile` for reproducible installs.

## Important resource preservation rule

Do not delete an existing resource merely because it does not fit the new architecture directly. Prefer one of these integration paths:

1. Mount the resource inside the shared primary canvas.
2. Extract its useful choreography into a reusable controller while preserving the original component.
3. Keep it as an alternate/reference implementation when running it directly would create duplicate infrastructure such as a second Canvas.
4. Add an adapter layer so future assets can use the same timing/state interfaces.

For this project, the MacBook GLBs are path (1), `Scene.tsx` is path (3), and its ScrollTrigger section/text concepts are reused through path (2).

## Planned next integrations

### Asset pipeline
- Add `GLTFLoader`, Draco, Meshopt and KTX2/Basis support.
- Add reusable scene asset adapters and disposal strategy.
- Add local HDR assets where a stable environment is required.
- Add LOD / responsive variants.

### Film plate
- Add production frame sequences to `public/sequences/`.
- Use poster/low-resolution frame -> nearby frames -> full-sequence loading.
- Use WebP/AVIF assets at device-aware resolutions.
- Map scroll progress directly to frame index.

### Interaction
- Add raycast selection/hover.
- Add richer touch gesture responses.
- Add optional device orientation support only where it improves the experience and permissions are available.

### Verification
- Run `next build` through CI/Vercel.
- Verify the page in a real browser and check for console errors.
- Test reverse scrolling, anchor navigation, mobile breakpoints, reduced motion and fallback quality.

## Critical design rule
Never make the entire experience one giant scroll-controlled animation. The premium effect comes from combining deterministic scroll choreography with autonomous real-time motion. The scene should still feel alive if the user stops scrolling.

## Licensing rule
Use researched repositories as technical references. Copy code only when the source license permits it and preserve required attribution. Prefer implementing our own engine from the documented architecture rather than copying entire projects. GSAP licensing must be checked for the intended commercial distribution before shipping client work.
