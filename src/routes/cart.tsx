import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart, cartTotal } from "@/lib/cart";
import { FrameVisual } from "@/components/frame-visual";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Evara3D" },
      { name: "description", content: "Review the frames in your Evara3D cart and continue to the order request." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-5xl text-ink">Your cart is empty</h1>
        <p className="mt-4 text-ink/70">Pick a frame and we'll do the rest.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block bg-ink px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain"
        >
          Browse the collection
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-display text-5xl text-ink">Cart</h1>

      <div className="mt-12 grid gap-12 md:grid-cols-[1.6fr_1fr]">
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map((i) => (
            <div key={i.id} className="grid grid-cols-[120px_1fr_auto] gap-6 py-8">
              <div className="bg-secondary/60 p-2">
                <FrameVisual frameFinish={i.frameFinish} mapColor={i.mapColor} trackColor={i.trackColor} />
              </div>
              <div>
                <div className="font-display text-2xl text-ink">{i.name}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/55">
                  {i.frameFinish} · {i.mapColor} relief · {i.trackColor} track
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center border border-ink/30">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="px-3 py-1.5 hover:bg-ink hover:text-paper" aria-label="Decrease">−</button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="px-3 py-1.5 hover:bg-ink hover:text-paper" aria-label="Increase">+</button>
                  </div>
                  <button
                    onClick={() => remove(i.id)}
                    className="text-xs uppercase tracking-[0.18em] text-ink/55 hover:text-terrain"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-ink">AED {i.priceAed * i.qty}</div>
                <div className="mt-1 text-xs text-ink/50">AED {i.priceAed} each</div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit bg-secondary/60 p-8">
          <div className="text-xs uppercase tracking-[0.22em] text-ink/50">Order summary</div>
          <div className="mt-6 flex justify-between text-sm">
            <span className="text-ink/70">Subtotal</span>
            <span className="text-ink">AED {total}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-ink/70">Shipping</span>
            <span className="text-ink/70">Quoted on request</span>
          </div>
          <div className="mt-6 border-t border-ink/15 pt-4 flex justify-between font-display text-xl">
            <span>Total</span>
            <span>AED {total}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-8 block bg-ink px-6 py-4 text-center text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain"
          >
            Send order request
          </Link>
          <p className="mt-4 text-xs text-ink/55">
            No payment now. We'll WhatsApp you to confirm details, shipping, and payment.
          </p>
        </aside>
      </div>
    </section>
  );
}
