import "server-only";
import { eq, inArray } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { annualMonthlyCents } from "@/lib/format";

export type PlanItem = { slug: string; qty: number; billing: "monthly" | "annual" };

export function makeOrderNo(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(6));
  let suffix = "";
  for (const b of bytes) suffix += alphabet[b % alphabet.length];
  return `CV-${suffix}`;
}

/** Compact plan encoding that fits Stripe's 500-char metadata limit. */
export function planToCompact(items: PlanItem[]): string {
  return items
    .map((i) => `${i.slug}:${i.qty}:${i.billing === "annual" ? "a" : "m"}`)
    .join("|");
}

export function compactToPlan(compact: string | undefined): PlanItem[] {
  if (!compact) return [];
  return compact
    .split("|")
    .map((seg) => {
      const [slug, q, b] = seg.split(":");
      return { slug, qty: Number(q) || 0, billing: (b === "a" ? "annual" : "monthly") as PlanItem["billing"] };
    })
    .filter((i) => i.slug && i.qty > 0 && i.qty <= 50);
}

/** Always re-price from the database — never trust client-sent prices. */
export async function pricePlan(items: PlanItem[]) {
  const rows = await db
    .select()
    .from(products)
    .where(inArray(products.slug, items.map((i) => i.slug)));
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  if (bySlug.size !== items.length) return null;
  const lineItems = items.map((i) => {
    const p = bySlug.get(i.slug)!;
    const unitMonthly =
      i.billing === "annual" ? annualMonthlyCents(p.priceCents) : p.priceCents;
    return {
      slug: p.slug,
      name: p.name,
      qty: i.qty,
      billing: i.billing,
      priceCents: unitMonthly,
      image: p.image,
    };
  });
  const totalMonthlyCents = lineItems.reduce((a, i) => a + i.priceCents * i.qty, 0);
  return { bySlug, lineItems, totalMonthlyCents };
}

/**
 * Idempotently record a paid Stripe Checkout Session as an order.
 * Safe to call from both the webhook and the success page.
 */
export async function ensureOrderForSession(
  session: Stripe.Checkout.Session
): Promise<string | null> {
  const existing = await db
    .select({ orderNo: orders.orderNo })
    .from(orders)
    .where(eq(orders.stripeSessionId, session.id))
    .limit(1);
  if (existing.length > 0) return existing[0].orderNo;

  const md = session.metadata ?? {};
  const items = compactToPlan(md.plan);
  if (items.length === 0) return null;
  const priced = await pricePlan(items);
  if (!priced) return null;

  const orderNo = md.orderNo || makeOrderNo();
  try {
    await db.insert(orders).values({
      orderNo,
      email: (session.customer_details?.email || md.email || "customer@example.com").toLowerCase(),
      fullName: md.name || "Stripe Customer",
      company: md.company || null,
      paymentMethod: "Stripe Checkout",
      totalMonthlyCents: priced.totalMonthlyCents,
      items: priced.lineItems,
      stripeSessionId: session.id,
      status: "paid",
    });
    return orderNo;
  } catch {
    // Unique-violation race (webhook + success page together): read back the winner.
    const retry = await db
      .select({ orderNo: orders.orderNo })
      .from(orders)
      .where(eq(orders.stripeSessionId, session.id))
      .limit(1);
    return retry[0]?.orderNo ?? orderNo;
  }
}
