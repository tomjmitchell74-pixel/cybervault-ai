"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, ShieldCheck, Zap } from "lucide-react";
import { useCart } from "@/store/cart";
import { fmtMoney } from "@/lib/format";

export type SuccessData =
  | { state: "paid"; orderNo: string; email: string | null; amountCents: number | null }
  | { state: "unpaid" }
  | { state: "unconfigured" }
  | { state: "missing" };

export function SuccessClient({ data }: { data: SuccessData }) {
  const clear = useCart((s) => s.clear);

  // A completed Stripe session means the cart was paid — clear it.
  useEffect(() => {
    if (data.state === "paid") clear();
  }, [data.state, clear]);

  if (data.state !== "paid") {
    const copy =
      data.state === "unpaid"
        ? {
            title: "Payment not completed",
            body: "Stripe reported this session as unpaid. No charge was made — head back to checkout and try again.",
          }
        : data.state === "unconfigured"
          ? {
              title: "Payments not configured",
              body: "This storefront hasn't been given a Stripe secret key yet, so live sessions can't be verified.",
            }
          : {
              title: "Session not found",
              body: "We couldn't verify that payment session. If your card was charged, contact ops with your receipt and we'll reconcile it immediately.",
            };
    return (
      <div className="bg-blueprint flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl border border-ember/30 bg-ember/10 text-ember">
            <AlertTriangle className="size-7" />
          </span>
          <h1 className="display-xl mt-6 text-4xl font-bold sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-dim">{copy.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/checkout" className="btn-primary px-5 py-2.5 text-sm">
              <ArrowLeft className="size-4" /> Back to checkout
            </Link>
            <Link href="/shop" className="btn-ghost px-5 py-2.5 text-sm">
              Browse the arsenal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <div className="bg-blueprint pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[30rem] -translate-x-1/2 rounded-full bg-pulse/12 blur-[90px]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-2xl pt-28 pb-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          className="mx-auto grid size-20 place-items-center rounded-full bg-pulse/12 text-pulse"
        >
          <BadgeCheck className="size-10" />
        </motion.div>
        <p className="kicker mt-8 text-pulse">Payment received via Stripe</p>
        <h1 className="display-xl mt-3 text-4xl font-bold sm:text-6xl">
          DEPLOYMENT <em className="font-accent font-normal italic">confirmed</em>
        </h1>
        <p className="mt-6 font-mono text-[11px] tracking-[0.24em] text-faint uppercase">
          Order reference
        </p>
        <p className="mt-2 font-mono text-4xl font-bold tracking-[0.1em] text-pulse">
          {data.orderNo}
        </p>
        {data.amountCents != null && (
          <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
            Charged {fmtMoney(data.amountCents)}
          </p>
        )}
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-dim">
          A Stripe receipt is on its way to{" "}
          <span className="text-mist">{data.email ?? "your inbox"}</span>. Your agents are
          provisioning now — expect first contact within seven minutes.
        </p>
        <div className="panel mx-auto mt-10 max-w-md p-6 text-left">
          {[
            { icon: BadgeCheck, label: "Payment captured & keys escrowed", done: true },
            { icon: Zap, label: "Agents provisioning in your environment", done: true },
            { icon: ShieldCheck, label: "Baseline calibration begins (72h)", done: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 py-2.5">
              <span
                className={`grid size-8 place-items-center rounded-full border ${
                  s.done
                    ? "border-pulse/40 bg-pulse/10 text-pulse"
                    : "border-white/15 text-faint"
                }`}
              >
                <s.icon className="size-4" />
              </span>
              <p className={`text-[13.5px] ${s.done ? "text-mist" : "text-faint"}`}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 pb-6">
          <Link href="/shop" className="btn-primary">
            Deploy another agent <ArrowRight className="size-4" />
          </Link>
          <Link href="/" className="btn-ghost">
            <ArrowLeft className="size-4" /> Back to base
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
