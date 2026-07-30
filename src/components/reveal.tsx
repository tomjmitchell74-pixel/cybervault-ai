"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  kicker,
  title,
  copy,
  align = "left",
}: {
  kicker: string;
  title: ReactNode;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : undefined}>
      <p className="kicker text-pulse">{kicker}</p>
      <h2 className="display-xl mt-3 text-4xl font-bold sm:text-5xl lg:text-6xl">{title}</h2>
      {copy && (
        <p
          className={`mt-4 max-w-xl text-[15px] leading-relaxed text-dim ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {copy}
        </p>
      )}
    </Reveal>
  );
}
