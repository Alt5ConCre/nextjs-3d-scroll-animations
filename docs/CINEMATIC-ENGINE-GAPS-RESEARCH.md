# Cinematic Engine — Deep Gaps & Production Resource Research

Research date: 2026-09-16
Repository: https://github.com/Alt5ConCre/nextjs-3d-scroll-animations

## Purpose

This document is the canonical gap inventory for turning the current Cinematic Engine into a reusable production-quality cinematic website system. It covers what is already present, what is still missing, GitHub references for each missing area, candidate packages/tools, and the implementation order.

Core rule: preserve existing resources and integrate through adapters/components. Do not replace the current MacBook GLBs, alternate Scene concepts, CinematicDirector, centralized scroll state, chapter system, independent R3F useFrame motion, performance director, or postprocessing.

## Executive status

### Already present

- Next.js + React + TypeScript
- Three.js + React Three Fiber + Drei
- GSAP
- Lenis
- R3F persistent Canvas
- centralized normalized cinematic scroll state
- CinematicDirector
- Canvas ImageSequence film-plate component
- staged sequence loading and adjacent prefetch
- hold zones and micro-animation
- secondary video currentTime scrubber
- chapter system
- independent real-time useFrame animation
- particles
- environment lighting
- transmission/reflection-style materials
- postprocessing
- responsive/mobile baseline
- reduced-motion baseline
- existing MacBook GLB resources

The current package stack is confirmed in package.json; the missing work is mostly production asset tooling, loader wiring, configurability, testing, and polish rather than a missing core rendering framework.

## Gap inventory

