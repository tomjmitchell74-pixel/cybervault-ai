"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, PenLine, Star } from "lucide-react";
import type { ReviewView } from "@/lib/data";
import { cx, timeAgo } from "@/lib/format";
import { submitReview } from "@/app/actions";
import { Stars } from "@/components/stars";

function RatingPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1.5" role="radiogroup" aria-label="Choose a rating">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          onMouseEnter={() => setHover(v)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(v)}
          className="transition-transform hover:scale-110"
          aria-label={`${v} star${v > 1 ? "s" : ""}`}
        >
          <Star
            className={cx(
              "size-7 transition-colors",
              (hover || value) >= v ? "fill-pulse text-pulse" : "text-faint/60"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewsSection({
  productSlug,
  reviews,
}: {
  productSlug: string;
  reviews: ReviewView[];
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [thanks, setThanks] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitReview({ slug: productSlug, rating, title, body, author, role });
      if (res.ok) {
        setThanks(true);
        setFormOpen(false);
        setTitle("");
        setBody("");
        setAuthor("");
        setRole("");
        setRating(5);
        router.refresh();
      } else {
        setError(res.error ?? "Transmission failed — try again.");
      }
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
      {/* summary */}
      <div>
        <div className="panel sticky top-48 p-6">
          <p className="kicker text-faint">Field rating</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="display-xl text-6xl font-bold text-pulse">{avg.toFixed(1)}</span>
            <span className="pb-2 font-mono text-[11px] text-faint">/ 5.0</span>
          </div>
          <Stars value={avg} size={16} className="mt-2" />
          <p className="mt-2 text-[12.5px] text-dim">
            {reviews.length} verified field reports from production deployments
          </p>
          <div className="mt-5 space-y-2">
            {dist.map((d) => (
              <div key={d.star} className="flex items-center gap-3">
                <span className="w-3 font-mono text-[11px] text-faint">{d.star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%`,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-pulse"
                  />
                </div>
                <span className="w-6 text-right font-mono text-[11px] text-faint">{d.count}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setThanks(false);
              setFormOpen((v) => !v);
            }}
            className="btn-ghost mt-6 w-full py-2.5 text-[13px]"
          >
            <PenLine className="size-3.5" /> File a field report
          </button>
          {thanks && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center text-[12px] text-pulse"
            >
              Report received — thank you, operator.
            </motion.p>
          )}
        </div>
      </div>

      {/* list + form */}
      <div>
        {formOpen && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="panel mb-6 border-pulse/25 p-6"
          >
            <p className="font-display text-lg font-bold">Your field report</p>
            <div className="mt-4">
              <span className="field-label">Mission rating</span>
              <RatingPicker value={rating} onChange={setRating} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="rv-name">Callsign / name</label>
                <input
                  id="rv-name"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Dana Whisper"
                  className="input-dark text-[13px]"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="rv-role">Role (optional)</label>
                <input
                  id="rv-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. SOC Lead, Acme"
                  className="input-dark text-[13px]"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="field-label" htmlFor="rv-title">Headline</label>
              <input
                id="rv-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sum it up in one line"
                className="input-dark text-[13px]"
              />
            </div>
            <div className="mt-4">
              <label className="field-label" htmlFor="rv-body">Report</label>
              <textarea
                id="rv-body"
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What did the agent actually do in your environment? Be specific."
                className="input-dark resize-none text-[13px]"
              />
            </div>
            {error && <p className="mt-3 text-[12.5px] text-red-400">{error}</p>}
            <div className="mt-5 flex items-center gap-3">
              <button type="submit" disabled={pending} className={cx("btn-primary px-6 py-2.5 text-[13px]", pending && "btn-disabled")}>
                {pending ? "Transmitting…" : "Transmit report"}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase hover:text-dim"
              >
                Abort
              </button>
            </div>
          </motion.form>
        )}

        <ul className="space-y-4">
          {reviews.map((r, i) => (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.05 }}
              className="panel p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full font-display text-[13px] font-bold text-void"
                    style={{ background: `hsl(${r.avatarHue}, 70%, 62%)` }}
                  >
                    {r.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      {r.author}
                      {r.verified && <BadgeCheck className="size-3.5 text-pulse" />}
                    </p>
                    <p className="font-mono text-[10px] text-faint">
                      {r.role} · {timeAgo(r.createdAt)}
                    </p>
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              <p className="mt-4 font-display text-[15px] font-bold tracking-tight">{r.title}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-dim">{r.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
