"use client";

import { useEffect, useMemo, useState } from "react";

type ConfirmationStatusProps = {
  txHash?: string;
  label?: string;
};

type Phase = "confirming" | "confirmed";

function buildMockBlockNumber(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const base = 3200000;
  return base + (hash % 50000);
}

export default function ConfirmationStatus({
  txHash,
  label = "Confirming via Espresso..."
}: ConfirmationStatusProps) {
  const [phase, setPhase] = useState<Phase>("confirming");

  const blockNumber = useMemo(() => {
    const seed = txHash ?? `${Date.now()}`;
    return buildMockBlockNumber(seed);
  }, [txHash]);

  useEffect(() => {
    setPhase("confirming");
    const delay = 2200 + Math.floor(Math.random() * 800);
    const timer = setTimeout(() => {
      setPhase("confirmed");
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [txHash]);

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
      ) : (
        <div className="flex items-center justify-between text-emerald-100">
          <span>Confirmed ✓</span>
          <span className="text-xs text-emerald-200/70">Espresso block #{blockNumber}</span>
        </div>
      )}
    </div>
  );
}
