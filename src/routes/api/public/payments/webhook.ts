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
        },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) console.error("send-order-emails non-ok", res.status, await res.text());
  } catch (e) {
    console.error("send-order-emails invoke failed", e);
  }
}

async function handleSessionCompleted(session: any) {
  const requestId: string | undefined = session.metadata?.orderRequestId;
  if (!requestId) {
    console.error("checkout.session.completed missing orderRequestId metadata", session.id);
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
  const { error } = await supabase
    .from("order_requests")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_session_id: session.id,
    } as any)
    .eq("id", requestId);
  if (error) {
    console.error("failed to mark order paid", requestId, error);
    return;
  }
  await sendOrderEmails(requestId);
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
