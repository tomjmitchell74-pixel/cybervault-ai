"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Lock, Minus, Plus, RefreshCcw, Zap, ZapIcon } from "lucide-react";
import type { ProductView } from "@/lib/data";
import { annualMonthlyCents, annualSavingsCents, cx, fmtMoney } from "@/lib/format";
import { useCart, type Billing } from "@/store/cart";

export function PurchasePanel({ product }: { product: ProductView }) {
  const [billing, setBilling] = useState<Billing>("annual");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const router = useRouter();

  const effective = billing === "annual" ? annualMonthlyCents(product.priceCents) : product.priceCents;

  const doAdd = (redirect: boolean) => {
    add(
      {
        slug: product.slug,
        name: product.name,
        codename: product.codename,
        image: product.image,
        hue: product.hue,
        priceCents: product.priceCents,
        billing,
      },
      qty
    );
    if (redirect) {
      router.push("/checkout");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
      setTimeout(() => openDrawer(), 380);
    }
  };

  return (
    <div className="mt-8">
      {/* billing selector */}
      <div className="grid grid-cols-2 gap-3">
        {(["monthly", "annual"] as const).map((b) => {
          const price = b === "annual" ? annualMonthlyCents(product.priceCents) : product.priceCents;
          return (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={cx(
                "relative rounded-2xl border p-4 text-left transition-all duration-300",
                billing === b
                  ? "border-pulse/60 bg-pulse/8 shadow-[0_8px_32px_-12px_rgba(92,240,200,0.35)]"
                  : "border-white/10 bg-panel hover:border-white/25"
              )}
            >
              {b === "annual" && (
                <span className="absolute -top-2 right-3 rounded-full bg-pulse px-2 py-0.5 font-mono text-[8.5px] font-bold tracking-[0.14em] text-void">
                  SAVE 20%
                </span>
              )}
              <p className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                {b === "annual" ? "Annual" : "Monthly"}
              </p>
              <p className="mt-1.5 font-display text-2xl font-bold tracking-tight">
                {fmtMoney(price)}
                <span className="text-[13px] font-medium text-faint">/mo</span>
              </p>
              <p className="mt-1 text-[11px] text-faint">
                {b === "annual"
                  ? `Billed yearly · save ${fmtMoney(annualSavingsCents(product.priceCents))}`
                  : "Billed monthly · cancel anytime"}
              </p>
            </button>
          );
        })}
      </div>

      {/* qty + cta */}
      <div className="mt-5 flex gap-3">
        <div className="flex items-center gap-1 rounded-full border border-white/12 bg-panel px-1.5">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-9 place-items-center text-dim transition-colors hover:text-mist"
            aria-label="Decrease licenses"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-6 text-center font-mono text-sm font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(50, q + 1))}
            className="grid size-9 place-items-center text-dim transition-colors hover:text-mist"
            aria-label="Increase licenses"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
        <button
          onClick={() => doAdd(false)}
          className={cx("btn-primary flex-1", added && "pointer-events-none")}
        >
          {added ? (
            <>
              <Check className="size-4" strokeWidth={3} /> Added to arsenal
            </>
          ) : (
            <>
              Add to arsenal — {fmtMoney(effective * qty)}
              <span className="text-[13px] font-medium opacity-70">/mo</span>
            </>
          )}
        </button>
      </div>
      <button onClick={() => doAdd(true)} className="btn-ghost mt-3 w-full">
        <ZapIcon className="size-4 text-pulse" /> Deploy now — skip the cart
      </button>

      {/* assurances */}
      <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/8 pt-6">
        {[
          { icon: Zap, label: "Provisioned in ~7 min" },
          { icon: RefreshCcw, label: "30-day money-back" },
          { icon: Lock, label: "BYOK · zero retention" },
        ].map((a) => (
          <div key={a.label} className="flex flex-col items-center gap-2 text-center">
            <a.icon className="size-4 text-pulse" />
            <p className="font-mono text-[9px] leading-snug tracking-[0.12em] text-faint uppercase">
              {a.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
