import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MAX_GPX_FILES = 20;

/**
 * Issues one-time signed upload URLs for guest GPX files.
 * Guests never write to storage directly; each URL is scoped to a single,
 * server-generated path in the private gpx-uploads bucket.
 */
export const createGpxUploadUrls = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ count: z.number().int().min(1).max(MAX_GPX_FILES) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uploads: { path: string; token: string }[] = [];
    for (let i = 0; i < data.count; i++) {
      const path = `requests/${crypto.randomUUID()}.gpx`;
      const { data: signed, error } = await supabaseAdmin.storage
        .from("gpx-uploads")
        .createSignedUploadUrl(path);
      if (error || !signed) {
        console.error("createSignedUploadUrl failed", error);
        throw new Error("Could not prepare GPX upload");
      }
      uploads.push({ path: signed.path, token: signed.token });
    }
    return { uploads };
  });
