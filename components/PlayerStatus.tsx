"use client";

import { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { getDepositsForGame } from "../lib/deposit";
type PlayerStatusProps = {
  gameCode: string;
  onDepositClick?: () => void;
};

export default function PlayerStatus({ gameCode, onDepositClick }: PlayerStatusProps) {
  const address = useAddress();
  const [hasDeposited, setHasDeposited] = useState(false);

  useEffect(() => {
    if (!address || !gameCode) {
      setHasDeposited(false);
      return;
    }

    const deposits = getDepositsForGame(gameCode);
    setHasDeposited(Boolean(deposits[address]));
  }, [address, gameCode]);

  const statusLabel = address
    ? hasDeposited
      ? "Deposit received"
      : "Awaiting deposit"
    : "Connect wallet to see your status";

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5">
      <div className="flex flex-col gap-3 text-sm text-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-emerald-200/70">Player status</span>
          <span className="text-emerald-100">{statusLabel}</span>
        </div>
        {!hasDeposited ? (
          <button
            type="button"
            onClick={onDepositClick}
            disabled={!address}
            className="mt-2 w-full rounded-full border border-emerald-300/40 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Deposit
          </button>
        ) : null}
      </div>
    </section>
  );
}
