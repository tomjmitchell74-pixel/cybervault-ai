import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, CircleCheck } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getReviewsForProduct } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { Stars } from "@/components/stars";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "./product-gallery";
import { PurchasePanel } from "./purchase-panel";
import { ReviewsSection } from "./reviews-section";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Agent not found" };
  return {
    title: `${product.name} — ${product.category}`,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(slug, 4),
  ]);

  const paragraphs = product.description.split("\n\n");

  return (
    <div className="relative min-h-screen">
      <div className="bg-blueprint pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 pt-36 pb-24 sm:px-6">
        {/* breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] tracking-[0.14em] text-faint uppercase">
          <Link href="/" className="hover:text-pulse">Store</Link>
          <ChevronRight className="size-3" />
          <Link href="/shop" className="hover:text-pulse">Catalog</Link>
          <ChevronRight className="size-3" />
          <span>{product.category}</span>
          <ChevronRight className="size-3" />
          <span className="text-pulse">{product.codename}</span>
        </nav>

        {/* main grid */}
        <div className="mt-8 grid gap-12 lg:mt-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <ProductGallery product={product} />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="kicker text-pulse">
              {product.codename} · {product.category}
            </p>
            <h1 className="display-xl mt-3 text-5xl font-bold sm:text-6xl">{product.name}</h1>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-dim sm:text-lg">
              {product.tagline}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Stars value={product.rating} size={15} />
              <span className="font-mono text-[11.5px] text-dim">
                {product.rating.toFixed(1)} — {product.reviewCount} field reports
              </span>
              <a href="#reviews" className="font-mono text-[11px] text-pulse underline-offset-4 hover:underline">
                Read them
              </a>
            </div>
            <PurchasePanel product={product} />
          </Reveal>
        </div>

        {/* overview + capabilities */}
        <section className="mt-24 grid gap-12 border-t border-white/8 pt-16 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="kicker text-pulse">Mission profile</p>
            <h2 className="display-xl mt-3 text-3xl font-bold sm:text-4xl">
              What {product.name} <em className="font-accent font-normal italic">actually does</em>
            </h2>
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-dim">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="panel h-full p-7">
              <p className="kicker text-faint">Core capabilities</p>
              <ul className="mt-6 space-y-4">
                {product.features.map((f, i) => (
                  <li key={i} className="flex gap-3.5">
                    <CircleCheck className="mt-0.5 size-4.5 shrink-0 text-pulse" />
                    <span className="text-[14.5px] leading-relaxed text-mist/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* reviews */}
        <section id="reviews" className="mt-24 scroll-mt-32 border-t border-white/8 pt-16">
          <Reveal>
            <p className="kicker text-pulse">Field reports</p>
            <h2 className="display-xl mt-3 mb-12 text-3xl font-bold sm:text-4xl">
              Operators on <em className="font-accent font-normal italic">the record</em>
            </h2>
          </Reveal>
          <ReviewsSection productSlug={product.slug} reviews={reviews} />
        </section>

        {/* related */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-white/8 pt-16">
            <Reveal>
              <p className="kicker text-pulse">Squad mates</p>
              <h2 className="display-xl mt-3 text-3xl font-bold sm:text-4xl">
                Pairs well <em className="font-accent font-normal italic">with</em>
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.06} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
