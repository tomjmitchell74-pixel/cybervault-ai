import type { Metadata } from "next";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout — Secure Deployment",
  description: "Confirm your agent deployment. Encrypted end-to-end, provisioned in minutes.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
