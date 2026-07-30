import type { Metadata } from "next";
import { getStripe } from "@/lib/stripe";
import { ensureOrderForSession } from "@/lib/orders";
import { SuccessClient, type SuccessData } from "./success-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your CyberVault AI agents are provisioning.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const stripe = getStripe();

  let data: SuccessData = { state: "missing" };
  if (!session_id) {
    data = { state: "missing" };
  } else if (!stripe) {
    data = { state: "unconfigured" };
  } else {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        const orderNo = await ensureOrderForSession(session);
        data = {
          state: "paid",
          orderNo: orderNo ?? session.metadata?.orderNo ?? "CV-PENDING",
          email: session.customer_details?.email ?? session.metadata?.email ?? null,
          amountCents: session.amount_total ?? null,
        };
      } else {
        data = { state: "unpaid" };
      }
    } catch (err) {
      console.error("Failed to verify Stripe session:", err);
      data = { state: "missing" };
    }
  }

  return <SuccessClient data={data} />;
}
