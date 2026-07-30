import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter";

const COLS = [
  {
    title: "Catalog",
    links: [
      { label: "All agents", href: "/shop" },
      { label: "Sentinel Prime", href: "/product/sentinel-prime" },
      { label: "Cipher Intelligence", href: "/product/cipher-intelligence" },
      { label: "Nexus Swarm", href: "/product/nexus-swarm" },
      { label: "Collections", href: "/#collections" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why CyberVault", href: "/#why" },
      { label: "Field reports", href: "/#reviews" },
      { label: "Agent protocol v2", href: "/#" },
      { label: "Trust center", href: "/#" },
      { label: "Careers", href: "/#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Deployment docs", href: "/#" },
      { label: "Status", href: "/#" },
      { label: "Security.txt", href: "/#" },
      { label: "Contact ops", href: "/#" },
      { label: "Responsible disclosure", href: "/#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-abyss">
      <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="grid gap-12 pb-16 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-pulse text-void">
                <ShieldCheck className="size-5" strokeWidth={2.4} />
              </span>
              <span className="font-display text-[15px] font-bold tracking-tight">
                CYBERVAULT <span className="text-pulse">AI</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-dim">
              The open marketplace for autonomous security agents. Built by operators, for
              operators — deployed in 140 countries, trusted under real fire.
            </p>
            <NewsletterForm />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLS.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[10px] tracking-[0.24em] text-faint uppercase">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-dim transition-colors hover:text-pulse"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-6 sm:flex-row">
          <p className="font-mono text-[10px] tracking-[0.18em] text-faint uppercase">
            © 2026 CyberVault AI · All transmissions encrypted
          </p>
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-faint uppercase">
            <span className="size-1.5 rounded-full bg-pulse animate-pulse-dot" />
            All systems operational
          </p>
        </div>

        <div
          aria-hidden
          className="display-xl pointer-events-none -mb-10 bg-linear-to-b from-white/6 to-transparent bg-clip-text text-center text-[13vw] leading-none font-bold text-transparent select-none sm:text-[10vw]"
        >
          CYBERVAULT
        </div>
      </div>
    </footer>
  );
}
