import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our story — Evara3D" },
      { name: "description", content: "Evara3D FZC is a UAE studio turning Strava runs into 3D-printed topographic relief map frames." },
      { property: "og:title", content: "Our story — Evara3D" },
      { property: "og:description", content: "A UAE studio for runners who treat their routes as memory." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <span className="text-xs uppercase tracking-[0.28em] text-terrain">Our story</span>
      <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">
        Every Moment Has a Place. Every Place Has a Story.
      </h1>
      <div className="mt-12 space-y-6 text-lg leading-relaxed text-foreground/80">
        <p>{"\n"}</p>
        <p>{"\n"}</p>
        <p>{"\n"}</p>
        <p>{"\n"}</p>
      </div>
      <div className="mt-14">
        <Link to="/shop" className="bg-terrain px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain">
          See the collection
        </Link>
      </div>
    </section>
  );
}
