import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import frameLegendary from "@/assets/carousel/frame-legendary.jpg.asset.json";
import frameSlmt from "@/assets/carousel/frame-slmt.jpg.asset.json";
import frameMushrif from "@/assets/carousel/frame-mushrif.jpg.asset.json";
import frameGoatUltra from "@/assets/carousel/frame-goat-ultra.jpg.asset.json";
import frameGoatUltraStand from "@/assets/carousel/frame-goat-ultra-stand.jpg.asset.json";
import frameGoatTrailRace from "@/assets/carousel/frame-goat-trail-race.jpg.asset.json";
import frameLisKalba from "@/assets/carousel/frame-lis-kalba.jpg.asset.json";
import frameLisKalbaStand from "@/assets/carousel/frame-lis-kalba-stand.jpg.asset.json";
import frameGoatMedal from "@/assets/carousel/frame-goat-medal.jpg.asset.json";
import frameLegacyGoat from "@/assets/gallery/IMG_6698-2.PNG.asset.json";
import frameGoatYellow from "@/assets/gallery/goat-yellow-frame.png.asset.json";
import photoLisKalbaHex from "@/assets/gallery/lis-kalba-hex-photoshoot.png.asset.json";
import photoGoatUltraTrail from "@/assets/gallery/goat-ultra-trail-photoshoot.png.asset.json";
import photoSlmt from "@/assets/gallery/slmt-photoshoot.png.asset.json";
import photoMushrif from "@/assets/gallery/mushrif-photoshoot.png.asset.json";
import photoGoatMedalWhite from "@/assets/gallery/goat-ultra-medal-white-frame.jpeg.asset.json";
import photoGoatKarisBlack from "@/assets/gallery/goat-ultra-karis-black-frame.jpeg.asset.json";
import photoCappadociaWallWhite from "@/assets/gallery/IMG_7290.jpeg.asset.json";
import photoCappadociaDesk from "@/assets/gallery/IMG_7292-2.jpeg.asset.json";
import photoCappadociaAngle from "@/assets/gallery/IMG_7310.jpeg.asset.json";
import photoCappadociaMedalAngle from "@/assets/gallery/IMG_7311.jpeg.asset.json";
import hyroxArena from "@/assets/gallery/hyrox-istanbul-arena.png.asset.json";
import hyroxAmir from "@/assets/gallery/hyrox-istanbul-amir.jpeg.asset.json";
import hyroxRawad from "@/assets/gallery/hyrox-istanbul-rawad.jpg.asset.json";
import hyroxRawadAngle from "@/assets/gallery/hyrox-istanbul-rawad-angle.jpg.asset.json";
import hyroxDoublesStudio from "@/assets/gallery/hyrox-istanbul-doubles-studio.png.asset.json";
import hyroxDoublesHand from "@/assets/gallery/hyrox-istanbul-doubles-hand.jpg.asset.json";
import hyroxDoublesShelf from "@/assets/gallery/hyrox-istanbul-doubles-shelf.jpg.asset.json";
import flaskWhiteStudio from "@/assets/gallery/flask-white-studio.webp.asset.json";
import flaskBlackStudio from "@/assets/gallery/flask-black-studio.png.asset.json";
import flaskBlueStand from "@/assets/gallery/flask-blue-stand.webp.asset.json";
import flaskBlueStudio from "@/assets/gallery/flask-blue-studio.png.asset.json";
import flaskBlueCounter from "@/assets/gallery/flask-blue-counter.png.asset.json";
import flaskBlueReal from "@/assets/gallery/flask-blue-real.jpeg.asset.json";

type GalleryImage = {
  src: string;
  title: string;
  caption: string;
};

type GalleryFolder = {
  id: string;
  label: string;
  description: string;
  images: GalleryImage[];
};

