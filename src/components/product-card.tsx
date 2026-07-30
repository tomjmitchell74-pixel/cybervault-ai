"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { ProductView } from "@/lib/data";
import { annualMonthlyCents, fmtMoney } from "@/lib/format";
import { useCart } from "@/store/cart";
import { Stars } from "@/components/stars";

export function ProductCard({ product, priority = false }: { product: ProductView; priority?: boolean }) {
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const [added, setAdded] = useState(false);

  const quickAdd = () => {
    add({
      slug: product.slug,
      name: product.name,
      codename: product.codename,
      image: product.image,
      hue: product.hue,
      priceCents: product.priceCents,
      billing: "monthly",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
    setTimeout(() => openDrawer(), 420);
  };

  return (
    <article
      className="agent-card group panel relative flex h-full flex-col overflow-hidden"
      style={{ ["--card-glow" as string]: `hsla(${product.hue}, 85%, 62%, 0.22)` }}
    >
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          className="img-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 0%, hsla(${product.hue},85%,62%,0.18), transparent 65%)`,
          }}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-void/75 px-3 py-1 font-mono text-[9px] font-bold tracking-[0.18em] text-pulse uppercase backdrop-blur">
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 rounded-full bg-void/75 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] text-dim backdrop-blur">
          {product.codename}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[9.5px] tracking-[0.22em] text-faint uppercase">{product.category}</p>
        <Link href={`/product/${product.slug}`} className="mt-1.5">
          <h3 className="font-display text-lg leading-tight font-bold tracking-tight transition-colors group-hover:text-pulse">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-dim">{product.tagline}</p>

        <div className="mt-3 flex items-center gap-2">
          <Stars value={product.rating} />
          <span className="font-mono text-[10.5px] text-faint">
            {product.rating.toFixed(1)} · {product.reviewCount} reports
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-white/8 pt-4">
          <div>
            <p className="font-display">
              <span className="text-xl font-bold tracking-tight">{fmtMoney(product.priceCents)}</span>
              <span className="text-[12px] font-medium text-faint">/mo</span>
            </p>
            <p className="mt-0.5 font-mono text-[9.5px] tracking-wide text-faint">
              or {fmtMoney(annualMonthlyCents(product.priceCents))}/mo annual
            </p>
          </div>
          <button
            onClick={quickAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`grid size-10 cursor-pointer place-items-center rounded-full transition-all duration-300 ${
              added
                ? "scale-110 bg-pulse text-void"
                : "border border-white/15 text-mist hover:border-pulse hover:bg-pulse hover:text-void"
            }`}
          >
            {added ? <Check className="size-4" strokeWidth={3} /> : <Plus className="size-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}
