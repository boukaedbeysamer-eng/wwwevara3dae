import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(4).max(40),
  notes: z.string().trim().max(2000).optional().nullable(),
});

const itemSchema = z.object({
  productSlug: z.string().min(1).max(60),
  productName: z.string().min(1).max(120),
  qty: z.number().int().min(1).max(20),
  unitPriceAed: z.number().min(0).max(100000),
  frameFinish: z.string().min(1).max(40),
  mapColor: z.string().min(1).max(40),
  trackColor: z.string().min(1).max(40),
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
    const total = data.items.reduce((s, i) => s + i.unitPriceAed * i.qty, 0);

    const { data: req, error: reqErr } = await supabase
      .from("order_requests")
      .insert({
        full_name: data.contact.fullName,
        email: data.contact.email,
        whatsapp: data.contact.whatsapp,
        notes: data.contact.notes || null,
        total_aed: total,
        status: "new",
      })
      .select("id")
      .single();

    if (reqErr || !req) {
      console.error("order_requests insert failed", reqErr);
      throw new Error("Could not submit request. Please try again.");
    }

    const itemRows = data.items.map((i) => ({
      request_id: req.id,
      product_slug: i.productSlug,
      product_name: i.productName,
      qty: i.qty,
      unit_price_aed: i.unitPriceAed,
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

    return { id: req.id as string };
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