| # | Capability | Current state | Priority | Recommendation |
|---|---|---|---|---|
| 1 | Product asset library / hero models | Missing except existing MacBook | P0 | Establish source and licensing manifest; support local GLB/GLTF |
| 2 | Professional 3D modeling/render source | External | P0 | Blender or equivalent DCC for custom product models and offline cinematic renders |
| 3 | GLB/GLTF optimization pipeline | Partially planned | P0 | Add glTF-Transform CLI; Draco/Meshopt; KTX2/Basis; texture resizing |
| 4 | Explicit runtime compressed-texture loader wiring | Not fully implemented | P0 | Add KTX2Loader and explicit local decoder paths; confirm Draco/Meshopt paths |
| 5 | glTF validation gate | Missing | P1 | Add Khronos glTF Validator to asset CI/process |
| 6 | 4K/2K/mobile film asset pipeline | Manual | P0 | Formalize render → FFmpeg → frame sequence → WebP/JPG tiers |
| 7 | Frame extraction tooling | Missing as project utility | P0 | FFmpeg CLI script + manifest generation |
| 8 | Image sequence manifest/index | Missing | P0 | Generate frame count, dimensions, byte size, checksum, mobile/desktop mapping |
| 9 | CDN/cache strategy for sequences | Basic static hosting only | P1 | Immutable hashed assets and long-lived caching; verify Vercel/static behavior |
| 10 | HDRI/environment library | Basic environment exists | P1 | Build named HDRI presets; prefer licensed/CC0 sources or user-owned assets |
| 11 | PBR texture library | Basic materials only | P1 | Add production material presets and texture manifest |
| 12 | Material preset system | Missing as reusable API | P1 | Metallic, ceramic, glass, leather, carbon, food/product presets |
| 13 | Lighting preset system | Partial | P1 | Studio, rim, softbox, dramatic, warm/cool, macro presets |
| 14 | Cinematic camera preset library | Partial waypoint system | P0 | Reusable orbit, macro push, pullback, reveal, sweep, detail-focus presets |
| 15 | Camera path authoring/config format | Partial | P0 | Formalize camera waypoints with progress, position, target, lens/FOV, hold |
| 16 | Product configuration schema | Missing | P0 | Product ID + model + sequence + material + lighting + camera + chapters in data |
| 17 | Multi-product scene adapter | Missing | P0 | Load product configuration instead of hard-coded hero models |
| 18 | Exploded-view / mechanical animation system | Missing | P1 | Named transform groups and timeline channels for parts |
| 19 | Mouse/touch cinematic interaction layer | Basic / product-dependent | P1 | Unified pointer influence with damping and touch-safe behavior |
| 20 | Scroll velocity signal as cinematic input | Partially available | P0 | Expose normalized velocity to camera, shader, particles, typography, audio |
| 21 | Shader effect library | Basic | P1 | Distortion, heat haze, chromatic shift, scanlines, grain, displacement, reveal masks |
| 22 | Reflection quality system | Partial | P1 | HDRI + planar/reflection probes where justified; tune by quality tier |
| 23 | DOF/bloom/grain/color grade presets | Infrastructure present | P1 | Build named cinematic grading presets and chapter overrides |
| 24 | WebGPU future renderer path | Not implemented | P2 | Keep renderer abstraction; benchmark before adoption |
| 25 | WebCodecs video path | Not implemented | P2 | Optional advanced decoder for large video sequences |
| 26 | Audio/music engine | Missing | P1 | Web Audio / HTMLMediaElement controller with user-gesture-safe startup |
| 27 | Scroll-synchronized SFX | Missing | P2 | Chapter markers + event triggers; avoid excessive audio events |
| 28 | Premium loading/preloader UX | Basic loading only | P0 | Progress phases: environment, hero, film plate, interactive-ready |
| 29 | Loading failure/retry UI | Missing | P1 | Per-asset error state + fallback poster/low tier |
| 30 | Asset memory manager | Partial cache logic | P0 | Explicit release/disposal policies, sequence cache budget and decoder cleanup |
| 31 | Scene/object disposal audit | Needs review | P1 | Geometry/material/texture/render-target cleanup on transitions |
| 32 | Visibility/tab power-saving | Needs implementation | P1 | Pause expensive loops when off-screen/hidden |
| 33 | WebGL context-loss recovery | Missing | P1 | Detect context loss and restore/fallback gracefully |
| 34 | WebGL unsupported fallback | Basic concept only | P1 | Static poster/HTML cinematic fallback rather than blank canvas |
| 35 | Mobile composition variants | Framework exists | P0 | Product-specific frame/camera composition assets for narrow screens |
| 36 | Low/medium/high quality presets | Partial | P0 | Centralized quality policy for DPR, frames, effects, particles, shadows |
| 37 | Network-aware loading | Missing | P1 | Use connection hints / adaptive sequence loading where supported |
| 38 | Prefetch heuristics | Partial | P1 | Combine progress direction, velocity and nearest frames |
| 39 | SEO metadata/social preview | Missing/partial | P1 | Next metadata, OG/Twitter image, semantic HTML and crawlable text |
| 40 | Analytics/performance telemetry | Missing | P1 | Web Vitals plus cinematic runtime metrics, loaded off critical path |
| 41 | Automated browser QA | Missing | P0 | Playwright smoke, interaction, viewport and screenshot tests |
| 42 | WebGL visual regression strategy | Missing | P1 | Tolerant canvas screenshot comparisons plus deterministic camera state |
| 43 | Build/type/lint/test CI | Incomplete | P0 | Typecheck + lint + build + asset validation in Actions |
| 44 | Performance budgets | Missing | P0 | Bundle, GLB, texture, sequence, first-frame and FPS targets |
| 45 | Asset licensing manifest | Missing | P0 | Record source URL + license + attribution for every external asset |
| 46 | Content authoring workflow | Missing | P1 | Document how to create a new product without editing engine internals |
| 47 | Demo product pack | Existing MacBook only | P0 | Create one polished product implementation as the reference template |
| 48 | Production deployment verification | Needs verification | P0 | Verify GitHub Actions and Vercel deployment before calling engine production-ready |

## 1. Product and 3D asset sourcing

A cinematic website needs a genuinely good hero asset. The current engine can render GLB/GLTF, but the final visual quality depends on the source model, topology, materials, textures, and animation.

### Reference repositories

- Khronos glTF Sample Models: https://github.com/KhronosGroup/glTF-Sample-Models — useful for validating material/extension behavior and loader compatibility. Each sample includes license information. citeturn813484search1
- pmndrs/assets: https://github.com/pmndrs/assets — CC0, optimized models, HDRIs, matcaps, normals and fonts intended for web use. citeturn813484search0
- pmndrs/market: https://github.com/pmndrs/market — CC0 assets, HDRIs, textures, starters and a material editor; useful as an asset discovery/reference system. citeturn813484search4
- awesome-cc0: https://github.com/madjin/awesome-cc0 — discovery index for public-domain/CC0 assets. Use it as a source directory, then verify the specific license. citeturn813484search6

