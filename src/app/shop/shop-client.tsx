"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, Check, ListFilter, Search, ShieldOff, X } from "lucide-react";
import type { CollectionView, ProductView } from "@/lib/data";
import { CATEGORIES } from "@/lib/taxonomy";
import { cx, fmtMoney } from "@/lib/format";
import { ProductCard } from "@/components/product-card";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "name";
type PriceBucket = "all" | "budget" | "mid" | "pro";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low → high" },
  { key: "price-desc", label: "Price: high → low" },
  { key: "rating", label: "Highest rated" },
  { key: "name", label: "Name A–Z" },
];

const PRICE_BUCKETS: { key: PriceBucket; label: string; test: (c: number) => boolean }[] = [
  { key: "all", label: "Any price", test: () => true },
  { key: "budget", label: "Under $150/mo", test: (c) => c < 15000 },
  { key: "mid", label: "$150 – $250/mo", test: (c) => c >= 15000 && c <= 25000 },
  { key: "pro", label: "Over $250/mo", test: (c) => c > 25000 },
];

const RATING_FILTERS = [
  { value: 0, label: "Any rating" },
  { value: 4.5, label: "4.5 & up" },
  { value: 4.8, label: "4.8 & up" },
];

export function ShopClient({
  products,
  collections,
}: {
  products: ProductView[];
  collections: CollectionView[];
}) {
  const params = useSearchParams();
  const initialCollection = params.get("collection");

  const [search, setSearch] = useState("");
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [collection, setCollection] = useState<string>(initialCollection ?? "all");
  const [priceBucket, setPriceBucket] = useState<PriceBucket>("all");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setCollection(initialCollection ?? "all");
  }, [initialCollection]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const bucket = PRICE_BUCKETS.find((b) => b.key === priceBucket)!;
    let list = products.filter((p) => {
      if (q && !`${p.name} ${p.tagline} ${p.category} ${p.codename}`.toLowerCase().includes(q))
        return false;
      if (activeCats.length > 0 && !activeCats.includes(p.category)) return false;
      if (collection !== "all" && !p.collectionSlugs.includes(collection)) return false;
      if (!bucket.test(p.priceCents)) return false;
      if (p.rating < minRating) return false;
      return true;
    });
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [products, search, activeCats, collection, priceBucket, minRating, sort]);

  const activeFilterCount =
    activeCats.length +
    (collection !== "all" ? 1 : 0) +
    (priceBucket !== "all" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    setActiveCats([]);
    setCollection("all");
    setPriceBucket("all");
    setMinRating(0);
  };

  const avgRating = products.length
    ? products.reduce((a, p) => a + p.rating, 0) / products.length
    : 0;
  const totalReviews = products.reduce((a, p) => a + p.reviewCount, 0);

  const filtersPanel = (
    <div className="space-y-7">
      <div>
        <p className="field-label">Search</p>
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, capability, codename…"
            className="input-dark pl-10 text-[13px]"
          />
        </div>
      </div>

      <div>
        <p className="field-label">Collection</p>
        <div className="space-y-1">
          {[{ slug: "all", name: "All collections" }, ...collections].map((c) => (
            <button
              key={c.slug}
              onClick={() => setCollection(c.slug)}
              className={cx(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition-colors",
                collection === c.slug
                  ? "bg-pulse/10 font-semibold text-pulse"
                  : "text-dim hover:bg-white/5 hover:text-mist"
              )}
            >
              {c.name}
              {collection === c.slug && <Check className="size-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="field-label">Discipline</p>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const active = activeCats.includes(cat);
            const count = products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() =>
                  setActiveCats((prev) =>
                    active ? prev.filter((c) => c !== cat) : [...prev, cat]
                  )
                }
                className="flex w-full items-center gap-3 text-left"
              >
                <span
                  className={cx(
                    "grid size-4.5 shrink-0 place-items-center rounded border transition-all",
                    active ? "border-pulse bg-pulse text-void" : "border-white/20 text-transparent"
                  )}
                >
                  <Check className="size-3" strokeWidth={3.5} />
                </span>
                <span className={cx("flex-1 text-[13px]", active ? "text-mist" : "text-dim")}>
                  {cat}
                </span>
                <span className="font-mono text-[10px] text-faint">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="field-label">Budget</p>
        <div className="space-y-1">
          {PRICE_BUCKETS.map((b) => (
            <button
              key={b.key}
              onClick={() => setPriceBucket(b.key)}
              className={cx(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-colors",
                priceBucket === b.key
                  ? "bg-pulse/10 font-semibold text-pulse"
                  : "text-dim hover:bg-white/5 hover:text-mist"
              )}
            >
              {b.label}
              <span
                className={cx(
                  "size-2 rounded-full border",
                  priceBucket === b.key ? "border-pulse bg-pulse" : "border-white/25"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="field-label">Minimum rating</p>
        <div className="flex gap-2">
          {RATING_FILTERS.map((r) => (
            <button
              key={r.value}
              onClick={() => setMinRating(r.value)}
              className={cx(
                "flex-1 rounded-lg border px-2 py-2 font-mono text-[11px] transition-colors",
                minRating === r.value
                  ? "border-pulse/50 bg-pulse/10 text-pulse"
                  : "border-white/10 text-dim hover:border-white/25"
              )}
            >
              {r.label.replace(" & up", "+")}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 font-mono text-[11px] tracking-[0.16em] text-dim uppercase transition-colors hover:border-red-400/40 hover:text-red-300"
        >
          <X className="size-3.5" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-blueprint min-h-screen">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-void to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 pt-40 pb-24 sm:px-6">
        {/* header */}
        <div className="max-w-2xl">
          <p className="kicker text-pulse">CyberVault AI / Catalog</p>
          <h1 className="display-xl mt-3 text-5xl font-bold sm:text-6xl">
            THE <em className="font-accent font-normal italic">arsenal</em>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-dim">
            {products.length} autonomous agents · fleet average {avgRating.toFixed(1)}★ ·{" "}
            {totalReviews} verified field reports · every plan starts with a 30-day money-back
            guarantee.
          </p>
        </div>

        {/* toolbar */}
        <div className="sticky top-[104px] z-30 mt-10 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-void/80 px-4 py-3 backdrop-blur-xl">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold transition-colors hover:border-pulse/40 lg:hidden"
          >
            <ListFilter className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="grid size-4.5 place-items-center rounded-full bg-pulse font-mono text-[9px] font-bold text-void">
                {activeFilterCount}
              </span>
            )}
          </button>
          <p className="hidden font-mono text-[11px] tracking-[0.18em] text-faint uppercase lg:block">
            Showing <span className="text-pulse">{filtered.length}</span> of {products.length}{" "}
            agents
          </p>
          <div className="flex items-center gap-2">
            <ArrowDownUp className="size-3.5 text-faint" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="cursor-pointer rounded-lg border border-white/12 bg-panel px-3 py-2 text-[12.5px] font-medium text-mist transition-colors hover:border-white/25"
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* mobile filter drawer */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-panel p-5 lg:hidden"
            >
              {filtersPanel}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-48 rounded-2xl border border-white/10 bg-panel/70 p-5">
              {filtersPanel}
            </div>
          </aside>

          {/* grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="panel flex flex-col items-center justify-center px-6 py-24 text-center">
                <ShieldOff className="size-10 text-faint" />
                <p className="mt-5 font-display text-xl font-bold">No agents match that brief</p>
                <p className="mt-2 max-w-sm text-sm text-dim">
                  Loosen the filters or clear the search — the right operative is in here
                  somewhere.
                </p>
                <button onClick={clearAll} className="btn-primary mt-6 px-5 py-2.5 text-[13px]">
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((p) => (
                    <motion.div
                      key={p.slug}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            <p className="mt-10 border-t border-white/8 pt-6 text-center font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
              All plans billed in USD · {fmtMoney(900)}+ deployments this week · SOC 2 Type II
              audited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
