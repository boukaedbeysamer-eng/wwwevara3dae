import { defineTool } from "@lovable.dev/mcp-js";
import { GALLERY_FOLDERS } from "@/data/gallery";

export default defineTool({
  name: "list_gallery_folders",
  title: "List gallery folders",
  description:
    "List the Evara3D gallery folders (Trail Running, HYROX, Soft Flask Drying Stand) with their slug, description and photo count.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const folders = GALLERY_FOLDERS.map((f) => ({
      slug: f.slug,
      label: f.label,
      heading: f.heading,
      description: f.description,
      photoCount: f.images.length,
      url: `https://www.evara3d.ae/gallery/${f.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(folders, null, 2) }],
      structuredContent: { folders },
    };
  },
});
