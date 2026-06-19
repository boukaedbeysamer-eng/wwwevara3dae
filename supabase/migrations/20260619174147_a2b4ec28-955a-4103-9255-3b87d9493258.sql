
CREATE TABLE public.order_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  notes TEXT,
  total_aed NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_request_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.order_requests(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  qty INT NOT NULL,
  unit_price_aed NUMERIC(10,2) NOT NULL,
  frame_finish TEXT NOT NULL,
  map_color TEXT NOT NULL,
  track_color TEXT NOT NULL,
  run_name TEXT,
  run_distance_km NUMERIC(6,2),
  run_elevation_m INT,
  run_date DATE,
  run_time TEXT,
  run_location TEXT,
  gpx_path TEXT
);

CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.order_requests TO anon;
GRANT INSERT ON public.order_requests TO authenticated;
GRANT ALL ON public.order_requests TO service_role;

GRANT INSERT ON public.order_request_items TO anon;
GRANT INSERT ON public.order_request_items TO authenticated;
GRANT ALL ON public.order_request_items TO service_role;

GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT INSERT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

ALTER TABLE public.order_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit order requests" ON public.order_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can submit order request items" ON public.order_request_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
