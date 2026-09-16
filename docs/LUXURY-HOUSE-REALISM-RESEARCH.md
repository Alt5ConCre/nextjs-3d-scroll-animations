# Luxury House Cinematic / Real-Estate Realism Research

Research date: 2026-09-16

## Purpose

The house experience should feel like a real architectural/property viewing, not a generic 3D model showcase. The primary design target is a cinematic architectural film with believable scale, materials, furniture, lighting, camera movement, and room-to-room continuity. Scroll controls the authored film timeline; optional interactive 3D/panorama/splat modes provide deeper exploration.

## Core finding: use a hybrid property-tour architecture

A single technique is not enough for a convincing luxury-property experience.

1. **Cinematic film plate (primary):** pre-rendered 4K frame sequence on Canvas. Scroll progress deterministically selects frames. Best for photoreal composition, cinematic transitions, reflections, daylight changes, furniture detail, and exact camera choreography.
2. **Real-time 3D inspection (secondary):** GLB/GLTF scene for hotspots, orbit/look controls, room interaction, material/state changes, and optional guided camera movement.
3. **360 panorama / room mode (secondary):** high-resolution panoramic rooms for a real-estate-style “stand in the room and look around” experience. Multi-resolution tiling is useful for keeping panoramas usable on the web.
4. **Gaussian Splat mode (advanced):** captured-reality reconstruction for highly realistic room/space walkthroughs where a real photographed/scanned property is the source. Treat this as an optional advanced viewer, not the default production path.
5. **Mobile fallback:** short section videos/stills or optimized panoramas instead of full-resolution desktop frame scrubbing.

This avoids the visual compromise of trying to make a low-detail real-time model look like a final architectural render.

## Strong GitHub references

### AURIGA — Villa Lysning
https://github.com/Leonxlnx/realestateopus5

The closest conceptual reference for our target. It is explicitly an interactive architectural film for a private brokerage. A single continuous camera journey moves through a house and landscape; the repository uses authored camera keyframes, separate position/aim curves, per-segment easing, intentional camera holds, in-world text, and an asset/provenance manifest. The README explicitly describes the experience as content living in the world rather than as generic HTML over a canvas. It also documents a blue-hour-to-night lighting progression that is used deliberately for reveals. The repository states its assets are CC0 and provides ASSETS.md. Source evidence: GitHub README opened 2026-09-16. 

### MuhammadMuzamil-dev/threejs-architectural-walkthrough
https://github.com/MuhammadMuzamil-dev/threejs-architectural-walkthrough

Useful for the interactive side: architectural villa walkthrough, First-Person controls, PointerLock, GLTFLoader, dynamic lighting/shadows, responsive viewport, and rAF rendering. Use conceptually for optional “Explore the House” mode, not as the main cinematic film layer.

### mohammedAljadd/3d-model-web-page
https://github.com/mohammedAljadd/3d-model-web-page

Useful property-tour interaction reference. It includes house door controls, front/back/top views, weather effects, evening/night lighting, animated 360-degree rotation, and an automated guided room/floor tour. README notes Blender preprocessing for performance. This is a strong reference for interactive property states and guided-tour logic.

### wallabyway/gaussian-splats-lmv
https://github.com/wallabyway/gaussian-splats-lmv

Useful advanced captured-reality reference. It combines Gaussian splats with architectural/reality models, custom loaders, GPU-style rendering, worker-assisted depth sorting, and cut-plane controls. Demonstrates that photoreal captured spaces can be navigated interactively in a browser without reducing them to conventional low-poly geometry.

### lucastsui/splat-room-edit
https://github.com/lucastsui/splat-room-edit

Useful research reference for the real-estate end state: room captured from phone video, reconstructed as a Gaussian splat, then walked in a browser. The project reports that the resulting room can preserve baked-in shading and soft shadows during semantic color editing. Treat its processing workflow as research rather than a production dependency until thoroughly evaluated.

### mpetroff/pannellum / Spaceport-Project/pannellum
https://github.com/mpetroff/pannellum
https://github.com/Spaceport-Project/pannellum

