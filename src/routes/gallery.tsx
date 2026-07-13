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
import frameLegacyGoat from "@/assets/gallery/legacy-goat-ultra.jpg.asset.json";

const GALLERY_IMAGES = [
  { src: frameLegendary.url, title: "PORTABLE 3D HEX MAP DISPLAY", caption: "Premium stand-mounted relief for your proudest moment." },
  { src: frameSlmt.url, title: "Spring Lebanon Mountain Trail", caption: "Framed relief of the SLMT route — Choucrallah Karam." },
  { src: frameMushrif.url, title: "Mushrif Park Run", caption: "Oak-framed 8KM Mushrif Park route in the UAE." },
  { src: frameGoatTrailRace.url, title: "GOAT Ultra Trail Race", caption: "98.61KM ultra in a deep shadow-box frame." },
  { src: frameGoatMedal.url, title: "GOAT ULTRA TRAIL RACE — MEDAL FRAME", caption: "Shadow-box frame with hex relief and 100KM finisher medal." },
  { src: frameGoatUltra.url, title: "GOAT Ultra Hex", caption: "Standalone hex plaque — 100KM, 6450M elevation." },
  { src: frameGoatUltraStand.url, title: "GOAT ULTRA HEX WITH STAND", caption: "Hex relief paired with a honeycomb display stand." },
  { src: frameLisKalba.url, title: "Lis Kalba Hex", caption: "Hex relief plaque of the 8.7KM Kalba route." },
  { src: frameLisKalbaStand.url, title: "LIS KALBA HEX\u00a0 WITH STAND", caption: "Kalba hex paired with a honeycomb display stand." },
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

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_IMAGES.map((img) => (
          <button
            key={img.title}
            className="group text-left"
            onClick={() => setOpenImage(img.src)}
          >
            <div className="overflow-hidden bg-secondary/60">
              <img
                src={img.src}
                alt={img.title}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-3">
              <h3 className="font-display text-lg text-foreground">{img.title}</h3>
              <p className="mt-1 text-sm text-foreground/60">{img.caption}</p>
            </div>
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
