-- Guest GPX uploads now go through one-time signed upload URLs issued by the server,
-- so clients no longer need a direct INSERT rule on storage.objects.
DROP POLICY IF EXISTS "Guests can upload GPX files" ON storage.objects;