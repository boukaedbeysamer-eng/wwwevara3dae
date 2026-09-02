export type FrameFinish = "White Matte" | "Matte Black" | "Wooden";
export type MapColor = "Black" | "White" | "Green" | "Wooden";
export type TrackColor = "Red" | "Black" | "Orange" | "White";

export const FRAME_FINISHES: FrameFinish[] = ["White Matte", "Matte Black", "Wooden"];
export const MAP_COLORS: MapColor[] = ["Black", "White", "Green", "Wooden"];
export const TRACK_COLORS: TrackColor[] = ["Red", "Black", "Orange"];
export const TEXT_COLORS: TrackColor[] = ["White", "Black"];
export const HYROX_DISPLAY_COLORS: MapColor[] = ["Black", "White", "Wooden"];

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  priceAed: number;
  frameSize: string;
  mapSize: string;
  includes: string[];
  story: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "keepsaker",
    name: "Keepsaker",
    tagline: "The first finish line, framed.\n21 × 30 CM DEEP FRAME",
    priceAed: 220,
    frameSize: "21 × 30 cm deep frame",
    mapSize: "10 × 11 cm 3D-printed terrain",
    includes: [
      "Custom 3D-printed topographic terrain of your run",
      "Printed run stats: Race name, distance, elevation gain, date.",
      "Deep shadow-box frame, ready to hang",
    ],
    story: "Frame your first Run, first Race or first Ultra.",
  },
  {
    slug: "achiever",
    name: "Achiever",
    tagline: "Your medal deserves to be well preserved.\u00a0 30 × 40 CM DEEP FRAME\u00a0",
    priceAed: 260,
    frameSize: "30 × 40 cm deep frame",
    mapSize: "11 × 12 cm 3D-printed terrain",
    includes: [
      "Custom 3D-printed topographic terrain of your run",
      "Printed run stats: Race name, distance, elevation gain, date.",
      "Integrated medal hanger",
      "Deep shadow-box frame, ready to hang",
    ],
    story: "Race day shouldn't live in a drawer. The Achiever pairs the elevation profile you earned with the medal you came home with — one object, one story.",
  },
  {
    slug: "legacy",
    name: "Legacy",
    tagline: "Map, medal, and BIB — together.\u00a0\n28 × 55 CM DEEP FRAME\u00a0",
    priceAed: 350,
    frameSize: "28 × 55 CM DEEP FRAME",
    mapSize: "11 × 12 cm 3D-printed terrain",
    includes: [
      "Custom 3D-printed topographic terrain of your run",
      "Printed run stats: Race name, distance, elevation gain, date.",
      "Integrated medal hanger",
      "BIB number display",
      "Deep shadow-box frame, ready to hang",
    ],
    story: "The full memory: the course beneath your feet, the number on your chest, the medal around your neck. Built for the races you'll be telling stories about in twenty years.",
  },
  {
    slug: "3d-map-display",
    name: "3D HEX MAP DISPLAY WITH STAND",
    tagline: "Your route, standing tall.\u00a0\n13 × 11 × 3 CM\u00a0",
    priceAed: 100,
    frameSize: "130 × 110 × 30 mm",
    mapSize: "3D-printed terrain with stand",
    includes: [
      "Custom 3D-printed topographic terrain of your run",
      "Movable display stand",
      "Printed run stats: Race name, distance, elevation gain, date.",
    ],
    story: "A 3D-printed map of your run, mounted on its own stand — perfect for desks, shelves, or anywhere you want to relive the route.",
  },
];

export const HYROX_PRODUCTS: Product[] = [
  {
    slug: "hyrox-hex",
    name: "HYROX HEX DISPLAY WITH STAND",
    tagline: "Your HYROX race keepsake in 3D.",
    priceAed: 125,
    frameSize: "17 × 15 × 1.5 cm",
    mapSize: "3D-printed hexagonal display with stand",
    includes: [
      "Custom 3D-printed hexagonal Hyrox display",
      "Personalised athlete name, division/season",
      "Race date and finish time",
      "Display stand included with a wall-mountable.",
    ],
    story:
      "A custom 3D-printed hexagonal display piece commemorating a Hyrox race — personalized with the athlete's name, division/season, race date, and finish time. Comes with a stand and can also be wall-mounted.",
  },
];

export const ALL_PRODUCTS: Product[] = [...PRODUCTS, ...HYROX_PRODUCTS];

export const getProduct = (slug: string) => ALL_PRODUCTS.find((p) => p.slug === slug);
