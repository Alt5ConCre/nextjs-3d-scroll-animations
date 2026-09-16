# Cinematic Engine — Advanced Tools & Reference Research

Research date: 2026-09-16

## Purpose

This document records advanced technologies and GitHub references that can extend the reusable Cinematic Engine beyond the current WebGL + GSAP + Lenis + R3F baseline. These are research references, not a mandate to add every dependency. Production defaults should remain lean and compatibility-first.

## 1. WebGPU + Three Shader Language (TSL)

### Why it matters
WebGPU/TSL opens a future path for GPU-heavy procedural materials, compute-style effects, particles, morphing and modern post-processing while retaining Three.js scene concepts.

### References
- Three.js WebGPU examples: https://github.com/mrdoob/three.js/tree/dev/examples
- Three.js WebGPU SSR example: https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_postprocessing_ssr.html
- Three.js WebGPU anamorphic example: https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_postprocessing_anamorphic.html
- Three.js WebGPU postprocessing manual: https://github.com/mrdoob/three.js/blob/dev/manual/pages/webgpu-postprocessing.html
- Three WebGPU + TSL example: https://github.com/bagidea/three-webgpu-tsl-example
- Procedural WebGPU/TSL cinematic-style example: https://github.com/code-yeongyu/solar-system-omo-native
- TSL morphing particles: https://github.com/chrismaldona2/tsl-morphing-particles

### Engine decision
Keep WebGL as the production default. Design renderer/effects APIs so WebGPU can become an opt-in backend later. Do not port GLSL line-by-line to TSL; map shader intent into node graphs/TSL semantics.

## 2. GPU particles and visual effects

### Why it matters
Large particle fields, debris, sparks, dust, energy, smoke-like motion and product reveal effects should move simulation work onto the GPU where practical.

### References
- three-vfx: https://github.com/LukaRakocevic/three-vfx
  - Instanced particle effects, single-draw-call architecture per effect, GPU animation and lighting/shadows integration.
- threeparticles: https://github.com/threeparticles/threeparticles
  - WebGPU particle engine with R3F support.
- TSL morphing particles: https://github.com/chrismaldona2/tsl-morphing-particles
  - 16k+ particle morphing between arbitrary models, GPU position/color work, instancing and procedural shader motion.

### Engine candidates
Create reusable presets: dust, sparks, floating dust, orbit particles, energy trails, debris burst, confetti, smoke sprites and model-to-particles dissolve.

## 3. Realistic path tracing

### Why it matters
For hero shots where rasterized lighting is not sufficient, path tracing can deliver physically richer reflections, indirect lighting and material response.

### References
- React Three GPU Pathtracer: https://github.com/pmndrs/react-three-gpu-pathtracer
- R3F ecosystem explicitly lists GPU path tracing as a supported advanced option: https://github.com/pmndrs/react-three-fiber

### Engine decision
Use path tracing selectively for hero/static scenes or high-quality mode. Keep rasterized rendering for interactive/scroll-heavy scenes because deterministic frame rate and responsiveness are more important than maximum offline-like quality.

## 4. Advanced reflections, SSR, SSGI and screen-space effects

### Why it matters
Luxury products depend heavily on controlled reflections, contact shading, ambient occlusion, depth of field, bloom and subtle lens effects.

### References
- Three.js WebGPU SSR example: https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_postprocessing_ssr.html
- Three.js WebGPU postprocessing examples: https://github.com/mrdoob/three.js/blob/dev/manual/pages/webgpu-postprocessing.html
- threejs-scenes-skill reference for WebGPU effects: https://github.com/tuomashatakka/threejs-scenes-skill
- R3F examples include monitors with bloom, DOF and reflections: https://github.com/pmndrs/react-three-fiber/blob/master/docs/getting-started/examples.mdx

### Engine candidates
Build a grading layer driven by chapter progress: exposure, environment intensity, bloom, DOF focus, vignette, grain, chromatic aberration, RGB shift and reflection intensity.

## 5. Camera system / cinematic camera controls

### Why it matters
A premium site needs more than a single camera interpolation. Dolly, truck, orbit, focal offsets, smooth damping and user interaction should be composable with scroll waypoints.

### Reference
- camera-controls: https://github.com/yomotsu/camera-controls
  - Smooth camera transitions, orbit, dolly, truck, touch gestures, focal offset, fit-to-object and related camera tooling. MIT licensed.

### Engine decision
Use our existing camera-waypoint director as the source of truth and optionally adapt camera-controls for interactive inspection states. Scroll choreography must remain deterministic.

## 6. Mouse, touch and gesture interaction

### Why it matters
Hover parallax, drag-to-inspect, pinch, pointer tilt and controlled touch interactions add product realism.

