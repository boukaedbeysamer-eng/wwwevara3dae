import { createFileRoute, Link } from "@tanstack/react-router";
import { GALLERY_FOLDERS } from "@/data/gallery";

const TITLE = "Gallery — 3D Map Frames, HYROX Displays & Run Gear | Evara3D";
const DESCRIPTION =
  "Browse the Evara3D gallery: 3D-printed trail running map frames, custom HYROX hex displays, and soft flask drying stands made in Dubai.";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://evara3d.ae/gallery" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: GALLERY_FOLDERS[0].images[0].src },
      { name: "twitter:image", content: GALLERY_FOLDERS[0].images[0].src },
    ],
    links: [{ rel: "canonical", href: "https://evara3d.ae/gallery" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          url: "https://evara3d.ae/gallery",
          hasPart: GALLERY_FOLDERS.map((f) => ({
            "@type": "ImageGallery",
            name: f.heading,
            description: f.metaDescription,
            url: `https://evara3d.ae/gallery/${f.slug}`,
          })),
        }),
      },
    ],
  }),
  component: GalleryIndexPage,
});

function GalleryIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <header className="text-center">
        <span className="text-xs uppercase tracking-[0.28em] text-terrain">The work</span>
        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
          Evara3D Gallery
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-foreground/70">
          {DESCRIPTION} Pick a collection below to see finished pieces, close-up
          details, and the finishes we print in.
        </p>
      </header>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_FOLDERS.map((folder) => (
          <article key={folder.slug} className="group">
            <Link
              to="/gallery/$folder"
              params={{ folder: folder.slug }}
              className="block"
            >
              <div className="aspect-[4/5] overflow-hidden bg-secondary/60">
                <img
                  src={folder.images[0].src}
                  alt={`${folder.heading} — ${folder.images[0].title}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h2 className="mt-5 font-display text-xl uppercase tracking-wide text-foreground">
                {folder.label}
              </h2>
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">
              {folder.description}
            </p>
            <Link
              to="/gallery/$folder"
              params={{ folder: folder.slug }}
              className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-terrain hover:underline"
            >
              View {folder.label} photos ({folder.images.length})
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
