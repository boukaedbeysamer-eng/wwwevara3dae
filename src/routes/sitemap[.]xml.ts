import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ALL_PRODUCTS } from "@/data/products";
import { GALLERY_FOLDERS } from "@/data/gallery";

const BASE_URL = "https://evara3d.ae";

interface SitemapImage {
  loc: string;
  title: string;
  caption: string;
}

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  images?: SitemapImage[];
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absolute(url: string) {
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/shop", changefreq: "weekly", priority: "0.9" },
          {
            path: "/gallery",
            changefreq: "monthly",
            priority: "0.7",
            images: GALLERY_FOLDERS.map((f) => ({
              loc: absolute(f.images[0].src),
              title: `${f.heading} — ${f.images[0].title}`,
              caption: f.images[0].caption,
            })),
          },
          ...GALLERY_FOLDERS.map((f) => ({
            path: `/gallery/${f.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
            images: f.images.map((img) => ({
              loc: absolute(img.src),
              title: img.title,
              caption: img.caption,
            })),
          })),
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/faq", changefreq: "monthly", priority: "0.5" },
          ...ALL_PRODUCTS.map((p) => ({
            path: `/shop/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.8",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            ...(e.images ?? []).map((img) =>
              [
                `    <image:image>`,
                `      <image:loc>${escapeXml(img.loc)}</image:loc>`,
                `      <image:title>${escapeXml(img.title)}</image:title>`,
                `      <image:caption>${escapeXml(img.caption)}</image:caption>`,
                `    </image:image>`,
              ].join("\n"),
            ),
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );


        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,

          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
