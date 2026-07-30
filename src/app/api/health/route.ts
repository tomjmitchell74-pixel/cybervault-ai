import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    const stripeMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live")
      ? "live"
      : process.env.STRIPE_SECRET_KEY?.startsWith("sk_test")
        ? "test"
        : null;
    return Response.json({
      ok: true,
      db: "connected",
      stripe: stripeMode ?? "not_configured",
      webhook: process.env.STRIPE_WEBHOOK_SECRET ? "configured" : "not_configured",
    });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
