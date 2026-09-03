import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ALL_PRODUCTS } from "@/data/products";
import { GALLERY_FOLDERS } from "@/data/gallery";
import { ResponsiveImage } from "@/components/responsive-image";
import flaskDryStand from "@/assets/flask-dry-stand.png.asset.json";
import flaskDryStand1 from "@/assets/flask-dry-stand-1.webp.asset.json";
import flaskDryStand2 from "@/assets/flask-dry-stand-2.jpg.asset.json";
import flaskDryStandBlack from "@/assets/flask-dry-stand-black.png.asset.json";
import flaskDryStandWhite from "@/assets/flask-dry-stand-white.png.asset.json";



import heroTerrainBg from "@/assets/hero-hex-mountain.jpg.asset.json";
import collectionTopoBg from "@/assets/collection-topo-bg.jpg.asset.json";

import frameKeepsakerGoat from "@/assets/pomelli-photoshoot-keepsaker.png.asset.json";
import frameAchieverMedal from "@/assets/IMG_7292-4.jpeg.asset.json";
import frame3dMapGoatHex from "@/assets/carousel/frame-3dmap-goat-hex.jpg.asset.json";
import frame3dHexMap from "@/assets/carousel/frame-3d-hex-map.png.asset.json";
import hyroxHexStandPhoto from "@/assets/hyrox-hex-stand-photo.jpg.asset.json";
import hyroxHex2pcCard from "@/assets/hyrox-hex-2pc-card.jpg.asset.json";

import frameLegendary from "@/assets/carousel/frame-legendary.jpg.asset.json";
import frameSlmt from "@/assets/carousel/frame-slmt.jpg.asset.json";
import frameMushrif from "@/assets/carousel/frame-mushrif.jpg.asset.json";
import pomelliPhotoshoot0715 from "@/assets/carousel/pomelli-photoshoot-0715.png.asset.json";
import pomelliPhotoshoot0715_2 from "@/assets/carousel/pomelli-photoshoot-0715_2.png.asset.json";
import pomelliPhotoshootImage9_16 from "@/assets/carousel/pomelli-photoshoot-image-9-16-0715.png.asset.json";
import pomelliPhotoshootLisKalba from "@/assets/carousel/pomelli-photoshoot-lis-kalba-0715.png.asset.json";
import frameLisKalbaStand from "@/assets/carousel/frame-lis-kalba-stand.jpg.asset.json";
import goatUltraHex0715 from "@/assets/carousel/goat-ultra-hex-0715.png.asset.json";
import frameGoatUltraStand from "@/assets/carousel/frame-goat-ultra-stand.jpg.asset.json";

import frameGoatUltraTrailRace from "@/assets/carousel/frame-goat-ultra-trail-race.jpg.asset.json";
import frameCarouselHexMedal from "@/assets/carousel/IMG_6592-4.PNG.asset.json";
import heroLegacy from "@/assets/carousel/hero-legacy-goat-ultra-peaks.jpg.asset.json";
import legacyFrame from "@/assets/carousel/IMG_6699.jpg.asset.json";
import legacyRaceDirector from "@/assets/carousel/legacy-goat-ultra-race-director.png.asset.json";


