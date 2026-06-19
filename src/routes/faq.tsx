import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Evara3D" },
      { name: "description", content: "Answers about GPX files, frame finishes, lead times, shipping, and payment for Evara3D topographic frames." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  {
    q: "Which apps can I export a GPX file from?",
    a: "Strava, Garmin Connect, Apple Fitness, Komoot, Wahoo, Suunto — anything that records GPS and exports .gpx. For Strava: open an activity → ⋯ menu → Export GPX.",
  },
  {
    q: "How does payment work?",
    a: "You're not charged on the website. Once we receive your request, we WhatsApp you within 24 hours to confirm the details and arrange payment (bank transfer or card link) and shipping.",
  },
  {
    q: "How long does it take?",
    a: "Production takes 7–10 working days from confirmation. Shipping within the UAE is 1–3 days; international is quoted per destination.",
  },
  {
    q: "Can I see a preview before you print?",
    a: "Yes — once we receive your GPX, we send you a render preview before any printing begins. Nothing goes into production without your approval.",
  },
  {
    q: "Can I gift this?",
    a: "Absolutely. Add a note at checkout and we'll arrange gift wrap. We can also ship directly to the recipient.",
  },
  {
    q: "What if I don't have a GPX file?",
    a: "Get in touch — for famous courses (Dubai Marathon, RAK Half, etc.) we can usually source the route. Just send us the race name and year.",
  },
];

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <span className="text-xs uppercase tracking-[0.28em] text-terrain">Help</span>
      <h1 className="mt-3 font-display text-5xl text-foreground">Frequently asked.</h1>
      <div className="mt-12 divide-y divide-ink/10 border-y border-foreground/30/10">
        {faqs.map((f) => (
          <details key={f.q} className="group py-6">
            <summary className="flex cursor-pointer items-baseline justify-between gap-6 font-display text-xl text-foreground">
              {f.q}
              <span className="text-terrain transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 leading-relaxed text-foreground/75">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
