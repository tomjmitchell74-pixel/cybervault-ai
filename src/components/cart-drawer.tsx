"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, PackageOpen, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { cartMonthlySubtotal, cartSavings, useCart, type Billing } from "@/store/cart";
import { annualMonthlyCents, fmtMoney } from "@/lib/format";

function BillingPill({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  return (
    <div className="flex overflow-hidden rounded-full border border-white/10 font-mono text-[9.5px] tracking-wider uppercase">
      {(["monthly", "annual"] as const).map((b) => (
        <button
          key={b}
          onClick={() => onChange(b)}
          className={`px-2.5 py-1 transition-colors ${
            billing === b ? "bg-pulse font-bold text-void" : "text-faint hover:text-dim"
          }`}
        >
          {b === "annual" ? "annual −20%" : "monthly"}
        </button>
      ))}
    </div>
  );
}

export function CartDrawer() {
  const open = useCart((s) => s.drawerOpen);
  const close = useCart((s) => s.closeDrawer);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const setBilling = useCart((s) => s.setBilling);
  const remove = useCart((s) => s.remove);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const subtotal = cartMonthlySubtotal(items);
  const savings = cartSavings(items);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[95] bg-void/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col border-l border-white/10 bg-panel"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
              <div>
                <h2 className="font-display text-lg font-bold tracking-tight">Your Arsenal</h2>
                <p className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                  {items.length} agent{items.length === 1 ? "" : "s"} staged for deployment
                </p>
              </div>
              <button
                onClick={close}
                className="grid size-9 place-items-center rounded-full border border-white/10 text-dim transition-colors hover:border-white/25 hover:text-mist"
                aria-label="Close cart"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* items */}
            <div className="drawer-scroll flex-1 overflow-y-auto px-6 py-5">
              {mounted && items.length > 0 ? (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const monthly =
                        item.billing === "annual"
                          ? annualMonthlyCents(item.priceCents)
                          : item.priceCents;
                      return (
                        <motion.li
                          key={`${item.slug}-${item.billing}`}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="hairline rounded-2xl bg-card p-3.5"
                        >
                          <div className="flex gap-3.5">
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={close}
                              className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-white/10"
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                              <span
                                className="absolute inset-0"
                                style={{
                                  background: `radial-gradient(circle at 70% 20%, hsla(${item.hue},85%,65%,0.25), transparent 60%)`,
                                }}
                              />
                            </Link>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-mono text-[9px] tracking-[0.2em] text-faint">
                                    {item.codename}
                                  </p>
                                  <Link
                                    href={`/product/${item.slug}`}
                                    onClick={close}
                                    className="font-display text-sm font-bold tracking-tight hover:text-pulse"
                                  >
                                    {item.name}
                                  </Link>
                                </div>
                                <button
                                  onClick={() => remove(item.slug, item.billing)}
                                  className="text-faint transition-colors hover:text-red-400"
                                  aria-label={`Remove ${item.name}`}
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                              <div className="mt-2">
                                <BillingPill
                                  billing={item.billing}
                                  onChange={(b) => setBilling(item.slug, item.billing, b)}
                                />
                              </div>
                              <div className="mt-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-1 rounded-full border border-white/10">
                                  <button
                                    onClick={() => setQty(item.slug, item.billing, item.qty - 1)}
                                    className="grid size-6.5 place-items-center text-dim hover:text-mist"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="size-3" />
                                  </button>
                                  <span className="w-5 text-center font-mono text-xs">{item.qty}</span>
                                  <button
                                    onClick={() => setQty(item.slug, item.billing, item.qty + 1)}
                                    className="grid size-6.5 place-items-center text-dim hover:text-mist"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="size-3" />
                                  </button>
                                </div>
                                <p className="font-mono text-sm font-semibold text-mist">
                                  {fmtMoney(monthly * item.qty)}
                                  <span className="text-faint">/mo</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <span className="grid size-16 place-items-center rounded-2xl border border-white/10 bg-card text-faint">
                    <PackageOpen className="size-7" />
                  </span>
                  <p className="mt-5 font-display text-base font-bold">The arsenal is empty</p>
                  <p className="mt-1.5 max-w-55 text-sm text-dim">
                    No agents staged yet. Your perimeter deserves better company.
                  </p>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="btn-primary mt-6 px-5 py-2.5 text-[13px]"
                  >
                    Browse the catalog
                  </Link>
                </div>
              )}
            </div>

            {/* footer */}
            {mounted && items.length > 0 && (
              <div className="border-t border-white/8 px-6 py-5">
                {savings > 0 && (
                  <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-pulse">
                    <span>ANNUAL DISCOUNT APPLIED</span>
                    <span>−{fmtMoney(savings)}/mo</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-dim">Monthly subtotal</span>
                  <span className="font-display text-xl font-bold">
                    {fmtMoney(subtotal)}
                    <span className="text-sm font-medium text-faint">/mo</span>
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-faint">
                  Provisioned instantly after checkout. Cancel anytime.
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="btn-primary mt-4 w-full py-3.5 text-sm"
                >
                  Proceed to checkout <ArrowRight className="size-4" />
                </Link>
                <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[9.5px] tracking-[0.18em] text-faint uppercase">
                  <ShieldCheck className="size-3" /> SOC 2 II · keys stay in your vault
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
