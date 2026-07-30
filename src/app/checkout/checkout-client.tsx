"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  PackageOpen,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cartMonthlySubtotal, cartSavings, useCart } from "@/store/cart";
import { annualMonthlyCents, cx, fmtMoney } from "@/lib/format";
import { placeOrder } from "@/app/actions";

type Step = 1 | 2 | 3;

const STEP_LABELS = ["Details", "Review", "Confirmed"];

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function CheckoutClient() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [method, setMethod] = useState<"card" | "bank">("card");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [holder, setHolder] = useState("");
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");
  const [acctType, setAcctType] = useState<"checking" | "savings">("checking");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ orderNo: string; total: number; pm: string } | null>(
    null
  );
  const [stripePending, setStripePending] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);

  const subtotal = cartMonthlySubtotal(items);
  const savings = cartSavings(items);
  const dueToday = items.reduce((acc, i) => {
    const m = i.billing === "annual" ? annualMonthlyCents(i.priceCents) : i.priceCents;
    return acc + m * i.qty * (i.billing === "annual" ? 12 : 1);
  }, 0);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const nameOk = name.trim().length >= 2;
  const cardOk =
    card.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3,4}$/.test(cvc);
  const routingOk = /^\d{9}$/.test(routing);
  const accountOk = /^\d{4,17}$/.test(account);
  const holderOk = (holder.trim() || name.trim()).length >= 2;
  const bankOk = routingOk && accountOk && holderOk;
  const detailsOk = emailOk && nameOk && (method === "card" ? cardOk : bankOk);

  const confirmOrder = () => {
    setError(null);
    const last4 =
      method === "bank" ? account.slice(-4) : card.replace(/\s/g, "").slice(-4);
    startTransition(async () => {
      const res = await placeOrder({
        customer: { email: email.trim(), name: name.trim(), company: company.trim() || undefined },
        items: items.map((i) => ({ slug: i.slug, qty: i.qty, billing: i.billing })),
        payment: { kind: method, last4 },
      });
      if (res.ok && res.orderNo) {
        setReceipt({
          orderNo: res.orderNo,
          total: res.totalMonthlyCents ?? subtotal,
          pm:
            method === "bank"
              ? `Bank ${acctType} account •• ${last4}`
              : `Card •• ${last4}`,
        });
        clear();
        setStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(res.error ?? "Deployment failed — please retry.");
      }
    });
  };

  const payWithStripe = async () => {
    setError(null);
    setStripePending(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            email: email.trim(),
            name: name.trim(),
            company: company.trim() || undefined,
          },
          items: items.map((i) => ({ slug: i.slug, qty: i.qty, billing: i.billing })),
        }),
      });
      const json = await res.json();
      if (res.ok && json.url) {
        window.location.href = json.url as string;
        return;
      }
      setError(json.error ?? "Stripe checkout is unavailable right now.");
    } catch {
      setError("Couldn't reach the payment server — check your connection and retry.");
    }
    setStripePending(false);
  };

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  // ---- empty cart ----
  if (step !== 3 && items.length === 0) {
    return (
      <div className="bg-blueprint flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl border border-white/10 bg-card text-faint">
            <PackageOpen className="size-7" />
          </span>
          <h1 className="display-xl mt-6 text-4xl font-bold sm:text-5xl">Nothing staged</h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] text-dim">
            Your deployment queue is empty. Add an agent or three before heading to the launch
            bay.
          </p>
          <Link href="/shop" className="btn-primary mt-8">
            Browse the arsenal <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="bg-blueprint pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 pt-36 pb-24 sm:px-6">
        <p className="kicker text-pulse">CyberVault AI / Deployment bay</p>
        <h1 className="display-xl mt-3 text-4xl font-bold sm:text-6xl">
          {step === 3 ? (
            <>
              DEPLOYMENT <em className="font-accent font-normal italic">confirmed</em>
            </>
          ) : (
            <>
              SECURE <em className="font-accent font-normal italic">checkout</em>
            </>
          )}
        </h1>

        {/* stepper */}
        <div className="mt-8 flex items-center gap-2">
          {STEP_LABELS.map((label, i) => {
            const n = (i + 1) as Step;
            const active = step === n;
            const done = step > n;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={cx(
                    "grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-bold transition-all",
                    done && "border-pulse bg-pulse text-void",
                    active && "border-pulse/60 bg-pulse/10 text-pulse",
                    !done && !active && "border-white/15 text-faint"
                  )}
                >
                  {done ? <BadgeCheck className="size-3.5" /> : n}
                </span>
                <span
                  className={cx(
                    "hidden font-mono text-[10px] tracking-[0.18em] uppercase sm:block",
                    active ? "text-mist" : "text-faint"
                  )}
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ============ STEP 3 — SUCCESS ============ */}
          {step === 3 && receipt && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-14 max-w-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
                className="mx-auto grid size-20 place-items-center rounded-full bg-pulse/12 text-pulse"
              >
                <BadgeCheck className="size-10" />
              </motion.div>
              <p className="mt-8 font-mono text-[11px] tracking-[0.24em] text-faint uppercase">
                Order reference
              </p>
              <p className="mt-2 font-mono text-4xl font-bold tracking-[0.1em] text-pulse">
                {receipt.orderNo}
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-faint uppercase">
                Charged via {receipt.pm}
              </p>
              <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-dim">
                A confirmation transmission is on its way to{" "}
                <span className="text-mist">{email}</span>. Your agents are provisioning now —
                expect first contact within seven minutes.
              </p>
              <div className="panel mx-auto mt-10 max-w-md p-6 text-left">
                {[
                  { icon: BadgeCheck, label: "Order confirmed & keys escrowed", done: true },
                  { icon: Zap, label: "Agents provisioning in your environment", done: true },
                  { icon: ShieldCheck, label: "Baseline calibration begins (72h)", done: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3.5 py-2.5">
                    <span
                      className={cx(
                        "grid size-8 place-items-center rounded-full border",
                        s.done ? "border-pulse/40 bg-pulse/10 text-pulse" : "border-white/15 text-faint"
                      )}
                    >
                      <s.icon className="size-4" />
                    </span>
                    <p className={cx("text-[13.5px]", s.done ? "text-mist" : "text-faint")}>{s.label}</p>
                    {!s.done && (
                      <span className="ml-auto font-mono text-[9px] tracking-[0.16em] text-faint uppercase">
                        queued
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/shop" className="btn-primary">
                  Deploy another agent <ArrowRight className="size-4" />
                </Link>
                <Link href="/" className="btn-ghost">
                  <ArrowLeft className="size-4" /> Back to base
                </Link>
              </div>
            </motion.div>
          )}

          {/* ============ STEPS 1–2 ============ */}
          {step !== 3 && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: step === 2 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_380px]"
            >
              {/* left column */}
              <div className="panel p-6 sm:p-8">
                {step === 1 && (
                  <div>
                    <p className="font-display text-xl font-bold">Operator details</p>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="field-label" htmlFor="co-email">Work email</label>
                        <input
                          id="co-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => setTouched(true)}
                          placeholder="operator@yourcompany.com"
                          className="input-dark"
                        />
                        {touched && !emailOk && email.length > 0 && (
                          <p className="mt-1.5 text-[12px] text-red-400">Enter a valid email address.</p>
                        )}
                      </div>
                      <div>
                        <label className="field-label" htmlFor="co-name">Full name</label>
                        <input
                          id="co-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Dana Whisper"
                          className="input-dark"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="co-company">Company (optional)</label>
                        <input
                          id="co-company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Acme Industries"
                          className="input-dark"
                        />
                      </div>
                    </div>

                    <div className="mt-8 border-t border-white/8 pt-7">
                      <p className="flex items-center gap-2 font-display text-xl font-bold">
                        Payment method
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        {(
                          [
                            { key: "card", label: "Card", hint: "Visa · MC · Amex", icon: CreditCard },
                            { key: "bank", label: "Bank account", hint: "ACH direct debit", icon: Landmark },
                          ] as const
                        ).map((m) => (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => setMethod(m.key)}
                            className={cx(
                              "relative rounded-2xl border p-4 text-left transition-all duration-300",
                              method === m.key
                                ? "border-pulse/60 bg-pulse/8 shadow-[0_8px_32px_-12px_rgba(92,240,200,0.35)]"
                                : "border-white/10 bg-panel hover:border-white/25"
                            )}
                          >
                            {method === m.key && (
                              <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-pulse text-void">
                                <BadgeCheck className="size-3" />
                              </span>
                            )}
                            <m.icon
                              className={cx(
                                "size-5",
                                method === m.key ? "text-pulse" : "text-dim"
                              )}
                            />
                            <p className="mt-2 text-sm font-semibold">{m.label}</p>
                            <p className="font-mono text-[9.5px] tracking-[0.14em] text-faint uppercase">
                              {m.hint}
                            </p>
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {method === "card" ? (
                          <motion.div
                            key="card-fields"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="mt-5 grid gap-5 sm:grid-cols-2"
                          >
                            <div className="sm:col-span-2">
                              <label className="field-label" htmlFor="co-card">Card number</label>
                              <input
                                id="co-card"
                                inputMode="numeric"
                                value={card}
                                onChange={(e) => setCard(formatCard(e.target.value))}
                                placeholder="4242 4242 4242 4242"
                                className="input-dark font-mono tracking-wider"
                              />
                            </div>
                            <div>
                              <label className="field-label" htmlFor="co-exp">Expiry</label>
                              <input
                                id="co-exp"
                                inputMode="numeric"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                placeholder="MM/YY"
                                className="input-dark font-mono"
                              />
                            </div>
                            <div>
                              <label className="field-label" htmlFor="co-cvc">CVC</label>
                              <input
                                id="co-cvc"
                                inputMode="numeric"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                placeholder="3–4 digits"
                                className="input-dark font-mono"
                              />
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="bank-fields"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="mt-5 grid gap-5 sm:grid-cols-2"
                          >
                            <div className="sm:col-span-2">
                              <label className="field-label" htmlFor="co-holder">Account holder name</label>
                              <input
                                id="co-holder"
                                value={holder}
                                onChange={(e) => setHolder(e.target.value)}
                                placeholder={name.trim() || "Name on the account"}
                                className="input-dark"
                              />
                            </div>
                            <div>
                              <label className="field-label" htmlFor="co-routing">Routing number</label>
                              <input
                                id="co-routing"
                                inputMode="numeric"
                                value={routing}
                                onChange={(e) =>
                                  setRouting(e.target.value.replace(/\D/g, "").slice(0, 9))
                                }
                                placeholder="9-digit ABA routing"
                                className="input-dark font-mono tracking-wider"
                              />
                              {touched && routing.length > 0 && !routingOk && (
                                <p className="mt-1.5 text-[12px] text-red-400">
                                  US routing numbers are exactly 9 digits.
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="field-label" htmlFor="co-account">Account number</label>
                              <input
                                id="co-account"
                                inputMode="numeric"
                                value={account}
                                onChange={(e) =>
                                  setAccount(e.target.value.replace(/\D/g, "").slice(0, 17))
                                }
                                placeholder="4–17 digits"
                                className="input-dark font-mono tracking-wider"
                              />
                              {touched && account.length > 0 && !accountOk && (
                                <p className="mt-1.5 text-[12px] text-red-400">
                                  Enter 4–17 digits.
                                </p>
                              )}
                            </div>
                            <div className="sm:col-span-2">
                              <span className="field-label">Account type</span>
                              <div className="flex gap-2">
                                {(["checking", "savings"] as const).map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setAcctType(t)}
                                    className={cx(
                                      "flex-1 rounded-xl border px-3 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
                                      acctType === t
                                        ? "border-pulse/50 bg-pulse/10 text-pulse"
                                        : "border-white/10 text-dim hover:border-white/25"
                                    )}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-dim sm:col-span-2">
                              By continuing, you authorize CyberVault AI to debit this account for
                              your subscription. ACH debits typically settle within 2–3 business
                              days — your agents provision immediately.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <p className="mt-4 flex items-start gap-2 font-mono text-[10px] leading-relaxed tracking-wide text-faint uppercase">
                        <Lock className="mt-0.5 size-3 shrink-0 text-pulse" />
                        Demo storefront — {method === "bank" ? "bank" : "card"} details are
                        validated locally and never leave your browser. Only the last 4 digits are
                        recorded with your order.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setTouched(true);
                        if (detailsOk) {
                          setStep(2);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={cx("btn-primary mt-8 w-full sm:w-auto", !detailsOk && "opacity-50")}
                    >
                      Continue to review <ArrowRight className="size-4" />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <p className="font-display text-xl font-bold">Final review</p>
                    <div className="mt-6 space-y-3">
                      <div className="rounded-xl border border-white/10 bg-abyss/60 p-4">
                        <p className="field-label mb-1.5">Deploying to</p>
                        <p className="text-sm font-semibold">{name}</p>
                        <p className="font-mono text-[11px] text-dim">
                          {email}
                          {company.trim() ? ` · ${company}` : ""}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-abyss/60 p-4">
                        <p className="field-label mb-1.5">Payment</p>
                        {method === "bank" ? (
                          <p className="flex items-center gap-2 text-sm font-semibold">
                            <Landmark className="size-4 text-pulse" />
                            Bank {acctType} account ending in{" "}
                            <span className="font-mono">{account.slice(-4)}</span>
                          </p>
                        ) : (
                          <p className="flex items-center gap-2 text-sm font-semibold">
                            <CreditCard className="size-4 text-pulse" />
                            Card ending in{" "}
                            <span className="font-mono">{card.replace(/\s/g, "").slice(-4)}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="mt-6 text-[13px] leading-relaxed text-dim">
                      By confirming, you authorize recurring billing at{" "}
                      <span className="font-semibold text-mist">{fmtMoney(subtotal)}/mo</span> fleet
                      rate until cancelled. Annual licenses bill 12 months upfront. Cancel anytime
                      from the ops console — agents stand down gracefully and hand back every key.
                    </p>
                    {error && <p className="mt-4 text-[13px] text-red-400">{error}</p>}
                    <div className="mt-8 space-y-3">
                      <button
                        onClick={payWithStripe}
                        disabled={stripePending || pending}
                        className={cx("btn-primary w-full sm:w-auto", (stripePending || pending) && "btn-disabled")}
                      >
                        {stripePending ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Redirecting to Stripe…
                          </>
                        ) : (
                          <>
                            Pay {fmtMoney(dueToday)} securely via Stripe <ArrowRight className="size-4" />
                          </>
                        )}
                      </button>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={confirmOrder}
                          disabled={pending || stripePending}
                          className={cx("btn-ghost", (pending || stripePending) && "btn-disabled")}
                        >
                          {pending ? (
                            <>
                              <Loader2 className="size-4 animate-spin" /> Simulating…
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="size-4 text-pulse" /> Simulate order (demo — no charge)
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setStep(1)}
                          className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase hover:text-dim"
                        >
                          → Edit details
                        </button>
                      </div>
                      <p className="flex items-start gap-2 font-mono text-[10px] leading-relaxed tracking-wide text-faint uppercase">
                        <Lock className="mt-0.5 size-3 shrink-0 text-pulse" />
                        Stripe handles cards, ACH bank debit &amp; wallets on its hosted page —
                        your details never touch this store.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* right column — summary */}
              <aside className="panel sticky top-48 p-6">
                <p className="kicker text-faint">Deployment manifest</p>
                <ul className="mt-5 space-y-4">
                  {items.map((i) => {
                    const m = i.billing === "annual" ? annualMonthlyCents(i.priceCents) : i.priceCents;
                    return (
                      <li key={`${i.slug}-${i.billing}`} className="flex gap-3">
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-white/10">
                          <Image src={i.image} alt={i.name} fill sizes="48px" className="object-cover" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-semibold">{i.name}</p>
                          <p className="font-mono text-[10px] text-faint uppercase">
                            {i.billing} · ×{i.qty}
                          </p>
                        </div>
                        <p className="font-mono text-[12.5px] font-semibold">
                          {fmtMoney(m * i.qty)}
                          <span className="text-faint">/mo</span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 space-y-2.5 border-t border-white/8 pt-5">
                  <div className="flex justify-between text-[13px] text-dim">
                    <span>Fleet subtotal</span>
                    <span className="font-mono">{fmtMoney(subtotal)}/mo</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-[13px] text-pulse">
                      <span>Annual discount</span>
                      <span className="font-mono">−{fmtMoney(savings)}/mo</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between border-t border-white/8 pt-3.5">
                    <span className="text-sm font-semibold">Due today</span>
                    <span className="font-display text-2xl font-bold">{fmtMoney(dueToday)}</span>
                  </div>
                  <p className="text-right font-mono text-[10px] text-faint">
                    then {fmtMoney(subtotal)}/mo across the fleet
                  </p>
                </div>
                <p className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[9.5px] tracking-[0.16em] text-faint uppercase">
                  <ShieldCheck className="size-3" /> 30-day money-back guarantee
                </p>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
