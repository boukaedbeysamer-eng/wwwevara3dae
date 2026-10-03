// ============= Full file contents =============

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Share2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GALLERY_FOLDERS, getGalleryFolder } from "@/data/gallery";
import { ResponsiveImage } from "@/components/responsive-image";

export const Route = createFileRoute("/gallery_/$folder")({
  validateSearch: (search: Record<string, unknown>): { photo?: string } => ({
    photo: typeof search.photo === "string" ? search.photo : undefined,
  }),
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

/** URL-safe slug for a photo, used as the ?photo= shareable link parameter. */
function slugifyPhoto(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function GalleryFolderPage() {
  const { folder } = Route.useLoaderData();
  const { photo } = Route.useSearch();
  const navigate = Route.useNavigate();
  const touchStartX = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);

  const requestedIndex = photo
    ? folder.images.findIndex((img) => slugifyPhoto(img.title) === photo)
    : -1;
  const openIndex = requestedIndex !== -1 ? requestedIndex : null;
  const active = openIndex !== null ? folder.images[openIndex] : undefined;
  const imageCount = folder.images.length;

  const openPhoto = useCallback(
    (index: number) => {
      navigate({ search: { photo: slugifyPhoto(folder.images[index].title) } });
    },
    [folder.images, navigate],
  );
  const closeViewer = useCallback(() => {
    navigate({ search: {}, replace: true });
  }, [navigate]);
  const goPrev = useCallback(() => {
    if (openIndex === null) return;
    const prev = (openIndex - 1 + imageCount) % imageCount;
    navigate({ search: { photo: slugifyPhoto(folder.images[prev].title) }, replace: true });
  }, [openIndex, imageCount, folder.images, navigate]);
  const goNext = useCallback(() => {
    if (openIndex === null) return;
    const next = (openIndex + 1) % imageCount;
    navigate({ search: { photo: slugifyPhoto(folder.images[next].title) }, replace: true });
  }, [openIndex, imageCount, folder.images, navigate]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") closeViewer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, goPrev, goNext, closeViewer]);

  useEffect(() => {
    setCopied(false);
  }, [openIndex]);

  const sharePhoto = async () => {
    if (!active) return;
    const url = `${window.location.origin}/gallery/${folder.slug}?photo=${slugifyPhoto(active.title)}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: active.title, text: active.caption, url });
        return;
      } catch {
        // user dismissed the share sheet — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (e.g. insecure context) — nothing else to do
    }
  };

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
                onClick={() => openPhoto(folder.images.indexOf(img))}
              >
                <ResponsiveImage
                  src={img.src}
                  alt={`${img.title} — ${img.caption}`}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && closeViewer()}>
        <DialogContent
          className="fixed inset-0 left-0 top-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 border-none bg-black/95 p-0 shadow-none sm:rounded-none"
          onClick={closeViewer}
        >
          <DialogTitle className="sr-only">{active?.title ?? "Gallery image"}</DialogTitle>
          {active && (
            <div
              className="relative flex h-full w-full touch-pan-y flex-col items-center justify-center px-14 py-6"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const delta = e.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (Math.abs(delta) < 50) return;
                if (delta > 0) goPrev();
                else goNext();
              }}
            >
              <button
                aria-label="Close viewer"
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
                onClick={closeViewer}
              >
                <X className="h-5 w-5" />
              </button>
              <button
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25"
                onClick={goPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25"
                onClick={goNext}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <ResponsiveImage
                key={active.src}
                src={active.src}
                alt={`${active.title} — ${active.caption}`}
                sizes="95vw"
                priority
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
              <div className="mt-5 max-w-2xl text-center">
                <p className="text-sm font-medium text-white">{active.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">{active.caption}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/40">
                  {openIndex! + 1} / {imageCount}
                </p>
                <button
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-white transition hover:bg-white/25"
                  onClick={(e) => {
                    e.stopPropagation();
                    sharePhoto();
                  }}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                  {copied ? "Link copied" : "Share photo"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