### Rule

Free demo assets are adequate for engine tests, but a premium client website should normally use an owned/licensed model or a custom-created model. Do not assume that a model found on a marketplace is reusable commercially.

## 2. 3D optimization pipeline

This is one of the clearest missing production components.

### Recommended tool: glTF-Transform

Repository: https://github.com/donmccurdy/glTF-Transform

The current CLI supports broad optimization flows including:

- Draco geometry compression
- Meshopt compression for geometry, morph targets and animation
- texture resizing
- WebP/AVIF transmission formats
- KTX2/Basis Universal GPU texture compression
- pruning, flattening, joining and simplification
- animation resampling

The project explicitly documents these operations and is MIT licensed. citeturn461863search0turn461863search1turn461863search3

### Runtime requirement

Three.js GLTFLoader supports Draco, KTX2 and Meshopt through explicit loader configuration. KTX2Loader must be attached to GLTFLoader for KTX2 textures. citeturn718638search6

A recent loader reference confirms the expected setup: DRACOLoader, KTX2Loader with `detectSupport(renderer)`, and MeshoptDecoder. citeturn718638search0turn718638search11

### Engine work

Create a single model-loader factory:

```ts
createModelLoaders(renderer)
  -> GLTFLoader
  -> DRACOLoader
  -> KTX2Loader
  -> MeshoptDecoder
```

Use local decoder/transcoder files where possible for predictable deployment and to avoid depending on third-party CDNs at runtime.

## 3. Cinematic frame asset pipeline

The engine already has the player, but not the complete source-to-deployment pipeline.

### Required pipeline

```text
Blender / 3D render / camera animation
        ↓
Master ProRes/PNG/EXR render
        ↓
FFmpeg normalization
        ↓
Frame extraction
        ↓
Desktop sequence
Tablet sequence
Mobile sequence
        ↓
WebP/JPG compression
        ↓
Manifest generation
        ↓
public/cinematic/<product>/...
```

### Required manifest fields

```ts
{
  id: string;
  frameCount: number;
  width: number;
  height: number;
  format: 'webp' | 'jpg';
  desktopPath: string;
  mobilePath?: string;
  poster: string;
  byteEstimate?: number;
  checksum?: string;
}
```

### Why this matters

Exact frame sequencing is highly deterministic, naturally reversible and works well with the existing Canvas film plate. The missing part is automation and repeatability, not the browser renderer.

## 4. Video scrub path

The current VideoScrubber is a secondary adapter. For larger sequences, keep a real-video path.

Reference: https://github.com/dkaoster/scrolly-video

Use video when a complete image sequence would be too large. Keep seeking guarded and allow a fallback poster/sequence. For random-seek-heavy video, investigate all-keyframe encoding and seek serialization.

## 5. Asset loading and memory management

Current ImageSequence has staged loading and cache logic, but production still needs a broader asset budget.

### Missing

- central asset budget in MB
- maximum number of decoded frames held simultaneously
- disposal hooks for old sequence tiers
- loader cleanup for DRACO/KTX2 workers
- render-target disposal
- abort/cancellation for abandoned loads
- transition-aware cache eviction

A React Three Fiber issue notes that generic LoadingManager progress can be difficult to interpret when assets fan out into multiple requests, supporting the decision to maintain an explicit asset tracker rather than relying only on aggregate request progress. citeturn461863search11

## 6. HDRI, PBR and material system

A realistic product site needs reusable environment/material presets.

Reference: `shahbaziparisa/threejs-material-demo` demonstrates compressed GLB loading, PBR texture switching, HDRI environments and lighting presets in a Three.js viewer. citeturn145057search8

Use CC0 sources for development/reference where practical; pmndrs/assets includes optimized HDRIs and other web-ready assets. citeturn813484search0

### Proposed preset schema

```ts
{
  material: 'chrome',
  roughness: 0.16,
  metalness: 1,
  envIntensity: 1.8,
  clearcoat: 0.2
}
```

Presets should remain data-driven and product-overridable.

## 7. Camera and storytelling system

The current waypoint foundation should become a full reusable camera director.

