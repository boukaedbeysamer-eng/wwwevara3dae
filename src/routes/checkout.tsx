import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useCart, cartTotal } from "@/lib/cart";
import { submitOrderRequest } from "@/lib/requests.functions";
import { getProduct } from "@/data/products";
import { PhoneInput, buildE164 } from "@/components/phone-input";
import { supabase } from "@/integrations/supabase/client";



export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Evara3D" },
      { name: "description", content: "Complete your Evara3D order and pay securely with Stripe. We'll confirm details over WhatsApp and ship your custom 3D-printed frame within 48 hours." },
      { property: "og:title", content: "Checkout — Evara3D" },
      { property: "og:description", content: "Complete your Evara3D order and pay securely with Stripe. We'll confirm details over WhatsApp within 24 hours." },
      { property: "og:url", content: "https://evara3d.ae/checkout" },
    ],
    links: [{ rel: "canonical", href: "https://evara3d.ae/checkout" }],
  }),
  component: Checkout,
});

const itemDetailSchema = z.object({
  runName: z.string().trim().max(200).optional().or(z.literal("")),
  runDistanceKm: z.string().optional(),
  runElevationM: z.string().optional(),
  runDate: z.string().optional(),
  runTime: z.string().optional(),
  runLocation: z.string().trim().max(200).optional().or(z.literal("")),
});

const formSchema = z.object({
  fullName: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+\d{7,16}$/, "Enter your WhatsApp number (digits only)"),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  items: z.array(itemDetailSchema),
});


type FormValues = z.infer<typeof formSchema>;

