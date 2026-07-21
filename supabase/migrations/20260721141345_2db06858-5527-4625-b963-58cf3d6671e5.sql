ALTER TABLE public.order_requests
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_order_requests_stripe_session_id
  ON public.order_requests(stripe_session_id);