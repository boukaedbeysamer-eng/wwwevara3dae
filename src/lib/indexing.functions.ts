import { createServerFn } from "@tanstack/react-start";
import { PRODUCTS } from "@/data/products";

const SITE_URL = "https://evara3d.ae/";
const BASE = "https://evara3d.ae";

function sitemapUrls(): string[] {
  const paths = ["/", "/shop", "/gallery", "/about", "/faq", ...PRODUCTS.map((p) => `/shop/${p.slug}`)];
  return paths.map((p) => `${BASE}${p === "/" ? "" : p}`);
}

async function inspectUrl(url: string) {
  const lovableKey = process.env.LOVABLE_API_KEY!;
  const gscKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY!;
  const res = await fetch(
    "https://connector-gateway.lovable.dev/google_search_console/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gscKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
    },
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GSC inspect failed [${res.status}] for ${url}: ${text}`);
  }
  return JSON.parse(text);
}

export type IndexingRow = {
  url: string;
  checked_at: string;
  coverage_state: string | null;
  verdict: string | null;
  robots_txt_state: string | null;
  indexing_state: string | null;
  page_fetch_state: string | null;
  last_crawl_time: string | null;
  google_canonical: string | null;
  user_canonical: string | null;
};

export type HistoryPoint = {
  checked_at: string;
  verdict: string | null;
  coverage_state: string | null;
};

export type UrlSummary = {
  url: string;
  latest: IndexingRow | null;
  previous: IndexingRow | null;
  history: HistoryPoint[];
  status: "indexed" | "not_indexed" | "stuck" | "dropped" | "unknown";
  daysSinceLastCheck: number | null;
};

export const refreshIndexingStatus = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const urls = sitemapUrls();
  const results: { url: string; ok: boolean; error?: string }[] = [];

  for (const url of urls) {
    try {
      const data = await inspectUrl(url);
      const r = data?.inspectionResult?.indexStatusResult ?? {};
      await supabaseAdmin.from("indexing_snapshots").insert({
        url,
        coverage_state: r.coverageState ?? null,
        verdict: r.verdict ?? null,
        robots_txt_state: r.robotsTxtState ?? null,
        indexing_state: r.indexingState ?? null,
        page_fetch_state: r.pageFetchState ?? null,
        last_crawl_time: r.lastCrawlTime ?? null,
        google_canonical: r.googleCanonical ?? null,
        user_canonical: r.userCanonical ?? null,
        raw: data,
      });
      results.push({ url, ok: true });
    } catch (e) {
      results.push({ url, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
    // small pacing to avoid GSC quota bursts
    await new Promise((r) => setTimeout(r, 250));
  }

  return { checked: results.length, results };
});

export const getIndexingDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const urls = sitemapUrls();
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("indexing_snapshots")
    .select("*")
    .gte("checked_at", since)
    .order("checked_at", { ascending: false });

  if (error) throw new Error(error.message);

  const now = Date.now();
  const summaries: UrlSummary[] = urls.map((url) => {
    const rows = (data ?? []).filter((d: any) => d.url === url) as IndexingRow[];
    const latest = rows[0] ?? null;
    const previous = rows[1] ?? null;
    const history: HistoryPoint[] = rows
      .slice()
      .reverse()
      .map((r) => ({
        checked_at: r.checked_at,
        verdict: r.verdict,
        coverage_state: r.coverage_state,
      }));

    let status: UrlSummary["status"] = "unknown";
    if (latest) {
      const isPass = latest.verdict === "PASS";
      const wasPass = previous?.verdict === "PASS";
      const cov = (latest.coverage_state ?? "").toLowerCase();
      if (isPass) status = "indexed";
      else if (wasPass) status = "dropped";
      else if (cov.includes("crawled") || cov.includes("discovered") || cov.includes("not indexed"))
        status = "stuck";
      else status = "not_indexed";
    }

    const daysSinceLastCheck = latest
      ? Math.floor((now - new Date(latest.checked_at).getTime()) / (24 * 3600 * 1000))
      : null;

    return { url, latest, previous, history, status, daysSinceLastCheck };
  });

  const totals = {
    total: summaries.length,
    indexed: summaries.filter((s) => s.status === "indexed").length,
    stuck: summaries.filter((s) => s.status === "stuck").length,
    dropped: summaries.filter((s) => s.status === "dropped").length,
    not_indexed: summaries.filter((s) => s.status === "not_indexed").length,
    unknown: summaries.filter((s) => s.status === "unknown").length,
  };

  const lastRun = (data ?? [])[0]?.checked_at ?? null;

  return { summaries, totals, lastRun };
});