const CAROUSEL_ITEMS = [
  { img: legacyRaceDirector.url, name: "Legacy — Race Director Edition", desc: "GOAT Ultra Trail Race framed with medal, map, and BIB." },
  { img: frameCarouselHexMedal.url, name: "PORTABLE 3D HEX MAP DISPLAY", desc: "Premium stand-mounted relief for your proudest moment." },

  { img: pomelliPhotoshootImage9_16.url, name: "Spring Lebanon Mountain Trail", desc: "Framed relief of the SLMT route — Choucrallah Karam." },
  { img: pomelliPhotoshoot0715.url, name: "Mushrif Park Run", desc: "Oak-framed 8KM Mushrif Park route in the UAE." },
  { img: pomelliPhotoshoot0715_2.url, name: "GOAT Ultra Trail Race", desc: "98.61KM ultra in a deep shadow-box frame." },
  { img: goatUltraHex0715.url, name: "GOAT Ultra Hex", desc: "Standalone hex plaque — 100KM, 6450M elevation." },
  { img: frameGoatUltraStand.url, name: "GOAT ULTRA HEX WITH STAND", desc: "Hex relief paired with a honeycomb display stand." },
  { img: pomelliPhotoshootLisKalba.url, name: "Lis Kalba Hex", desc: "Hex relief plaque of the 8.7KM Kalba route." },
  { img: frameLisKalbaStand.url, name: "LIS KALBA HEX\u00a0 WITH STAND", desc: "Kalba hex paired with a honeycomb display stand." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Evara3D — Run it. Frame it." },
      { name: "description", content: "Custom 3D-printed topographic relief maps of your Strava runs, framed and ready to hang. Designed and made in the UAE." },
      { property: "og:title", content: "Evara3D — Run it. Frame it." },
      { property: "og:description", content: "Custom 3D-printed topographic relief maps of your Strava runs, framed and ready to hang." },
      { property: "og:url", content: "https://evara3d.ae/" },
    ],
    links: [
      { rel: "canonical", href: "https://evara3d.ae/" },
      { rel: "preload", as: "image", href: heroTerrainBg.url, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Evara3D FZC",
          url: "https://evara3d.ae/",
          description: "UAE studio turning Strava runs into 3D-printed topographic relief map frames.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Evara3D",
          url: "https://evara3d.ae/",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden border-b border-foreground/10">
        <ResponsiveImage
          src={heroTerrainBg.url}
          alt=""
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover object-right"
          width={1920}
          height={1200}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/60 to-background/30" />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.32em] text-terrain md:text-sm">
              Places . Moments . Memories .
            </span>
            <h1
              className="mt-6 font-display text-5xl font-bold uppercase leading-[0.95] text-foreground md:text-7xl lg:text-8xl"
              style={{ textShadow: "0 4px 30px rgba(0,0,0,0.55)" }}
            >
              Preserve the route.
              <br />
              Honor the effort.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/85 md:text-lg uppercase">
              Evara turns meaningful moments into
              <br />
              personalized pieces made to last.
              <br />
              From the places you love, to the
              <br />
              memories you never want to forget.
              <br />
              Your story. Beautifully preserved.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-terrain px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90"
              >
                Explore Collection
              </Link>
              <Link
                to="/about"
                className="border border-foreground/70 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery folders */}
      <section className="relative overflow-hidden bg-background border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <header className="text-center">
            <span className="text-xs uppercase tracking-[0.28em] text-terrain">The work</span>
            <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Evara3D Gallery</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-foreground/70">
              Browse the Evara3D gallery: 3D-printed trail running map frames, custom HYROX hex
              displays, and soft flask drying stands made in Dubai. Pick a collection below to see
              finished pieces, close-up details, and the finishes we print in.
            </p>
          </header>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY_FOLDERS.map((folder) => (
              <article key={folder.slug} className="group">
                <Link to="/gallery/$folder" params={{ folder: folder.slug }} className="block">
                  <div className="aspect-[4/5] overflow-hidden bg-secondary/60">
                    <ResponsiveImage
                      src={folder.images[0].src}
                      alt={`${folder.heading} — ${folder.images[0].title}`}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl uppercase tracking-wide text-foreground">
                    {folder.label}
                  </h3>
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{folder.description}</p>
                <Link
                  to="/gallery/$folder"
                  params={{ folder: folder.slug }}
                  className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-terrain hover:underline"
                >
                  View {folder.label} photos ({folder.images.length})
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* Trio of products */}
      <section className="relative bg-background overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${collectionTopoBg.url})`,
            opacity: 0.6,
            filter: "grayscale(100%) contrast(3) brightness(2.4) drop-shadow(0 0 3px rgba(255,255,255,0.55))",
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background via-background/25 to-background" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-terrain">ORDER OUR PRODUCTS</span>
            <h2 className="mt-3 font-display text-4xl text-foreground md:text-5xl">
              3D PRINTED PRODUCTS.
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-xs uppercase tracking-[0.22em] text-foreground hover:text-foreground/80 md:inline"
          >
            See all →
          </Link>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {ALL_PRODUCTS.map((p, i) => (
            <div key={p.slug}>
            <Link
              to="/shop/$slug"
              params={{ slug: p.slug }}
              className="group block"
            >

              <div className={`bg-secondary/60 transition-colors group-hover:bg-secondary ${i === 0 || i === 1 || i === 2 || i === 3 ? "" : "p-8"}`}>
                {i === 0 ? (
                  <ResponsiveImage
                    src={frameKeepsakerGoat.url}
                    alt={`${p.name} — 3D-printed topographic frame, handmade in Dubai`}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="aspect-square w-full object-cover"
                  />
                ) : i === 1 ? (
                  <ResponsiveImage
                    src={frameAchieverMedal.url}
                    alt={`${p.name} — 3D-printed topographic frame with race medal, handmade in Dubai`}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="aspect-square w-full object-cover"
                  />
                ) : i === 2 ? (
                  <ResponsiveImage
                    src={legacyFrame.url}
                    alt={`${p.name} — 3D-printed topographic frame with medal and race BIB, handmade in Dubai`}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="aspect-square w-full object-cover"
                  />
                ) : i === 3 ? (
                  <ResponsiveImage
                    src={frame3dHexMap.url}
                    alt={`${p.name} — 3D-printed hexagonal topographic map plaque, handmade in Dubai`}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="aspect-square w-full object-cover"
                  />
                ) : i === 4 || i === 5 ? (
                  <ResponsiveImage
                    src={i === 5 ? hyroxHex2pcCard.url : hyroxHexStandPhoto.url}
                    alt={`${p.name} — 3D-printed Hyrox hex race display, handmade in Dubai`}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="aspect-square w-full object-cover"
                  />

                ) : null}
              </div>
              <div className="mt-6 flex items-baseline justify-between">
                <h3 className="font-display text-2xl text-foreground">{p.name}</h3>
                <span className="text-sm text-foreground/90">AED {p.priceAed}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/90 whitespace-pre-line">{p.tagline}</p>
            </Link>
            {(p.slug === "hyrox-hex" || p.slug === "hyrox-hex-2pc") && (
              <Link
                to="/shop/$slug"
                params={{ slug: p.slug }}
                className="mt-5 block w-full bg-terrain px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90"
              >
                Place Your Order
              </Link>
            )}

            </div>
          ))}

          <FlaskDryStandCard />

        </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-foreground/30/10 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <span className="text-xs uppercase tracking-[0.28em] text-terrain">The process</span>
          <h2 className="mt-3 max-w-2xl font-display text-4xl text-foreground md:text-5xl">
            From GPX to gallery wall in four steps.
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-4">
            {[
              { n: "01", t: "Pick a frame", d: "Choose Keepsaker, Achiever, Legacy, or 3D HEX MAP DISPLAY WITH STAND — and your frame, relief, and track colors." },
              { n: "02", t: "Send your run", d: "Upload a GPX file from Strava or any app, with your run name, distance, date, and location." },
              { n: "03", t: "We sculpt it", d: "Our studio renders the terrain, prints it in 3D, and assembles the deep-frame." },
              { n: "04", t: "Hang it", d: "Your finished frame arrives ready to hang." },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-display text-terrain">{s.n}</div>
                <div className="mt-2 font-display text-xl text-foreground">{s.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote block */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <p className="font-display text-3xl leading-snug text-foreground md:text-4xl">
          "STRAVA KEEPS THE DATA. EVARA DISPLAYS IT"
        </p>
        <div className="mt-6 text-xs uppercase tracking-[0.22em] text-foreground/70">
          — PLACES . MOMENTS . MEMORIES .
        </div>
      </section>
    </>
  );
}

function FrameCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  const handleNav = (dir: -1 | 1) => {
    const next = Math.min(CAROUSEL_ITEMS.length - 1, Math.max(0, activeIndex + dir));
    scrollToIndex(next);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0;
      let min = Infinity;
      children.forEach((c, idx) => {
        const cCenter = c.offsetLeft - el.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(center - cCenter);
        if (d < min) { min = d; nearest = idx; }
      });
      setActiveIndex(nearest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CAROUSEL_ITEMS.map((item) => (
          <article
            key={item.name}
            className="snap-center shrink-0 w-[78%] sm:w-[60%] md:w-[78%] lg:w-[70%] shadow-2xl"
          >
            <ResponsiveImage
              src={item.img}
              alt={`${item.name} — ${item.desc}`}
              sizes="(min-width: 1024px) 70vw, (min-width: 640px) 60vw, 78vw"
              className="w-full h-auto object-cover"
            />
          </article>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => handleNav(-1)}
        disabled={activeIndex === 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-paper text-foreground shadow-lg transition-opacity disabled:opacity-40 hover:bg-paper/90"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => handleNav(1)}
        disabled={activeIndex === CAROUSEL_ITEMS.length - 1}
        className="absolute right-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-paper text-foreground shadow-lg transition-opacity disabled:opacity-40 hover:bg-paper/90"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-4 flex justify-center gap-2">
        {CAROUSEL_ITEMS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-6 bg-paper" : "w-2 bg-paper/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

function FlaskDryStandCard() {
  const [imgIndex, setImgIndex] = useState(0);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const images = [
    { src: flaskDryStandBlack.url, alt: "Flask Dry Stand — black 3D-printed soft flask drying stand" },
    { src: flaskDryStandWhite.url, alt: "Flask Dry Stand — white 3D-printed soft flask drying stand" },
    { src: flaskDryStand.url, alt: "Flask Dry Stand — 3D-printed detachable soft flask drying stand" },
    { src: flaskDryStand1.url, alt: "Flask Dry Stand — empty drying stand with honeycomb base" },
    { src: flaskDryStand2.url, alt: "Flask Dry Stand — two soft flasks air-drying upright" },
  ];

  const scrollToImage = (index: number) => {
    const next = Math.max(0, Math.min(images.length - 1, index));
    setImgIndex(next);
    const container = imgContainerRef.current;
    if (!container) return;
    const img = container.children[next] as HTMLElement;
    if (img) {
      container.scrollTo({ left: img.offsetLeft, behavior: "smooth" });
    }
  };

  return (
    <div className="group block">
      <div className="relative bg-secondary/60 transition-colors group-hover:bg-secondary">
        <div
          ref={imgContainerRef}
          className="flex aspect-square w-full snap-x snap-mandatory overflow-x-hidden scroll-smooth"
        >
          {images.map((img) => (
            <ResponsiveImage
              key={img.src}
              src={img.src}
              alt={img.alt}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="aspect-square w-full flex-shrink-0 snap-start object-cover"
              width={1024}
              height={1024}
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => scrollToImage(imgIndex - 1)}
              disabled={imgIndex === 0}
              className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black text-white shadow transition-opacity disabled:opacity-30 hover:bg-black/90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => scrollToImage(imgIndex + 1)}
              disabled={imgIndex === images.length - 1}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black text-white shadow transition-opacity disabled:opacity-30 hover:bg-black/90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => scrollToImage(i)}
                  className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-black" : "w-1.5 bg-black/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-6 flex items-baseline justify-between">
        <h3 className="font-display text-2xl text-foreground">SOFT FLASK DRYING STAND
</h3>
        <span className="text-sm text-foreground/90">AED 75</span>
      </div>
      <p className="mt-2 text-sm text-foreground/90">
        3D printed soft flask drying stand, fully detachable — designed to hold and air-dry
        insulated flasks/bottles upright, keeping them stable and ventilated between uses.
      </p>

      <Link
        to="/flask-dry-stand"
        className="mt-5 block w-full bg-terrain px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90"
      >
        Place Your Order
      </Link>
    </div>
  );
}
