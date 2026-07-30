import { Suspense } from "react";
import type { Metadata } from "next";
import { getCollections, getProducts } from "@/lib/data";
import { ShopClient } from "./shop-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalog — All Agents",
  description:
    "The full CyberVault AI arsenal: autonomous SOC analysts, threat-intel hunters, adaptive firewalls and multi-agent orchestrators. Filter, compare, deploy.",
};

export default async function ShopPage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  return (
    <Suspense>
      <ShopClient products={products} collections={collections} />
    </Suspense>
  );
}
