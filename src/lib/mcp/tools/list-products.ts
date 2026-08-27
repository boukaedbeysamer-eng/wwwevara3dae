import { defineTool } from "@lovable.dev/mcp-js";
import { ALL_PRODUCTS } from "@/data/products";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "List every Evara3D product available to order (3D-printed running route frames, HEX map displays, Hyrox displays) with slug, name, price in AED and sizes.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const products = ALL_PRODUCTS.map((p) => ({
      slug: p.slug,
      name: p.name,
      priceAed: p.priceAed,
      frameSize: p.frameSize,
      mapSize: p.mapSize,
      tagline: p.tagline.replace(/\s+/g, " ").trim(),
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
      structuredContent: { products },
    };
  },
});
