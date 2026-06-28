import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  FRAME_FINISHES,
  MAP_COLORS,
  TRACK_COLORS,
  getProduct,
  type FrameFinish,
  type MapColor,
  type TrackColor,
} from "@/data/products";
import { DynamicFrameSample, type FrameDetails } from "@/components/dynamic-frame-sample";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/shop_/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — Evara3D` : "Frame — Evara3D";
    const desc = p ? `${p.tagline} ${p.frameSize}, ${p.mapSize}.` : "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();
  const add = useCart((s) => s.add);

  const [frameFinish, setFrameFinish] = useState<FrameFinish>("Wooden");
  const [mapColor, setMapColor] = useState<MapColor>("Black");
  const [trackColor, setTrackColor] = useState<TrackColor>("Orange");
  const [qty, setQty] = useState(1);

  const [raceName, setRaceName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [elevation, setElevation] = useState("");

  const frameDetails: FrameDetails = {
    raceName,
    customerName,
    date,
    distance,
    time,
    location,
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

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Link to="/shop" className="text-xs uppercase tracking-[0.22em] text-foreground/60 hover:text-terrain">
        ← Back to shop
      </Link>

      <div className="mt-8 grid gap-16 md:grid-cols-[1.05fr_1fr]">
        <div className="bg-secondary/60 p-10 flex items-center justify-center">
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
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.28em] text-terrain">{product.frameSize}</span>
          <h1 className="mt-3 font-display text-5xl text-foreground">{product.name}</h1>
          <p className="mt-2 font-display text-lg text-foreground/70">{product.tagline}</p>
          <div className="mt-6 text-2xl text-foreground">AED {product.priceAed}</div>

          <p className="mt-8 leading-relaxed text-foreground/75">{product.story}</p>

          <div className="mt-8 border-t border-foreground/30/10 pt-6">
            <div className="text-xs uppercase tracking-[0.22em] text-foreground/50">What's included</div>
            <ul className="mt-3 space-y-2 text-sm text-foreground/80">
              {product.includes.map((line: string) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 inline-block h-1 w-3 bg-terrain" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {product.slug !== "3d-map-display" && (
            <Selector label="Frame finish" value={frameFinish} options={FRAME_FINISHES} onChange={setFrameFinish} />
          )}
          <Selector label="3D relief color" value={mapColor} options={MAP_COLORS} onChange={setMapColor} />
          <Selector label="Strava track color" value={trackColor} options={TRACK_COLORS} onChange={setTrackColor} />

          <div className="mt-8 border-t border-foreground/30/10 pt-6">
            <div className="text-xs uppercase tracking-[0.22em] text-foreground/50">
              {product.slug === "3d-map-display" ? "Personalize your map" : "Personalize your frame"}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase tracking-[0.18em] text-foreground/50">Race name</label>
                <Input
                  value={raceName}
                  onChange={(e) => setRaceName(e.target.value)}
                  placeholder="e.g. Dubai Marathon"
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] uppercase tracking-[0.18em] text-foreground/50">Your name</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ahmed Al Mansouri"
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-foreground/50">Date</label>
                <Input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. 12.03.2026"
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-foreground/50">Distance</label>
                <Input
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 42.2 km"
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-foreground/50">Time</label>
                <Input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 04:15:00"
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-foreground/50">Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dubai"
                  className="mt-1 rounded-none border-foreground/30 bg-transparent text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-foreground/50">Elevation</label>
                <Input
                  value={elevation}
                  onChange={(e) => setElevation(e.target.value)}
                  placeholder="e.g. 245 m"
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

          <p className="mt-6 text-xs text-foreground/50">
            We'll collect your GPX file and run details on the next step.
          </p>
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
      <div className="text-xs uppercase tracking-[0.22em] text-foreground/50">{label}</div>
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