Reference: `Grantmantek/threejs-scroll-scene` exposes waypoint arrays containing camera and look positions and uses GSAP ScrollTrigger for scroll-driven camera paths. It also includes reduced-motion behavior and editable waypoint configuration. citeturn718638search2

### Missing reusable camera presets

- hero orbit
- macro push-in
- macro pull-back
- side sweep
- top reveal
- 360 product turn
- detail lock
- exploded view
- end-card settle

Each preset should output the same normalized waypoint schema already established by the engine.

## 8. Interaction system

Need one interaction layer shared by all products.

```text
Pointer / touch
      ↓
normalized x/y
      ↓
damped influence
      ↓
product rotation
camera offset
shader intensity
particles
lighting drift
```

Touch must not interfere with normal page scrolling. On mobile, interaction should be intentionally reduced.

## 9. Scroll velocity as a first-class signal

The engine already exposes normalized velocity but it should become a documented cinematic signal.

Use it for:

- camera inertia
- particle displacement
- subtle motion blur
- shader distortion
- typography skew/opacity
- sound intensity
- chapter transition energy

Velocity should not directly replace deterministic scroll progress. It is a secondary effect signal.

## 10. Shader and VFX library

The current project has postprocessing and basic procedural motion, but a reusable cinematic library is still missing.

### Candidate effect families

- film grain
- chromatic aberration
- vignette
- bloom
- depth of field
- directional blur
- radial blur
- heat/haze distortion
- liquid/wave distortion
- scanline/noise
- color grade
- masked reveal
- speed-line/velocity distortion

The current R3F postprocessing ecosystem already exposes bloom, depth-of-field, noise and vignette through `@react-three/postprocessing`. citeturn145057search5turn145057search13

Keep these effects preset-based so chapters can activate/deactivate combinations without duplicating shader code.

## 11. WebGPU path

Do not make WebGPU a v1 dependency.

Three.js now has a dedicated WebGPU post-processing system based on built-in MRT support and effect composition, but it is a separate renderer/post-processing architecture from the mature WebGL EffectComposer path. citeturn145057search1turn145057search6

### Decision

- Production default: WebGLRenderer path already used by the engine.
- Future: renderer abstraction + benchmarked WebGPU spike.
- Do not mix GLSL EffectComposer passes blindly with WebGPURenderer.

## 12. Audio system

A polished cinematic site can use music and product-specific SFX, but audio should never block initial render.

Reference: `spaceynyc/inner-system` demonstrates audio-reactive R3F, frequency analysis, scroll storytelling, particles, lighting and a staged preloader. citeturn145057search0

Reference: `7g3n/web-audio-threejs-starter` demonstrates Web Audio analyser data, bass/mids/highs, cleanup and responsive controls. citeturn145057search7

### Missing architecture

```text
AudioController
  ├── ambient music
  ├── product SFX
  ├── chapter triggers
  ├── scroll velocity input
  └── user gesture / mute policy
```

Audio must start only when browser policies permit it.

## 13. Loading, fallback and resilience

A production cinematic site must never display an empty black canvas if a decoder, GLB, video or sequence fails.

### Missing

- hero poster fallback
- low-resolution emergency fallback
- asset-level retry
- WebGL context-loss handling
- unsupported WebGL2 behavior
- hidden-tab suspension
- offscreen renderer throttling

Reference: `leisurelyleon/aurora` explicitly uses WebGL2 feature detection, context-loss handling, IntersectionObserver-based render pausing, DPR limits and reduced-motion fallback. citeturn718638search8

This maps directly to the resilience layer needed here.

## 14. Performance architecture

### Missing formal quality policy

Create one central quality object:

```ts
{
  tier: 'high' | 'medium' | 'low';
  dpr: [1, 2];
  maxParticles: 1800;
  shadowMap: 2048;
  postprocessing: true;
  sequenceScale: 1;
  sequenceStep: 1;
}
```

The exact values should be benchmarked per real product rather than treated as universal constants.

### Performance controls

- DPR cap
- particle cap
- shadow quality
- postprocess resolution
- texture resolution
- sequence resolution
- sequence frame-step on low tiers
- LOD
- visibility pause
- tab-hidden pause
- decoder worker budget
- cache budget

## 15. Mobile-specific composition

Do not rely only on smaller desktop rendering.

