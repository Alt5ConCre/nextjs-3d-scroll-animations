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

export const HOUSE_SEQUENCE = {
  desktopVideo: "/house/media/luxury-house-master-4k.mp4",
  poster: "/house/poster.webp",
  desktopMinWidth: 769,
  scrollHeightVh: 760,
};

export const HOUSE_CHAPTERS: HouseChapter[] = [
  { id: "exterior-arrival", navLabel: "Arrival", kicker: "01 / ARRIVAL", title: "Architecture, composed for arrival.", description: "A slow approach reveals the two-storey silhouette, landscaping, stone, timber and glass as the house emerges from dusk.", start: 0, end: 0.13, mobileVideo: "/house/mobile/01.mp4" },
  { id: "foyer", navLabel: "Foyer", kicker: "02 / FOYER", title: "First light. First impression.", description: "Double-height entry, sculptural staircase, limestone flooring and a tailored console create the visual threshold into the home.", start: 0.13, end: 0.25, mobileVideo: "/house/mobile/02.mp4" },
  { id: "living", navLabel: "Living", kicker: "03 / LIVING", title: "Open space, precisely layered.", description: "A double-height living room connects warm oak, neutral upholstery, artwork, fireplace geometry and floor-to-ceiling glazing.", start: 0.25, end: 0.39, mobileVideo: "/house/mobile/03.mp4" },
  { id: "kitchen", navLabel: "Kitchen", kicker: "04 / KITCHEN", title: "A kitchen designed around the island.", description: "Fluted cabinetry, veined stone, integrated appliances, sculptural pendants and dining moments sit inside one continuous composition.", start: 0.39, end: 0.52, mobileVideo: "/house/mobile/04.mp4" },
  { id: "dining-patio", navLabel: "Dining + Patio", kicker: "05 / DINING + PATIO", title: "Inside flows into the evening.", description: "The dining room opens to a covered terrace, pool edge and garden, extending the architecture into the landscape.", start: 0.52, end: 0.65, mobileVideo: "/house/mobile/05.mp4" },
  { id: "primary-suite", navLabel: "Primary Suite", kicker: "06 / PRIMARY SUITE", title: "Quiet luxury upstairs.", description: "A calm bedroom palette, lounge chair, upholstered bed wall, soft lighting and private balcony create the private retreat.", start: 0.65, end: 0.78, mobileVideo: "/house/mobile/06.mp4" },
  { id: "bath-terrace", navLabel: "Bath + Terrace", kicker: "07 / BATH + TERRACE", title: "The final reveal is above it all.", description: "Stone bathroom details transition to the upper terrace, where architecture, water, planting and skyline finish the walkthrough.", start: 0.78, end: 0.93, mobileVideo: "/house/mobile/07.mp4" },
  { id: "private-tour", navLabel: "Private Tour", kicker: "08 / PRIVATE TOUR", title: "Walk through it in person.", description: "The sequence settles on the complete residence before the invitation to schedule a private tour.", start: 0.93, end: 1, mobileVideo: "/house/mobile/08.mp4" },
];
