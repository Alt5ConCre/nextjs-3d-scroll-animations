# Luxury House Scroll-Scrubbing — GitHub Research

Research date: 2026-09-16.

## Best reference set

| Repository | Stars observed | Stack | Technique | Why it matters |
|---|---:|---|---|---|
| https://github.com/FelixVerdianto17/canvas-scroll-sequence | 0 | Next.js App Router, TypeScript, Tailwind, Motion, Lenis, Canvas | Scroll progress maps to a numbered Canvas image sequence; 192-frame example | Closest architecture match to our existing Next.js/Lenis project. citeturn738405search0 |
| https://github.com/mkurtic/apfel-sequence | 4 | TypeScript, Canvas, React/Vue/vanilla wrappers | Canvas frame sequence with eager/lazy buffering and breakpoint-specific sequences | Strong reference for responsive loading and production API design. citeturn398032search1 |
| https://github.com/dkaoster/scrolly-video | 1.1k | JavaScript | External progress controls video playback; multiple decoding/playback strategies | Most established reference in this set for reusable scroll-controlled media. citeturn445036search5 |
| https://github.com/Relaxkartikey/prior-gsap-animation-portfolio-website-template | 8 | HTML/CSS/JS, GSAP ScrollTrigger, Canvas | Apple-style Canvas frame scrub plus parallax/video transitions and preloader | Excellent reference for chapter choreography and transition language. citeturn398032search0 |
| https://github.com/shajith23/bmw | 0 shown on page | Next.js, TypeScript, Tailwind, Framer Motion, Lenis, Canvas, Web Audio | 192-frame product sequence with audio, responsive layout and telemetry UI | Useful product-showcase composition and audio patterns. citeturn568278search7 |
| https://github.com/steveharrison/scroll-video | 0 | Vanilla JS, HTML5 video | `currentTime` scrub, rAF handling, every-frame keyframes (`-g 1`) | Good secondary real-video adapter and encoding reference. citeturn445036search2 |
| https://github.com/danhnm1203/scrollytelling | GitHub page surfaced without star count | Next/Nuxt/Astro/plain HTML, FFmpeg | Turns source video into scroll-scrubbed frame sequences; includes landscape/portrait variants | Strong asset-production CLI/workflow reference. citeturn568278search9 |
| https://github.com/sagarparmarr/genx | GitHub page surfaced without star count | Next.js, Canvas, WebP, Framer Motion-style spring/lerp | 192-frame bidirectional Canvas sequence with DPR clamping | Useful rendering and CDN/performance reference. citeturn568278search2 |
| https://github.com/freshtechbro/claudedesignskills | GitHub page surfaced without star count | GSAP patterns | Canonical ScrollTrigger Canvas image-sequence pattern with pinned stage and scrub | Compact reference for implementation details. citeturn568278search1 |
| https://github.com/MengTo/Skills | GitHub page surfaced without star count | Web design skill docs | Normalized progress + pinned/sticky stage + replaceable renderer | Reinforces a renderer-neutral cinematic architecture. citeturn568278search8 |

## Recommendation

### Best external starting point: FelixVerdianto17/canvas-scroll-sequence

Reason: it is the closest reference to the target application: Next.js App Router + Canvas image sequence + Lenis + product-story sections. It also explicitly documents a premium preloader, responsive layout and ref-based Canvas rendering. citeturn738405search0

### Best loading architecture reference: mkurtic/apfel-sequence

Borrow concepts, not code: breakpoint-specific asset sequences, eager/lazy modes, retries and preload windows. It is MIT licensed. citeturn398032search1

### Best advanced media reference: dkaoster/scrolly-video

Use as the secondary media strategy where a complete image sequence would be too large. The repository is mature and focuses specifically on externally controlled playback. citeturn445036search5

## Implementation decisions for our house site

1. Primary renderer: HTML5 Canvas frame sequence.
2. Scroll source of truth: normalized progress from the existing CinematicDirector/Lenis runtime.
3. Frame interpolation: requestAnimationFrame + lerp, never raw scroll events for painting.
4. Desktop loading: preload every configured frame before enabling the cinematic runway, matching the requested production behavior.
5. Mobile: replace frame scrubbing with short muted chapter videos played by IntersectionObserver.
6. Story copy: fixed overlays whose opacity/position is driven by normalized progress.
7. Navigation: fixed room list that jumps to chapter anchors.
8. Accessibility: preserve semantic section copy and reduced-motion behavior.
9. Asset pipeline: 4K offline master -> optimized web frame sequence -> poster/mobile derivatives.
10. Do not copy Apple assets, branding or proprietary source code. Verify licenses before copying any external implementation.

## Current project mapping

The existing project already has a reusable CinematicDirector, ImageSequence and VideoScrubber layer. The new house walkthrough is built as a product-specific composition around those existing ideas rather than replacing the engine wholesale.
