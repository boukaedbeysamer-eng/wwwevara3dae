import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { ALL_PRODUCTS, getProduct } from "@/data/products";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Get full details for one Evara3D product by slug: price, dimensions, what is included, and the product story.",
  inputSchema: {
    slug: z
      .string()
      .min(1)
      .describe(`Product slug. One of: ${ALL_PRODUCTS.map((p) => p.slug).join(", ")}`),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const product = getProduct(slug.trim().toLowerCase());
    if (!product) {
      throw new ToolError(
        `No product with slug "${slug}". Available: ${ALL_PRODUCTS.map((p) => p.slug).join(", ")}`,
      );
    }
    const detail = { ...product, tagline: product.tagline.replace(/\s+/g, " ").trim() };
    return {
      content: [{ type: "text", text: JSON.stringify(detail, null, 2) }],
      structuredContent: { product: detail },
    };
  },
});
