import { ResponsiveImage } from "@/components/responsive-image";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import {
  FRAME_FINISHES,
  MAP_COLORS,
  TRACK_COLORS,
  TEXT_COLORS,
  HYROX_DISPLAY_COLORS,
  getProduct,
  type FrameFinish,
  type MapColor,
  type TrackColor,
} from "@/data/products";
import { DynamicFrameSample, type FrameDetails } from "@/components/dynamic-frame-sample";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import hyroxHexAsset from "@/assets/hyrox/hyrox-hex.png.asset.json";

export const Route = createFileRoute("/shop_/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — 3D Topographic Map Frame — Evara3D` : "Frame — Evara3D";
    const desc = p ? `${p.tagline} ${p.frameSize}, ${p.mapSize}.` : "";
    const url = `https://evara3d.ae/shop/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.name,
                description: `${p.tagline} ${p.story}`,
                brand: { "@type": "Brand", name: "Evara3D" },
                offers: {
                  "@type": "Offer",
                  price: p.priceAed,
                  priceCurrency: "AED",
                  availability: "https://schema.org/InStock",
                  url,
                },
              }),
            },
          ]
        : [],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();
  const add = useCart((s) => s.add);

  const [frameFinish, setFrameFinish] = useState<FrameFinish>("Wooden");
  const isHyrox = product.slug === "hyrox-hex";
  const [mapColor, setMapColor] = useState<MapColor>("Black");
  const [trackColor, setTrackColor] = useState<TrackColor>(isHyrox ? "White" : "Orange");
  const [qty, setQty] = useState(1);

  const [raceName, setRaceName] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [elevation, setElevation] = useState("");

  const frameDetails: FrameDetails = {
    raceName,
    date,
    distance,
    elevation,
  };

  const handleAdd = (goToCart: boolean) => {
    add({
      productSlug: product.slug,
      name: product.name,
      priceAed: product.priceAed,
      qty,
      frameFinish,
      mapColor,
      trackColor,
      ...frameDetails,
    });
    toast.success(`${product.name} added to cart`);
    if (goToCart) navigate({ to: "/cart" });
  };

  const raceNameId = useId();
  const dateId = useId();
  const distanceId = useId();
  const elevationId = useId();

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Link to="/shop" className="text-xs uppercase tracking-[0.22em] text-foreground/60 hover:text-terrain">
        ← Back to shop
      </Link>

      <div className="mt-8 grid gap-16 md:grid-cols-[1.05fr_1fr]">
        <div className="bg-secondary/60 p-10 flex items-center justify-center">
          {product.slug === "hyrox-hex" ? (
            <ResponsiveImage
              src={hyroxHexAsset.url}
              alt="Hyrox Hex — 3D-printed hexagonal race result display with stand"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              className="w-full max-w-lg object-contain"
            />
          ) : (
            <DynamicFrameSample
              frameFinish={frameFinish}
              mapColor={mapColor}
              trackColor={trackColor}
              showMedal={product.slug !== "keepsaker" && product.slug !== "3d-map-display"}
              showSecondHex={product.slug !== "keepsaker" && product.slug !== "3d-map-display"}
              showBibSquare={product.slug === "legacy"}
              minimal={product.slug === "3d-map-display"}
              {...frameDetails}
            />
          )}
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.28em] text-terrain">{product.frameSize}</span>
          <h1 className="mt-3 font-display text-5xl text-foreground">{product.slug === "hyrox-hex" ? "HYROX HEX DISPLAY WITH STAND." : `${product.name} — 3D Topographic Map Frame`}</h1>
          <p className="mt-2 font-display text-lg text-foreground/70">{product.tagline}</p>
          <div className="mt-6 text-2xl text-foreground">AED {product.priceAed}</div>

          <p className="mt-8 leading-relaxed text-foreground/75">{product.story}</p>

          <div className="mt-8 border-t border-foreground/30/10 pt-6">
            <div className="text-xs uppercase tracking-[0.22em] text-foreground/70">What's included</div>
            <ul className="mt-3 space-y-2 text-sm text-foreground/80">
              {product.includes.map((line: string) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 inline-block h-1 w-3 bg-terrain" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {product.slug !== "3d-map-display" && product.slug !== "hyrox-hex" && (
            <Selector 
              label="Frame finish" 
              value={frameFinish} 
              options={FRAME_FINISHES.filter(f => f !== "Wooden")} 
              onChange={setFrameFinish} 
            />
          )}
          <Selector label={product.slug === "hyrox-hex" ? "3D\u00A0hexagonal Hyrox display color" : "3D relief color"} value={mapColor} options={product.slug === "hyrox-hex" ? HYROX_DISPLAY_COLORS : MAP_COLORS} onChange={setMapColor} />
          <Selector 
            label={product.slug === "hyrox-hex" ? "TEXT COLOR" : "Strava track color"} 
            value={trackColor} 
            options={product.slug === "hyrox-hex" ? TEXT_COLORS : TRACK_COLORS} 
            onChange={setTrackColor} 
          />

          <div className="mt-8 border-t border-foreground/30/10 pt-6">
            <div className="text-xs uppercase tracking-[0.22em] text-foreground/70">
              {product.slug === "hyrox-hex" ? "Personalise your display" : product.slug === "3d-map-display" ? "Personalize your map" : "Personalize your frame"}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor={raceNameId} className="block text-[10px] uppercase tracking-[0.18em] text-foreground/70">
                  {product.slug === "hyrox-hex" ? "ATHLETE NAME" : "Race name"}
                </label>
                <Input
                  id={raceNameId}
                  value={raceName}
                  onChange={(e) => setRaceName(e.target.value)}
                  placeholder={product.slug === "hyrox-hex" ? "e.g. John Doe" : "e.g. Dubai Marathon"}
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div className={product.slug === "hyrox-hex" ? "col-span-2" : ""}>
                <label htmlFor={dateId} className="block text-[10px] uppercase tracking-[0.18em] text-foreground/70">
                  {product.slug === "hyrox-hex" ? "RACE LOCATION & DIVISION / SEASON" : "Date"}
                </label>
                <Input
                  id={dateId}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder={product.slug === "hyrox-hex" ? "e.g. Hyrox Istanbul - Pro Men" : "e.g. 12.03.2026"}
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div>
                <label htmlFor={distanceId} className="block text-[10px] uppercase tracking-[0.18em] text-foreground/70">
                  {product.slug === "hyrox-hex" ? "TIME" : "Distance"}
                </label>
                <Input
                  id={distanceId}
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder={product.slug === "hyrox-hex" ? "e.g. 1:06:56" : "e.g. 42.2 km"}
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div>
                <label htmlFor={elevationId} className="block text-[10px] uppercase tracking-[0.18em] text-foreground/70">
                  {product.slug === "hyrox-hex" ? "DATE" : "Elevation"}
                </label>
                <Input
                  id={elevationId}
                  value={elevation}
                  onChange={(e) => setElevation(e.target.value)}
                  placeholder={product.slug === "hyrox-hex" ? "e.g. 12.03.2026" : "e.g. 245 m"}
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center border border-foreground/30/30">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-foreground hover:bg-terrain hover:text-paper"
                aria-label="Decrease quantity"
              >−</button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="px-4 py-3 text-foreground hover:bg-terrain hover:text-paper"
                aria-label="Increase quantity"
              >+</button>
            </div>
            <button
              onClick={() => handleAdd(false)}
              className="flex-1 bg-terrain px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain"
            >
              Add to cart
            </button>
          </div>
          <button
            onClick={() => handleAdd(true)}
            className="mt-3 w-full border border-foreground/30 px-6 py-4 text-xs uppercase tracking-[0.22em] text-foreground hover:bg-terrain hover:text-paper"
          >
            Add & request now
          </button>

          {product.slug !== "hyrox-hex" && (
            <p className="mt-6 text-xs text-foreground/70">
              We'll collect your GPX file and run details on the next step.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Selector<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="mt-8">
      <div className="text-xs uppercase tracking-[0.22em] text-foreground/70">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`border px-4 py-2 text-sm transition-colors ${
              value === opt
                ? "border-foreground/30 bg-terrain text-paper"
                : "border-foreground/30/30 text-foreground hover:border-foreground/30"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
