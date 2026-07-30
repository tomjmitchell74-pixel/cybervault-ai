"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Radio } from "lucide-react";

const parent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const child = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

const STATS = [
  { value: "4,900+", label: "Agents deployed" },
  { value: "99.99%", label: "Fleet uptime" },
  { value: "41s", label: "Median triage time" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* backdrop */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="A CyberVault AI autonomous guardian entity rising over a circuit sea"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/75 to-void/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/60" />
        <div className="bg-blueprint absolute inset-0 opacity-50" />
      </div>

      {/* floating HUD chips */}
      <div className="absolute top-[24%] right-[7%] hidden animate-float lg:block">
        <div className="glass hairline flex items-center gap-2.5 rounded-full px-4 py-2.5">
          <CheckCircle2 className="size-4 text-pulse" />
          <span className="font-mono text-[10px] tracking-[0.18em] text-mist uppercase">
            Threat contained · 41s
          </span>
        </div>
      </div>
      <div className="absolute right-[16%] bottom-[30%] hidden animate-float-slow lg:block">
        <div className="glass hairline flex items-center gap-2.5 rounded-full px-4 py-2.5">
          <span className="size-1.5 rounded-full bg-pulse animate-pulse-dot" />
          <span className="font-mono text-[10px] tracking-[0.18em] text-mist uppercase">
            Sentinel Prime · online
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-36 pb-24 sm:px-6">
        <motion.div variants={parent} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={child}>
            <span className="inline-flex items-center gap-2 rounded-full border border-pulse/30 bg-pulse/8 px-4 py-1.5">
              <Radio className="size-3.5 text-pulse" />
              <span className="font-mono text-[10px] tracking-[0.24em] text-pulse uppercase">
                The agent vault is open — v4 Helix live
              </span>
            </span>
          </motion.div>

          <motion.h1
            variants={child}
            className="display-xl mt-7 text-[clamp(3.2rem,9vw,7.5rem)] font-bold"
          >
            HIRE THE
            <br />
            <span className="text-gradient-pulse">MACHINES</span>
            <br />
            THAT{" "}
            <em className="font-accent font-normal text-mist/95 italic">guard.</em>
          </motion.h1>

          <motion.p
            variants={child}
            className="mt-7 max-w-xl text-[16px] leading-relaxed text-dim sm:text-lg"
          >
            CyberVault AI is the open marketplace for autonomous security agents — vetted,
            battle-tested, and provisioned in minutes. From SOC triage to dark-web intelligence,
            pick your operators and put your defense on autopilot.
          </motion.p>

          <motion.div variants={child} className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/shop" className="btn-primary text-[15px]">
              Browse the arsenal <ArrowRight className="size-4" />
            </Link>
            <Link href="/#collections" className="btn-ghost text-[15px]">
              Explore collections
            </Link>
          </motion.div>

          <motion.div
            variants={child}
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold tracking-tight text-pulse sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 font-mono text-[9.5px] tracking-[0.18em] text-faint uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.3em] text-faint uppercase">Scroll</span>
          <div className="relative h-10 w-px overflow-hidden bg-white/10">
            <div className="absolute inset-x-0 h-3 animate-scan-line bg-pulse" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
