"use server";

import { revalidatePath } from "next/cache";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orders, products, reviews } from "@/db/schema";
import { annualMonthlyCents } from "@/lib/format";
import { makeOrderNo } from "@/lib/orders";

const reviewInput = z.object({
  slug: z.string().min(1).max(64),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(4000),
  author: z.string().min(2).max(120),
  role: z.string().max(160).optional(),
});

export async function submitReview(
  input: z.infer<typeof reviewInput>
): Promise<{ ok: boolean; error?: string }> {
  const parsed = reviewInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please complete every field — rating, title, name and a few sentences of report." };
  }
  const data = parsed.data;
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, data.slug))
    .limit(1);
  if (!product) return { ok: false, error: "Unknown agent." };

  await db.insert(reviews).values({
    productId: product.id,
    author: data.author.trim(),
    role: data.role?.trim() || "Verified Deployer",
    avatarHue: Math.floor(Math.random() * 360),
    rating: data.rating,
    title: data.title.trim(),
    body: data.body.trim(),
    verified: false,
  });
  revalidatePath(`/product/${data.slug}`);
  return { ok: true };
}

const orderInput = z.object({
  customer: z.object({
    email: z.string().email(),
    name: z.string().min(2).max(160),
    company: z.string().trim().max(200).optional(),
  }),
    items: z
    .array(
      z.object({
        slug: z.string().min(1).max(64),
        qty: z.number().int().min(1).max(50),
        billing: z.enum(["monthly", "annual"]),
      })
    )
    .min(1)
    .max(50),
  payment: z.object({
    kind: z.enum(["card", "bank"]),
    last4: z.string().regex(/^\d{4}$/),
  }),
});

export async function placeOrder(
  input: z.infer<typeof orderInput>
): Promise<{ ok: boolean; orderNo?: string; totalMonthlyCents?: number; error?: string }> {
  const parsed = orderInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check your email, name and cart contents." };
  }
  const { customer, items, payment } = parsed.data;

  const slugs = items.map((i) => i.slug);
  const rows = await db.select().from(products).where(inArray(products.slug, slugs));
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  if (bySlug.size !== slugs.length) {
    return { ok: false, error: "One or more agents are no longer available." };
  }

  // Prices are recomputed server-side from the database — never trust the client.
  const lineItems = items.map((i) => {
    const p = bySlug.get(i.slug)!;
    const unitMonthly = i.billing === "annual" ? annualMonthlyCents(p.priceCents) : p.priceCents;
    return {
      slug: p.slug,
      name: p.name,
      qty: i.qty,
      billing: i.billing,
      priceCents: unitMonthly,
      image: p.image,
    };
  });
  const totalMonthlyCents = lineItems.reduce((acc, i) => acc + i.priceCents * i.qty, 0);

  const orderNo = makeOrderNo();
  await db.insert(orders).values({
    orderNo,
    email: customer.email.toLowerCase(),
    fullName: customer.name.trim(),
    company: customer.company?.trim() || null,
    paymentMethod:
      payment.kind === "bank" ? `Bank account •• ${payment.last4}` : `Card •• ${payment.last4}`,
    totalMonthlyCents,
    items: lineItems,
    status: "confirmed",
  });

  return { ok: true, orderNo, totalMonthlyCents };
}
