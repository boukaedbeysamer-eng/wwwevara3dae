
DROP POLICY "Anyone can submit order requests" ON public.order_requests;
DROP POLICY "Anyone can submit order request items" ON public.order_request_items;
DROP POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Guests can submit order requests" ON public.order_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 255
    AND length(whatsapp) BETWEEN 4 AND 40
    AND (notes IS NULL OR length(notes) <= 2000)
    AND total_aed >= 0
    AND total_aed <= 100000
    AND status = 'new'
  );

CREATE POLICY "Guests can submit order request items" ON public.order_request_items
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(product_slug) BETWEEN 1 AND 60
    AND length(product_name) BETWEEN 1 AND 120
    AND qty BETWEEN 1 AND 20
    AND unit_price_aed >= 0
    AND unit_price_aed <= 100000
    AND length(frame_finish) BETWEEN 1 AND 40
    AND length(map_color) BETWEEN 1 AND 40
    AND length(track_color) BETWEEN 1 AND 40
    AND (run_name IS NULL OR length(run_name) <= 200)
    AND (run_location IS NULL OR length(run_location) <= 200)
    AND (gpx_path IS NULL OR length(gpx_path) <= 300)
  );

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(email) BETWEEN 3 AND 255 AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');

CREATE POLICY "Guests can upload GPX files" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'gpx-uploads'
    AND (storage.foldername(name))[1] = 'requests'
  );
