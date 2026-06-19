import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FrameFinish, MapColor, TrackColor } from "@/data/products";

export type CartItem = {
  id: string;
  productSlug: string;
  name: string;
  priceAed: number;
  qty: number;
  frameFinish: FrameFinish;
  mapColor: MapColor;
  trackColor: TrackColor;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => ({
          items: [...s.items, { ...item, id: crypto.randomUUID() }],
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, Math.min(20, qty)) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "evara-cart" },
  ),
);

export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.priceAed * i.qty, 0);

export const cartCount = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.qty, 0);
