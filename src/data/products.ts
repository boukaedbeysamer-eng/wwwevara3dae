export type FrameFinish = "White Matt" | "Matte Black" | "Wooden";
export type MapColor = "Black" | "White" | "Green" | "Wooden";
export type TrackColor = "Red" | "Black" | "Orange";

export const FRAME_FINISHES: FrameFinish[] = ["White Matt", "Matte Black", "Wooden"];
export const MAP_COLORS: MapColor[] = ["Black", "White", "Green", "Wooden"];
export const TRACK_COLORS: TrackColor[] = ["Red", "Black", "Orange"];

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
    tagline: "The first finish line, framed.",
    priceAed: 200,
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
    tagline: "Your medal deserves a home.",
    priceAed: 250,
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
    tagline: "Map, medal, and BIB — together.",
    priceAed: 350,
    frameSize: "28 × 50 cm deep frame",
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
    tagline: "Your route, standing tall.",
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

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
