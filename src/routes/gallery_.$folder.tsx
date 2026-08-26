import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GALLERY_FOLDERS, getGalleryFolder } from "@/data/gallery";

export const Route = createFileRoute("/gallery_/$folder")({
  loader: ({ params }) => {
    const folder = getGalleryFolder(params.folder);
    if (!folder) throw notFound();
    return { folder };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Gallery not found — Evara3D" }, { name: "robots", content: "noindex" }],
      };
    }
    const f = loaderData.folder;
    const url = `https://evara3d.ae/gallery/${params.folder}`;
    return {
      meta: [
        { title: f.metaTitle },
        { name: "description", content: f.metaDescription },
        { property: "og:title", content: f.metaTitle },
        { property: "og:description", content: f.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: f.images[0].src },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: f.images[0].src },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: f.heading,
            description: f.metaDescription,
            url,
            image: f.images.map((img) => ({
              "@type": "ImageObject",
              contentUrl: img.src,
              name: img.title,
              description: img.caption,
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://evara3d.ae/" },
              { "@type": "ListItem", position: 2, name: "Gallery", item: "https://evara3d.ae/gallery" },
              { "@type": "ListItem", position: 3, name: f.label, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: FolderNotFound,
  component: GalleryFolderPage,
});

function FolderNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground">Gallery not found</h1>
      <p className="mt-4 text-sm text-foreground/70">
        That collection doesn't exist.{" "}
        <Link to="/gallery" className="text-terrain hover:underline">
          Back to the gallery
        </Link>
        .
      </p>
    </div>
  );
}

function GalleryFolderPage() {
  const { folder } = Route.useLoaderData();
  const [openImage, setOpenImage] = useState<string | null>(null);
  const active = folder.images.find((img) => img.src === openImage);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-foreground/60">
        <Link to="/gallery" className="hover:text-terrain">
          Gallery
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{folder.label}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl text-foreground md:text-5xl">{folder.heading}</h1>
        <p className="mt-5 text-base leading-relaxed text-foreground/80">{folder.intro}</p>
      </header>

      <section aria-labelledby="photos-heading" className="mt-14">
        <h2 id="photos-heading" className="sr-only">
          {folder.label} photos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folder.images.map((img) => (
            <figure key={img.title}>
              <button
                className="group block aspect-[4/5] w-full overflow-hidden bg-secondary/60"
                onClick={() => setOpenImage(img.src)}
              >
                <img
                  src={img.src}
                  alt={`${img.title} — ${img.caption}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </button>
              <figcaption className="mt-3">
                <h3 className="text-sm font-medium text-foreground">{img.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-foreground/65">{img.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="more-heading" className="mt-20 border-t border-foreground/10 pt-10">
        <h2 id="more-heading" className="font-display text-xl uppercase tracking-wide text-foreground">
          More collections
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {GALLERY_FOLDERS.filter((f) => f.slug !== folder.slug).map((f) => (
            <li key={f.slug}>
              <Link
                to="/gallery/$folder"
                params={{ folder: f.slug }}
                className="inline-block rounded-full bg-secondary/60 px-5 py-2 text-sm text-foreground hover:bg-secondary"
              >
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Dialog open={!!openImage} onOpenChange={(open) => !open && setOpenImage(null)}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{active?.title ?? "Gallery image"}</DialogTitle>
          {active && (
            <img
              src={active.src}
              alt={`${active.title} — ${active.caption}`}
              className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
