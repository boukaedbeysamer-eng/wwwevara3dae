import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { GALLERY_FOLDERS } from "@/data/gallery";

export default defineTool({
  name: "get_gallery_folder",
  title: "Get gallery folder",
  description:
    "Get one Evara3D gallery folder by slug, including its intro copy and every photo with title, caption and image URL.",
  inputSchema: {
    slug: z
      .string()
      .min(1)
      .describe(`Gallery folder slug. One of: ${GALLERY_FOLDERS.map((f) => f.slug).join(", ")}`),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const folder = GALLERY_FOLDERS.find((f) => f.slug === slug.trim().toLowerCase());
    if (!folder) {
      throw new ToolError(
        `No gallery folder "${slug}". Available: ${GALLERY_FOLDERS.map((f) => f.slug).join(", ")}`,
      );
    }
    const detail = {
      slug: folder.slug,
      label: folder.label,
      heading: folder.heading,
      description: folder.description,
      intro: folder.intro,
      url: `https://www.evara3d.ae/gallery/${folder.slug}`,
      images: folder.images,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(detail, null, 2) }],
      structuredContent: { folder: detail },
    };
  },
});
