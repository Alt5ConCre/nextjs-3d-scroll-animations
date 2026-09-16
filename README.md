# Cinematic Web Engine

A reusable Next.js + React Three Fiber engine for cinematic, interactive websites where **scroll directs the film and the 3D world keeps moving independently**.

## Design principle

The engine deliberately uses two animation systems:

- **Cinematic Director:** Lenis + GSAP ScrollTrigger drive reversible scroll progress, chapter choreography, camera movement, DOM transitions, and future film-frame sequences.
- **Real-Time Actor:** React Three Fiber's `useFrame` loop keeps rotation, particles, materials, lighting, and camera breathing alive even when scrolling stops.

This separation is a core design rule. The entire experience must not become one giant scroll-controlled animation.

## Current engine capabilities

- One primary WebGL canvas for the cinematic experience.
- Lenis smooth scrolling synchronized to the GSAP ticker.
- Centralized cinematic scroll state: progress, velocity, scroll, limit, time.
- GSAP ScrollTrigger chapter choreography.
- Preserved MacBook GLB resources, including the original opening/closing and movement timelines.
- Procedural autonomous 3D actor with transmission material, ring motion and particles.
- HDR-style studio environment lighting and ACES filmic color management.
- Contact shadows.
- Bloom, film noise and vignette post-processing.
- R3F `PerformanceMonitor` + `AdaptiveDpr` quality control.
- Pointer parallax.
- Reduced-motion fallback.
- Reusable `CinematicChapter` abstraction.
- Reusable canvas `ImageSequence` component for future pre-rendered Blender/Cinema 4D film plates.
- Responsive cinematic navigation and chapter anchors.
- Static export support for GitHub Pages and root deployment support for Vercel.

## Preserved resources

The existing MacBook resources are intentionally retained and integrated into the main cinematic canvas:

```text
public/assets/Macbook_Top.glb
public/assets/Macbook_Bottom.glb
src/components/MacBook.tsx
src/components/Scene.tsx
```

`MacBook.tsx` contains the original GLB choreography and is now used by `CinematicEngine.tsx`.

`Scene.tsx` is preserved as an alternate/reference scene because mounting it alongside the main engine would create a second WebGL canvas. Its important animation concepts and section anchors are reused by the primary engine instead of deleting the resource.

## Project structure

```text
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    MacBook.tsx
    Scene.tsx
    cinematic/
      CinematicEngine.tsx
      CinematicDirector.tsx
      CinematicChapter.tsx
      ImageSequence.tsx
  lib/
    cinematic/
      scroll-state.ts
public/
  assets/
    Macbook_Top.glb
    Macbook_Bottom.glb
docs/
  CINEMATIC-ENGINE-RESEARCH.md
```

## Dependency stack

The current stack is aligned for the cinematic renderer:

- Next.js 15.5.x maintenance line
- React 19.2.x
- React Three Fiber 9.7.x
- Drei 10.7.x
- Three.js 0.186.x
- `@react-three/postprocessing` 3.1.x
- Lenis 1.3.x
- GSAP 3.12.x

Lenis is intentionally part of the runtime because it is designed for smooth scrolling, WebGL synchronization and GSAP ScrollTrigger integration. Post-processing is kept as a small, composable effect chain rather than a collection of heavyweight passes.

## Install

Use pnpm 10.28.0:

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
pnpm start
```

## Deployment

### Vercel

The repository is connected to Vercel. Vercel uses the repository's pnpm configuration and currently regenerates the lockfile when dependencies change. Once the synchronized `pnpm-lock.yaml` is committed by CI, the install command can safely be tightened back to frozen-lockfile mode.

### GitHub Pages

`.github/workflows/nextjs.yml` builds the static export and uploads `./out`. The workflow uses the same pnpm version as the project and can regenerate the lockfile when required.

## Film-frame sequences

`src/components/cinematic/ImageSequence.tsx` is ready for numbered pre-rendered frames. The component maps normalized scroll progress directly to a frame index, so reverse scrolling is exact.

Example frame pattern:

```text
/public/sequences/hero/frame-0001.webp
/public/sequences/hero/frame-0002.webp
...
```

No placeholder frames are bundled into the engine. Add real production frames when a cinematic shot is available.

## Research

See [`docs/CINEMATIC-ENGINE-RESEARCH.md`](docs/CINEMATIC-ENGINE-RESEARCH.md) for the full architecture, external references, performance strategy, image-sequence approach and licensing notes.
