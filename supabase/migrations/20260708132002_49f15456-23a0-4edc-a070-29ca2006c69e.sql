
-- Ensure anon can insert into request tables (guest checkout)
GRANT INSERT ON public.order_requests TO anon;
GRANT INSERT ON public.order_request_items TO anon;
GRANT INSERT ON public.newsletter_subscribers TO anon;

DROP POLICY IF EXISTS "anon can insert order_requests" ON public.order_requests;
CREATE POLICY "anon can insert order_requests" ON public.order_requests
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon can insert order_request_items" ON public.order_request_items;
CREATE POLICY "anon can insert order_request_items" ON public.order_request_items
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon can subscribe newsletter" ON public.newsletter_subscribers;
CREATE POLICY "anon can subscribe newsletter" ON public.newsletter_subscribers
  FOR INSERT TO anon WITH CHECK (true);

-- Storage: allow anon uploads to gpx-uploads/requests/*
DROP POLICY IF EXISTS "anon can upload gpx" ON storage.objects;
CREATE POLICY "anon can upload gpx" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'gpx-uploads' AND (storage.foldername(name))[1] = 'requests');
