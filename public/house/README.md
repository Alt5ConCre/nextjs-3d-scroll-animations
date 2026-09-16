# Luxury House Walkthrough Assets

Place the production assets here without changing the component contract.

## Desktop Canvas sequence

`public/house/frames/frame_0001.webp` ... `frame_0360.webp`

Recommended delivery target: 16:9, 4K master rendered offline, web derivative optimized for performance. The current scaffold blocks desktop scrolling until the configured frame set has finished loading.

## Poster

`public/house/poster.webp`

Use the final exterior hero frame or an independently graded still.

## Mobile clips

`public/house/mobile/01-arrival.mp4`
`public/house/mobile/02-foyer.mp4`
`public/house/mobile/03-living.mp4`
`public/house/mobile/04-kitchen.mp4`
`public/house/mobile/05-dining-patio.mp4`
`public/house/mobile/06-primary-suite.mp4`
`public/house/mobile/07-bath-terrace.mp4`
`public/house/mobile/08-private-tour.mp4`

Mobile uses short muted loopable clips with IntersectionObserver autoplay/pause instead of frame-by-frame scrubbing.

## Optional future tiers

Add separate folders such as `frames-high`, `frames-medium`, and `frames-low` when a quality policy is introduced. Keep the same logical frame order.

The implementation does not require these folders yet.
