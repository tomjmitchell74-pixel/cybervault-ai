import { Star } from "lucide-react";

export function Stars({
  value,
  size = 13,
  className = "",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const stars = Array.from({ length: 5 });
  return (
    <span className={`relative inline-flex ${className}`} aria-label={`${value} out of 5 stars`}>
      <span className="flex gap-[2px] text-faint/50">
        {stars.map((_, i) => (
          <Star key={i} style={{ width: size, height: size }} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-[2px] overflow-hidden text-pulse"
        style={{ width: `${pct}%` }}
      >
        {stars.map((_, i) => (
          <Star key={i} style={{ width: size, height: size }} fill="currentColor" className="shrink-0" />
        ))}
      </span>
    </span>
  );
}
