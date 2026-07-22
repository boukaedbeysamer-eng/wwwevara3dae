import { createFileRoute, Link } from "@tanstack/react-router";
import aboutBgVideo from "@/assets/about-bg-video.mp4.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our story — Evara3D" },
      { name: "description", content: "Evara3D FZC is a UAE studio turning Strava runs into 3D-printed topographic relief map frames." },
      { property: "og:title", content: "Our story — Evara3D" },
      { property: "og:description", content: "A UAE studio for runners who treat their routes as memory." },
      { property: "og:url", content: "https://evara3d.ae/about" },
    ],
    links: [{ rel: "canonical", href: "https://evara3d.ae/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      {/* Video header */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src={aboutBgVideo.url}
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative z-10 flex h-full flex-col justify-center px-6">
          <div className="mx-auto w-full max-w-3xl">
            <span className="text-xs uppercase tracking-[0.28em] text-terrain">Our story</span>
            <h1 className="mt-3 font-display text-5xl text-paper md:text-6xl">
              Every Moment Has a Place. Every Place Has a Story.
            </h1>
          </div>
        </div>
      </section>

      {/* Text content with navy background */}
      <section className="bg-ink">
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-20">
          <div className="space-y-6 text-lg leading-relaxed text-paper/80">
            <p>
              Some moments stop time. The finish line of your first marathon. The trail
              that pushed you beyond what you thought possible. The city street where you
              met the person you'd spend your life with. The coordinates where you took
              your first breath. These are not just memories. They are places. Real
              terrain. Real ground. Real moments frozen in geography.
            </p>
            <p>
              Evara3D was born from a simple but powerful belief, that the most
              meaningful moments of your life deserve to be more than a photo on your
              phone or a file on an app. Whether you're a runner, a cyclist, a swimmer,
              a traveler, or simply a human being with a story worth telling, Evara3D is
              here for you.
            </p>
            <p>
              We take any location or route that matters to you. A race, a ride, a
              first meeting, a hometown, a place that changed your life and transform
              it into a handcrafted 3D topographic map, custom framed with the details
              that make it yours. Because your story didn't happen in the air. It happened
              somewhere.
            </p>
            <p>Evara3D. Turn Your Experience Into A Framed Memory.</p>
          </div>
          <div className="mt-14">
            <Link to="/shop" className="bg-terrain px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain">
              See the collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