const TRAIL_RUNNING_IMAGES: GalleryImage[] = [
  { src: photoCappadociaWallWhite.url, title: "Cappadocia Ultra Trail Run — White Frame", caption: "63KM ultra with finisher medal in a white deep frame." },
  { src: photoCappadociaDesk.url, title: "Cappadocia Ultra Trail Run — Desk Display", caption: "Hex relief and medal, framed in white." },
  { src: photoCappadociaAngle.url, title: "Cappadocia Ultra Trail Run — Angle View", caption: "Blue hex relief with orange route line." },
  { src: photoCappadociaMedalAngle.url, title: "Cappadocia Ultra Trail Run — Medal Detail", caption: "Salomon Cappadocia finisher medal mounted on the hex." },
  { src: photoGoatMedalWhite.url, title: "GOAT Ultra Trail Race — White Frame with Medal", caption: "White frame with hex relief and 100KM finisher medal." },
  { src: photoGoatKarisBlack.url, title: "GOAT Ultra Trail Race — Karis Miriam Brown", caption: "Black frame with hex relief — 98.61KM." },
  { src: frameLegendary.url, title: "PORTABLE 3D HEX MAP DISPLAY", caption: "Premium stand-mounted relief for your proudest moment." },
  { src: photoGoatUltraTrail.url, title: "GOAT Ultra Trail Race — Framed", caption: "98.61KM ultra in a deep shadow-box frame." },
  { src: photoSlmt.url, title: "Spring Lebanon Mountain Trail — Framed", caption: "Framed relief of the SLMT route — Choucrallah Karam." },
  { src: photoMushrif.url, title: "Mushrif Park Run — Oak Frame", caption: "Oak-framed 8KM Mushrif Park route." },
  { src: photoLisKalbaHex.url, title: "Lis Kalba Hex — 8.7KM", caption: "Hex relief plaque of the 8.7KM Kalba route." },
  { src: frameSlmt.url, title: "Spring Lebanon Mountain Trail", caption: "Framed relief of the SLMT route — Choucrallah Karam." },
  { src: frameMushrif.url, title: "Mushrif Park Run", caption: "Oak-framed 8KM Mushrif Park route in the UAE." },
  { src: frameGoatTrailRace.url, title: "GOAT Ultra Trail Race", caption: "98.61KM ultra in a deep shadow-box frame." },
  { src: frameGoatMedal.url, title: "GOAT ULTRA TRAIL RACE — MEDAL FRAME", caption: "Shadow-box frame with hex relief and 100KM finisher medal." },
  { src: frameLegacyGoat.url, title: "Legacy", caption: "Map, medal, and BIB — together." },
  { src: frameGoatUltra.url, title: "GOAT Ultra Hex", caption: "Standalone hex plaque — 100KM, 6450M elevation." },
  { src: frameGoatUltraStand.url, title: "GOAT ULTRA HEX WITH STAND", caption: "Hex relief paired with a honeycomb display stand." },
  { src: frameLisKalba.url, title: "Lis Kalba Hex", caption: "Hex relief plaque of the 8.7KM Kalba route." },
  { src: frameLisKalbaStand.url, title: "LIS KALBA HEX WITH STAND", caption: "Kalba hex paired with a honeycomb display stand." },
  { src: frameGoatYellow.url, title: "GOAT ULTRA TRAIL RACE 50KM — WHITE FRAME", caption: "50KM finisher medal display with a 3D Printed relief in a bold white frame." },
];

const HYROX_IMAGES: GalleryImage[] = [
  { src: hyroxDoublesStudio.url, title: "HYROX Istanbul — Manuel & Tarek", caption: "Pro Doubles hex display with stand — 1 AUG 2026, 1:01:46." },
  { src: hyroxDoublesHand.url, title: "HYROX Istanbul — Doubles Hex In Hand", caption: "Black hex display with white race plate and gold lettering." },
  { src: hyroxDoublesShelf.url, title: "HYROX Istanbul — Shelf Display", caption: "Stand-mounted hex display alongside race trophies." },
  { src: hyroxArena.url, title: "HYROX Istanbul — Amir Boureslan", caption: "3D-printed hex display photographed at the HYROX Istanbul arena." },
  { src: hyroxAmir.url, title: "HYROX Istanbul — Open Singles 2026/2027", caption: "Black hex display with race date and finish time." },
  { src: hyroxRawad.url, title: "HYROX Istanbul — Rawad Eid", caption: "Pro Singles hex display with white race plate." },
  { src: hyroxRawadAngle.url, title: "HYROX Istanbul — Hex Display Angle", caption: "Stand-mounted hex display, side view." },
];

