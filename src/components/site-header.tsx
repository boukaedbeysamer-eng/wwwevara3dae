import { Link, useRouterState } from "@tanstack/react-router";
import { useCart, cartCount } from "@/lib/cart";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import evaraLogo from "@/assets/evara-logo-blue-transparent.png.asset.json";

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/about", label: "Our Story" },
    { to: "/shop", label: "Collection" },
    { to: "/gallery", label: "Gallery" },
    { to: "/faq", label: "Process" },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center" aria-label="Evara — home">
          <img src={evaraLogo.url} alt="Evara" className="h-14 w-auto" />
        </Link>
        <nav className="hidden gap-10 text-sm uppercase tracking-[0.18em] text-foreground/70 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`transition-colors hover:text-terrain ${
                pathname.startsWith(n.to) ? "text-terrain" : ""
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/shop"
            className="bg-terrain px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90"
          >
            Shop Online
          </Link>
          <Link
            to="/cart"
            className="group relative inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-foreground hover:text-terrain"
          >
            Cart
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-terrain px-2 text-xs text-paper">
              {count}
            </span>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/60 text-foreground hover:text-terrain md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4 text-sm uppercase tracking-[0.18em]">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`py-3 transition-colors hover:text-terrain ${
                  pathname.startsWith(n.to) ? "text-terrain" : "text-foreground/80"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
