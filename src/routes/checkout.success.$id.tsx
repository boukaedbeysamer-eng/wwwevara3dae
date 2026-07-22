import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getOrderStatus } from "@/lib/payments.functions";

export const Route = createFileRoute("/checkout/success/$id")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: "Order confirmed — Evara3D" },
      { name: "description", content: "Your Evara3D order is confirmed. Our studio will WhatsApp you within 24 hours to confirm run details and arrange shipping of your custom 3D-printed frame." },
      { property: "og:title", content: "Order confirmed — Evara3D" },
      { property: "og:description", content: "Your Evara3D order is confirmed. We'll WhatsApp you within 24 hours to arrange your custom 3D-printed frame." },
      { property: "og:url", content: `https://evara3d.ae/checkout/success/${params.id}` },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `https://evara3d.ae/checkout/success/${params.id}` }],
  }),
  component: Success,
});

type State =
  | { kind: "loading" }
  | { kind: "paid" }
  | { kind: "pending" }
  | { kind: "failed"; label: string }
  | { kind: "not_found" };

function Success() {
  const { id } = Route.useParams();
  const ref = id.slice(0, 8).toUpperCase();
  const fetchStatus = useServerFn(getOrderStatus);
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetchStatus({ data: { id } });
        if (cancelled) return;
        if (!res.status) {
          setState({ kind: "not_found" });
          return;
        }
        if (res.status === "paid") {
          setState({ kind: "paid" });
          return;
        }
        if (res.status === "expired" || res.status === "payment_failed" || res.status === "checkout_failed") {
          const label =
            res.status === "expired"
              ? "This checkout session expired."
              : "Payment did not complete.";
          setState({ kind: "failed", label });
          return;
        }
        // pending_payment — webhook may still be arriving. Poll for ~20s.
        if (attempts < 20) {
          setState({ kind: "pending" });
          setTimeout(poll, 1000);
        } else {
          setState({ kind: "pending" });
        }
      } catch {
        if (!cancelled && attempts < 20) setTimeout(poll, 1500);
      }
    };
    void poll();
    return () => {
      cancelled = true;
    };
  }, [id, fetchStatus]);

  return (
    <section className="mx-auto max-w-2xl px-6 py-32 text-center">
      <StatusHeader state={state} />
      <div className="mt-10 inline-block border border-foreground/30/20 px-6 py-4">
        <div className="text-xs uppercase tracking-[0.22em] text-foreground/55">Reference</div>
        <div className="mt-1 font-display text-2xl text-foreground">EVR-{ref}</div>
      </div>
      <div className="mt-12 flex justify-center gap-4">
        <Link to="/" className="bg-terrain px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain">
          Back to home
        </Link>
        {state.kind === "failed" && (
          <Link to="/shop" className="border border-foreground/30 px-6 py-4 text-xs uppercase tracking-[0.22em] text-foreground">
            Try again
          </Link>
        )}
      </div>
    </section>
  );
}

function StatusHeader({ state }: { state: State }) {
  if (state.kind === "loading" || state.kind === "pending") {
    return (
      <>
        <span className="text-xs uppercase tracking-[0.28em] text-terrain">Confirming payment…</span>
        <h1 className="mt-4 font-display text-5xl text-foreground">One moment.</h1>
        <p className="mt-6 text-foreground/70">
          We're waiting for Stripe to confirm your payment. This usually takes a few seconds.
        </p>
      </>
    );
  }
  if (state.kind === "paid") {
    return (
      <>
        <span className="text-xs uppercase tracking-[0.28em] text-terrain">Payment received</span>
        <h1 className="mt-4 font-display text-5xl text-foreground">Thank you.</h1>
        <p className="mt-6 text-foreground/70">
          Your payment is confirmed. Our studio will WhatsApp you within 24 hours to confirm run
          details and arrange shipping.
        </p>
      </>
    );
  }
  if (state.kind === "failed") {
    return (
      <>
        <span className="text-xs uppercase tracking-[0.28em] text-destructive">Payment not completed</span>
        <h1 className="mt-4 font-display text-5xl text-foreground">Something went wrong.</h1>
        <p className="mt-6 text-foreground/70">{state.label} You haven't been charged. Please try again.</p>
      </>
    );
  }
  return (
    <>
      <span className="text-xs uppercase tracking-[0.28em] text-foreground/60">Order not found</span>
      <h1 className="mt-4 font-display text-5xl text-foreground">Hmm.</h1>
      <p className="mt-6 text-foreground/70">We couldn't find this order. If you just paid, please check your email for confirmation.</p>
    </>
  );
}
