import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { ensureOrderForSession } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ received: true, note: "stripe not configured" });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      await ensureOrderForSession(event.data.object);
    } catch (err) {
      console.error("Failed to record order from webhook:", err);
      return NextResponse.json({ error: "Order recording failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