For products with very different framing on portrait screens, create a separate sequence/camera composition. `mkurtic/apfel-sequence` provides a strong reference for breakpoint-specific sequences and responsive buffering. citeturn432230search6

Use the existing ImageSequence support for mobile frames, but make product manifests explicitly define whether mobile uses:

- same sequence with resizing
- reduced frame count
- separate composition
- separate poster

## 16. Product configuration system

This is one of the highest-value missing components.

The engine should not know that a product is a MacBook, watch or burger.

### Target schema

```ts
export type CinematicProduct = {
  id: string;
  model: string;
  sequence?: ImageSequenceManifest;
  environment?: string;
  materialPreset?: string;
  lightingPreset?: string;
  cameraPreset?: string;
  quality?: QualityProfile;
  chapters: CinematicChapterConfig[];
};
```

This is what will make the engine reusable.

## 17. Mechanical / exploded-view animation

For watches, laptops, cars, machinery and electronics, add named groups:

```ts
{
  id: 'caseback',
  offset: [0, -0.12, 0],
  rotation: [0, 0, 0]
}
```

A chapter timeline can then animate those transforms independently from scroll position while the film plate remains synchronized.

## 18. SEO and semantic HTML

The cinematic canvas should be a visual layer, not the only content representation.

Need:

- semantic headings
- crawlable product descriptions
- metadata
- OG image
- accessible controls
- visible/fallback text
- reduced-motion mode

Next.js supports client-isolated Web Vitals reporting and standard metadata patterns. citeturn718638search3

## 19. Analytics and telemetry

Add performance telemetry only after core interactions load.

Useful metrics:

- Web Vitals
- sequence first-frame time
- full sequence loaded time
- GLB load time
- decoder errors
- dropped/slow seek events
- average frame duration
- current quality tier
- WebGL context loss

Google's `web-vitals` library is small and designed for reporting real-user Core Web Vitals; it recommends deferring loading until after user-impacting code. citeturn718638search5

Do not allow analytics SDKs to enter the critical visual bundle unnecessarily.

## 20. Automated QA and visual regression

This is a significant production gap.

### Minimum test suite

- page loads
- canvas exists
- hero asset eventually appears
- scroll changes normalized progress
- reverse scroll reverses frame index
- object continues independent motion when scroll is static
- mobile layout works
- reduced-motion works
- failed asset shows fallback
- resize does not break canvas
- no fatal console errors

Playwright examples specifically demonstrate WebGL canvas screenshot comparison and Three.js interaction testing. citeturn718638search9

For visual tests, deterministic camera/lighting/time settings should be used so screenshot comparisons are meaningful.

## 21. CI and quality gates

Current repo has GitHub Actions infrastructure, but the production gate should include:

```text
pnpm install
pnpm typecheck
pnpm lint
pnpm build
asset validation
GLB validation
Playwright smoke
optional visual regression
```

Do not call CI green until an actual workflow run is observed.

## 22. Performance budgets

Set measurable targets per product instead of vague "fast" goals.

Suggested starting budget categories:

- first meaningful poster: very small
- initial JavaScript: minimized
- hero GLB: compressed and validated
- textures: capped per quality tier
- initial frame set: small
- full sequence: lazy loaded
- low-tier sequence: materially smaller than desktop
- no unnecessary multiple WebGL canvases

These are target categories, not hard universal byte limits; benchmark on representative devices before fixing final numbers.

## 23. Licensing and attribution system

This is mandatory before shipping copied external resources.

### Repository policy

For every external model, HDRI, texture, audio file, shader snippet or copied code:

```text
asset
source URL
license
author
attribution requirement
modification notes
commercial-use status
```

Khronos glTF samples document per-model licensing; pmndrs/assets provides CC0 web-ready assets; awesome-cc0 is useful for discovery but still requires verifying the actual source license. citeturn813484search1turn813484search0turn813484search6

Do not copy Apple proprietary assets or branding into a commercial implementation. Use Apple-style behavior only as a visual/interaction reference.

## 24. Recommended new repository utilities

The eventual project additions should look approximately like:

