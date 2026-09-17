# Real Estate Media — Final Chapter Board

Branch: `real-estate-media-experiment`

The experiment keeps the desktop real-time GLB/cinematic camera experience intact. The researched stock clips below are wired into the existing mobile chapter video layer so the branch can be previewed without committing large binary video files to Git.

All selected pages currently show Pexels' Free/Free to use licensing indicator. Verify the current Pexels license again before final production deployment.

| Chapter | Exact role | Selected clip | Format | Direct video used by experiment |
|---|---|---|---|---|
| 01 Arrival | Aerial approach / exterior reveal | https://www.pexels.com/video/aerial-view-of-luxury-and-modern-design-home-17224719/ | 3840x2160, 16:9, 5s | https://videos.pexels.com/video-files/17224719/17224719-uhd_3840_2160_30fps.mp4 |
| 02 Foyer | Architectural entry / staircase | https://www.pexels.com/video/a-modern-staircase-design-7239156/ | UHD 4K source | https://videos.pexels.com/video-files/7239156/7239156-uhd_3840_2160_25fps.mp4 |
| 03 Living | Warm modern living room | https://www.pexels.com/video/modern-house-interior-5744424/ | UHD 4K source | https://videos.pexels.com/video-files/5744424/5744424-uhd_3840_2160_30fps.mp4 |
| 04 Kitchen | Island / lighting / premium kitchen | https://www.pexels.com/video/modern-kitchen-interior-design-15887128/ | 3840x2160, 16:9, 15s | https://videos.pexels.com/video-files/15887128/15887128-uhd_3840_2160_30fps.mp4 |
| 05 Dining + Patio | Residence / pool / garden connection | https://www.pexels.com/video/modern-luxury-house-with-infinity-pool-view-32456138/ | 3840x2160, 16:9, 60fps source | https://videos.pexels.com/video-files/32456138/13842188_3840_2160_60fps.mp4 |
| 06 Primary Suite | Warm, quiet modern bedroom | https://www.pexels.com/video/cozy-modern-bedroom-interior-with-soft-lighting-35364127/ | 3840x2160, 16:9, 13s | https://videos.pexels.com/video-files/35364127/14983714_3840_2160_25fps.mp4 |
| 07 Bath + Terrace | Bathroom detail | https://www.pexels.com/video/modern-hotel-bathroom-interior-with-sink-and-mirror-29455653/ | 3840x2160, 16:9, 6s | https://videos.pexels.com/video-files/29455653/12679960_3840_2160_25fps.mp4 |
| 08 Private Tour | Single-villa aerial closing reveal | https://www.pexels.com/video/an-aerial-view-of-a-house-with-a-pool-and-a-garden-28448027/ | UHD 4K source | https://videos.pexels.com/video-files/28448027/12385951_3840_2160_30fps.mp4 |

## Design intent

- Desktop: preserve the existing GLB, cinematic camera, scroll runtime, chapter overlays and real-time rendering.
- Mobile: replace generic `/house/mobile/*.mp4` placeholders with chapter-specific researched footage.
- Avoid using a stock clip as the entire identity of the site; clips are supporting architectural cutaways.
- Chapter 07 intentionally uses the bathroom as the mobile focal shot; the terrace remains represented by the desktop GLB/cinematic sequence and can receive a second licensed cutaway later.
- Chapter 08 uses a single-villa aerial view rather than a generic neighborhood shot to make the final property reveal specific to the residence story.

## Source verification notes

The selected Pexels pages were checked during the September 17, 2026 research pass. Pexels currently labels these selected assets as free/free to use on their pages. The direct CDN URLs are used only for this experiment; for production, prefer downloading the licensed assets into the project's media storage/CDN rather than relying on third-party hotlinking.