Useful for a lightweight 360 panorama mode. Pannellum is WebGL-based, self-hostable, and includes a multi-resolution panorama generator plus configuration/API options. It is a good room-tour adapter when the input is photographic 360 imagery rather than a 3D model.

### google/marzipano
https://github.com/google/marzipano

Useful for multi-scene 360 panorama tours. The demo uses a scene list and scene switching, which maps naturally to room-to-room property navigation. Good reference for high-resolution panoramic scene management.

### rodrigopolo/pannellum-tour-editor
https://github.com/rodrigopolo/pannellum-tour-editor

Useful authoring reference: multi-scene tour editing, hotspot placement, saved camera angles, JSON import/export, and multi-resolution support. This suggests a future internal “property tour authoring” format rather than hard-coding room transitions.

### Raigyo/unity-3d-archviz
https://github.com/Raigyo/unity-3d-archviz

Older but conceptually valuable: the same house is offered through hotspots mode, first-person mode, and cinematic mode. This reinforces the hybrid-tour idea: guided film + free exploration + room navigation.

## Luxury real-estate website references

### Meridian Private Estates
https://www.themarketingdistrict.com/work/meridian-private-estates

2026 case study describing a cinematic, scroll-led property site with a full-bleed scroll-scrubbed film hero, editorial residence presentation, restrained motion, and a discreet enquiry path. Useful for content hierarchy and conversion placement. This is a case study, not an open-source implementation.

### Maison Estates
https://www.inpured.com/case-study/maison-estates

Describes an ultra-luxury real-estate site using Next.js, GSAP ScrollTrigger, Lenis, Framer Motion, Tailwind and cinematic animations, including pinned horizontal property scroll, parallax, character-level text reveals and magnetic cursor behavior. Useful as a modern luxury-property interaction reference.

### One Green Way Residences
https://www.onegreenway.pt/

Useful visual reference for a real luxury residence site: large architectural hero imagery, landscape integration, warm exterior lighting, glass, stone, pool and sunset presentation. Use as art-direction reference only.

### Lumé Residences
https://www.behance.net/gallery/225936565/Lum-Residences-Real-Estate-Website-Design

Useful editorial UX reference for a Dubai luxury residential presentation: smooth animations, rich residence details, amenities, neighborhood context, availability, and high-end visual restraint.

## Architectural realism findings

A believable house is a system, not a single model. The rendering must communicate:

- correct human scale and believable room proportions;
- plausible ceiling heights and transitions between public/private zones;
- real door thickness, frames, handles, thresholds and swing directions;
- realistic stair geometry, landings, handrails and clearances;
- physically believable wall/floor/ceiling junctions;
- correct window/curtain proportions and glazing reflections;
- realistic built-in cabinetry, appliances and sanitary fixtures;
- lighting fixtures that actually appear to emit or bounce light;
- furniture arranged around circulation, not randomly placed;
- realistic rugs, textiles, books, artwork, plants, table objects, kitchen items and bathroom accessories;
- material variation, imperfections, edge wear and roughness variation;
- daylight direction that remains consistent across exterior and interior shots;
- believable exterior landscaping and drainage/pool edges;
- night shots where interior light color and intensity match the architecture.

## Building-code research to keep architectural geometry believable

These are **reference constraints for plausibility**, not legal design approval. Actual compliance depends on the project jurisdiction and the applicable edition of the local code.

### Dubai
Dubai Municipality's official Dubai Building Code page states that the DBC establishes minimum requirements for health, safety, welfare, environmental impact and sustainable development. The page includes dedicated villa insulation types, glazing schedules, AC-unit schedules and solar-power calculations, and links the Dubai Universal Design Code. Because our fictional house is being art-directed for a Dubai-oriented luxury property, these are appropriate realism references when choosing glazing, thermal design, shading, accessibility and mechanical-plant details. Official source: https://www.dm.gov.ae/municipality-business/planning-and-construction/dubai-building-code-2/

