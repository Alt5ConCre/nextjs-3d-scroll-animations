# Real-Estate Media Asset Board

Prepared for the existing cinematic house walkthrough.

## Integration target

Existing project: `nextjs-3d-scroll-animations`

Current walkthrough already expects:

- Desktop cinematic video: `/house/media/luxury-house-master-4k.mp4`
- Poster: `/house/poster.webp`
- Architectural GLB: `/house/models/luxury-house-architectural.glb`
- Mobile chapter videos: `/house/mobile/01.mp4` through `/house/mobile/08.mp4`

The new media should be treated as a separate asset set first, then integrated into the existing scene without removing the current 3D architecture.

## Selected visual direction

1. **Hero / arrival** — modern luxury residence, glass facade, pool, dusk lighting.
2. **Apartment / urban context** — contemporary multi-storey residential architecture.
3. **Villa / pool** — low horizontal geometry, glass, stone and warm interior lighting.
4. **Architecture motion** — slow exterior building movement, drone/aerial approaches, architectural details.
5. **Construction / development** — optional transition material for an architecture/process chapter.

## Reference sources

These are reference/search pages rather than downloaded copyrighted files. Before adding files to `public/house/media/`, use assets whose license permits the intended website use.

### Free photo references

- Unsplash — Modern house: https://unsplash.com/s/photos/modern-house
- Unsplash — Modern architecture house: https://unsplash.com/s/photos/modern-architecture-house
- Unsplash — Modern architecture: https://unsplash.com/s/photos/modern-architecture
- Unsplash — Modern building: https://unsplash.com/s/photos/modern-building

### Free video references

- Pexels — 4K buildings: https://www.pexels.com/search/videos/4k%20buildings/
- Pexels — Architects: https://www.pexels.com/search/videos/architects/
- Pexels — Modern building: https://www.pexels.com/search/videos/modern%20building/
- Pexels — Architecture design: https://www.pexels.com/search/videos/architecture%20design/
- Pexels — Architectural landscape: https://www.pexels.com/search/videos/architectural%20landscape/

## Search examples reviewed

The web image search returned useful architectural references including:

- A glass-and-timber luxury residence with an infinity pool.
- A contemporary multi-storey apartment building with illuminated glazing.
- A minimalist villa with a pool and floor-to-ceiling glazing.
- A modern hillside villa with a pool and strong horizontal cantilevers.

These are visual references only; they should not be copied into production unless their usage rights are confirmed.

## Proposed local asset layout

```text
public/house/media/
  real-estate/
    hero/
    exterior/
    apartment/
    villa/
    interior/
    aerial/
    details/

public/house/stills/
  real-estate/
    hero/
    exterior/
    interior/
```

## Integration plan

- Keep the existing GLB and cinematic scroll system intact.
- Add selected licensed 4K stills as transitional image layers between 3D chapters.
- Add selected licensed video clips as short cinematic cutaways, especially for arrival and exterior chapters.
- Use `object-fit: cover`, lazy loading, poster frames, and responsive sources so the asset layer does not unnecessarily increase initial load.
- Keep mobile media separate from desktop media.
- Do not replace the existing 3D scene with stock imagery; the real media should complement the 3D walkthrough.

## Next step

After licensed source files are placed in the local asset folders, wire them into `HouseWalkthrough` and `house-config.ts` as chapter media while preserving the current 3D camera sequence.
