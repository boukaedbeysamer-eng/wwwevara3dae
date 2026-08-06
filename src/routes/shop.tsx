import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import frame3dMap from "@/assets/carousel/frame-3d-hex-goat-ultra.png.asset.json";
import keepsakerImg from "@/assets/carousel/keepsaker-goat-ultra.png.asset.json";
import achieverImg from "@/assets/carousel/frame-achiever-goat-ultra.webp.asset.json";
import legacyImg from "@/assets/carousel/legacy-goat-ultra-race-director-2.jpg.asset.json";
import bgImg from "@/assets/IMG_4007.jpeg.asset.json";
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
          Each frame is made to order, in the UAE, from your GPX file. Prices in AED;
          worldwide shipping quoted on request.
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

          <Accordion id="glow" title="Glow Series" open={open === "glow"} onToggle={() => toggle("glow")} light titleBold>
            <ComingSoon
              title="Glow Series"
              note="Luminous relief maps that light up your route after dark. Launching soon."
            />
          </Accordion>

          <Accordion id="hyrox" title="Hyrox Series" open={open === "hyrox"} onToggle={() => toggle("hyrox")}>
            <ComingSoon
              title="Hyrox Series"
              note="Built for the Hyrox floor — stations, splits, and finish time in 3D. Launching soon."
            />
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
  titleBold = false,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  light?: boolean;
  titleBold?: boolean;
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
        <span className={`font-display text-2xl uppercase tracking-wide md:text-3xl ${light && titleBold ? "font-bold text-black" : ""}`}>{title}</span>
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

function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <div className="relative overflow-hidden border border-border/60 bg-ink px-6 py-16 text-center md:py-20">
      <TopoBackdrop />
      <div className="relative">
        <span className="text-xs uppercase tracking-[0.28em] text-terrain">Coming soon</span>
        <h3 className="mt-4 font-display text-4xl uppercase text-foreground md:text-5xl">{title}</h3>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-foreground/75">{note}</p>
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
