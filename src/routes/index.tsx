import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { FrameVisual } from "@/components/frame-visual";
import frameKeepsaker from "@/assets/carousel/frame-keepsaker-hex.png.asset.json";
import frameMilestone from "@/assets/carousel/frame-milestone.jpg.asset.json";
import frameLegendary from "@/assets/carousel/frame-legendary.jpg.asset.json";
import frameClassic from "@/assets/carousel/frame-classic.jpg.asset.json";

const CAROUSEL_ITEMS = [
  { img: frameKeepsaker.url, name: "Keepsaker", desc: "A timeless wooden frame for your first milestone run." },
  { img: frameMilestone.url, name: "Milestone", desc: "Bold black frame celebrating long-distance achievements." },
  { img: frameLegendary.url, name: "Legendary", desc: "Premium stand-mounted relief for your proudest moment." },
  { img: frameClassic.url, name: "Classic Oak", desc: "Clean topographic detail in a warm oak finish." },
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
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-terrain">The collection</span>
            <h2 className="mt-3 font-display text-4xl text-foreground md:text-5xl">
              Three frames. One memory.
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-xs uppercase tracking-[0.22em] text-foreground hover:text-terrain md:inline"
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
              <div className="bg-secondary/60 p-8 transition-colors group-hover:bg-secondary">
                <FrameVisual
                  frameFinish={i === 0 ? "White Matt" : i === 1 ? "Matte Black" : "Wooden"}
                  mapColor={i === 1 ? "White" : "Black"}
                  trackColor={i === 2 ? "Red" : "Orange"}
                />
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
              { n: "01", t: "Pick a frame", d: "Choose Keepsaker, Achiever, or Legacy — and your frame, relief, and track colors." },
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
          "STRAVA REMEMBERS THE DATA. EVARA DISPLAY IT"
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
            className="snap-center shrink-0 w-[78%] sm:w-[60%] md:w-[78%] lg:w-[70%] bg-paper shadow-2xl"
          >
            <img src={item.img} alt={`${item.name} frame`} className="w-full h-auto object-cover" />
            <div className="p-5">
              <h3 className="font-display text-xl font-bold text-foreground">{item.name}</h3>
              <p className="mt-1 text-sm text-foreground/70">{item.desc}</p>
            </div>
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