### Reference
- @use-gesture: https://github.com/pmndrs/use-gesture
  - React/vanilla drag, move, hover, scroll, wheel and pinch support; MIT licensed.

### Engine candidates
Implement an InteractionDirector that normalizes pointer/touch into a shared state consumed by R3F and DOM UI. Preserve native scrolling and explicitly configure touch-action on draggable regions.

## 7. Physics and mechanical product behavior

### Why it matters
Watches, machinery, hinges, exploded products, switches, rotating components and collision-style reveals benefit from real or constrained physics.

### Reference
- React Three Rapier: https://github.com/pmndrs/react-three-rapier
  - WASM-based Rapier physics, R3F v9 / React 19 support, manual stepping and independent update-loop options.

### Engine decision
Physics remains an optional module. Product choreography should default to deterministic scripted animation; physics can be enabled for demonstrations that genuinely benefit from it.

## 8. Authoring/debug controls

### Why it matters
Cinematic tuning is much faster with live controls for camera, light, materials, particle density, post effects and timing.

### References
- Leva: https://github.com/pmndrs/leva
- R3F ecosystem also references Leva and Triplex: https://github.com/pmndrs/react-three-fiber

### Engine candidates
Create a development-only Cinematic Inspector with panels for camera, environment, chapter progress, postprocessing, asset stats and quality tiers. Never ship it in the production bundle.

## 9. HDRI / environment authoring

### Why it matters
Controlled HDR environments are central to metallic, glass and glossy product rendering.

### References
- pmndrs/env HDR environment map editor: https://github.com/pmndrs/env
  - Browser-based HDR environment editor, realtime model preview, light positioning and export.
- Drei Environment: https://github.com/pmndrs/drei/blob/master/docs/staging/environment.mdx
  - HDR/EXR/cubemap loading, environment intensity/rotation, ground projection and self-hosted asset support.
- pmndrs/assets: https://github.com/pmndrs/assets
  - Self-hosted, optimized CC0 assets including HDRIs, models and textures.

### Engine decision
Maintain a self-hosted HDRI library. Do not depend on production CDN presets. Use multiple environments per product class: studio, dark studio, warehouse, architectural interior, sunset and outdoor.

## 10. 3D asset optimization and texture compression

### Why it matters
Photorealistic GLBs can become huge. Compression must happen before deployment, not only at runtime.

### Reference
- glTF-Transform: https://github.com/donmccurdy/glTF-Transform
  - Draco and Meshoptimizer geometry compression, texture resize/WebP, KTX2/Basis compression and automated optimize commands.

### Engine candidates
Create a repeatable asset command pipeline:
1. Validate GLB.
2. Remove unused resources.
3. Compress geometry with Meshopt or Draco as appropriate.
4. Resize textures based on target tier.
5. Convert texture slots to WebP/KTX2 where appropriate.
6. Generate desktop/mobile variants.
7. Record dimensions, bytes and compression method in a manifest.

## 11. Web media / WebCodecs / modern video pipeline

### Why it matters
Large cinematic sequences can be more practical as video than thousands of image files. A modern media layer can decode media efficiently and provide a future route to hybrid scrub playback.

### Reference
- Mediabunny: https://github.com/Vanilagy/mediabunny
  - Browser media toolkit built around modern web media capabilities, with WebCodecs-backed encoding/decoding support.
- Existing engine references: dkaoster/scrolly-video and steveharrison/scroll-video are documented in CINEMATIC-SCROLL-VIDEO-REFERENCES.md.

### Engine candidates
Add a MediaAdapter interface supporting:
- Canvas frame sequence
- HTMLVideoElement currentTime
- WebCodecs/Mediabunny future path
- poster fallback

Never let the chosen media backend leak into chapter/camera APIs.

## 12. Audio-reactive cinematic layer

### Why it matters
Music beats, low-frequency pulses and transient effects can subtly drive lighting, particles, shader intensity or typography.

### References
- web-audio-threejs-starter: https://github.com/7g3n/web-audio-threejs-starter
  - Web Audio frequency analysis, RMS/bass/mids/highs, GPU-rendered particles, R3F and cleanup patterns; MIT licensed.
- audio-reactive-shaders: https://github.com/TjardoOrtan/audio-reactive-shaders
  - React/Three.js GLSL visualizations reacting to audio bands.
- samantha-ui: https://github.com/desertcache/samantha-ui
  - React 19 + Three.js audio-reactive visual state, Fresnel/noise/glow and postprocessing patterns.

### Engine candidates
Normalize audio into a shared state:
`rms`, `bass`, `mid`, `high`, `transient`, `beatPhase`.
Allow chapters to map these to safe ranges rather than directly coupling visuals to audio implementation.

