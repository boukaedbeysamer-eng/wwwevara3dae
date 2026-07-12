import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/requests.functions";
import { toast } from "sonner";

export function SiteFooter() {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribe({ data: { email } });
      toast.success("You're on the list. Welcome to the trail.");
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-32 border-t border-foreground/30/15 bg-terrain text-paper">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="font-display text-3xl tracking-tight">
            EVARA&nbsp;3D
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
            Topographic relief maps of your runs — engineered, 3D-printed, and framed in
            the UAE. Built for athletes who treat their routes as memory.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-paper/40">
            Made in UAE · Prices in AED
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-paper/40">Explore</div>
          <ul className="mt-5 space-y-3 text-sm text-paper/85">
            <li><Link to="/shop" className="hover:text-terrain">Shop frames</Link></li>
            <li><Link to="/about" className="hover:text-terrain">Our story</Link></li>
            <li><Link to="/faq" className="hover:text-terrain">FAQ</Link></li>
            <li><Link to="/checkout" className="hover:text-terrain">Request an order</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-paper/40">Field notes</div>
          <p className="mt-5 text-sm leading-relaxed text-paper/70">
            Real runs. Real terrain. Real stories.<br />
            Be first to see new frame drops, featured athlete moments, and exclusive community offers. No noise, just the good stuff.
          </p>
          <form onSubmit={onSubmit} className="mt-5 flex">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@evara3d.ae"
              maxLength={255}
              className="w-full rounded-none border-b border-paper/30 bg-transparent px-0 py-2 text-sm text-paper placeholder:text-paper/40 focus:border-terrain focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="ml-3 whitespace-nowrap border-b border-terrain pb-2 text-xs uppercase tracking-[0.22em] text-terrain hover:text-paper hover:border-paper disabled:opacity-50"
            >
              {loading ? "..." : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-6 py-6 text-xs text-paper/40 md:flex-row">
          <span>© {new Date().getFullYear()} Evara3D FZC. All rights reserved.</span>
          <span>Built for runners, by runners.</span>
        </div>
      </div>
    </footer>
  );
}
