DROP POLICY IF EXISTS "Guests can upload GPX files" ON storage.objects;
CREATE POLICY "Guests can upload GPX files" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (
  bucket_id = 'gpx-uploads'
  AND (storage.foldername(name))[1] = 'requests'
  AND lower(name) LIKE '%.gpx'
  AND (metadata->>'size') IS NOT NULL
  AND (metadata->>'size')::bigint <= 5242880
);