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
      <h1 className="mt-3 font-display text-5xl text-ink md:text-6xl">
        A studio for the runs you remember.
      </h1>
      <div className="mt-12 space-y-6 text-lg leading-relaxed text-ink/80">
        <p>
          Evara3D is a small design and fabrication studio in the UAE. We make one
          thing: precision 3D-printed topographic relief maps of the routes our
          customers run, framed and ready to hang.
        </p>
        <p>
          We started because race medals end up in drawers, and Strava activities end
          up forgotten in the feed. The terrain you crossed — the climb that broke
          you, the descent that brought you back — deserves more than a screenshot.
        </p>
        <p>
          Every piece is made to order from your GPX file: we render the elevation,
          print it in layers, set the type for your stats, and assemble it into a
          deep shadow-box frame in our workshop. No two are the same.
        </p>
        <p>
          We're runners. We hope you frame the route that meant the most.
        </p>
      </div>
      <div className="mt-14">
        <Link to="/shop" className="bg-ink px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain">
          See the collection
        </Link>
      </div>
    </section>
  );
}
