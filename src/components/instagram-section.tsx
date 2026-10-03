import { ResponsiveImage } from "@/components/responsive-image";
import mdsFullFrame from "@/assets/gallery/mds-legendary-full-frame.png.asset.json";
import utmbFullFrame from "@/assets/gallery/img_7531.jpg.asset.json";
import berlinFrame from "@/assets/gallery/berlin-marathon-frame.jpg.asset.json";
import hyroxDoublesStudio from "@/assets/gallery/hyrox-istanbul-doubles-studio.png.asset.json";
import surfskiWinnerFrame from "@/assets/gallery/surfski-winner-frame.png.asset.json";
import photoCappadociaWallWhite from "@/assets/gallery/IMG_7290.jpeg.asset.json";
import flaskBlueStudio from "@/assets/gallery/flask-blue-studio.png.asset.json";
import frameGoatUltraStand from "@/assets/carousel/frame-goat-ultra-stand.jpg.asset.json";

export const INSTAGRAM_URL = "https://www.instagram.com/evara3d";

const INSTAGRAM_POSTS = [
  { src: mdsFullFrame.url, alt: "Evara3D Marathon des Sables Legendary 270KM frame with 3D relief, finisher photo and medal — Instagram @evara3d" },
  { src: utmbFullFrame.url, alt: "Evara3D UTMB Mont Blanc 175KM white frame with 3D terrain relief — Instagram @evara3d" },
  { src: berlinFrame.url, alt: "Evara3D Berlin Marathon 2024 oak frame with blue hex relief and medal — Instagram @evara3d" },
  { src: hyroxDoublesStudio.url, alt: "Evara3D HYROX Istanbul Pro Doubles hex display with stand — Instagram @evara3d" },
  { src: surfskiWinnerFrame.url, alt: "Evara3D DOSC Surfski Dubai winner's frame with 3D route relief — Instagram @evara3d" },
  { src: photoCappadociaWallWhite.url, alt: "Evara3D Cappadocia Ultra Trail 63KM white frame with finisher medal — Instagram @evara3d" },
  { src: frameGoatUltraStand.url, alt: "Evara3D GOAT Ultra hex relief with honeycomb display stand — Instagram @evara3d" },
  { src: flaskBlueStudio.url, alt: "Evara3D Soft Flask Drying Stand with two flasks drying — Instagram @evara3d" },
];

export function InstagramSection() {
  return (
    <section className="bg-background border-y border-foreground/10">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <header className="text-center">
          <span className="text-xs uppercase tracking-[0.28em] text-terrain">Follow the studio</span>
          <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
            Evara3D on Instagram
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-foreground/70">
            A curated look at recent Evara3D projects — race frames, HYROX hex displays and
            studio shots. Follow <span className="font-medium text-foreground">@evara3d</span> for
            new drops, behind-the-scenes printing, and athlete features.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.src}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View this Evara3D project on Instagram"
              className="group relative block overflow-hidden bg-secondary/60"
            >
              <ResponsiveImage
                src={post.src}
                alt={post.alt}
                sizes="(min-width: 768px) 25vw, 50vw"
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                <InstagramGlyph className="h-9 w-9" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg transition-opacity hover:opacity-90"
            style={{
              background:
                "linear-gradient(45deg, #F09433 0%, #E6683C 25%, #DC2743 50%, #CC2366 75%, #BC1888 100%)",
            }}
          >
            <InstagramGlyph className="h-4 w-4" />
            Follow @evara3d on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

export function InstagramGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
