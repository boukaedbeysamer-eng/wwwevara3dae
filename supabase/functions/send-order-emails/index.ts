// Sends admin notification + customer confirmation via Resend after checkout.
// Public function (verify_jwt=false) — called from the TanStack server function.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_TO = "info@evara3d.ae";
const FROM = "Evara3D <notify@evara3d.ae>";

type Item = {
  productName: string;
  qty: number;
  unitPriceAed: number;
  frameFinish: string;
  mapColor: string;
  trackColor: string;
  athleteName?: string | null;
  runName?: string | null;
  runLocation?: string | null;
  runDistanceKm?: number | null;
  runElevationM?: number | null;
  runDate?: string | null;
  runTime?: string | null;
  gpxPath?: string | null;
};

type Payload = {
  requestId: string;
  contact: { fullName: string; email: string; whatsapp: string; notes?: string | null };
  items: Item[];
  totalAed: number;
};

function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}

function renderAdminHtml(p: Payload): string {
  const rows = p.items
    .map(
      (i) => `
      <tr><td colspan="2" style="padding:16px 0 6px;border-top:1px solid #eee;font-weight:600">
        ${esc(i.productName)} × ${i.qty} — AED ${i.unitPriceAed * i.qty}
      </td></tr>
      <tr><td style="padding:2px 0;color:#555">Variant</td><td>${esc(i.frameFinish)} · ${esc(i.mapColor)} · ${esc(i.trackColor)}</td></tr>
      ${i.athleteName ? `<tr><td style="padding:2px 0;color:#555">Athlete</td><td>${esc(i.athleteName)}</td></tr>` : ""}
      ${i.runName ? `<tr><td style="padding:2px 0;color:#555">Run</td><td>${esc(i.runName)}</td></tr>` : ""}
      ${i.runLocation ? `<tr><td style="padding:2px 0;color:#555">Location</td><td>${esc(i.runLocation)}</td></tr>` : ""}
      ${i.runDistanceKm != null ? `<tr><td style="padding:2px 0;color:#555">Distance</td><td>${esc(i.runDistanceKm)} km</td></tr>` : ""}
      ${i.runElevationM != null ? `<tr><td style="padding:2px 0;color:#555">Elevation</td><td>${esc(i.runElevationM)} m</td></tr>` : ""}
      ${i.runDate ? `<tr><td style="padding:2px 0;color:#555">Date</td><td>${esc(i.runDate)}</td></tr>` : ""}
      ${i.runTime ? `<tr><td style="padding:2px 0;color:#555">Time</td><td>${esc(i.runTime)}</td></tr>` : ""}
      ${i.gpxPath ? `<tr><td style="padding:2px 0;color:#555">GPX</td><td>${esc(i.gpxPath)} (attached)</td></tr>` : ""}
    `,
    )
    .join("");

  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#111;max-width:640px;margin:0 auto;padding:24px">
    <h2 style="margin:0 0 8px">New order request</h2>
    <p style="color:#666;margin:0 0 20px">Request ID: ${esc(p.requestId)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:2px 0;color:#555;width:140px">Customer</td><td>${esc(p.contact.fullName)}</td></tr>
      <tr><td style="padding:2px 0;color:#555">Email</td><td>${esc(p.contact.email)}</td></tr>
      <tr><td style="padding:2px 0;color:#555">WhatsApp</td><td>${esc(p.contact.whatsapp)}</td></tr>
      ${p.contact.notes ? `<tr><td style="padding:2px 0;color:#555;vertical-align:top">Notes</td><td>${esc(p.contact.notes)}</td></tr>` : ""}
      ${rows}
      <tr><td colspan="2" style="padding:16px 0 0;border-top:2px solid #111;font-weight:700;font-size:16px">
        Estimated total: AED ${p.totalAed}
      </td></tr>
    </table>
  </body></html>`;
}

function renderCustomerHtml(p: Payload): string {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px">
    <h2 style="margin:0 0 12px">Thank you for your order request!</h2>
    <p>Hi ${esc(p.contact.fullName.split(" ")[0] || "there")},</p>
    <p>We have received your details and will WhatsApp you within 24 hours to confirm everything and arrange payment and shipping.</p>
    <p style="margin-top:24px;color:#666">— The Evara3D Team</p>
    <p style="color:#999;font-size:12px;margin-top:24px">Reference: ${esc(p.requestId)}</p>
  </body></html>`;
}

async function fetchGpxAttachments(items: Item[]) {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return [];
  const out: { filename: string; content: string }[] = [];
  for (const i of items) {
    if (!i.gpxPath) continue;
    try {
      const r = await fetch(`${url}/storage/v1/object/gpx-uploads/${i.gpxPath}`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!r.ok) continue;
      const buf = new Uint8Array(await r.arrayBuffer());
      let bin = "";
      for (let n = 0; n < buf.length; n++) bin += String.fromCharCode(buf[n]);
      out.push({
        filename: i.gpxPath.split("/").pop() || "run.gpx",
        content: btoa(bin),
      });
    } catch (e) {
      console.error("gpx fetch failed", i.gpxPath, e);
    }
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: CORS });

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY missing");
    return new Response(JSON.stringify({ error: "email_not_configured" }), {
      status: 500,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  const attachments = await fetchGpxAttachments(payload.items);

  const send = (body: unknown) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

  const results: Record<string, unknown> = {};

  try {
    const adminRes = await send({
      from: FROM,
      to: [ADMIN_TO],
      reply_to: payload.contact.email,
      subject: `New order request — ${payload.contact.fullName} (AED ${payload.totalAed})`,
      html: renderAdminHtml(payload),
      attachments: attachments.length ? attachments : undefined,
    });
    results.admin = { status: adminRes.status, body: await adminRes.text() };
  } catch (e) {
    console.error("admin email failed", e);
    results.admin = { error: String(e) };
  }

  try {
    const custRes = await send({
      from: FROM,
      to: [payload.contact.email],
      subject: "We received your Evara3D order request",
      html: renderCustomerHtml(payload),
    });
    results.customer = { status: custRes.status, body: await custRes.text() };
  } catch (e) {
    console.error("customer email failed", e);
    results.customer = { error: String(e) };
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { ...CORS, "content-type": "application/json" },
  });
});
