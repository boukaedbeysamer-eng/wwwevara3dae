
CREATE POLICY "No client access to indexing snapshots"
ON public.indexing_snapshots
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);
