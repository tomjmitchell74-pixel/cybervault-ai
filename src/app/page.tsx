import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Headphones, KeyRound, ShieldCheck, Zap } from "lucide-react";
import { getCollections, getFeaturedReviews, getProducts } from "@/lib/data";
import { timeAgo } from "@/lib/format";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { ProductCard } from "@/components/product-card";
import { Reveal, SectionHeading } from "@/components/reveal";
import { Stars } from "@/components/stars";

export const dynamic = "force-dynamic";

const TRUST = ["NORTHWIND", "HELIX BIO", "VANTAGE MKTS", "COBALT XCHG", "ASTRAEA", "GATEWAY HEALTH"];

const WHY = [
  {
    icon: Zap,
    title: "Provisioned in minutes",
    copy: "Pick an agent, set your rules of engagement, and it is working your environment before the invoice prints. No consultants, no six-month rollouts.",
  },
  {
    icon: ShieldCheck,
    title: "Audited to the metal",
    copy: "Every agent ships with SOC 2 Type II, ISO 27001 and a published evaluation harness. Bit-exact mission replay means zero mystery in the machine.",
  },
  {
    icon: KeyRound,
    title: "Your keys never leave",
    copy: "Bring-your-own-vault credential custody, zero data-retention training, and air-gapped deployment options for the truly paranoid. We approve.",
  },
  {
    icon: Headphones,
    title: "Ops desk, 24/7",
    copy: "Real human operators on call around the clock — incident veterans, not scripts. Median response: four minutes, day or night.",
  },
];

export default async function Home() {
  const [products, collections, testi] = await Promise.all([
    getProducts(),
    getCollections(),
    getFeaturedReviews(4),
  ]);
  const featured = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);

  return (
    <>
      <Hero />
      <Marquee />

      {/* trust strip */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <Reveal>
          <p className="text-center font-mono text-[10px] tracking-[0.3em] text-faint uppercase">
            Trusted by operators at
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUST.map((t, i) => (
              <span
                key={t}
                className="font-display text-sm font-bold tracking-[0.22em] text-faint transition-colors hover:text-dim"
                style={{ opacity: 0.55 + (i % 3) * 0.15 }}
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* collections */}
      <section id="collections" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-24 sm:px-6 sm:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="Curated battalions"
            title={
              <>
                FEATURED <em className="font-accent font-normal italic">collections</em>
              </>
            }
          />
          <Reveal delay={0.15}>
            <Link href="/shop" className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-dim uppercase transition-colors hover:text-pulse">
              View all agents
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {collections.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08} className="h-full">
              <Link
                href={`/shop?collection=${c.slug}`}
                className="agent-card group relative block h-full overflow-hidden rounded-2xl border border-white/8"
                style={{ ["--card-glow" as string]: `hsla(${c.hue}, 85%, 62%, 0.25)` }}
              >
                <div className="relative aspect-[3/3.6]">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="img-zoom object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-mono text-[9.5px] tracking-[0.24em] text-pulse uppercase">
                      {c.memberCount} agents · Collection {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="display-xl mt-2 text-3xl font-bold">{c.name}</h3>
                    <p className="mt-2 text-sm text-dim">{c.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-pulse">
                      Deploy the suite
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* featured products */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32">
        <SectionHeading
          kicker="Field-proven"
          title={
            <>
              MOST-DEPLOYED <em className="font-accent font-normal italic">operatives</em>
            </>
          }
          copy="Eight autonomous agents, ranked by real deployments. Each one carries a 30-day money-back guarantee and a 41-second median triage pedigree."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 0.07} className="h-full">
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link href="/shop" className="btn-ghost">
            Open the full catalog <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>

      {/* why cybervault */}
      <section id="why" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-24 sm:px-6 sm:pt-32">
        <SectionHeading
          kicker="The doctrine"
          title={
            <>
              WHY TEAMS <em className="font-accent font-normal italic">trust us</em>
            </>
          }
          align="center"
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.08} className="h-full">
              <div className="agent-card panel group flex h-full flex-col p-6">
                <span className="grid size-11 place-items-center rounded-xl border border-pulse/25 bg-pulse/8 text-pulse transition-transform duration-300 group-hover:scale-110">
                  <w.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{w.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-dim">{w.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* field reports */}
      <section id="reviews" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-24 sm:px-6 sm:pt-32">
        <SectionHeading
          kicker="Transmissions from the field"
          title={
            <>
              OPERATORS <em className="font-accent font-normal italic">report back</em>
            </>
          }
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {testi.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.07} className="h-full">
              <figure className="panel flex h-full flex-col p-6">
                <Stars value={r.rating} />
                <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-dim">
                  “{r.body.length > 220 ? r.body.slice(0, 220).trimEnd() + "…" : r.body}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-white/8 pt-4">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full font-display text-xs font-bold text-void"
                    style={{ background: `hsl(${r.avatarHue}, 70%, 62%)` }}
                  >
                    {r.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{r.author}</p>
                    <p className="truncate font-mono text-[10px] text-faint">
                      {r.role} · {timeAgo(r.createdAt)}
                    </p>
                  </div>
                </figcaption>
                <Link
                  href={`/product/${r.productSlug}`}
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-pulse uppercase hover:underline"
                >
                  Reviewing: {r.productName} <ArrowUpRight className="size-3" />
                </Link>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-pulse/20 bg-abyss px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="bg-blueprint absolute inset-0" />
            <div className="absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-pulse/12 blur-[90px]" />
            <div className="absolute -right-24 -bottom-32 h-72 w-72 rounded-full bg-volt/14 blur-[90px]" />
            <div className="relative">
              <p className="kicker text-pulse">Ready when you are</p>
              <h2 className="display-xl mx-auto mt-4 max-w-3xl text-4xl font-bold sm:text-6xl">
                YOUR PERIMETER IS <em className="font-accent font-normal italic">calling.</em>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-dim">
                Spin up your first autonomous agent today. 30-day money-back guarantee, cancel
                anytime, and the machines never ask for a raise.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link href="/shop" className="btn-primary text-[15px]">
                  Deploy your first agent <ArrowRight className="size-4" />
                </Link>
                <Link href="/#reviews" className="btn-ghost text-[15px]">
                  Read field reports
                </Link>
              </div>
              <p className="mt-8 font-mono text-[10px] tracking-[0.22em] text-faint uppercase">
                No sales call required · Provisioned in ~7 minutes
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
