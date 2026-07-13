import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";

import frameKeepsakerGoat from "@/assets/carousel/frame-keepsaker-goat-ultra.png.asset.json";
import frameAchieverMedal from "@/assets/carousel/frame-achiever-medal-goat.png.asset.json";
import frame3dMapGoatHex from "@/assets/carousel/frame-3dmap-goat-hex.jpg.asset.json";
import frame3dHexMap from "@/assets/carousel/frame-3d-hex-map.png.asset.json";
import frameLegendary from "@/assets/carousel/frame-legendary.jpg.asset.json";
import frameSlmt from "@/assets/carousel/frame-slmt.jpg.asset.json";
import frameMushrif from "@/assets/carousel/frame-mushrif.jpg.asset.json";
import frameLisKalba from "@/assets/carousel/frame-lis-kalba.jpg.asset.json";
import frameLisKalbaStand from "@/assets/carousel/frame-lis-kalba-stand.jpg.asset.json";
import frameGoatUltra from "@/assets/carousel/frame-goat-ultra.jpg.asset.json";
import frameGoatUltraStand from "@/assets/carousel/frame-goat-ultra-stand.jpg.asset.json";
import frameGoatTrailRace from "@/assets/carousel/frame-goat-trail-race.jpg.asset.json";
import frameGoatUltraTrailRace from "@/assets/carousel/frame-goat-ultra-trail-race.jpg.asset.json";
import heroLegacy from "@/assets/carousel/hero-legacy-goat-ultra-peaks.jpg.asset.json";
import legacyFrame from "@/assets/carousel/IMG_6699.jpg.asset.json";
import legacyRaceDirector from "@/assets/carousel/legacy-goat-ultra-race-director.png.asset.json";


const CAROUSEL_ITEMS = [
  { img: legacyRaceDirector.url, name: "Legacy — Race Director Edition", desc: "GOAT Ultra Trail Race framed with medal, map, and BIB." },
  { img: frameGoatUltraTrailRace.url, name: "PORTABLE 3D HEX MAP DISPLAY", desc: "Premium stand-mounted relief for your proudest moment." },

  { img: frameSlmt.url, name: "Spring Lebanon Mountain Trail", desc: "Framed relief of the SLMT route — Choucrallah Karam." },
  { img: frameMushrif.url, name: "Mushrif Park Run", desc: "Oak-framed 8KM Mushrif Park route in the UAE." },
  { img: frameGoatTrailRace.url, name: "GOAT Ultra Trail Race", desc: "98.61KM ultra in a deep shadow-box frame." },
  { img: frameGoatUltra.url, name: "GOAT Ultra Hex", desc: "Standalone hex plaque — 100KM, 6450M elevation." },
  { img: frameGoatUltraStand.url, name: "GOAT ULTRA HEX WITH STAND", desc: "Hex relief paired with a honeycomb display stand." },
  { img: frameLisKalba.url, name: "Lis Kalba Hex", desc: "Hex relief plaque of the 8.7KM Kalba route." },
  { img: frameLisKalbaStand.url, name: "LIS KALBA HEX\u00a0 WITH STAND", desc: "Kalba hex paired with a honeycomb display stand." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Evara3D — Run it. Frame it." },
      { name: "description", content: "Custom 3D-printed topographic relief maps of your Strava runs, framed and ready to hang. Designed and made in the UAE." },
      { property: "og:title", content: "Evara3D — Run it. Frame it." },
      { property: "og:description", content: "Custom 3D-printed topographic relief maps of your Strava runs, framed and ready to hang." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-foreground/30/10">
        <div className="topo-lines absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-[1.1fr_1fr] md:py-32 lg:py-40">
          <div className="flex flex-col justify-center">
            <span className="text-[20px] uppercase tracking-[0.28em] text-terrain">
              PLACES . MOMENTS . MEMORIES .
            </span>
            <h1 className="mt-6 font-display text-xl uppercase leading-relaxed text-foreground">
              EVARA TURNS MEANINGFUL MOMENTS INTO<br />
              PERSONALIZED PIECES MADE TO LAST.<br />
              FROM THE PLACES YOU LOVE, TO THE<br />
              MEMORIES YOU NEVER WANT TO FORGET.<br />
              YOUR STORY. BEAUTIFULLY PRESERVED.
            </h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-foreground/70">
              Upload a GPX file from any run. We translate the terrain you crossed into
              a precision&nbsp; 3D-printed topographic frame — your distance, elevation, and
              date set in type beneath it.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-terrain px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper transition-colors hover:bg-terrain"
              >
                Shop the frames
              </Link>
              <Link
                to="/about"
                className="border border-foreground/30 px-6 py-4 text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-terrain hover:text-paper"
              >
                How it's made
              </Link>
            </div>
          </div>
          <div className="relative w-full">
            <FrameCarousel />
          </div>

        </div>
      </section>

      {/* Trio of products */}
      <section className="bg-terrain mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-foreground">The collection</span>
            <h2 className="mt-3 font-display text-4xl text-foreground md:text-5xl">
              Four frames. One memory.
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
          {PRODUCTS.map((p, i) => (
            <Link
              key={p.slug}
              to="/shop/$slug"
              params={{ slug: p.slug }}
              className="group block"
            >
              <div className={`bg-secondary/60 transition-colors group-hover:bg-secondary ${i === 0 || i === 1 || i === 2 || i === 3 ? "" : "p-8"}`}>
                {i === 0 ? (
                  <img
                    src={frameKeepsakerGoat.url}
                    alt={`${p.name} 3D-printed topographic frame`}
                    className="aspect-square w-full object-cover"
                  />
                ) : i === 1 ? (
                  <img
                    src={frameAchieverMedal.url}
                    alt={`${p.name} 3D-printed topographic frame with medal`}
                    className="aspect-square w-full object-cover"
                  />
                ) : i === 2 ? (
                  <img
                    src={legacyFrame.url}
                    alt={`${p.name} 3D-printed topographic frame with medal and BIB`}
                    className="aspect-square w-full object-cover"
                  />
                ) : i === 3 ? (
                  <img
                    src={frame3dHexMap.url}
                    alt={`${p.name} 3D-printed topographic hex plaque`}
                    className="aspect-square w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="mt-6 flex items-baseline justify-between">
                <h3 className="font-display text-2xl text-foreground">{p.name}</h3>
                <span className="text-sm text-foreground/70">AED {p.priceAed}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/60">{p.tagline}</p>
            </Link>
          ))}
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
        <div className="mt-6 text-xs uppercase tracking-[0.22em] text-foreground/50">
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
            <img src={item.img} alt={`${item.name} frame`} className="w-full h-auto object-cover" />
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
