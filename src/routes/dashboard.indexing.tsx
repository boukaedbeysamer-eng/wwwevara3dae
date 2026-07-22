import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getIndexingDashboard,
  refreshIndexingStatus,
  type UrlSummary,
} from "@/lib/indexing.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/indexing")({
  head: () => ({
    meta: [
      { title: "Indexing Dashboard — Evara3D" },
      { name: "description", content: "Track Google indexing status for evara3d.ae sitemap URLs." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => await getIndexingDashboard(),
  component: IndexingDashboard,
});

function statusColor(status: UrlSummary["status"]) {
  switch (status) {
    case "indexed":
      return "bg-green-500/15 text-green-700 border-green-500/30";
    case "stuck":
      return "bg-amber-500/15 text-amber-700 border-amber-500/30";
    case "dropped":
      return "bg-red-500/15 text-red-700 border-red-500/30";
    case "not_indexed":
      return "bg-zinc-500/15 text-zinc-700 border-zinc-500/30";
    default:
      return "bg-zinc-200 text-zinc-600 border-zinc-300";
  }
}

function statusLabel(s: UrlSummary["status"]) {
  return {
    indexed: "Indexed",
    stuck: "Stuck",
    dropped: "Dropped",
    not_indexed: "Not indexed",
    unknown: "No data",
  }[s];
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function IndexingDashboard() {
  const { summaries, totals, lastRun } = Route.useLoaderData();
  const router = useRouter();
  const refresh = useServerFn(refreshIndexingStatus);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await refresh();
      toast.success(`Checked ${res.checked} URLs`);
      const errs = res.results.filter((r) => !r.ok);
      if (errs.length) toast.error(`${errs.length} URLs failed — see console`);
      if (errs.length) console.error("Indexing check errors", errs);
      await router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to refresh");
    } finally {
      setLoading(false);
    }
  };

  const attention = summaries.filter((s) => s.status === "stuck" || s.status === "dropped");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Indexing dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Google Search Console status for sitemap URLs. Last snapshot: {fmtDate(lastRun)}
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? "Checking…" : "Check now"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(
          [
            ["Total", totals.total, "bg-zinc-100"],
            ["Indexed", totals.indexed, "bg-green-100"],
            ["Stuck", totals.stuck, "bg-amber-100"],
            ["Dropped", totals.dropped, "bg-red-100"],
            ["Not indexed", totals.not_indexed + totals.unknown, "bg-zinc-100"],
          ] as const
        ).map(([label, value, bg]) => (
          <div key={label} className={`rounded border p-4 ${bg}`}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-1 font-display text-3xl">{value}</div>
          </div>
        ))}
      </div>

      {attention.length > 0 && (
        <div className="mt-8 rounded border border-amber-500/40 bg-amber-50 p-4">
          <h2 className="font-display text-lg">Needs attention ({attention.length})</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {attention.map((s) => (
              <li key={s.url} className="flex justify-between">
                <span className="truncate">{s.url}</span>
                <span className="ml-4 shrink-0 font-medium">
                  {statusLabel(s.status)} · {s.latest?.coverage_state ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">URL</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Coverage</th>
              <th className="px-3 py-2">Last crawl</th>
              <th className="px-3 py-2">Checked</th>
              <th className="px-3 py-2">History</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((s) => (
              <tr key={s.url} className="border-t">
                <td className="max-w-[280px] truncate px-3 py-2">
                  <a
                    className="hover:underline"
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.url.replace("https://evara3d.ae", "") || "/"}
                  </a>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${statusColor(s.status)}`}>
                    {statusLabel(s.status)}
                  </span>
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {s.latest?.coverage_state ?? "—"}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {fmtDate(s.latest?.last_crawl_time ?? null)}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {s.daysSinceLastCheck != null ? `${s.daysSinceLastCheck}d ago` : "—"}
                </td>
                <td className="px-3 py-2">
                  <HistoryBar points={s.history} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Click "Check now" to pull fresh URL Inspection data from Google Search Console. Snapshots are
        stored for 30 days so you can spot trends. A URL is "Dropped" if its most recent check went
        from PASS to non-PASS, and "Stuck" if Google has discovered/crawled it but hasn't indexed.
      </p>
    </div>
  );
}

function HistoryBar({ points }: { points: { verdict: string | null; checked_at: string }[] }) {
  if (!points.length) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex gap-0.5">
      {points.slice(-20).map((p, i) => {
        const pass = p.verdict === "PASS";
        return (
          <div
            key={i}
            title={`${fmtDate(p.checked_at)} — ${p.verdict ?? "?"}`}
            className={`h-4 w-2 rounded-sm ${pass ? "bg-green-500" : p.verdict ? "bg-red-400" : "bg-zinc-300"}`}
          />
        );
      })}
    </div>
  );
}