### Stairs / egress
For generic plausibility, contemporary dwelling stair geometry should be internally consistent. The 2021 IRC permits dwelling-unit stair risers up to 7 3/4 in (196 mm) and tread depth at least 10 in (254 mm), while the 2024 IBC contains broader stair rules including 7 in (178 mm) maximum / 4 in (102 mm) minimum riser and 11 in (279 mm) minimum tread in its general egress provision, with dwelling-unit exceptions. For a luxury villa visualization, use generous, comfortable proportions rather than pushing code minima; the key is uniformity and believable landings. Sources: ICC 2021 IRC and ICC 2024 IBC.

### Accessibility
ADA is not a Dubai building code and should not be presented as a Dubai requirement. It is useful only as an international accessibility reference. The ADA 2010 standards specify a 32 in (815 mm) minimum clear opening for accessible doors and requirements for accessible routes/turning spaces. For our visualization, include at least one believable step-free route and generous door/corridor clearances where practical.

## Recommended house program for the cinematic walkthrough

### Exterior / arrival
- private drive and gate;
- covered drop-off;
- two-storey facade with believable structural grid;
- stone, timber/metal and large glazed openings;
- architectural landscape lighting;
- mature planting with layers and variation;
- reflecting/infinity pool with realistic coping, overflow and waterline;
- concealed service/utility elements that still make the house believable;
- warm interior glow visible from exterior at dusk.

### Ground floor
1. Entry foyer — double height, console, sculpture, bench, artwork, staircase, feature pendant, concealed storage.
2. Formal living — sectional sofa, lounge chairs, coffee table, rug, fireplace, art, curtains, side tables.
3. Family/media lounge — lower, softer furniture, media wall, books, acoustic treatment, concealed AV.
4. Kitchen — large island, waterfall stone, stools, integrated refrigerator/ovens, cooktop, sink, backsplash, small appliances, pantry access.
5. Dining — 8–10 seat table, statement pendant, sideboard, table setting, artwork, direct terrace relationship.
6. Powder room — vanity, stone, mirror, wall light, accessories.
7. Guest suite — bed, nightstands, wardrobe, lounge chair, artwork, bathroom.
8. Utility/service — laundry/service circulation where architecturally appropriate.
9. Outdoor terrace — dining set, lounge set, fire feature, planters, pool, garden.

### Upper floor
10. Stair landing/gallery — artwork, console, visual connection to foyer.
11. Primary suite — king bed, upholstered wall, bedside tables, bench, lounge chair, rug, curtains, balcony connection.
12. Primary dressing room — wardrobes, island, display lighting, mirror.
13. Primary bathroom — double vanity, stone, freestanding tub, large shower, niche lighting, towels/accessories.
14. Bedroom 2 — queen/king bed, desk, wardrobe, artwork, ensuite.
15. Bedroom 3 — family/teen/guest treatment with desk and storage.
16. Bedroom 4 / office — flexible guest-study room.
17. Shared bath — double or single vanity, tub/shower, toilet enclosure.
18. Upper terrace — outdoor lounge, planters, feature lighting, horizon/view moment.

## Cinematic camera rules

Avoid a generic game-camera fly-through. Use an authored architectural camera path.

- Position and look-at/aim should be independently authored.
- Use smooth centripetal spline interpolation where appropriate.
- Use camera holds at important rooms rather than continuously moving through every second.
- Keep roll near zero unless deliberately used for a single stylized move.
- Use lens/FOV changes sparingly; most shots should feel like a stabilized cinema/architectural camera.
- Prefer slow push-ins, lateral reveals, doorway reveals, corner turns, stair ascents and controlled pull-backs.
- Do not teleport through walls or clip furniture.
- Keep a consistent eye height except for deliberate low/high architectural hero shots.
- Maintain realistic collision/clearance even when the shot is pre-rendered.
- Use environmental parallax: nearby furniture moves more than distant windows/landscape.

## Film language for room-to-room realism

Each room should have a shot purpose instead of being just another location.

- Arrival: establish exterior scale.
- Foyer: reveal vertical volume.
- Living: reveal material layering and glazing.
- Kitchen: show tactile craftsmanship and functional zoning.
- Dining: connect social interior to landscape.
- Stair: provide vertical transition and visual continuity.
- Primary suite: slow intimate movement and softer light.
- Bath: macro material/details, water, reflections.
- Terrace: release the camera into the view.
- Final exterior: return to the whole residence and conversion CTA.

