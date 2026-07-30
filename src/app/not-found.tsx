import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-blueprint relative flex min-h-screen items-center justify-center px-6">
      <div className="relative text-center">
        <ShieldAlert className="mx-auto size-10 text-pulse" />
        <p className="display-xl mt-6 text-[clamp(4rem,14vw,9rem)] font-bold">
          <span className="text-gradient-pulse">404</span>
        </p>
        <p className="font-mono text-[11px] tracking-[0.28em] text-faint uppercase">
          Signal lost · sector not found
        </p>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-dim">
          This corridor doesn&apos;t exist — or it&apos;s been sealed by Vault Keeper. Either way,
          the agents have been notified.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary px-5 py-2.5 text-sm">
            <ArrowLeft className="size-4" /> Return to base
          </Link>
          <Link href="/shop" className="btn-ghost px-5 py-2.5 text-sm">
            Browse the arsenal
          </Link>
        </div>
      </div>
    </div>
  );
}
