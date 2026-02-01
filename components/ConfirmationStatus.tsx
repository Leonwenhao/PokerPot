"use client";

import { useEffect, useState } from "react";

type ConfirmationStatusProps = {
  txHash?: string;
  label?: string;
};

type Phase = "confirming" | "confirmed" | "error";

type EspressoData = {
  blockHeight: number;
  merkleRoot: string;
};

export default function ConfirmationStatus({
  txHash,
  label = "Confirming via Espresso..."
}: ConfirmationStatusProps) {
  const [phase, setPhase] = useState<Phase>("confirming");
  const [espresso, setEspresso] = useState<EspressoData | null>(null);

  useEffect(() => {
    if (!txHash) return;

    setPhase("confirming");
    setEspresso(null);
    let mounted = true;
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await fetch("/api/espresso");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!mounted) return;
        setEspresso({ blockHeight: data.blockHeight, merkleRoot: data.merkleRoot });
        setPhase("confirmed");
      } catch {
        if (!mounted) return;
        attempts += 1;
        if (attempts >= 5) {
          setPhase("error");
        }
      }
    };

    poll();
    const interval = setInterval(() => {
      if (phase !== "confirming") {
        clearInterval(interval);
        return;
      }
      poll();
    }, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [txHash]);

  if (!txHash) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-100">
      {phase === "confirming" ? (
        <div className="flex items-center gap-2 text-emerald-200/90">
          <span>{label}</span>
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300/80" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300/60" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300/40" />
          </span>
        </div>
      ) : phase === "error" ? (
        <div className="flex items-center gap-2 text-amber-300/90">
          <span>Espresso confirmation unavailable</span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-emerald-100">
          <span>Confirmed ✓</span>
          <span className="text-xs text-emerald-200/70">
            Espresso block #{espresso?.blockHeight.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
