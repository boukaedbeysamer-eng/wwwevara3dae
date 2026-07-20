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



const GALLERY_IMAGES = [
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
  { src: frameLisKalbaStand.url, title: "LIS KALBA HEX\u00a0 WITH STAND", caption: "Kalba hex paired with a honeycomb display stand." },
  { src: frameGoatYellow.url, title: "GOAT ULTRA TRAIL RACE 50KM\u00a0 — WHITE FRAME\u00a0", caption: "50KM finisher medal display with a 3D Printed relief in a bold white frame." },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Evara3D" },
      { name: "description", content: "Explore custom 3D-printed topographic relief frames created by Evara3D." },
      { property: "og:title", content: "Gallery — Evara3D" },
      { property: "og:description", content: "Explore custom 3D-printed topographic relief frames created by Evara3D." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [openImage, setOpenImage] = useState<string | null>(null);
  const active = GALLERY_IMAGES.find((img) => img.src === openImage);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.28em] text-terrain">The work</span>
        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
          Gallery
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/70">
          Every frame tells a story. Browse real pieces made for runners, hikers, and adventurers across the region.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_IMAGES.map((img) => (
          <button
            key={img.title}
            className="group flex items-center justify-center overflow-hidden bg-secondary/60 p-4"
            onClick={() => setOpenImage(img.src)}
          >
            <img
              src={img.src}
              alt={img.title}
              className="max-h-[320px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

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
