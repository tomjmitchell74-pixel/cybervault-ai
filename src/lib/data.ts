import "server-only";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { collections, productCollections, products, reviews } from "@/db/schema";

export type ProductView = {
  id: number;
  slug: string;
  codename: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  badge: string | null;
  priceCents: number;
  image: string;
  hue: number;
  features: string[];
  capabilities: {
    speed: number;
    precision: number;
    stealth: number;
    autonomy: number;
    uptime: number;
    learning: number;
  };
  specs: { label: string; value: string }[];
  rating: number;
  reviewCount: number;
  collectionSlugs: string[];
  collectionNames: string[];
};

export type CollectionView = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  hue: number;
  memberCount: number;
  memberSlugs: string[];
};

export type ReviewView = {
  id: number;
  author: string;
  role: string;
  avatarHue: number;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

export { CATEGORIES } from "@/lib/taxonomy";

export async function getProducts(): Promise<ProductView[]> {
  const rows = await db.select().from(products).orderBy(asc(products.seedOrder));

  const agg = await db
    .select({
      productId: reviews.productId,
      cnt: sql<number>`count(*)::int`,
      avgRating: sql<number>`coalesce(avg(${reviews.rating}), 0)::float`,
    })
    .from(reviews)
    .groupBy(reviews.productId);
  const aggMap = new Map(agg.map((a) => [a.productId, a]));

  const colRows = await db
    .select({
      productId: productCollections.productId,
      slug: collections.slug,
      name: collections.name,
    })
    .from(productCollections)
    .innerJoin(collections, eq(collections.id, productCollections.collectionId));
  const colMap = new Map<number, { slug: string; name: string }[]>();
  for (const r of colRows) {
    const list = colMap.get(r.productId) ?? [];
    list.push({ slug: r.slug, name: r.name });
    colMap.set(r.productId, list);
  }

  return rows.map((p) => {
    const a = aggMap.get(p.id);
    const cols = colMap.get(p.id) ?? [];
    return {
      id: p.id,
      slug: p.slug,
      codename: p.codename,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      badge: p.badge,
      priceCents: p.priceCents,
      image: p.image,
      hue: p.hue,
      features: p.features,
      capabilities: p.capabilities,
      specs: p.specs,
      rating: a ? Math.round(a.avgRating * 10) / 10 : 0,
      reviewCount: a?.cnt ?? 0,
      collectionSlugs: cols.map((c) => c.slug),
      collectionNames: cols.map((c) => c.name),
    };
  });
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getCollections(): Promise<CollectionView[]> {
  const rows = await db.select().from(collections).orderBy(asc(collections.id));
  const memberRows = await db
    .select({
      collectionId: productCollections.collectionId,
      slug: products.slug,
    })
    .from(productCollections)
    .innerJoin(products, eq(products.id, productCollections.productId));
  const memberMap = new Map<number, string[]>();
  for (const m of memberRows) {
    const list = memberMap.get(m.collectionId) ?? [];
    list.push(m.slug);
    memberMap.set(m.collectionId, list);
  }
  return rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    image: c.image,
    hue: c.hue,
    memberCount: memberMap.get(c.id)?.length ?? 0,
    memberSlugs: memberMap.get(c.id) ?? [],
  }));
}

export async function getReviewsForProduct(productId: number): Promise<ReviewView[]> {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
  return rows.map((r) => ({
    id: r.id,
    author: r.author,
    role: r.role,
    avatarHue: r.avatarHue,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verified: r.verified,
    createdAt: r.createdAt.toISOString(),
  }));
}

/** Top 5-star pull-quotes for the home page testimonial wall. */
export async function getFeaturedReviews(limit = 4): Promise<(ReviewView & { productSlug: string; productName: string })[]> {
  const rows = await db
    .select({
      id: reviews.id,
      author: reviews.author,
      role: reviews.role,
      avatarHue: reviews.avatarHue,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      verified: reviews.verified,
      createdAt: reviews.createdAt,
      productSlug: products.slug,
      productName: products.name,
    })
    .from(reviews)
    .innerJoin(products, eq(products.id, reviews.productId))
    .where(eq(reviews.rating, 5))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<ProductView[]> {
  const all = await getProducts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  const pool = all.filter((p) => p.slug !== slug);
  pool.sort((a, b) => {
    const aShared = a.collectionSlugs.some((c) => current.collectionSlugs.includes(c)) ? 1 : 0;
    const bShared = b.collectionSlugs.some((c) => current.collectionSlugs.includes(c)) ? 1 : 0;
    if (aShared !== bShared) return bShared - aShared;
    return (a.category === current.category ? 0 : 1) - (b.category === current.category ? 0 : 1);
  });
  return pool.slice(0, limit);
}
