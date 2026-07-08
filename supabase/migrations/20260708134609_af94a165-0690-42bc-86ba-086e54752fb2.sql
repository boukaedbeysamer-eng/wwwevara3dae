
DROP POLICY IF EXISTS "anon can subscribe newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "anon can insert order_requests" ON public.order_requests;
DROP POLICY IF EXISTS "anon can insert order_request_items" ON public.order_request_items;
DROP POLICY IF EXISTS "anon can upload gpx" ON storage.objects;
