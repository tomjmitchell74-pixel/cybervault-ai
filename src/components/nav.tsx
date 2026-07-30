"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { cartCount, useCart } from "@/store/cart";
import { cx } from "@/lib/format";

const LINKS = [
  { href: "/shop", label: "Catalog" },
  { href: "/#collections", label: "Collections" },
  { href: "/#why", label: "Why CyberVault" },
  { href: "/#reviews", label: "Field Reports" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center rounded-xl bg-pulse text-void transition-transform duration-300 group-hover:rotate-6">
        <ShieldCheck className="size-5" strokeWidth={2.4} />
        <span className="absolute inset-0 rounded-xl bg-pulse opacity-40 blur-md transition-opacity group-hover:opacity-70" />
      </span>
      {!compact && (
        <span className="font-display text-[15px] font-bold tracking-tight">
          CYBERVAULT <span className="text-pulse">AI</span>
        </span>
      )}
    </Link>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const openDrawer = useCart((s) => s.openDrawer);
  const pathname = usePathname();
  const count = cartCount(items);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* announcement strip */}
      <div className="border-b border-white/5 bg-abyss/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5">
          <span className="size-1.5 rounded-full bg-pulse animate-pulse-dot" />
          <p className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
            Deployment credits live — 2 months free on every annual plan
          </p>
        </div>
      </div>

      {/* main bar */}
      <div
        className={cx(
          "transition-all duration-300",
          scrolled ? "border-b border-white/8 bg-void/85 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={cx(
                  "rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors duration-200",
                  pathname === l.href
                    ? "text-pulse"
                    : "text-dim hover:bg-white/5 hover:text-mist"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openDrawer}
              className="group relative flex items-center gap-2 rounded-full border border-white/12 bg-white/3 py-2 pr-4 pl-3 text-sm font-semibold transition-all duration-300 hover:border-pulse/40 hover:bg-white/6"
              aria-label="Open cart"
            >
              <ShoppingBag className="size-4 transition-transform duration-300 group-hover:-rotate-12" />
              <span className="hidden sm:inline">Arsenal</span>
              <AnimatePresence mode="popLayout">
                {mounted && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="grid min-w-5 place-items-center rounded-full bg-pulse px-1 font-mono text-[10px] font-bold text-void"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-white/12 text-mist lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-panel/95 p-2 backdrop-blur-xl lg:hidden"
          >
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3.5 font-display text-base font-semibold text-mist transition-colors hover:bg-white/5 hover:text-pulse"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/8 p-3">
              <p className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                4,900+ agents in the field
              </p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