```text
scripts/
  extract-sequence.ts
  build-sequence-manifest.ts
  optimize-glb.ts
  validate-glb.ts
  optimize-textures.ts

src/lib/cinematic/
  product-config.ts
  camera-presets.ts
  lighting-presets.ts
  material-presets.ts
  quality-policy.ts
  asset-manager.ts
  performance-metrics.ts
  audio-controller.ts
  interaction-state.ts

src/components/cinematic/
  ProductScene.tsx
  CinematicCamera.tsx
  CinematicEffects.tsx
  CinematicLoader.tsx
  CinematicFallback.tsx
  ProductInteraction.tsx
  ExplodedProduct.tsx

public/cinematic/
  products/
  environments/
  sequences/
  posters/
  audio/
  decoders/

 docs/
  ASSET-MANIFEST.md
  PERFORMANCE-BUDGETS.md
  PRODUCT-AUTHORING.md
```

This is a target structure, not a command to create every file immediately.

## 25. Recommended reference set

### Asset / optimization

- glTF-Transform: https://github.com/donmccurdy/glTF-Transform citeturn461863search0
- Khronos glTF Sample Models: https://github.com/KhronosGroup/glTF-Sample-Models citeturn813484search1
- pmndrs/assets: https://github.com/pmndrs/assets citeturn813484search0
- pmndrs/market: https://github.com/pmndrs/market citeturn813484search4

### Loading / rendering

- Three.js GLTFLoader: https://github.com/mrdoob/three.js/blob/dev/docs/pages/GLTFLoader.html.md citeturn718638search6
- R3F postprocessing: https://github.com/pmndrs/react-postprocessing citeturn145057search5
- Three.js WebGPU postprocessing: https://github.com/mrdoob/three.js/blob/dev/manual/pages/webgpu-postprocessing.html citeturn145057search1

### Cinematic interaction

- `Grantmantek/threejs-scroll-scene`: waypoint camera system citeturn718638search2
- `spaceynyc/inner-system`: audio-reactive cinematic R3F citeturn145057search0
- `leisurelyleon/aurora`: graceful WebGL2 fallback and performance guards citeturn718638search8

### Testing / performance

- Playwright WebGL patterns: https://github.com/currents-dev/playwright-best-practices-skill/blob/main/playwright-best-practices/testing-patterns/canvas-webgl.md citeturn718638search9
- Google web-vitals: https://github.com/GoogleChrome/web-vitals citeturn718638search5

## 26. Implementation priority

### P0 — must have before calling the engine production-ready

1. Product configuration schema
2. ProductScene adapter
3. Formal camera preset system
4. Formal quality policy
5. GLB optimization pipeline
6. KTX2/Draco/Meshopt loader factory
7. Sequence extraction + manifest tooling
8. Mobile product sequence/composition support
9. Premium loading/fallback system
10. Asset memory/disposal manager
11. Performance budgets
12. Licensing manifest
13. Playwright smoke tests
14. Typecheck/lint/build CI
15. One complete polished reference product
16. Verify deployment

### P1 — strong production enhancements

1. HDRI/material/lighting preset library
2. Interaction layer
3. shader/VFX preset library
4. context-loss recovery
5. WebGL fallback
6. audio controller
7. telemetry/Web Vitals
8. SEO/social metadata
9. advanced asset caching/prefetch
10. exploded mechanical choreography

### P2 — advanced/future

1. WebCodecs video decoder path
2. WebGPU renderer path
3. sophisticated SSR/SSGI reflection techniques
4. advanced audio-reactive effects
5. authoring UI for designers

## 27. Final conclusion

The project is not missing another big framework. It is missing a professional production layer around the existing rendering core.

The highest-value missing systems are:

```text
PRODUCT CONFIGURATION
        +
3D ASSET OPTIMIZATION
        +
FRAME/VIDEO ASSET PIPELINE
        +
CAMERA/LIGHTING/MATERIAL PRESETS
        +
MEMORY/PERFORMANCE MANAGEMENT
        +
FALLBACK/RESILIENCE
        +
QA/CI/PERFORMANCE BUDGETS
        +
LICENSE/ASSET MANIFEST
```

Once those are implemented, a new cinematic website should be created primarily by supplying product assets, a product configuration, sequence manifest, camera/chapter data and art direction rather than rewriting the engine.

## Research rule for future work

Before adding a substantial new cinematic capability, search GitHub and current official documentation for at least:

- an established implementation reference
- current renderer/framework compatibility
- performance implications
- mobile/fallback behavior
- license status

Then integrate the concept into the existing engine rather than copying another repository wholesale.
