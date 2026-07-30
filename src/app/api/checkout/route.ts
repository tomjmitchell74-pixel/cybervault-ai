import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { makeOrderNo, planToCompact, pricePlan } from "@/lib/orders";
import { annualMonthlyCents, fmtMoney } from "@/lib/format";

export const runtime = "nodejs";

const inputSchema = z.object({
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
});

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Live payments aren't switched on yet — add STRIPE_SECRET_KEY to the environment. The demo checkout below still works.",
        code: "stripe_unconfigured",
      },
      { status: 503 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = inputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
  }
  const { customer, items } = parsed.data;

  const priced = await pricePlan(items);
  if (!priced) {
    return NextResponse.json({ error: "One or more agents are no longer available." }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? process.env.APP_URL ?? "http://localhost:3000";
  const orderNo = makeOrderNo();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Payment methods (card, ACH, wallets) are managed in your Stripe Dashboard
      // under Settings → Payment methods and are offered automatically.
      customer_email: customer.email,
      client_reference_id: orderNo,
      line_items: items.map((it) => {
        const p = priced.bySlug.get(it.slug)!;
        const monthly = it.billing === "annual" ? annualMonthlyCents(p.priceCents) : p.priceCents;
        const unitToday = monthly * (it.billing === "annual" ? 12 : 1);
        return {
          quantity: it.qty,
          price_data: {
            currency: "usd",
            unit_amount: unitToday,
            product_data: {
              name: `${p.name} — ${it.billing === "annual" ? "Annual" : "Monthly"} license`,
              description: `${p.tagline} Effective ${fmtMoney(monthly)}/mo — first ${
                it.billing === "annual" ? "year" : "month"
              } billed today.`,
              images: [`${origin}${p.image}`],
            },
          },
        };
      }),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        orderNo,
        email: customer.email,
        name: customer.name,
        company: customer.company ?? "",
        plan: planToCompact(items),
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return NextResponse.json(
      { error: "Stripe rejected the session. Check that your key is valid and your account is active." },
      { status: 502 }
    );
  }
}
