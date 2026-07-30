"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { annualMonthlyCents } from "@/lib/format";

export type Billing = "monthly" | "annual";

export type CartItem = {
  slug: string;
  name: string;
  codename: string;
  image: string;
  hue: number;
  /** Monthly list price in cents. */
  priceCents: number;
  billing: Billing;
  qty: number;
};

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string, billing: Billing) => void;
  setQty: (slug: string, billing: Billing, qty: number) => void;
  setBilling: (slug: string, from: Billing, to: Billing) => void;
  clear: () => void;
};

const lineKey = (slug: string, billing: Billing) => `${slug}::${billing}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      add: (item, qty = 1) =>
        set((s) => {
          const key = lineKey(item.slug, item.billing);
          const existing = s.items.find((i) => lineKey(i.slug, i.billing) === key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                lineKey(i.slug, i.billing) === key ? { ...i, qty: Math.min(i.qty + qty, 50) } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, qty }] };
        }),
      remove: (slug, billing) =>
        set((s) => ({
          items: s.items.filter((i) => lineKey(i.slug, i.billing) !== lineKey(slug, billing)),
        })),
      setQty: (slug, billing, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => lineKey(i.slug, i.billing) !== lineKey(slug, billing))
              : s.items.map((i) =>
                  lineKey(i.slug, i.billing) === lineKey(slug, billing)
                    ? { ...i, qty: Math.min(qty, 50) }
                    : i
                ),
        })),
      setBilling: (slug, from, to) =>
        set((s) => {
          if (from === to) return s;
          const remaining = s.items.filter(
            (i) => lineKey(i.slug, i.billing) !== lineKey(slug, from)
          );
          const source = s.items.find((i) => lineKey(i.slug, i.billing) === lineKey(slug, from));
          if (!source) return s;
          const merged = remaining.find((i) => lineKey(i.slug, i.billing) === lineKey(slug, to));
          if (merged) {
            return {
              items: remaining.map((i) =>
                lineKey(i.slug, i.billing) === lineKey(slug, to)
                  ? { ...i, qty: Math.min(i.qty + source.qty, 50) }
                  : i
              ),
            };
          }
          return { items: [...remaining, { ...source, billing: to }] };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "cybervault-cart-v1",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/** Effective per-month price after the annual discount. */
export function effectiveMonthlyCents(item: CartItem): number {
  return item.billing === "annual" ? annualMonthlyCents(item.priceCents) : item.priceCents;
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.qty, 0);
}

export function cartMonthlySubtotal(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + effectiveMonthlyCents(i) * i.qty, 0);
}

export function cartSavings(items: CartItem[]): number {
  return items.reduce(
    (acc, i) => acc + (i.billing === "annual" ? (i.priceCents - annualMonthlyCents(i.priceCents)) * i.qty : 0),
    0
  );
}
