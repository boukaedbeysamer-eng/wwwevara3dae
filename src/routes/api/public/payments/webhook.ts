import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return _supabase;
}

async function sendOrderEmails(requestId: string) {
  const supabase = getSupabase();

  const { data: reqRaw, error: reqErr } = await supabase
    .from("order_requests")
    .select("id, full_name, email, whatsapp, notes, total_aed")
    .eq("id", requestId)
    .maybeSingle();
  const req = reqRaw as any;
  if (reqErr || !req) {
    console.error("order_requests fetch failed for email", requestId, reqErr);
    return;
  }

  const { data: itemsRaw, error: itemsErr } = await supabase
    .from("order_request_items")
    .select("*")
    .eq("request_id", requestId);
  const items = itemsRaw as any[] | null;
  if (itemsErr || !items) {
    console.error("order_request_items fetch failed for email", requestId, itemsErr);
    return;
  }

  const payload = {
    requestId: req.id as string,
    contact: {
      fullName: req.full_name as string,
      email: req.email as string,
      whatsapp: req.whatsapp as string,
      notes: (req.notes as string | null) ?? null,
    },
    items: items.map((i: any) => ({
      productName: i.product_name,
      qty: i.qty,
      unitPriceAed: i.unit_price_aed,
      frameFinish: i.frame_finish,
      mapColor: i.map_color,
      trackColor: i.track_color,
      runName: i.run_name,
      runLocation: i.run_location,
      runDistanceKm: i.run_distance_km,
      runElevationM: i.run_elevation_m,
      runDate: i.run_date,
      runTime: i.run_time,
      gpxPath: i.gpx_path,
    })),
    totalAed: req.total_aed,
  };

  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/send-order-emails`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY}`,
          "x-webhook-secret": process.env.EMAIL_WEBHOOK_SECRET ?? "",
        },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) console.error("send-order-emails non-ok", res.status, await res.text());
  } catch (e) {
    console.error("send-order-emails invoke failed", e);
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Payment Link checkouts can't carry metadata, so we pass the order id through
// client_reference_id instead. Accept either source.
function resolveRequestId(session: any): string | undefined {
  const fromMeta: string | undefined = session.metadata?.orderRequestId;
  if (fromMeta) return fromMeta;
  const ref: string | undefined = session.client_reference_id ?? undefined;
  if (ref && UUID_RE.test(ref)) return ref;
  return undefined;
}

async function handleSessionCompleted(session: any) {
  const requestId = resolveRequestId(session);
  if (!requestId) {
    console.error(
      "checkout.session.completed missing orderRequestId metadata and client_reference_id",
      session.id,
    );
    return;
  }
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from("order_requests")
    .select("status")
    .eq("id", requestId)
    .maybeSingle();
  if ((existing as any)?.status === "paid") {
    return; // idempotent
  }
  const { error } = await (supabase.from("order_requests") as any)
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_session_id: session.id,
    })
    .eq("id", requestId);
  if (error) {
    console.error("failed to mark order paid", requestId, error);
    return;
  }
  await sendOrderEmails(requestId);
}

async function handleSessionTerminal(session: any, newStatus: "expired" | "payment_failed") {
  const requestId = resolveRequestId(session);
  if (!requestId) return;
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from("order_requests")
    .select("status")
    .eq("id", requestId)
    .maybeSingle();
  const current = (existing as any)?.status;
  // Never overwrite a paid order; don't churn on repeat deliveries either.
  if (current === "paid" || current === newStatus) return;
  const { error } = await (supabase.from("order_requests") as any)
    .update({ status: newStatus })
    .eq("id", requestId);
  if (error) console.error(`failed to mark order ${newStatus}`, requestId, error);
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded":
              await handleSessionCompleted(event.data.object);
              break;
            case "checkout.session.expired":
              await handleSessionTerminal(event.data.object, "expired");
              break;
            case "checkout.session.async_payment_failed":
              await handleSessionTerminal(event.data.object, "payment_failed");
              break;
            default:
              console.log("Unhandled payment event", event.type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});

