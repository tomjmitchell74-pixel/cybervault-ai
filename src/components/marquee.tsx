import { Bot, Crosshair, Eye, Fingerprint, Lock, Radar, ShieldCheck, Cpu } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, label: "Autonomous triage" },
  { icon: Crosshair, label: "Dark-web intelligence" },
  { icon: Lock, label: "Zero-trust enforcement" },
  { icon: Radar, label: "Attack-surface mapping" },
  { icon: Bot, label: "Multi-agent orchestration" },
  { icon: Eye, label: "Exfiltration interdiction" },
  { icon: Cpu, label: "Self-tuning detection" },
  { icon: Fingerprint, label: "Crypto-verified audit" },
];

export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item.label} className="flex items-center gap-3 px-7">
          <item.icon className="size-4 text-pulse" />
          <span className="font-mono text-[11px] tracking-[0.28em] whitespace-nowrap text-dim uppercase">
            {item.label}
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee-mask overflow-hidden border-y border-white/8 bg-abyss/60 py-4">
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