## Realism cues that matter most

### Lighting
Use a coherent time-of-day progression. One possible master sequence is late afternoon -> golden hour -> blue hour -> night. All windows, reflected sky, exterior fixtures and interior practicals must agree with the same sun/environment state.

### Materials
Prioritize PBR correctness, roughness variation, normal detail, bevels and believable scale. Architectural edges should not be razor-perfect. Stone should have large and small variation; wood should have directionality; glass should reflect the environment; metal should vary between polished and satin surfaces.

### Furniture
Furniture is part of scale perception. Keep sofa seat heights, table heights, countertop heights, chair proportions and pendant heights internally believable. Avoid “catalog floating” where furniture is not grounded to the floor or walls.

### Human-scale props
Books, plants, lamps, bottles, towels, art, cushions, kitchen objects, tableware and door hardware provide scale references. A small number of well-placed objects is more convincing than hundreds of decorative assets.

### Sound
Even if the final site starts silent, prepare room-specific sound layers: exterior air, subtle water, HVAC/ambient hush, footsteps, door/lock clicks, kitchen ambience and distant city/garden sound. Avoid generic stock “luxury” sound beds.

## Technical production architecture to implement later

```text
HOUSE MASTER SCENE / RENDER SOURCE
        |
        +--> 4K cinematic camera path
        |       |
        |       +--> 360 / 720-frame master
        |       +--> room-specific hero shots
        |
        +--> Web film plate
        |       +--> desktop WebP/JPEG sequence
        |       +--> mobile compressed video/stills
        |
        +--> Interactive 3D GLB
        |       +--> optional guided walkthrough
        |       +--> hotspots / material states
        |
        +--> 360 panoramas
        |       +--> multires tiles
        |       +--> room scene switching
        |
        +--> optional Gaussian splat capture
                +--> photoreal room exploration
```

## What this changes in our implementation

1. Do **not** treat the current house as a single generic 3D model.
2. Make the pre-rendered film the hero experience.
3. Add a `PropertyTourMode` abstraction so film / 3D / panorama / splat are interchangeable adapters.
4. Add a room metadata schema with room name, floor, camera stations, focal objects, hotspots and CTA timing.
5. Add an architectural collision/clearance authoring pass before final camera export.
6. Add a lighting/time-of-day state shared across all render shots.
7. Add material and furniture style tokens so the whole house reads as one designed residence.
8. Keep mobile as a deliberately authored experience rather than a shrunken desktop.
9. Build the property website around real-estate information hierarchy: residence, rooms, amenities, specifications, location, gallery, enquiry.
10. Keep all code/assets modular and licensed; do not copy proprietary real-estate site assets.

## Important legal/code note

The building-code references above are for architectural plausibility in visualization. They do not certify a house design, permit, structural system, accessibility compliance, fire strategy, MEP design, zoning, or real-estate advertising claim. For an actual property project, the governing local authority, approved plans, licensed professionals and applicable laws control.

## Evidence highlights

- Dubai Municipality confirms the official Dubai Building Code and dedicated villa-related insulation/glazing/AC/solar calculation resources.
- AURIGA demonstrates a complete scroll-driven architectural film with authored camera curves, holds and in-world visual reveals.
- Pannellum and Marzipano demonstrate the room-by-room panorama model used by virtual-tour systems.
- Gaussian-splat projects demonstrate a path from real captured imagery/video to photorealistic browser navigation.
- Modern luxury property case studies consistently emphasize cinematic hero motion, editorial room presentation, restrained interaction and discreet enquiry flows.

## Recommended target

The finished experience should feel like a **private architectural film first, real-estate site second, and 3D viewer third**. The first few scrolls should sell the architecture through light, scale and material realism before exposing technical controls. A visitor should be able to continue straight through the cinematic story, jump directly to a room, or switch into a deeper room-exploration mode without leaving the single-page experience.
