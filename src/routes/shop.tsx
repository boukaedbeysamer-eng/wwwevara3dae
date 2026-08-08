import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { PRODUCTS, HYROX_PRODUCTS } from "@/data/products";
import frame3dMap from "@/assets/carousel/frame-3d-hex-goat-ultra.png.asset.json";
import keepsakerImg from "@/assets/carousel/keepsaker-pomelli-photoshoot-3.png.asset.json";
import achieverImg from "@/assets/carousel/achiever-pomelli-photoshoot-2.png.asset.json";
import legacyImg from "@/assets/carousel/legacy-goat-ultra-race-director-2.jpg.asset.json";
import bgImg from "@/assets/IMG_4007.jpeg.asset.json";
import hyroxHexImg from "@/assets/hyrox/hyrox-hex.png.asset.json";
import collectionTopoBg from "@/assets/collection-topo-bg.jpg.asset.json";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Evara3D" },
      { name: "description", content: "Browse the Evara3D collection of 3D-printed topographic running route frames: Keepsaker, Achiever, Legacy, and 3D HEX MAP DISPLAY WITH STAND." },
      { property: "og:title", content: "Shop — Evara3D" },
      { property: "og:description", content: "Browse 3D-printed topographic running route frames designed for athletes." },
      { property: "og:url", content: "https://evara3d.ae/shop" },
    ],
    links: [{ rel: "canonical", href: "https://evara3d.ae/shop" }],
  }),
  component: Shop,
});

const PANELS = ["frames", "glow", "hyrox", "custom"] as const;
type PanelId = (typeof PANELS)[number];

