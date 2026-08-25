import { Link, useRouterState } from "@tanstack/react-router";
import { useCart, cartCount } from "@/lib/cart";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import evaraLogo from "@/assets/evara-logo-blue-transparent.png.asset.json";

type CollectionLink =
  | { hash: string; label: string; to?: never }
  | { to: string; label: string; hash?: never };

const COLLECTION_LINKS: CollectionLink[] = [
  { hash: "frames", label: "Choose Your Frame Series" },
  { to: "/flask-dry-stand", label: "Flask Dry Stand" },
  { hash: "glow", label: "Glow Series" },
  { hash: "hyrox", label: "Hyrox Series" },
  { hash: "custom", label: "Custom My Project" },
];

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(false);
  const collectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/about", label: "Our Story" },
    { to: "/gallery", label: "Gallery" },
    { to: "/faq", label: "Process" },
  ];

  useEffect(() => {
    setOpen(false);
    setCollectionOpen(false);
    setMobileCollectionOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (collectionRef.current && !collectionRef.current.contains(e.target as Node)) {
        setCollectionOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center" aria-label="Evara — home">
          <img src={evaraLogo.url} alt="Evara" className="h-14 w-auto" />
        </Link>
        <nav className="hidden items-center gap-10 text-sm uppercase tracking-[0.18em] text-foreground/70 md:flex">
          <Link
            to="/about"
            className={`transition-colors hover:text-terrain ${pathname.startsWith("/about") ? "text-terrain" : ""}`}
          >
            Our Story
          </Link>

          <div className="relative" ref={collectionRef}>
            <button
              type="button"
              onClick={() => setCollectionOpen((v) => !v)}
              aria-expanded={collectionOpen}
              className={`flex items-center gap-2 uppercase tracking-[0.18em] transition-colors hover:text-terrain ${
                pathname.startsWith("/shop") ? "text-terrain" : ""
              }`}
            >
              PRODUCTS
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ease-out ${collectionOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`absolute left-0 top-full z-50 w-72 origin-top overflow-hidden border border-border/60 bg-background shadow-2xl transition-all duration-300 ease-in-out ${
                collectionOpen ? "mt-3 max-h-96 opacity-100" : "pointer-events-none mt-2 max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col py-2">
                {COLLECTION_LINKS.map((c) => (
                  <Link
                    key={c.hash ?? c.to}
                    to={c.to ?? "/shop"}
                    hash={c.hash}
                    onClick={() => setCollectionOpen(false)}
                    className="px-5 py-3 text-xs uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:bg-secondary/60 hover:text-terrain"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {nav.slice(1).map((n) => (
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
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className={`py-3 transition-colors hover:text-terrain ${
                pathname.startsWith("/about") ? "text-terrain" : "text-foreground/80"
              }`}
            >
              Our Story
            </Link>

            <button
              type="button"
              onClick={() => setMobileCollectionOpen((v) => !v)}
              aria-expanded={mobileCollectionOpen}
              className={`flex w-full items-center justify-between py-3 uppercase tracking-[0.18em] transition-colors hover:text-terrain ${
                pathname.startsWith("/shop") ? "text-terrain" : "text-foreground/80"
              }`}
            >
              PRODUCTS
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ease-out ${
                  mobileCollectionOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                mobileCollectionOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col border-l border-border/60 pl-4">
                {COLLECTION_LINKS.map((c) => (
                  <Link
                    key={c.hash ?? c.to}
                    to={c.to ?? "/shop"}
                    hash={c.hash}
                    onClick={() => setOpen(false)}
                    className="py-3 text-xs uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-terrain"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {nav.slice(1).map((n) => (
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
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 py-3 transition-colors hover:text-terrain ${
                pathname.startsWith("/cart") ? "text-terrain" : "text-foreground/80"
              }`}
            >
              Cart
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-terrain px-2 text-xs text-paper">
                {count}
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