const FLASK_STAND_IMAGES: GalleryImage[] = [
  { src: flaskWhiteStudio.url, title: "Soft Flask Drying Stand — White", caption: "White drying stand with honeycomb drainage tray." },
  { src: flaskBlackStudio.url, title: "Soft Flask Drying Stand — Black", caption: "Matte black stand with twin drying posts." },
  { src: flaskBlueStand.url, title: "Soft Flask Drying Stand — Blue", caption: "Blue stand with honeycomb tray and drip base." },
  { src: flaskBlueStudio.url, title: "Soft Flask Drying Stand — In Use", caption: "Two soft flasks drying upside down on the blue tray." },
  { src: flaskBlueCounter.url, title: "Soft Flask Drying Stand — Kitchen Counter", caption: "Blue stand keeping flasks and caps drying on marble." },
  { src: flaskBlueReal.url, title: "Soft Flask Drying Stand — Everyday Use", caption: "Blue stand drying flasks and bite valves after a run." },
];

const FOLDERS: GalleryFolder[] = [
  {
    id: "trail-running",
    label: "Trail Running",
    description: "Every frame tells a story. Browse real pieces made for runners, athletes, and adventurers across the region.",
    images: TRAIL_RUNNING_IMAGES,
  },
  {
    id: "hyrox",
    label: "HYROX",
    description: "Custom 3D-printed Hyrox hex displays. Personalised with athlete name, division, race date, and finish time.",
    images: HYROX_IMAGES,
  },
  {
    id: "soft-flask-drying-stand",
    label: "Soft Flask Drying Stand",
    description: "3D-printed soft flask drying stands — honeycomb drainage tray and twin posts, available in white, black, and blue.",
    images: FLASK_STAND_IMAGES,
  },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Evara3D" },
      { name: "description", content: "Explore custom 3D-printed topographic relief frames created by Evara3D." },
      { property: "og:title", content: "Gallery — Evara3D" },
      { property: "og:description", content: "Explore custom 3D-printed topographic relief frames created by Evara3D." },
      { property: "og:url", content: "https://evara3d.ae/gallery" },
    ],
    links: [{ rel: "canonical", href: "https://evara3d.ae/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [activeFolder, setActiveFolder] = useState<string>("trail-running");
  const [openImage, setOpenImage] = useState<string | null>(null);
  const currentFolder = FOLDERS.find((f) => f.id === activeFolder)!;
  const active = currentFolder.images.find((img) => img.src === openImage);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.28em] text-terrain">The work</span>
        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
          Gallery
        </h1>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {FOLDERS.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setActiveFolder(folder.id)}
            className={`rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-colors ${
              activeFolder === folder.id
                ? "bg-foreground text-background"
                : "bg-secondary/60 text-foreground hover:bg-secondary"
            }`}
          >
            {folder.label}
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-foreground/70">
          {currentFolder.description}
        </p>
      </div>

      {currentFolder.images.length > 0 ? (
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currentFolder.images.map((img) => (
            <button
              key={img.title}
              className="group aspect-[4/5] overflow-hidden bg-secondary/60"
              onClick={() => setOpenImage(img.src)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center justify-center rounded-2xl border border-dashed border-foreground/20 py-20">
          <p className="text-lg font-medium text-foreground/80">Coming soon</p>
          <p className="mt-2 max-w-md text-center text-sm text-foreground/60">
            HYROX photos will be added here. Check back once the first pieces are finished.
          </p>
        </div>
      )}

      <Dialog open={!!openImage} onOpenChange={(open) => !open && setOpenImage(null)}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{active?.title ?? "Gallery image"}</DialogTitle>
          {active && (
            <img
              src={active.src}
              alt={active.title}
              className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
