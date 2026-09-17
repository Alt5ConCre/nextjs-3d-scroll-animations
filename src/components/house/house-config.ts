export type HouseChapter = {
  id: string;
  navLabel: string;
  kicker: string;
  title: string;
  description: string;
  start: number;
  end: number;
  mobileVideo: string;
};

export type HouseMediaReference = {
  chapterId: string;
  source: "Pexels";
  sourcePage: string;
  videoUrl: string;
  purpose: string;
};

export const HOUSE_SEQUENCE = {
  desktopVideo: "/house/media/luxury-house-master-4k.mp4",
  poster: "/house/poster.webp",
  model: "/house/models/luxury-house-architectural.glb",
  desktopMinWidth: 769,
  scrollHeightVh: 760,
};

// Vercel Blob hosts the large mobile cutaways so video binaries stay out of Git.
// Desktop remains the real-time GLB experience; these clips power the mobile
// chapter cards without changing the existing 3D cinematic sequence.
export const HOUSE_MEDIA_REFERENCES: HouseMediaReference[] = [
  { chapterId: "exterior-arrival", source: "Pexels", sourcePage: "https://www.pexels.com/video/aerial-view-of-luxury-and-modern-design-home-17224719/", videoUrl: "https://67ynp4dqdqi5qa17.public.blob.vercel-storage.com/house/real-estate/01-arrival-ETiiPlpT2xdwPOyx4psvKsk04qYv44.mp4", purpose: "Modern luxury-home aerial approach and exterior reveal." },
  { chapterId: "foyer", source: "Pexels", sourcePage: "https://www.pexels.com/video/a-modern-staircase-design-7239156/", videoUrl: "https://67ynp4dqdqi5qa17.public.blob.vercel-storage.com/house/real-estate/02-foyer.mp4", purpose: "Architectural staircase and entry transition." },
  { chapterId: "living", source: "Pexels", sourcePage: "https://www.pexels.com/video/modern-house-interior-5744424/", videoUrl: "https://67ynp4dqdqi5qa17.public.blob.vercel-storage.com/house/real-estate/03-living.mp4", purpose: "Warm modern living room with glazing, greenery and neutral materials." },
  { chapterId: "kitchen", source: "Pexels", sourcePage: "https://www.pexels.com/video/a-couple-checking-out-kitchen-cabinet-designs-4824593/", videoUrl: "https://67ynp4dqdqi5qa17.public.blob.vercel-storage.com/house/real-estate/04-kitchen.mp4", purpose: "Modern kitchen cabinetry and island-focused design reference." },
  { chapterId: "dining-patio", source: "Pexels", sourcePage: "https://www.pexels.com/video/modern-luxury-house-with-infinity-pool-view-32456138/", videoUrl: "https://67ynp4dqdqi5qa17.public.blob.vercel-storage.com/house/real-estate/05-dining-patio.mp4", purpose: "Luxury residence, patio, pool and garden connection." },
  { chapterId: "primary-suite", source: "Pexels", sourcePage: "https://www.pexels.com/video/cozy-modern-bedroom-interior-with-soft-lighting-35364127/", videoUrl: "https://67ynp4dqdqi5qa17.public.blob.vercel-storage.com/house/real-estate/06-primary-suite.mp4", purpose: "Warm modern bedroom suitable for the quiet-luxury suite chapter." },
  { chapterId: "bath-terrace", source: "Pexels", sourcePage: "https://www.pexels.com/video/video-of-a-luxurious-bathroom-7578551/", videoUrl: "https://67ynp4dqdqi5qa17.public.blob.vercel-storage.com/house/real-estate/07-bathroom.mp4", purpose: "Luxury bathroom detail; terrace remains a separate exterior beat in the desktop GLB sequence." },
  { chapterId: "private-tour", source: "Pexels", sourcePage: "https://www.pexels.com/video/aerial-footage-of-a-villa-8960469/", videoUrl: "https://67ynp4dqdqi5qa17.public.blob.vercel-storage.com/house/real-estate/08-private-tour.mp4", purpose: "Single-villa aerial closing reveal with pool and terrace." },
];

const MEDIA_BY_CHAPTER = Object.fromEntries(
  HOUSE_MEDIA_REFERENCES.map((media) => [media.chapterId, media.videoUrl])
) as Record<string, string>;

export const HOUSE_CHAPTERS: HouseChapter[] = [
  { id: "exterior-arrival", navLabel: "Arrival", kicker: "01 / ARRIVAL", title: "Architecture, composed for arrival.", description: "A slow approach reveals the two-storey silhouette, landscaping, stone, timber and glass as the house emerges from dusk.", start: 0, end: 0.13, mobileVideo: MEDIA_BY_CHAPTER["exterior-arrival"] },
  { id: "foyer", navLabel: "Foyer", kicker: "02 / FOYER", title: "First light. First impression.", description: "Double-height entry, sculptural staircase, limestone flooring and a tailored console create the visual threshold into the home.", start: 0.13, end: 0.25, mobileVideo: MEDIA_BY_CHAPTER["foyer"] },
  { id: "living", navLabel: "Living", kicker: "03 / LIVING", title: "Open space, precisely layered.", description: "A double-height living room connects warm oak, neutral upholstery, artwork, fireplace geometry and floor-to-ceiling glazing.", start: 0.25, end: 0.39, mobileVideo: MEDIA_BY_CHAPTER["living"] },
  { id: "kitchen", navLabel: "Kitchen", kicker: "04 / KITCHEN", title: "A kitchen designed around the island.", description: "Fluted cabinetry, veined stone, integrated appliances, sculptural pendants and dining moments sit inside one continuous composition.", start: 0.39, end: 0.52, mobileVideo: MEDIA_BY_CHAPTER["kitchen"] },
  { id: "dining-patio", navLabel: "Dining + Patio", kicker: "05 / DINING + PATIO", title: "Inside flows into the evening.", description: "The dining room opens to a covered terrace, pool edge and garden, extending the architecture into the landscape.", start: 0.52, end: 0.65, mobileVideo: MEDIA_BY_CHAPTER["dining-patio"] },
  { id: "primary-suite", navLabel: "Primary Suite", kicker: "06 / PRIMARY SUITE", title: "Quiet luxury upstairs.", description: "A calm bedroom palette, lounge chair, upholstered bed wall, soft lighting and private balcony create the private retreat.", start: 0.65, end: 0.78, mobileVideo: MEDIA_BY_CHAPTER["primary-suite"] },
  { id: "bath-terrace", navLabel: "Bath + Terrace", kicker: "07 / BATH + TERRACE", title: "The final reveal is above it all.", description: "Stone bathroom details transition to the upper terrace, where architecture, water, planting and skyline finish the walkthrough.", start: 0.78, end: 0.93, mobileVideo: MEDIA_BY_CHAPTER["bath-terrace"] },
  { id: "private-tour", navLabel: "Private Tour", kicker: "08 / PRIVATE TOUR", title: "Walk through it in person.", description: "The sequence settles on the complete residence before the invitation to schedule a private tour.", start: 0.93, end: 1, mobileVideo: MEDIA_BY_CHAPTER["private-tour"] },
];
