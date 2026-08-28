DROP POLICY "Guests can submit order requests" ON public.order_requests;
CREATE POLICY "Guests can submit order requests"
ON public.order_requests FOR INSERT TO anon, authenticated
WITH CHECK (
  length(full_name) >= 1 AND length(full_name) <= 120
  AND length(email) >= 3 AND length(email) <= 255
  AND length(whatsapp) >= 4 AND length(whatsapp) <= 40
  AND (notes IS NULL OR length(notes) <= 2000)
  AND total_aed >= 0 AND total_aed <= 100000
  AND status IN ('new','awaiting_payment')
);

DROP POLICY "Guests can submit order request items" ON public.order_request_items;
CREATE POLICY "Guests can submit order request items"
ON public.order_request_items FOR INSERT TO anon, authenticated
WITH CHECK (
  length(product_slug) >= 1 AND length(product_slug) <= 60
  AND length(product_name) >= 1 AND length(product_name) <= 120
  AND qty >= 1 AND qty <= 50
  AND unit_price_aed >= 0 AND unit_price_aed <= 100000
  AND length(frame_finish) >= 1 AND length(frame_finish) <= 40
  AND length(map_color) >= 1 AND length(map_color) <= 40
  AND length(track_color) >= 1 AND length(track_color) <= 40
  AND (run_name IS NULL OR length(run_name) <= 200)
  AND (run_location IS NULL OR length(run_location) <= 200)
  AND (gpx_path IS NULL OR length(gpx_path) <= 300)
);