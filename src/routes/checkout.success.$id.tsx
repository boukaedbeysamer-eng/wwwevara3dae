import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/success/$id")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Payment received — Evara3D" },
      { name: "description", content: "Your Evara3D order is confirmed. We'll be in touch shortly." },
    ],
  }),
  component: Success,
});

function Success() {
  const { id } = Route.useParams();
  const { session_id } = Route.useSearch();
  const ref = id.slice(0, 8).toUpperCase();
  const paid = Boolean(session_id);

  return (
    <section className="mx-auto max-w-2xl px-6 py-32 text-center">
      <span className="text-xs uppercase tracking-[0.28em] text-terrain">
        {paid ? "Payment received" : "Order received"}
      </span>
      <h1 className="mt-4 font-display text-5xl text-foreground">Thank you.</h1>
      <p className="mt-6 text-foreground/70">
        {paid
          ? "Your payment is confirmed and our studio will WhatsApp you within 24 hours to confirm run details and arrange shipping."
          : "We've got your order. Our studio will WhatsApp you within 24 hours to confirm everything."}
      </p>
      <div className="mt-10 inline-block border border-foreground/30/20 px-6 py-4">
        <div className="text-xs uppercase tracking-[0.22em] text-foreground/55">Reference</div>
        <div className="mt-1 font-display text-2xl text-foreground">EVR-{ref}</div>
      </div>
      <div className="mt-12">
        <Link to="/" className="bg-terrain px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain">
          Back to home
        </Link>
      </div>
    </section>
  );
}
