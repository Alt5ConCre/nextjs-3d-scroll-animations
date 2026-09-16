export type HouseChapter = {
  id: string;
  navLabel: string;
  kicker: string;
  title: string;
  description: string;
  start: number;
  end: number;
  frameStart: number;
  frameEnd: number;
  mobileVideo: string;
};

/**
 * Replace frameCount and asset paths when the final 4K house sequence is rendered.
 * Frame names are expected as frame_0001.webp ... frame_0360.webp by default.
 */
export const HOUSE_SEQUENCE = {
  frameCount: 360,
  frameDigits: 4,
  framePath: "/house/frames",
  framePrefix: "frame_",
  frameSuffix: ".webp",
  poster: "/house/poster.webp",
  desktopMinWidth: 769,
  scrollHeightVh: 760,
};

export const HOUSE_CHAPTERS: HouseChapter[] = [
  {
    id: "exterior-arrival",
    navLabel: "Arrival",
    kicker: "01 / ARRIVAL",
    title: "Architecture, composed for arrival.",
    description: "A slow approach reveals the two-storey silhouette, landscaping, stone, timber and glass as the house emerges from dusk.",
    start: 0,
    end: 0.13,
    frameStart: 0,
    frameEnd: 54,
    mobileVideo: "/house/mobile/01-arrival.mp4",
  },
  {
    id: "foyer",
    navLabel: "Foyer",
    kicker: "02 / FOYER",
    title: "First light. First impression.",
    description: "Double-height entry, sculptural staircase, limestone flooring and a tailored console create the visual threshold into the home.",
    start: 0.13,
    end: 0.25,
    frameStart: 55,
    frameEnd: 103,
    mobileVideo: "/house/mobile/02-foyer.mp4",
  },
  {
    id: "living",
    navLabel: "Living",
    kicker: "03 / LIVING",
    title: "Open space, precisely layered.",
    description: "A double-height living room connects warm oak, neutral upholstery, artwork, fireplace geometry and floor-to-ceiling glazing.",
    start: 0.25,
    end: 0.39,
    frameStart: 104,
    frameEnd: 153,
    mobileVideo: "/house/mobile/03-living.mp4",
  },
  {
    id: "kitchen",
    navLabel: "Kitchen",
    kicker: "04 / KITCHEN",
    title: "A kitchen designed around the island.",
    description: "Fluted cabinetry, veined stone, integrated appliances, sculptural pendants and dining moments sit inside one continuous composition.",
    start: 0.39,
    end: 0.52,
    frameStart: 154,
    frameEnd: 200,
    mobileVideo: "/house/mobile/04-kitchen.mp4",
  },
  {
    id: "dining-patio",
    navLabel: "Dining + Patio",
    kicker: "05 / DINING + PATIO",
    title: "Inside flows into the evening.",
    description: "The dining room opens to a covered terrace, pool edge and garden, extending the architecture into the landscape.",
    start: 0.52,
    end: 0.65,
    frameStart: 201,
    frameEnd: 247,
    mobileVideo: "/house/mobile/05-dining-patio.mp4",
  },
  {
    id: "primary-suite",
    navLabel: "Primary Suite",
    kicker: "06 / PRIMARY SUITE",
    title: "Quiet luxury upstairs.",
    description: "A calm bedroom palette, lounge chair, upholstered bed wall, soft lighting and private balcony create the private retreat.",
    start: 0.65,
    end: 0.78,
    frameStart: 248,
    frameEnd: 294,
    mobileVideo: "/house/mobile/06-primary-suite.mp4",
  },
  {
    id: "bath-terrace",
    navLabel: "Bath + Terrace",
    kicker: "07 / BATH + TERRACE",
    title: "The final reveal is above it all.",
    description: "Stone bathroom details transition to the upper terrace, where architecture, water, planting and skyline finish the walkthrough.",
    start: 0.78,
    end: 0.93,
    frameStart: 295,
    frameEnd: 334,
    mobileVideo: "/house/mobile/07-bath-terrace.mp4",
  },
  {
    id: "private-tour",
    navLabel: "Private Tour",
    kicker: "08 / PRIVATE TOUR",
    title: "Walk through it in person.",
    description: "The sequence settles on the complete residence before the invitation to schedule a private tour.",
    start: 0.93,
    end: 1,
    frameStart: 335,
    frameEnd: 359,
    mobileVideo: "/house/mobile/08-private-tour.mp4",
  },
];

export function frameSrc(index: number) {
  const padded = String(index + 1).padStart(HOUSE_SEQUENCE.frameDigits, "0");
  return `${HOUSE_SEQUENCE.framePath}/${HOUSE_SEQUENCE.framePrefix}${padded}${HOUSE_SEQUENCE.frameSuffix}`;
}
