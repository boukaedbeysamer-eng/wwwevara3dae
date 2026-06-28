import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { KeepsakerFrameVisual } from "@/components/keepsaker-frame-visual";
import { AchieverFrameVisual } from "@/components/achiever-frame-visual";
import { LegacyFrameVisual } from "@/components/legacy-frame-visual";
import frame3dMap from "@/assets/carousel/frame-3d-map.jpg.asset.json";
import keepsakerImg from "@/assets/carousel/goat-ultra-keepsaker.jpeg.asset.json";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Evara3D" },
      { name: "description", content: "Browse the Evara3D collection of 3D-printed topographic running route frames: Keepsaker, Achiever, Legacy, and 3D MAP display." },
      { property: "og:title", content: "Shop — Evara3D" },
      { property: "og:description", content: "Browse 3D-printed topographic running route frames designed for athletes." },
    ],
  }),
  component: Shop,
});

function Shop() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <span className="text-xs uppercase tracking-[0.28em] text-terrain">The collection</span>
      <h1 className="mt-3 max-w-2xl font-display text-5xl text-foreground md:text-6xl">
        Choose your frame.
      </h1>
      <p className="mt-4 max-w-xl text-base text-foreground/70">
        Each frame is made to order, in the UAE, from your GPX file. Prices in AED;
        worldwide shipping quoted on request.
      </p>

      <div className="mt-16 grid gap-14 md:grid-cols-3">
        {PRODUCTS.map((p) => (
          <Link key={p.slug} to="/shop/$slug" params={{ slug: p.slug }} className="group block">
            <div className={`bg-secondary/60 transition-colors group-hover:bg-secondary ${p.slug === "keepsaker" ? "" : "p-8"}`}>
              {p.slug === "keepsaker" && (
                <KeepsakerFrameVisual alt={`${p.name} 3D-printed topographic frame`} />
              )}
              {p.slug === "achiever" && <AchieverFrameVisual />}
              {p.slug === "legacy" && <LegacyFrameVisual />}
              {p.slug === "3d-map-display" && (
                <img src={frame3dMap.url} alt={`${p.name} 3D-printed topographic hex plaque`} className="aspect-square w-full object-cover" />
              )}
            </div>
            <div className="mt-6 flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-foreground">{p.name}</h2>
              <span className="text-sm text-foreground/70">AED {p.priceAed}</span>
            </div>
            <p className="mt-2 text-sm text-foreground/60">{p.tagline}</p>
            <div className="mt-3 text-xs uppercase tracking-[0.22em] text-foreground/50">
              {p.frameSize}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