## 13. Advanced state and animation architecture

### Why it matters
Scroll state, pointer state, camera state, product motion, audio and quality changes should not cause unnecessary React rerenders.

### References
- Zustand is part of the R3F ecosystem for state management: https://github.com/pmndrs/zustand
- R3F documentation highlights external state libraries and performance-aware patterns: https://github.com/pmndrs/react-three-fiber

### Engine decision
Keep hot animation values in refs/runtime state. Use centralized external state for orchestration/configuration and avoid per-frame React state updates.

## 14. Performance profiling and budgets

### Why it matters
Cinematic effects can fail on real devices even if they look good on a desktop development GPU.

### Reference
- r3f-perf: https://github.com/utsuboco/r3f-perf
  - FPS, frame time, GPU/program and memory-oriented runtime profiling.

### Engine candidates
Define budgets by quality tier:
- DPR cap
- draw calls
- triangles
- texture memory
- particle count
- postprocessing passes
- sequence frame dimensions
- memory growth over time
- startup asset bytes

## 15. Browser/device resilience

### Advanced requirements
- WebGL context-loss recovery
- asset load failure fallback
- unsupported WebGL fallback poster/video
- `prefers-reduced-motion`
- orientation changes
- low-memory/weak-device tier
- touch-device interaction constraints
- visibility/background-tab throttling
- deterministic cleanup of GPU assets

These should become a dedicated `RuntimeSafetyDirector` rather than scattered component checks.

## 16. Visual QA and automated regression

### Advanced testing approach
Use browser automation to verify:
- page loads without console errors
- Canvas exists
- chapter text appears
- scroll progresses
- reverse scrolling works
- frame sequence advances
- video adapter does not throw when metadata is late
- mobile layout is usable
- reduced-motion mode disables cinematic motion appropriately
- WebGL failure produces a fallback

A screenshot regression layer can compare key cinematic checkpoints after deterministic waits. Keep thresholds tolerant of GPU/browser rendering differences.

## 17. Production asset sources

### Useful research pools
- pmndrs/assets: CC0 self-hostable HDRIs/models/textures.
- Poly Haven resources referenced by pmndrs/drei assets documentation.
- Product-specific models may come from Blender/Sketchfab/other sources, but every asset license must be checked before shipping.

### Licensing rule
Research repositories are not automatically safe to copy. Inspect LICENSE and preserve notices. Do not copy Apple product photography, proprietary assets or branding. Prefer original renders and original code derived from documented concepts.

## 18. Recommended advanced architecture

```text
                    CINEMATIC ENGINE
                           |
                +----------+----------+
                |                     |
          DIRECTOR LAYER          RENDER LAYER
                |                     |
       +--------+--------+      +-----+----------------+
       |        |        |      |      |       |        |
     Scroll   Pointer   Audio   R3F   Media   VFX    PostFX
       |        |        |      |      |       |        |
       +--------+--------+------+------+-+-----+--------+
                                         |
                                QUALITY / SAFETY
                                         |
                              Desktop / Mobile / Fallback
```

## 19. What should actually be added next

### P0 — Add to engine
- Product config schema
- Asset manifest schema
- MediaAdapter abstraction
- Camera preset library
- Cinematic Inspector (dev-only)
- asset optimization commands using glTF-Transform
- runtime performance budgets
- runtime safety/fallback director
- automated visual smoke tests

### P1 — Add after P0
- gesture interaction module
- audio controller
- GPU particle presets
- advanced material/lighting presets
- HDRI management
- exploded/mechanical choreography helpers

### P2 — Research/optional
- WebGPU/TSL backend
- WebGPU SSR/SSGI
- path tracing mode
- WebCodecs/Mediabunny adapter
- GPU morphing systems
- physics module
- authoring UI / Triplex-style editor

## 20. Current repository relationship

These references are additions to the existing research documents:
- `docs/CINEMATIC-ENGINE-RESEARCH.md`
- `docs/CINEMATIC-SCROLL-VIDEO-REFERENCES.md`
- `docs/CINEMATIC-ENGINE-GAPS-RESEARCH.md`

Preservation rule remains mandatory: integrate proven techniques through adapters/components; do not replace the existing MacBook GLBs, legacy Scene concepts, CinematicDirector, centralized scroll state, R3F animation, chapter system or postprocessing.

## Key conclusion

The advanced research confirms that the current architecture can grow into a high-end reusable cinematic platform without committing to every emerging technology at once. WebGL + R3F remains the safest interactive baseline; WebGPU/TSL, path tracing, WebCodecs, GPU VFX, advanced reflections and audio-reactive systems should be modular upgrades behind stable engine interfaces.
