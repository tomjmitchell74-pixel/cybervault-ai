"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Image as ImageIcon, Radar } from "lucide-react";
import type { ProductView } from "@/lib/data";
import { cx } from "@/lib/format";

const AXES = [
  { key: "speed", label: "SPEED" },
  { key: "precision", label: "PRECISION" },
  { key: "stealth", label: "STEALTH" },
  { key: "autonomy", label: "AUTONOMY" },
  { key: "uptime", label: "UPTIME" },
  { key: "learning", label: "LEARNING" },
] as const;

function CapabilityRadar({ product }: { product: ProductView }) {
  const size = 340;
  const cxp = size / 2;
  const cyp = size / 2;
  const R = 118;

  const point = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
    return [cxp + Math.cos(angle) * r, cyp + Math.sin(angle) * r] as const;
  };

  const ring = (frac: number) =>
    AXES.map((_, i) => point(i, R * frac).join(",")).join(" ");

  const valuePoly = AXES.map((a, i) =>
    point(i, (R * product.capabilities[a.key]) / 100).join(",")
  ).join(" ");

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 sm:p-10">
      <p className="kicker text-faint">Capability matrix</p>
      <svg viewBox={`0 0 ${size} ${size}`} className="mt-4 w-full max-w-[340px]">
        {[0.33, 0.66, 1].map((f) => (
          <polygon key={f} points={ring(f)} fill="none" stroke="rgba(255,255,255,0.08)" />
        ))}
        {AXES.map((_, i) => {
          const [x, y] = point(i, R);
          return (
            <line key={i} x1={cxp} y1={cyp} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />
          );
        })}
        <polygon
          points={valuePoly}
          fill={`hsla(${product.hue}, 85%, 60%, 0.22)`}
          stroke={`hsl(${product.hue}, 85%, 62%)`}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        {AXES.map((a, i) => {
          const [x, y] = point(i, (R * product.capabilities[a.key]) / 100);
          return (
            <circle
              key={a.key}
              cx={x}
              cy={y}
              r={3.2}
              fill={`hsl(${product.hue}, 85%, 66%)`}
            />
          );
        })}
        {AXES.map((a, i) => {
          const [x, y] = point(i, R + 26);
          return (
            <text
              key={a.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#9aa5b7"
              fontSize={9}
              fontFamily="var(--font-jetbrains), monospace"
              letterSpacing={1.5}
            >
              {a.label} {product.capabilities[a.key]}
            </text>
          );
        })}
      </svg>
      <p className="mt-4 max-w-xs text-center font-mono text-[10px] leading-relaxed tracking-wide text-faint">
        Benchmarked against the CV-Helix evaluation harness · updated hourly from live fleet
        telemetry
      </p>
    </div>
  );
}

function SpecSheet({ product }: { product: ProductView }) {
  return (
    <div className="flex h-full flex-col justify-center p-6 sm:p-10">
      <div className="flex items-center justify-between">
        <p className="kicker text-faint">Spec sheet</p>
        <p className="font-mono text-[10px] tracking-[0.2em] text-pulse">{product.codename}</p>
      </div>
      <dl className="mt-6 divide-y divide-white/8 border-y border-white/8">
        {product.specs.map((s) => (
          <div key={s.label} className="flex items-baseline justify-between gap-6 py-3.5">
            <dt className="shrink-0 font-mono text-[10.5px] tracking-[0.14em] text-faint uppercase">
              {s.label}
            </dt>
            <dd className="text-right font-display text-[13.5px] font-semibold text-mist">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 font-mono text-[9.5px] tracking-[0.18em] text-faint uppercase">
        Certified under CyberVault evaluation harness v4.2
      </p>
    </div>
  );
}

const SLIDES = [
  { key: "render", label: "Unit render", icon: ImageIcon },
  { key: "radar", label: "Capability matrix", icon: Radar },
  { key: "spec", label: "Spec sheet", icon: ClipboardList },
] as const;

export function ProductGallery({ product }: { product: ProductView }) {
  const [active, setActive] = useState<(typeof SLIDES)[number]["key"]>("render");

  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-abyss"
        style={{
          boxShadow: `0 40px 120px -48px hsla(${product.hue}, 85%, 60%, 0.28)`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {active === "render" && (
              <div className="relative h-full w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute inset-x-0 h-24 animate-scan-line bg-gradient-to-b from-transparent via-pulse/10 to-transparent" />
                </div>
              </div>
            )}
            {active === "radar" && (
              <div className="bg-blueprint h-full w-full">
                <CapabilityRadar product={product} />
              </div>
            )}
            {active === "spec" && (
              <div className="h-full w-full bg-panel">
                <SpecSheet product={product} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {product.badge && (
          <span className="absolute top-4 left-4 z-10 rounded-full bg-void/75 px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-pulse uppercase backdrop-blur">
            {product.badge}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {SLIDES.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={cx(
              "group relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-2.5 transition-all duration-300",
              active === s.key
                ? "border-pulse/50 bg-pulse/8"
                : "border-white/10 bg-panel hover:border-white/25"
            )}
          >
            {s.key === "render" ? (
              <span className="relative size-8 shrink-0 overflow-hidden rounded-md border border-white/15">
                <Image src={product.image} alt="" fill sizes="32px" className="object-cover" />
              </span>
            ) : (
              <span
                className={cx(
                  "grid size-8 shrink-0 place-items-center rounded-md border border-white/15",
                  active === s.key ? "text-pulse" : "text-faint"
                )}
              >
                <s.icon className="size-4" />
              </span>
            )}
            <span
              className={cx(
                "truncate font-mono text-[9.5px] tracking-[0.12em] uppercase",
                active === s.key ? "text-pulse" : "text-dim"
              )}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
