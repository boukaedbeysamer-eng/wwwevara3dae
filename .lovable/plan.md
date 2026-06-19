# Evara3D FZC — Build Plan

Premium, minimal storefront in the spirit of Patagonia / high-end map studios. Guest "request a quote" checkout — no online payment in v1. All data + file uploads stored in Lovable Cloud.

## Brand & design system

- Palette: deep ink `#0E1A1F`, warm paper `#F4EFE7`, terrain orange `#D9622B`, moss `#3C5A3B`, stone `#8A8276`.
- Typography: `@fontsource/fraunces` (display, serif) for headings + `@fontsource/inter` (body). Headings tight tracking, generous whitespace.
- Subtle topographic SVG accents (concentric contour lines) used as background motifs on hero, product cards, and checkout.
- Components extend shadcn primitives; tokens defined in `src/styles.css` (no hardcoded colors).

## Product catalogue (hardcoded in `src/data/products.ts`)

Three SKUs the customer can configure:

| Slug | Name | Price (AED) | Includes |
|---|---|---|---|
| `keepsaker` | Keepsaker Deep Frame | 220 | 21×30cm frame + 10×11cm 3D map |
| `achiever` | Achiever Deep Frame | 260 | 30×40cm frame + 11×12cm 3D map + medal hanger |
| `legacy` | Legacy Deep Frame | 350 | 28×50cm frame + 11×12cm 3D map + medal hanger + BIB number |

Per-order variant selections:
- **Frame finish**: White Matt · Matte Black · Wooden
- **Map relief color**: Black · White · Green · Wooden
- **Strava track color**: Red · Black · Orange

Background topography is always white with black contour lines (fixed, shown as "what's included").

## Routes (TanStack Start, file-based)

```
src/routes/
  __root.tsx                 site shell, header/footer, newsletter
  index.tsx                  /            hero, story, featured frames, how-it-works
  shop.tsx                   /shop        product grid
  shop.$slug.tsx             /shop/:slug  product detail + configurator + "Add to cart"
  cart.tsx                   /cart        line items, edit/remove, totals (AED)
  checkout.tsx               /checkout    guest form + GPX upload + run details
  checkout.success.$id.tsx   /checkout/success/:id  confirmation + request id
  about.tsx                  /about
  faq.tsx                    /faq
```

Each route sets its own `head()` meta (title, description, og:title/desc). Leaf product pages get og:image of the frame visual.

## Cart

- Zustand store persisted to `localStorage` (`evara-cart`).
- Item shape: `{ id, productSlug, name, priceAed, qty, frameFinish, mapColor, trackColor }`.
- Header shows item count; cart drawer + dedicated `/cart` page.

## Checkout = "Request"

No payment. Single page form (zod + react-hook-form):

1. **Contact** — full name, email, WhatsApp number (with country code), optional notes.
2. **Run details** per cart line — run name, distance (km), elevation gain (m), run date, run time (hh:mm:ss), location name.
3. **GPX upload** per cart line — `.gpx` file, max 5 MB, validated client-side.

On submit:
- Upload each GPX to Storage bucket `gpx-uploads` under `requests/{request_id}/{line_id}.gpx`.
- Insert one row in `order_requests` + one row per line in `order_request_items` (with run metadata, variant choices, gpx storage path).
- Redirect to `/checkout/success/:id` showing the request reference and "we'll WhatsApp you shortly".
- Clear cart.

A protected server function (`requireSupabaseAuth` + admin role) lists requests later — out of scope for v1 UI, but schema is admin-ready.

## Database (migration)

```sql
create table public.order_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text not null,
  notes text,
  total_aed numeric(10,2) not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table public.order_request_items (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.order_requests(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  qty int not null,
  unit_price_aed numeric(10,2) not null,
  frame_finish text not null,
  map_color text not null,
  track_color text not null,
  run_name text,
  run_distance_km numeric(6,2),
  run_elevation_m int,
  run_date date,
  run_time interval,
  run_location text,
  gpx_path text
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
```

RLS: all three tables RLS-on. Anon gets `INSERT` only (so guests can submit). No `SELECT` for anon. `service_role` gets full access for the team. Grants written per `public-schema-grants`.

Storage bucket `gpx-uploads` (private). RLS policy allows anon `INSERT` into `requests/*`, no `SELECT`.

## Server functions (`src/lib/requests.functions.ts`)

- `submitOrderRequest({ contact, items })` — public `createServerFn`, validates with zod, inserts request + items using server publishable client (anon insert policy). Returns `{ id }`.
- `subscribeNewsletter({ email })` — public `createServerFn`, upserts into `newsletter_subscribers`.

GPX upload happens client-side directly to Storage with the publishable key (anon insert policy on `gpx-uploads/requests/*`), then path is passed into `submitOrderRequest`.

## Footer

Brand blurb, nav links, newsletter signup (email + submit → `subscribeNewsletter`), social placeholders, AED currency note, "Made in UAE".

## Out of scope (v1)

- Stripe / online payment
- Strava OAuth
- Customer accounts / order history
- Admin dashboard UI (data model supports it later)

## Build order

1. Enable Lovable Cloud.
2. Migration (tables + RLS + grants) and create storage bucket.
3. Install fonts (`@fontsource/fraunces`, `@fontsource/inter`), set up tokens in `src/styles.css`.
4. Product data + Zustand cart store + zod schemas.
5. Server functions.
6. Routes: root shell → index → shop → product → cart → checkout → success → about/faq.
7. Verify build, smoke-test the request flow.