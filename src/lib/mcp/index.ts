import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import listCustomizationOptions from "./tools/list-customization-options";
import listGalleryFolders from "./tools/list-gallery-folders";
import getGalleryFolder from "./tools/get-gallery-folder";

const SUPABASE_URL =
  import.meta.env['VITE_SUPABASE_URL'] ?? "https://tdnxhferbfmpumnbexsq.supabase.co";

export default defineMcp({
  // Require a signed-in account: every MCP request must present a valid
  // access token issued by the app's own auth service. Unauthenticated
  // callers get a 401 with the OAuth discovery metadata.
  auth: auth.oauth.issuer({
    issuer: `${SUPABASE_URL}/auth/v1`,
    jwksUri: `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
    acceptedAudiences: ["authenticated"],
    resourceName: "Evara3D catalog MCP",
  }),
  name: "route-keepsake-co",
  title: "Route Keepsake Co.",
  version: "0.1.0",
  instructions:
    "Public catalog tools for Evara3D (Route Keepsake Co.) — 3D-printed running route frames, HEX map displays, Hyrox displays and soft flask drying stands. Use `list_products` and `get_product` for the catalog and prices in AED, `list_customization_options` for frame/relief/track color choices, and `list_gallery_folders` / `get_gallery_folder` for product photos. These tools are read-only and expose no customer or order data.",
  tools: [
    listProducts,
    getProduct,
    listCustomizationOptions,
    listGalleryFolders,
    getGalleryFolder,
  ],
});
