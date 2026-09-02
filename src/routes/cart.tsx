import { ResponsiveImage } from "@/components/responsive-image";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PhoneInput, buildE164 } from "@/components/phone-input";
import { submitFlaskOrder } from "@/lib/requests.functions";
import { useCart, cartTotal } from "@/lib/cart";
import { FrameVisual } from "@/components/frame-visual";
import { createFlaskCheckout } from "@/lib/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";

import hyroxHexAsset from "@/assets/hyrox/hyrox-hex.png.asset.json";
import flaskBlackAsset from "@/assets/flask-dry-stand-black.png.asset.json";
import flaskWhiteAsset from "@/assets/flask-dry-stand-white.png.asset.json";
import flaskBlueAsset from "@/assets/flask-dry-stand.png.asset.json";

const FLASK_IMAGES: Record<string, string> = {
  Black: flaskBlackAsset.url,
  White: flaskWhiteAsset.url,
  Blue: flaskBlueAsset.url,
};

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Evara3D" },
      { name: "description", content: "Review the frames in your Evara3D cart and continue to the order request." },
      { property: "og:title", content: "Cart — Evara3D" },
      { property: "og:description", content: "Review the frames in your Evara3D cart and continue to the order request." },
      { property: "og:url", content: "https://evara3d.ae/cart" },
    ],
    links: [{ rel: "canonical", href: "https://evara3d.ae/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const total = cartTotal(items);
  const flaskItems = items.filter((i) => i.productSlug === "flask-dry-stand");
  const hex2pcItems = items.filter((i) => i.productSlug === "hyrox-hex-2pc");
  const frameItems = items.filter(
    (i) => i.productSlug !== "flask-dry-stand" && i.productSlug !== "hyrox-hex-2pc",
  );
  const flaskQty = flaskItems.reduce((s, i) => s + i.qty, 0);
  const flaskBreakdown = flaskItems.map((i) => `${i.qty}x ${i.color ?? "Black"}`).join(", ");

  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState("+971");
  const [nationalNumber, setNationalNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [payUrl, setPayUrl] = useState<string | null>(null);

  type FlaskCheckoutItem = { color: "Black" | "White" | "Blue"; qty: number };

  const submitFlask = async (e: React.FormEvent) => {
    e.preventDefault();
    const whatsapp = buildE164(dial, nationalNumber);
    if (!fullName.trim() || !/^\S+@\S+\.\S+$/.test(email) || !/^\+\d{7,16}$/.test(whatsapp)) {
      toast.error("Please enter your name, a valid email and WhatsApp number.");
      return;
    }
    setSubmitting(true);
    // Open the tab synchronously with the click so browsers don't block it.
    const payWindow = window.open("", "_blank");
    try {
      const flaskPayload: FlaskCheckoutItem[] = flaskItems.map((i) => ({
        color: (i.color ?? "Black") as "Black" | "White" | "Blue",
        qty: i.qty,
      }));
      const res = await submitFlaskOrder({
        data: {
          contact: { fullName: fullName.trim(), email: email.trim(), whatsapp, notes: notes.trim() || null },
          items: flaskPayload,
        },
      });
      const checkout = await createFlaskCheckout({
        data: {
          requestId: res.id,
          email: email.trim(),
          fullName: fullName.trim(),
          whatsapp,
          items: flaskPayload,
          environment: getStripeEnvironment(),
          origin: window.location.origin,
        },
      });
      if ("error" in checkout) throw new Error(checkout.error);
      if (!checkout.url) throw new Error("Stripe did not return a payment link.");
      setPayUrl(checkout.url);
      setShowForm(false);
      if (payWindow) payWindow.location.href = checkout.url;
      toast.success("Order confirmed — complete payment in the new tab.");
    } catch (err) {
      payWindow?.close();
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not submit your order.");
    } finally {
      setSubmitting(false);
    }
  };




  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-5xl text-foreground">Your cart is empty</h1>
        <p className="mt-4 text-foreground/70">Pick a frame and we'll do the rest.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block bg-terrain px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain"
        >
          Browse the collection
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-display text-5xl text-foreground">Cart</h1>

      <div className="mt-12 grid gap-12 md:grid-cols-[1.6fr_1fr]">
        <div className="divide-y divide-ink/10 border-y border-foreground/30/10">
          {items.map((i) => (
            <div key={i.id} className="grid grid-cols-[120px_1fr_auto] gap-6 py-8">
              <div className="bg-secondary/60 p-2 flex items-center justify-center">
                {i.productSlug === "hyrox-hex" || i.productSlug === "hyrox-hex-2pc" ? (
                  <ResponsiveImage
                    src={hyroxHexAsset.url}
                    alt="Hyrox Hex 3D-printed hexagonal race display"
                    sizes="120px"
                    className="h-full w-full object-contain"
                  />
                ) : i.productSlug === "flask-dry-stand" ? (
                  <ResponsiveImage
                    src={FLASK_IMAGES[i.color ?? "Black"] ?? flaskBlackAsset.url}
                    alt={`Soft Flask Drying Stand — ${i.color ?? "Black"}`}
                    sizes="120px"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FrameVisual frameFinish={i.frameFinish} mapColor={i.mapColor} trackColor={i.trackColor} />
                )}
              </div>
              <div>
                <div className="font-display text-2xl text-foreground">{i.name}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/70">
                  {i.productSlug === "hyrox-hex" || i.productSlug === "hyrox-hex-2pc"
                    ? `${i.mapColor} display · ${i.trackColor} text`
                    : i.productSlug === "flask-dry-stand"
                      ? `Color: ${i.color ?? "Black"}`
                      : `${i.frameFinish} · ${i.mapColor} relief · ${i.trackColor} track`}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center border border-foreground/30/30">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="px-3 py-1.5 hover:bg-terrain hover:text-paper" aria-label="Decrease">−</button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="px-3 py-1.5 hover:bg-terrain hover:text-paper" aria-label="Increase">+</button>
                  </div>
                  <button
                    onClick={() => remove(i.id)}
                    className="text-xs uppercase tracking-[0.18em] text-foreground/70 hover:text-terrain"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-foreground">AED {i.priceAed * i.qty}</div>
                <div className="mt-1 text-xs text-foreground/70">AED {i.priceAed} each</div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit bg-secondary/60 p-8">
          <div className="text-xs uppercase tracking-[0.22em] text-foreground/70">Order summary</div>
          <div className="mt-6 flex justify-between text-sm">
            <span className="text-foreground/70">Subtotal</span>
            <span className="text-foreground">AED {total}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-foreground/70">Shipping</span>
            <span className="text-foreground/70">Quoted on request</span>
          </div>
          <div className="mt-6 border-t border-foreground/30/15 pt-4 flex justify-between font-display text-xl">
            <span>Total</span>
            <span>AED {total}</span>
          </div>
          {flaskItems.length > 0 && !showForm && !payUrl && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-8 block w-full bg-terrain px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90"
            >
              Place Your Order &amp; Secure Your Payment
            </button>
          )}

          {flaskItems.length > 0 && showForm && (
            <form onSubmit={submitFlask} className="mt-8 space-y-4">
              <div className="text-xs uppercase tracking-[0.22em] text-foreground/70">Your details</div>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                maxLength={120}
                autoComplete="name"
                className="w-full border border-foreground/30 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/40"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                maxLength={255}
                autoComplete="email"
                className="w-full border border-foreground/30 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/40"
              />
              <PhoneInput
                dial={dial}
                number={nationalNumber}
                onDialChange={setDial}
                onNumberChange={setNationalNumber}
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                maxLength={2000}
                className="min-h-20 w-full border border-foreground/30 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/40"
              />
              <button
                type="submit"
                disabled={submitting}
                className="block w-full bg-terrain px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Confirm order & continue to payment"}
              </button>
            </form>
          )}
          {flaskItems.length > 0 && (
            <p className="mt-3 text-xs text-foreground/70">
              Soft Flask Drying Stand: {flaskQty} unit{flaskQty === 1 ? "" : "s"} ({flaskBreakdown}).
            </p>
          )}
          {hex2pcItems.length > 0 && (
            <a
              href="https://buy.stripe.com/00waEY5RwaBw6yDeKYf7i08"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block bg-terrain px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90"
            >
              Place Your Order and Secure Your Payment
            </a>
          )}
          {frameItems.length > 0 && (
            <a
              href="https://buy.stripe.com/cNidRafs6bFA9KPfP2f7i07"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block bg-terrain px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90"
            >
              Place Your Order and Secure Your Payment
            </a>
          )}
          <p className="mt-4 text-xs text-foreground/70">
            After payment, we'll WhatsApp you to confirm your design details, order specifications, and shipping. Make sure you type your WhatsApp number correctly.
          </p>

        </aside>
      </div>

      {payUrl && (
        <p className="mt-8 text-center text-sm text-foreground/70">
          Payment opens in a new tab.{" "}
          <a href={payUrl} target="_blank" rel="noopener noreferrer" className="underline text-terrain">
            Continue to secure payment
          </a>
        </p>
      )}
    </section>
  );
}
