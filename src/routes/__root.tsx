import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource/bebas-neue/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/whatsapp-button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <h2 className="mt-4 font-display text-2xl">Off the map</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This route doesn't exist — but yours could be on a wall.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-terrain px-5 py-3 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain"
          >
            Back to base
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something went sideways</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Refresh and try again, or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-terrain px-5 py-3 text-xs uppercase tracking-[0.22em] text-paper hover:bg-terrain"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-foreground/30 px-5 py-3 text-xs uppercase tracking-[0.22em] text-foreground hover:bg-terrain hover:text-paper"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "PTfXT6jjrwia1yAJM2SauU6wvXTAh32BT-Z1Hs_T2RA" },
      { title: "Evara3D — 3D-printed topographic maps of your runs" },
      { name: "description", content: "Turn your Strava run into a custom 3D-printed topographic relief map, framed for the wall. Designed and made in the UAE." },
      { name: "author", content: "Evara3D FZC" },
      { property: "og:title", content: "Evara3D — 3D-printed topographic maps of your runs" },
      { property: "og:description", content: "Turn your Strava run into a custom 3D-printed topographic relief map, framed for the wall. Designed and made in the UAE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Evara3D — 3D-printed topographic maps of your runs" },
      { name: "twitter:description", content: "Turn your Strava run into a custom 3D-printed topographic relief map, framed for the wall. Designed and made in the UAE." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3af80984-da15-40fc-848c-722085eb0ee3/id-preview-2b9bc141--5fea5a40-38d2-4e3e-98e9-0961f980b0f9.lovable.app-1782250178825.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3af80984-da15-40fc-848c-722085eb0ee3/id-preview-2b9bc141--5fea5a40-38d2-4e3e-98e9-0961f980b0f9.lovable.app-1782250178825.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster position="top-center" />
      <WhatsAppButton />
    </QueryClientProvider>
  );
}
