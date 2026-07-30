export function fmtMoney(cents: number): string {
  const dollars = cents / 100;
  const hasFraction = cents % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(dollars);
}

/** Annual billing: 2 months free => pay 80% of the monthly rate, billed upfront. */
export function annualMonthlyCents(monthlyCents: number): number {
  return Math.round(monthlyCents * 0.8);
}

export function annualSavingsCents(monthlyCents: number): number {
  return (monthlyCents - annualMonthlyCents(monthlyCents)) * 12;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