function Shop() {
  const [open, setOpen] = useState<PanelId | null>("frames");

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "") as PanelId;
      if (PANELS.includes(hash)) {
        setOpen(hash);
        window.setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const toggle = (id: PanelId) => {
    setOpen((cur) => {
      const next = cur === id ? null : id;
      if (next) {
        window.setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
      return next;
    });
  };

  return (
    <section
      className="relative mx-auto max-w-7xl px-6 py-20 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg.url})` }}
    >
      <div className="absolute inset-0 bg-ink/92 backdrop-blur-[2px]" />
      <div className="relative">
        <span className="text-xs uppercase tracking-[0.28em] text-terrain">The collection</span>
        <h1 className="mt-3 max-w-2xl font-display text-5xl text-foreground md:text-6xl">
          Choose your series.
        </h1>
        <p className="mt-4 max-w-xl text-base text-foreground/90">
          {"\n"}
        </p>

        <div className="mt-12 space-y-4">
          <Accordion
            id="frames"
            title="Choose Your Frame Series"
            open={open === "frames"}
            onToggle={() => toggle("frames")}
            light
          >
            <FrameSeries />
          </Accordion>

          <Accordion id="glow" title="Glow Series" open={open === "glow"} onToggle={() => toggle("glow")}>
            <ComingSoon
              light
              title="Glow Series"
              note=""
            />
          </Accordion>

          <Accordion id="hyrox" title="Hyrox Series" open={open === "hyrox"} onToggle={() => toggle("hyrox")}>
            <HyroxSeries />
          </Accordion>


          <Accordion id="custom" title="Custom My Project" open={open === "custom"} onToggle={() => toggle("custom")}>
            <CustomProject />
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function Accordion({
  id,
  title,
  open,
  onToggle,
  light = false,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  light?: boolean;
  children: React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => setMaxH(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div
      id={id}
      className={`scroll-mt-24 border ${light ? "border-paper/20 bg-paper" : "border-border/60 bg-card/70"}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className={`flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-8 ${
          light ? "text-ink" : "text-foreground"
        }`}
      >
        <span className="font-display text-2xl uppercase tracking-wide md:text-3xl">{title}</span>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-terrain transition-transform duration-300 ease-out ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={`${id}-panel`}
        style={{ maxHeight: open ? maxH : 0 }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div ref={innerRef} className={`px-5 pb-10 md:px-8 ${open ? "" : "pointer-events-none"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

function FrameSeries() {
  return (
    <div className="grid gap-14 pt-2 md:grid-cols-3">
      {PRODUCTS.map((p) => (
        <Link key={p.slug} to="/shop/$slug" params={{ slug: p.slug }} className="group block">
          <div className="bg-ink/5 transition-colors group-hover:bg-ink/10">
            {p.slug === "keepsaker" && (
              <img src={keepsakerImg.url} alt={`${p.name} 3D-printed topographic frame`} className="aspect-square w-full object-cover" />
            )}
            {p.slug === "achiever" && (
              <img src={achieverImg.url} alt={`${p.name} 3D-printed topographic frame with medal`} className="aspect-square w-full object-cover" />
            )}
            {p.slug === "legacy" && (
              <img src={legacyImg.url} alt={`${p.name} 3D-printed topographic frame with medal and BIB`} className="aspect-square w-full object-cover" />
            )}
            {p.slug === "3d-map-display" && (
              <img src={frame3dMap.url} alt={`${p.name} 3D-printed topographic hex plaque`} className="aspect-square w-full object-cover" />
            )}
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <h2 className="font-display text-2xl text-ink">{p.name}</h2>
            <span className="text-sm font-semibold text-terrain">AED {p.priceAed}</span>
          </div>
          <p className="mt-2 text-sm text-ink/80">{p.tagline}</p>
          <div className="mt-3 text-xs uppercase tracking-[0.22em] text-ink/60">{p.frameSize}</div>
        </Link>
      ))}
    </div>
  );
}

function TopoBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
      style={{ backgroundImage: `url(${collectionTopoBg.url})`, filter: "grayscale(100%) contrast(2)" }}
    />
  );
}

function ComingSoon({ title, note, light = false }: { title: string; note: string; light?: boolean }) {
  return (
    <div className={`relative overflow-hidden border border-border/60 px-6 py-16 text-center md:py-20 ${light ? "bg-paper" : "bg-ink"}`}>
      {!light && <TopoBackdrop />}
      <div className="relative">
        <span className="text-xs uppercase tracking-[0.28em] text-terrain">Coming soon</span>
        <h3 className={`mt-4 font-display text-4xl uppercase md:text-5xl ${light ? "text-ink" : "text-foreground"}`}>{title}</h3>
        <p className={`mx-auto mt-4 max-w-md text-sm leading-relaxed ${light ? "text-ink/80" : "text-foreground/75"}`}>{note}</p>
      </div>
    </div>
  );
}

function CustomProject() {
  return (
    <div className="relative overflow-hidden border border-border/60 bg-ink px-6 py-14 md:px-12">
      <TopoBackdrop />
      <div className="relative max-w-2xl">
        <span className="text-xs uppercase tracking-[0.28em] text-terrain">Custom my project</span>
        <h3 className="mt-4 font-display text-4xl uppercase text-foreground md:text-5xl">
          Have something else in mind?
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          Tell us about your idea — a bespoke route, a corporate gift set, an event trophy, or a
          shape we've never printed before. Reach out by phone or email and our studio will get
          back to you as soon as possible to start working on it.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="tel:+971553949060"
            className="inline-flex items-center gap-2 bg-terrain px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90"
          >
            <Phone className="h-4 w-4" /> +971 55 394 9060
          </a>
          <a
            href="mailto:info@evara3d.ae"
            className="inline-flex items-center gap-2 border border-foreground/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-foreground hover:text-ink"
          >
            <Mail className="h-4 w-4" /> info@evara3d.ae
          </a>
        </div>
      </div>
    </div>
  );
}

function HyroxSeries() {
  const p = HYROX_PRODUCTS[0];
  return (
    <div className="relative overflow-hidden border border-border/60 bg-ink px-6 py-12 md:px-12">
      <TopoBackdrop />
      <div className="relative">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <Link to="/shop/$slug" params={{ slug: p.slug }} className="group block">
            <div className="bg-foreground/5 transition-colors group-hover:bg-foreground/10">
              <img
                src={hyroxHexImg.url}
                alt={`${p.name} 3D-printed hexagonal Hyrox race display`}
                className="aspect-square w-full object-cover"
              />
            </div>
          </Link>
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-terrain">Hyrox series</span>
            <h3 className="mt-3 font-display text-4xl uppercase text-foreground md:text-5xl">{p.name}</h3>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">{p.story}</p>
            <div className="mt-5 text-xs uppercase tracking-[0.22em] text-foreground/60">{p.frameSize}</div>
            <div className="mt-2 text-lg font-semibold text-terrain">AED {p.priceAed}</div>
            <Link
              to="/shop/$slug"
              params={{ slug: p.slug }}
              className="mt-7 inline-flex items-center gap-2 bg-terrain px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90"
            >
              Order now
            </Link>
          </div>
        </div>
        <p className="mt-10 text-xs uppercase tracking-[0.28em] text-foreground/50">{"\n"}</p>
      </div>
    </div>
  );
}
