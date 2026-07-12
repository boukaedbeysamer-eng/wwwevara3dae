import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { LegacyFrameVisual } from "@/components/legacy-frame-visual";
import frame3dMap from "@/assets/carousel/frame-3d-hex-goat-ultra.png.asset.json";
import keepsakerImg from "@/assets/carousel/keepsaker-goat-ultra.png.asset.json";
import achieverImg from "@/assets/carousel/frame-achiever-goat-ultra.webp.asset.json";
import bgImg from "@/assets/IMG_4007.jpeg.asset.json";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Evara3D" },
      { name: "description", content: "Browse the Evara3D collection of 3D-printed topographic running route frames: Keepsaker, Achiever, Legacy, and 3D HEX MAP DISPLAY WITH STAND." },
      { property: "og:title", content: "Shop — Evara3D" },
      { property: "og:description", content: "Browse 3D-printed topographic running route frames designed for athletes." },
    ],
  }),
  component: Shop,
});

function Shop() {
  return (
    <section
      className="relative mx-auto max-w-7xl px-6 py-20 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg.url})` }}
    >
      <div className="absolute inset-0 bg-ink/92 backdrop-blur-[2px]" />
      <div className="relative">
        <span className="text-xs uppercase tracking-[0.28em] text-terrain text-shadow-sm">The collection</span>
        <h1 className="mt-3 max-w-2xl font-display text-5xl text-foreground text-shadow-md md:text-6xl">
          Choose your frame.
        </h1>
        <p className="mt-4 max-w-xl text-base text-foreground/90 text-shadow-sm">
          Each frame is made to order, in the UAE, from your GPX file. Prices in AED;
          worldwide shipping quoted on request.
        </p>

        <div className="mt-16 grid gap-14 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <Link key={p.slug} to="/shop/$slug" params={{ slug: p.slug }} className="group block">
              <div className={`bg-card transition-colors group-hover:bg-secondary ${p.slug === "keepsaker" || p.slug === "achiever" || p.slug === "3d-map-display" ? "" : "p-8"}`}>
                {p.slug === "keepsaker" && (
                  <img src={keepsakerImg.url} alt={`${p.name} 3D-printed topographic frame`} className="aspect-square w-full object-contain" />
                )}
                {p.slug === "achiever" && (
                  <img src={achieverImg.url} alt={`${p.name} 3D-printed topographic frame with medal`} className="aspect-square w-full object-cover" />
                )}
                {p.slug === "legacy" && <LegacyFrameVisual />}
                {p.slug === "3d-map-display" && (
                  <img src={frame3dMap.url} alt={`${p.name} 3D-printed topographic hex plaque`} className="aspect-square w-full object-cover" />
                )}
              </div>
              <div className="mt-6 flex items-baseline justify-between">
                <h2 className="font-display text-2xl text-foreground text-shadow-sm">{p.name}</h2>
                <span className="text-sm font-medium text-foreground/90">AED {p.priceAed}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/80">{p.tagline}</p>
              <div className="mt-3 text-xs uppercase tracking-[0.22em] text-foreground/70">
                {p.frameSize}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
