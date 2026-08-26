import { ResponsiveImage } from "@/components/responsive-image";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import flaskBlack from "@/assets/flask-dry-stand-black.png.asset.json";
import flaskWhite from "@/assets/flask-dry-stand-white.png.asset.json";
import flaskBlue from "@/assets/flask-dry-stand-blue.png.asset.json";

export const FLASK_PRICE_AED = 75;
export const FLASK_SLUG = "flask-dry-stand";

const COLORS = [
  { name: "Black", swatch: "#111111", img: flaskBlack.url },
  { name: "White", swatch: "#f4f4f4", img: flaskWhite.url },
  { name: "Blue", swatch: "#1e3a8a", img: flaskBlue.url },
] as const;

const DESCRIPTION =
  "3D printed soft flask drying stand, fully detachable — designed to hold and air-dry insulated flasks/bottles upright, keeping them stable and ventilated between uses.";

export const Route = createFileRoute("/flask-dry-stand")({
  head: () => ({
    meta: [
      { title: "Flask Dry Stand — Evara3D" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Flask Dry Stand — Evara3D" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://evara3d.ae/flask-dry-stand" },
      { property: "og:image", content: `https://evara3d.ae${flaskBlack.url}` },
      { name: "twitter:image", content: `https://evara3d.ae${flaskBlack.url}` },
    ],
    links: [{ rel: "canonical", href: "https://evara3d.ae/flask-dry-stand" }],
  }),
  component: FlaskDryStandPage,
});

function FlaskDryStandPage() {
  const add = useCart((s) => s.add);
  const navigate = useNavigate();
  const [active, setActive] = useState<string>("Black");
  const [qty, setQty] = useState<Record<string, number>>({ Black: 0, White: 0, Blue: 0 });

  const totalQty = Object.values(qty).reduce((a, b) => a + b, 0);
  const activeImg = COLORS.find((c) => c.name === active)!.img;

  const setColorQty = (color: string, next: number) =>
    setQty((q) => ({ ...q, [color]: Math.max(0, Math.min(20, next)) }));

  const addToCart = () => {
    if (totalQty === 0) return;
    COLORS.forEach((c) => {
      const n = qty[c.name] ?? 0;
      if (n > 0) {
        add({
          productSlug: FLASK_SLUG,
          name: "Flask Dry Stand",
          priceAed: FLASK_PRICE_AED,
          qty: n,
          color: c.name,
          frameFinish: "Matte Black",
          mapColor: "Black",
          trackColor: "Orange",
        });
      }
    });
    setQty({ Black: 0, White: 0, Blue: 0 });
    navigate({ to: "/cart" });
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="bg-secondary/60">
          <ResponsiveImage
            src={activeImg}
            alt={`Soft Flask Drying Stand in ${active} — 3D-printed drying rack for running soft flasks`}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="aspect-square w-full object-cover"
            width={1024}
            height={1024}
          />
          <div className="flex gap-3 p-4">
            {COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setActive(c.name)}
                aria-label={`View ${c.name}`}
                className={`h-16 w-16 overflow-hidden border transition-colors ${
                  active === c.name ? "border-terrain" : "border-foreground/20"
                }`}
              >
                <ResponsiveImage src={c.img} alt={`${c.name} Soft Flask Drying Stand thumbnail`} sizes="64px" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-display text-4xl uppercase text-foreground md:text-5xl">SOFT FLASK DRYING STAND</h1>
          <div className="mt-3 text-lg text-foreground/90">AED {FLASK_PRICE_AED} <span className="text-sm text-foreground/60">per unit</span></div>
          <p className="mt-6 text-sm leading-relaxed text-foreground/85">{DESCRIPTION}</p>

          <div className="mt-10 text-xs uppercase tracking-[0.22em] text-terrain">Choose colors & quantity</div>
          <div className="mt-5 space-y-4">
            {COLORS.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between border border-foreground/20 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => setActive(c.name)}
                  className="flex items-center gap-3 text-left"
                >
                  <span
                    className="h-6 w-6 rounded-full border border-foreground/30"
                    style={{ backgroundColor: c.swatch }}
                  />
                  <span className="text-xs uppercase tracking-[0.18em] text-foreground">{c.name}</span>
                </button>
                <div className="flex items-center border border-foreground/30">
                  <button
                    type="button"
                    aria-label={`Decrease ${c.name} quantity`}
                    onClick={() => setColorQty(c.name, (qty[c.name] ?? 0) - 1)}
                    className="grid h-9 w-9 place-items-center text-foreground transition-colors hover:bg-foreground/10"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm text-foreground">{qty[c.name] ?? 0}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${c.name} quantity`}
                    onClick={() => setColorQty(c.name, (qty[c.name] ?? 0) + 1)}
                    className="grid h-9 w-9 place-items-center text-foreground transition-colors hover:bg-foreground/10"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-baseline justify-between text-sm">
            <span className="uppercase tracking-[0.18em] text-foreground/70">Total</span>
            <span className="text-foreground">
              {totalQty} × AED {FLASK_PRICE_AED} = AED {totalQty * FLASK_PRICE_AED}
            </span>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={totalQty === 0}
            className="mt-6 w-full bg-terrain px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
