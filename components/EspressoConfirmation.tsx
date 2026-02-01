"use client";

import { useEffect, useState } from "react";

type EspressoConf = {
  blockHeight: number;
  timestamp: number;
  l1Head: number;
  merkleRoot: string;
  confirmedAt: string;
};

type Props = {
  pulse?: boolean;
  /** When true, the badge is enabled and will poll Espresso. When false/undefined, renders nothing. */
  enabled?: boolean;
};

export default function EspressoConfirmationBadge({ pulse, enabled }: Props) {
  const [conf, setConf] = useState<EspressoConf | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    const poll = async () => {
      try {
        const res = await fetch("/api/espresso");
        if (!res.ok) throw new Error();
        const data: EspressoConf = await res.json();
        if (mounted) {
          setConf(data);
          setError(false);
        }
      } catch {
        if (mounted) setError(true);
      }
    };

    poll();
    const interval = setInterval(poll, pulse ? 4000 : 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pulse, enabled]);

  if (!enabled) return null;

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        Espresso Network — connecting...
      </div>
    );
  }

  if (!conf) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Espresso Network — loading...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full bg-emerald-400 ${pulse ? "animate-pulse" : ""}`} />
        <span className="text-xs font-semibold text-emerald-200">Espresso Confirmation Layer</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300">
        <div>
          <span className="text-slate-500">Block</span>{" "}
          <span className="font-mono text-emerald-100">#{conf.blockHeight.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-500">L1 Head</span>{" "}
          <span className="font-mono text-emerald-100">#{conf.l1Head.toLocaleString()}</span>
        </div>
        <div className="col-span-2">
          <span className="text-slate-500">Merkle Root</span>{" "}
          <span className="font-mono text-emerald-100/70">
            {conf.merkleRoot.slice(0, 30)}...
          </span>
        </div>
      </div>
      <p className="mt-1.5 text-[10px] text-emerald-300/50">
        Shared sequencer confirmations enable cross-chain settlement trust
      </p>
    </div>
  );
}
