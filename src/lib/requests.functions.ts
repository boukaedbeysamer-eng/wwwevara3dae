import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { ALL_PRODUCTS, FRAME_FINISHES, MAP_COLORS, TRACK_COLORS, TEXT_COLORS } from "@/data/products";

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
  trackColor: z.enum([...new Set([...TRACK_COLORS, ...TEXT_COLORS])] as [string, ...string[]]),
  runName: z.string().max(200).optional().nullable(),
  runDistanceKm: z.number().min(0).max(10000).optional().nullable(),
  runElevationM: z.number().int().min(0).max(20000).optional().nullable(),
  runDate: z.string().optional().nullable(),
  runTime: z.string().max(20).optional().nullable(),
  runLocation: z.string().max(200).optional().nullable(),
  gpxPath: z.string().max(300).optional().nullable(),
});

const submitSchema = z.object({
  contact: contactSchema,
  items: z.array(itemSchema).min(1).max(20),
});

const serverClient = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

export const submitOrderRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submitSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = serverClient();

    const resolved = data.items.map((i) => {
      const product = ALL_PRODUCTS.find((p) => p.slug === i.productSlug);
      if (!product) throw new Error(`Unknown product: ${i.productSlug}`);
      return { item: i, product };
    });

    const total = resolved.reduce((s, { item, product }) => s + product.priceAed * item.qty, 0);

    const requestId = crypto.randomUUID();
    const { error: reqErr } = await supabase
      .from("order_requests")
      .insert({
        id: requestId,
        full_name: data.contact.fullName,
        email: data.contact.email,
        whatsapp: data.contact.whatsapp,
        notes: data.contact.notes || null,
        total_aed: total,
        status: "new",
      });

    if (reqErr) {
      console.error("order_requests insert failed", reqErr);
      throw new Error("Could not submit request. Please try again.");
    }
    const req = { id: requestId };

    const itemRows = resolved.map(({ item: i, product }) => ({
      request_id: req.id,
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
      throw new Error("Could not save order items. Please try again.");
    }

    // Fire-and-log emails via edge function; do not fail the request if email fails.
    try {
      const emailRes = await fetch(`${process.env.SUPABASE_URL}/functions/v1/send-order-emails`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY}`,
          "x-webhook-secret": process.env.EMAIL_WEBHOOK_SECRET ?? "",
        },
        body: JSON.stringify({
          requestId: req.id,
          contact: data.contact,
          items: resolved.map(({ item: i, product }) => ({
            productName: product.name,
            qty: i.qty,
            unitPriceAed: product.priceAed,
            frameFinish: i.frameFinish,
            mapColor: i.mapColor,
            trackColor: i.trackColor,
            runName: i.runName ?? null,
            runLocation: i.runLocation ?? null,
            runDistanceKm: i.runDistanceKm ?? null,
            runElevationM: i.runElevationM ?? null,
            runDate: i.runDate ?? null,
            runTime: i.runTime ?? null,
            gpxPath: i.gpxPath ?? null,
          })),
          totalAed: total,
        }),
      });
      if (!emailRes.ok) console.error("send-order-emails non-ok", emailRes.status, await emailRes.text());
    } catch (e) {
      console.error("send-order-emails invoke failed", e);
    }

    return { id: req.id as string };
  });


const FLASK_SLUG = "flask-dry-stand";
const FLASK_NAME = "SOFT FLASK DRYING STAND";
const FLASK_PRICE_AED = 75;

const flaskSchema = z.object({
  contact: contactSchema,
  items: z
    .array(
      z.object({
        color: z.enum(["Black", "White", "Blue"]),
        qty: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(20),
});

export const submitFlaskOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => flaskSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = serverClient();
    const total = data.items.reduce((s, i) => s + FLASK_PRICE_AED * i.qty, 0);
    const requestId = crypto.randomUUID();

    const { error: reqErr } = await supabase.from("order_requests").insert({
      id: requestId,
      full_name: data.contact.fullName,
      email: data.contact.email,
      whatsapp: data.contact.whatsapp,
      notes: data.contact.notes || null,
      total_aed: total,
      status: "awaiting_payment",
    });
    if (reqErr) {
      console.error("flask order_requests insert failed", reqErr);
      throw new Error("Could not submit your order. Please try again.");
    }

    const { error: itemsErr } = await supabase.from("order_request_items").insert(
      data.items.map((i) => ({
        request_id: requestId,
        product_slug: FLASK_SLUG,
        product_name: FLASK_NAME,
        qty: i.qty,
        unit_price_aed: FLASK_PRICE_AED,
        frame_finish: "N/A",
        map_color: i.color,
        track_color: "N/A",
      })),
    );
    if (itemsErr) {
      console.error("flask order_request_items insert failed", itemsErr);
      throw new Error("Could not save your order items. Please try again.");
    }

    try {
      const emailRes = await fetch(`${process.env.SUPABASE_URL}/functions/v1/send-order-emails`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY}`,
          "x-webhook-secret": process.env.EMAIL_WEBHOOK_SECRET ?? "",
        },
        body: JSON.stringify({
          requestId,
          contact: data.contact,
          items: data.items.map((i) => ({
            productName: FLASK_NAME,
            qty: i.qty,
            unitPriceAed: FLASK_PRICE_AED,
            frameFinish: "—",
            mapColor: i.color,
            trackColor: "—",
          })),
          totalAed: total,
        }),
      });
      if (!emailRes.ok)
        console.error("send-order-emails non-ok", emailRes.status, await emailRes.text());
    } catch (e) {
      console.error("send-order-emails invoke failed", e);
    }

    return { id: requestId };
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
