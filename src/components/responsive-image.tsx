import manifest from "@/assets/responsive-manifest.json";

type Manifest = Record<string, { width: number; sources: Record<string, string> }>;

const MANIFEST = manifest as Manifest;

export type ResponsiveImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet"
> & {
  /** Original asset URL (from a `.asset.json` pointer). */
  src: string;
  alt: string;
  /** `sizes` attribute — describe the rendered width so the browser picks the smallest useful file. */
  sizes?: string;
  /** Set for above-the-fold images; everything else lazy-loads. */
  priority?: boolean;
};

/**
 * Serves pre-generated WebP variants (480/960/1440w) via srcset, falling back to
 * the original file when no optimized variant exists.
 */
export function ResponsiveImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  loading,
  decoding,
  ...rest
}: ResponsiveImageProps) {
  const entry = MANIFEST[src];
  const srcSet = entry
    ? Object.entries(entry.sources)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([w, url]) => `${url} ${w}w`)
        .join(", ")
    : undefined;

  const widths = entry ? Object.keys(entry.sources).map(Number).sort((a, b) => a - b) : [];
  const fallback = entry ? entry.sources[String(widths[widths.length - 1])] : src;

  return (
    <img
      {...rest}
      src={fallback}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding ?? (priority ? "sync" : "async")}
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}