function Checkout() {
  const allItems = useCart((s) => s.items);
  // The Soft Flask Drying Stand is paid directly via Stripe from the cart and is
  // not part of the order-request flow, so it must not be submitted here.
  // Stale carts may also hold slugs that no longer exist in the catalogue —
  // those would fail server-side validation, so drop them here too.
  const items = allItems.filter(
    (i) => i.productSlug !== "flask-dry-stand" && Boolean(getProduct(i.productSlug)),
  );
  const remove = useCart((s) => s.remove);
  const navigate = useNavigate();
  const sendRequest = useServerFn(submitOrderRequest);
  const [files, setFiles] = useState<Record<number, File | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [dial, setDial] = useState("+971");
  const [nationalNumber, setNationalNumber] = useState("");


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      notes: "",
      items: items.map(() => ({})),
    },
  });


  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl">Nothing to check out</h1>
        <p className="mt-3 text-foreground/70">Add a frame first, then come back to complete your order.</p>
        <Link to="/shop" className="mt-8 inline-block bg-terrain px-6 py-4 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain">
          Choose a frame
        </Link>
      </section>
    );
  }


  const total = cartTotal(items);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      for (const [k, f] of Object.entries(files)) {
        if (f && f.size > 50 * 1024 * 1024) {
          toast.error(`GPX file for item ${Number(k) + 1} exceeds 50 MB.`);
          setSubmitting(false);
          return;
        }
      }

      const uploadedPaths: (string | null)[] = await Promise.all(
        items.map(async (_, idx) => {
          const file = files[idx];
          if (!file) return null;
          const path = `requests/${crypto.randomUUID()}-${idx}.gpx`;
          const { error } = await supabase.storage
            .from("gpx-uploads")
            .upload(path, file, { contentType: "application/gpx+xml", upsert: false });
          if (error) {
            console.error("gpx upload failed", error);
            toast.error(`Couldn't upload GPX for item ${idx + 1}.`);
            return null;
          }
          return path;
        }),
      );

      const payloadItems = items.map((it, idx) => {
        const d = values.items[idx] || {};
        const distance = d.runDistanceKm ? Number(d.runDistanceKm) : null;
        const elevation = d.runElevationM ? Number(d.runElevationM) : null;
        return {
          productSlug: it.productSlug,
          qty: it.qty,
          frameFinish: it.frameFinish,
          mapColor: it.mapColor,
          trackColor: it.trackColor,
          runName: d.runName || null,
          runDistanceKm: Number.isFinite(distance) ? distance : null,
          runElevationM: Number.isFinite(elevation) ? elevation : null,
          runDate: d.runDate || null,
          runTime: d.runTime || null,
          runLocation: d.runLocation || null,
          gpxPath: uploadedPaths[idx],
        };
      });

      const res = await sendRequest({
        data: {
          contact: {
            fullName: values.fullName,
            email: values.email,
            whatsapp: values.whatsapp,
            notes: values.notes || null,
          },
          items: payloadItems,
        },
      });

      items.forEach((i) => remove(i.id));
      navigate({ to: "/checkout/success/$id", params: { id: res.id }, search: { request: "1" } });
    } catch (err) {
      console.error("checkout submit failed", err);
      const message = err instanceof Error && err.message ? err.message : String(err);
      toast.error(`Could not send your request: ${message}`);

    } finally {
      setSubmitting(false);
    }
  };



  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-display text-5xl text-foreground">Checkout</h1>
      <p className="mt-3 max-w-xl text-foreground/70">
        Enter your details and run information, then send your request — no payment needed now. We'll
        WhatsApp you within 24 hours with a payment link, production and shipping details.
      </p>


      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 grid gap-12 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-12">
          <div>
            <SectionLabel n="01" t="Your details" />
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Field label="Full name" error={form.formState.errors.fullName?.message}>
                <input className={inp} {...form.register("fullName")} maxLength={120} />
              </Field>
              <Field label="Email" error={form.formState.errors.email?.message}>
                <input type="email" className={inp} {...form.register("email")} maxLength={255} />
              </Field>
              <PhoneInput
                dial={dial}
                number={nationalNumber}
                onDialChange={(d) => {
                  setDial(d);
                  form.setValue("whatsapp", buildE164(d, nationalNumber), { shouldValidate: form.formState.isSubmitted });
                }}
                onNumberChange={(n) => {
                  setNationalNumber(n);
                  form.setValue("whatsapp", buildE164(dial, n), { shouldValidate: form.formState.isSubmitted });
                }}
                error={form.formState.errors.whatsapp?.message}
              />

              <Field label="Notes (optional)">
                <textarea className={`${inp} min-h-24`} {...form.register("notes")} maxLength={2000} placeholder="Anything we should know — gift wrap, deadline, custom engraving…" />
              </Field>
            </div>
          </div>

          <div>
            <SectionLabel n="02" t="Your runs" />
            <p className="mt-3 text-sm text-foreground/60">
              GPX file is optional — once we receive your order we will contact you for the GPX file.
            </p>
            <div className="mt-6 space-y-8">
              {items.map((it, idx) => (
                <div key={it.id} className="border border-foreground/30/15 bg-secondary/40 p-6">
                  <div className="flex items-baseline justify-between">
                    <div className="font-display text-xl text-foreground">{it.name}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-foreground/70">
                      {it.frameFinish} · {it.mapColor} · {it.trackColor} · ×{it.qty}
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Field label={it.productSlug === "hyrox-hex" ? "ATHLETE NAME" : "Run name"}>
                      <input className={inp} {...form.register(`items.${idx}.runName`)} placeholder={it.productSlug === "hyrox-hex" ? "AMIR BOURESLAN" : "Dubai Marathon 2025"} maxLength={200} />
                    </Field>
                    <Field label="Location">
                      <input className={inp} {...form.register(`items.${idx}.runLocation`)} placeholder="Dubai, UAE" maxLength={200} />
                    </Field>
                    {it.productSlug !== "hyrox-hex" && (
                      <>
                        <Field label="Distance (km)">
                          <input type="number" step="0.01" min="0" className={inp} {...form.register(`items.${idx}.runDistanceKm`)} placeholder="42.20" />
                        </Field>
                        <Field label="Elevation gain (m)">
                          <input type="number" step="1" min="0" className={inp} {...form.register(`items.${idx}.runElevationM`)} placeholder="184" />
                        </Field>
                      </>
                    )}
                    <Field label="Run date">
                      <input type="date" className={inp} {...form.register(`items.${idx}.runDate`)} />
                    </Field>
                    <Field label="Run time (hh:mm:ss)">
                      <input className={inp} {...form.register(`items.${idx}.runTime`)} placeholder="03:42:11" maxLength={20} />
                    </Field>
                    {it.productSlug !== "hyrox-hex" && (
                      <div className="md:col-span-2">
                        <Field label="">
                          <input
                            type="file"
                            accept=".gpx,application/gpx+xml,application/xml,text/xml"
                            onChange={(e) => setFiles((prev) => ({ ...prev, [idx]: e.target.files?.[0] || null }))}
                            className="block w-full text-sm text-foreground file:mr-4 file:border-0 file:bg-terrain file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.18em] file:text-paper hover:file:bg-terrain"
                          />
                        </Field>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit bg-secondary/60 p-8">
          <div className="text-xs uppercase tracking-[0.22em] text-foreground/70">Your order</div>
          <ul className="mt-5 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4">
                <span className="text-foreground">{i.name} × {i.qty}</span>
                <span className="text-foreground/80">AED {i.priceAed * i.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-foreground/30/15 pt-4 flex justify-between font-display text-xl">
            <span>Total</span>
            <span>AED {total}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-8 block w-full bg-terrain px-6 py-4 text-center text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain disabled:opacity-60"
          >
            {submitting ? "Sending request…" : "Send request now"}
          </button>
          <p className="mt-4 text-xs text-foreground/70">
            No payment now. We'll receive your order and send you a secure payment link over WhatsApp.
          </p>

        </aside>
      </form>
    </section>
  );
}

const inp = "w-full border-b border-foreground/30/25 bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-terrain focus:outline-none";

function SectionLabel({ n, t }: { n: string; t: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-foreground/30/10 pb-3">
      <span className="font-display text-terrain">{n}</span>
      <span className="font-display text-2xl text-foreground">{t}</span>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.18em] text-foreground/70">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
