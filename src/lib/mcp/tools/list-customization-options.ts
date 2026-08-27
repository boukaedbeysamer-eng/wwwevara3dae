import { defineTool } from "@lovable.dev/mcp-js";
import { FRAME_FINISHES, MAP_COLORS, TRACK_COLORS } from "@/data/products";

export default defineTool({
  name: "list_customization_options",
  title: "List customization options",
  description:
    "List the frame finishes, 3D relief map colors and route/track colors a customer can choose when ordering an Evara3D frame.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const options = {
      frameFinishes: FRAME_FINISHES,
      mapColors: MAP_COLORS,
      trackColors: TRACK_COLORS,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(options, null, 2) }],
      structuredContent: options,
    };
  },
});
