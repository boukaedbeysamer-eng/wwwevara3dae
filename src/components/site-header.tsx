import { Link, useRouterState } from "@tanstack/react-router";
import { useCart, cartCount } from "@/lib/cart";
import { useEffect, useState } from "react";
import evaraLogo from "@/assets/evara-logo.png.asset.json";

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "Story" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center" aria-label="Evara — home">
          <img src={evaraLogo.url} alt="Evara" className="h-12 w-auto" />
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
        <Link
          to="/cart"
          className="group relative inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-foreground hover:text-terrain"
        >
          Cart
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-terrain px-2 text-xs text-paper group-hover:bg-terrain">
            {count}
          </span>
        </Link>
      </div>
    </header>
  );
}
