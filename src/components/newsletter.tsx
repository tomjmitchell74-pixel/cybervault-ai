"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="mt-7 max-w-sm">
      <p className="font-mono text-[10px] tracking-[0.24em] text-faint uppercase">
        Threat wire — weekly intel brief
      </p>
      {done ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 text-sm text-pulse"
        >
          <CheckCircle2 className="size-4" /> Transmission received. Watch your inbox.
        </motion.p>
      ) : (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operator@yourcompany.com"
            className="input-dark flex-1 py-2.5 text-[13px]"
          />
          <button
            type="submit"
            className="grid size-10.5 shrink-0 cursor-pointer place-items-center rounded-xl bg-pulse text-void transition-transform hover:scale-105"
            aria-label="Subscribe"
          >
            <ArrowRight className="size-4" />
          </button>
        </form>
      )}
    </div>
  );
}
