import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { FrameVisual } from "@/components/frame-visual";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Evara3D" },
      { name: "description", content: "Browse the Evara3D collection of 3D-printed topographic running route frames: Keepsaker, Achiever, and Legacy." },
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
      <h1 className="mt-3 max-w-2xl font-display text-5xl text-ink md:text-6xl">
        Choose your frame.
      </h1>
      <p className="mt-4 max-w-xl text-base text-ink/70">
        Each frame is made to order, in the UAE, from your GPX file. Prices in AED;
        worldwide shipping quoted on request.
      </p>

      <div className="mt-16 grid gap-14 md:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <Link key={p.slug} to="/shop/$slug" params={{ slug: p.slug }} className="group block">
            <div className="bg-secondary/60 p-8 transition-colors group-hover:bg-secondary">
              <FrameVisual
                frameFinish={i === 0 ? "White Matt" : i === 1 ? "Matte Black" : "Wooden"}
                mapColor={i === 1 ? "White" : "Black"}
                trackColor={i === 2 ? "Red" : "Orange"}
              />
            </div>
            <div className="mt-6 flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-ink">{p.name}</h2>
              <span className="text-sm text-ink/70">AED {p.priceAed}</span>
            </div>
            <p className="mt-2 text-sm text-ink/60">{p.tagline}</p>
            <div className="mt-3 text-xs uppercase tracking-[0.22em] text-ink/50">
              {p.frameSize}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
