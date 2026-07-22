
CREATE TABLE public.indexing_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  coverage_state TEXT,
  verdict TEXT,
  robots_txt_state TEXT,
  indexing_state TEXT,
  page_fetch_state TEXT,
  last_crawl_time TIMESTAMPTZ,
  google_canonical TEXT,
  user_canonical TEXT,
  raw JSONB
);
CREATE INDEX idx_indexing_snapshots_url_time ON public.indexing_snapshots (url, checked_at DESC);
GRANT ALL ON public.indexing_snapshots TO service_role;
ALTER TABLE public.indexing_snapshots ENABLE ROW LEVEL SECURITY;
