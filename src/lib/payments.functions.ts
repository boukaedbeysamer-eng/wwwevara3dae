import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS, FRAME_FINISHES, MAP_COLORS, TRACK_COLORS } from "@/data/products";
import { createStripeClient, getStripeErrorMessage, type StripeEnv } from "@/lib/stripe.server";

const PRICE_MAP: Record<string, string> = {
  keepsaker: "frame_keepsaker_aed",
  achiever: "frame_achiever_aed",
  legacy: "frame_legacy_aed",
  "3d-map-display": "map_3d_hex_display_aed",
};

const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(4).max(40),
  notes: z.string().trim().max(2000).optional().nullable(),
});

const itemSchema = z.object({
  productSlug: z.string().min(1).max(60),
  qty: z.number().int().min(1).max(20),
  frameFinish: z.enum(FRAME_FINISHES as [string, ...string[]]),
  mapColor: z.enum(MAP_COLORS as [string, ...string[]]),
  trackColor: z.enum(TRACK_COLORS as [string, ...string[]]),
  runName: z.string().max(200).optional().nullable(),
  runDistanceKm: z.number().min(0).max(10000).optional().nullable(),
  runElevationM: z.number().int().min(0).max(20000).optional().nullable(),
  runDate: z.string().optional().nullable(),
  runTime: z.string().max(20).optional().nullable(),
  runLocation: z.string().max(200).optional().nullable(),
  gpxPath: z.string().max(300).optional().nullable(),
});

const inputSchema = z.object({
  contact: contactSchema,
  items: z.array(itemSchema).min(1).max(20),
  environment: z.enum(["sandbox", "live"]),
  origin: z.string().url(),
});

const serverClient = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

type CheckoutResult = { clientSecret: string; requestId: string } | { error: string };

export const createOrderCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }): Promise<CheckoutResult> => {
    const supabase = serverClient();

    const resolved = data.items.map((i) => {
      const product = PRODUCTS.find((p) => p.slug === i.productSlug);
      const priceLookup = PRICE_MAP[i.productSlug];
      if (!product || !priceLookup) throw new Error(`Unknown product: ${i.productSlug}`);
      return { item: i, product, priceLookup };
    });

    const total = resolved.reduce((s, { item, product }) => s + product.priceAed * item.qty, 0);

    const requestId = crypto.randomUUID();
    const { error: reqErr } = await supabase.from("order_requests").insert({
      id: requestId,
      full_name: data.contact.fullName,
      email: data.contact.email,
      whatsapp: data.contact.whatsapp,
      notes: data.contact.notes || null,
      total_aed: total,
      status: "pending_payment",
    });
    if (reqErr) {
      console.error("order_requests insert failed", reqErr);
      return { error: "Could not save order. Please try again." };
    }

    const itemRows = resolved.map(({ item: i, product }) => ({
      request_id: requestId,
      product_slug: product.slug,
      product_name: product.name,
      qty: i.qty,
      unit_price_aed: product.priceAed,
      frame_finish: i.frameFinish,
      map_color: i.mapColor,
      track_color: i.trackColor,
      run_name: i.runName || null,
      run_distance_km: i.runDistanceKm ?? null,
      run_elevation_m: i.runElevationM ?? null,
      run_date: i.runDate || null,
      run_time: i.runTime || null,
      run_location: i.runLocation || null,
      gpx_path: i.gpxPath || null,
    }));
    const { error: itemsErr } = await supabase.from("order_request_items").insert(itemRows);
    if (itemsErr) {
      console.error("order_request_items insert failed", itemsErr);
      return { error: "Could not save order items. Please try again." };
    }

    try {
      const stripe = createStripeClient(data.environment as StripeEnv);
      const lookupKeys = [...new Set(resolved.map((r) => r.priceLookup))];
      const prices = await stripe.prices.list({ lookup_keys: lookupKeys, limit: 20 });
      const priceByLookup = new Map(prices.data.map((p) => [p.lookup_key!, p.id]));

      const lineItems = resolved.map(({ item, priceLookup }) => {
        const priceId = priceByLookup.get(priceLookup);
        if (!priceId) throw new Error(`Price not found for ${priceLookup}`);
        return { price: priceId, quantity: item.qty };
      });

      const returnUrl = `${data.origin}/checkout/success/${requestId}?session_id={CHECKOUT_SESSION_ID}`;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        ui_mode: "embedded_page",
        line_items: lineItems,
        return_url: returnUrl,
        customer_email: data.contact.email,
        payment_intent_data: {
          description: `Evara3D order ${requestId.slice(0, 8).toUpperCase()}`,
        },
        metadata: {
          orderRequestId: requestId,
          fullName: data.contact.fullName,
          whatsapp: data.contact.whatsapp,
        },
      });

      await supabase
        .from("order_requests")
        .update({ stripe_session_id: session.id })
        .eq("id", requestId);

      return { clientSecret: session.client_secret ?? "", requestId };
    } catch (error) {
      console.error("stripe checkout failed", error);
      await supabase
        .from("order_requests")
        .update({ status: "checkout_failed" })
        .eq("id", requestId);
      return { error: getStripeErrorMessage(error) };
    }
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = serverClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: data.email });
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      console.error("newsletter insert failed", error);
      throw new Error("Could not subscribe. Please try again.");
    }
    return { ok: true };
  });
