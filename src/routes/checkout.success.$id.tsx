import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/success/$id")({
  head: () => ({
    meta: [
      { title: "Request received — Evara3D" },
      { name: "description", content: "Your Evara3D order request has been received. We'll be in touch shortly." },
    ],
  }),
  component: Success,
});

function Success() {
  const { id } = Route.useParams();
  const ref = id.slice(0, 8).toUpperCase();
  return (
    <section className="mx-auto max-w-2xl px-6 py-32 text-center">
      <span className="text-xs uppercase tracking-[0.28em] text-terrain">Request received</span>
      <h1 className="mt-4 font-display text-5xl text-ink">Thank you.</h1>
      <p className="mt-6 text-ink/70">
        We've got your run. Our studio will review the details and WhatsApp you within 24
        hours to confirm everything and arrange payment & shipping.
      </p>
      <div className="mt-10 inline-block border border-ink/20 px-6 py-4">
        <div className="text-xs uppercase tracking-[0.22em] text-ink/55">Reference</div>
        <div className="mt-1 font-display text-2xl text-ink">EVR-{ref}</div>
      </div>
      <div className="mt-12">
        <Link to="/" className="bg-ink px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain">
          Back to home
        </Link>
      </div>
    </section>
  );
}
