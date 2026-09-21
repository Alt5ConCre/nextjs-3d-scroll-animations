# OpenCode — LuxuryHouse Photorealism Reference Workflow

Project: `LuxuryHouse_Photoreal_WIP.blend`

Before making major Blender changes, inspect this repository reference document:

`docs/PHOTOREALISM_REFERENCE_LIBRARY.md`

Then inspect the local reference library if present:

`C:\Users\USER-89\Desktop\LuxuryHouse_Reference_Library\`

## Goal

Make the existing Blender house look like a real professionally photographed luxury residence.

The target is NOT generic CGI, game graphics, or an architectural illustration.

## Workflow

1. Inspect the current Blender scene before editing.
2. Inspect all available real-photo references.
3. Inspect the 4K video references for camera behavior.
4. Inspect available HDRIs and PBR materials.
5. Identify the biggest visual differences between the render and real photography.
6. Change only the highest-impact items first.

## Priorities

1. Camera realism
2. Physically believable lighting
3. Glass and reflection behavior
4. Hero material response
5. Micro-surface variation
6. Contact shadows
7. Furniture/material scale
8. Plant realism
9. Exterior/background realism
10. Exposure and color management

## Camera requirements

Study real architectural photography.

Avoid:
- excessive wide-angle distortion
- unrealistically low camera height
- perfect CG framing
- excessive depth of field
- artificial sharpening
- excessive bloom

Prefer:
- realistic full-frame camera behavior
- restrained DOF
- natural lens perspective
- realistic exposure
- subtle highlight rolloff
- photographic composition

## Material requirements

Do not make surfaces uniformly perfect.

Add physically plausible variation to:
- roughness
- color
- normal detail
- micro scratches
- subtle edge wear
- natural stone variation
- wood grain
- plaster variation
- fabric response
- metal reflection

Do not destroy the existing architectural design.

## Lighting

Use Cycles.

Test the reference HDRIs against the existing lighting.

The final lighting should produce:
- believable indirect light
- realistic window illumination
- natural shadow softness
- realistic reflections
- believable warm/cool balance
- no blown highlights
- no black crushed interiors

## Video reference

Use video ONLY to study:
- camera height
- camera speed
- acceleration/deceleration
- lens behavior
- framing
- exposure changes
- room transitions

Do not embed copyrighted reference video into the project.

## Render validation

After each major pass:
- render the hero camera
- compare visually against the real-photo references
- inspect glass/reflections
- inspect materials at 100%
- inspect shadow/contact areas
- inspect plants
- inspect window/exterior lighting

Do not declare success because the render is attractive. The criterion is whether it reads as a photograph.

Before any large change, report the exact objects/materials/cameras to be changed and why.
