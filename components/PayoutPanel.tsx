"use client";

import { useEffect, useMemo, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { getDepositsForGame, SUPPORTED_CHAINS, type DepositRecord } from "../lib/deposit";
import { usePotBalance } from "../hooks/usePotBalance";
import { usePayout } from "../hooks/usePayout";
import type { PayoutEntry } from "../lib/payout";
import PlayerPayoutRow from "./PlayerPayoutRow";
import PayoutProgress from "./PayoutProgress";
import EspressoConfirmationBadge from "./EspressoConfirmation";

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

type PayoutPanelProps = {
  gameCode: string;
  hostAddress?: string | null;
};

export default function PayoutPanel({ gameCode, hostAddress }: PayoutPanelProps) {
  const address = useAddress();
  const isHost = useMemo(() => {
    if (!address || !hostAddress) return false;
    return address.toLowerCase() === hostAddress.toLowerCase();
  }, [address, hostAddress]);

  const [deposits, setDeposits] = useState<Record<string, DepositRecord>>({});
  // amounts[player][chainId] = "string"
  const [amounts, setAmounts] = useState<Record<string, Record<number, string>>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const { total, chains: chainBalances, isLoading } = usePotBalance(8000);
  const { statuses, isExecuting, globalError, executePayouts, reset } = usePayout();

  useEffect(() => {
    if (!gameCode) return;
    let mounted = true;

    const sync = () => {
      const data = getDepositsForGame(gameCode);
      if (!mounted) return;
      setDeposits(data);
      setAmounts((prev) => {
        const next: Record<string, Record<number, string>> = { ...prev };
        Object.keys(data).forEach((player) => {
          if (!next[player]) {
            next[player] = {};
          }
        });
        return next;
      });
    };

    sync();
    const timer = setInterval(sync, 4000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [gameCode]);

  if (!isHost) {
    return null;
  }

  const players = Object.keys(deposits);

  // Build payout entries from the per-player per-chain amounts
  const payoutEntries: PayoutEntry[] = [];
  for (const player of players) {
    const playerAmounts = amounts[player] ?? {};
    for (const chain of SUPPORTED_CHAINS) {
      const amt = toNumber(playerAmounts[chain.chainId] ?? "0");
      if (amt > 0) {
        payoutEntries.push({ player, amount: amt, chainId: chain.chainId });
      }
    }
  }

  const totalPayout = payoutEntries.reduce((sum, e) => sum + e.amount, 0);

  // Per-chain totals for validation
  const chainTotals = new Map<number, number>();
  for (const entry of payoutEntries) {
    chainTotals.set(entry.chainId, (chainTotals.get(entry.chainId) ?? 0) + entry.amount);
  }

  // Check if any chain's payouts exceed its escrow balance
  const chainOverflows: string[] = [];
  for (const [cid, payoutTotal] of chainTotals) {
    const balance = chainBalances.find((c) => c.chainId === cid);
    if (balance && payoutTotal > balance.amount) {
      chainOverflows.push(
        `${balance.label}: $${payoutTotal.toFixed(2)} payouts > $${balance.amount.toFixed(2)} available`
      );
    }
  }

  const exceedsPot = chainOverflows.length > 0;

  const handleChange = (player: string, chainId: number, value: string) => {
    setAmounts((prev) => ({
      ...prev,
      [player]: { ...(prev[player] ?? {}), [chainId]: value }
    }));
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await executePayouts(payoutEntries);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">Host controls</p>
          <h2 className="mt-2 text-xl font-semibold text-emerald-100">Settle payouts</h2>
        </div>
        <div className="text-right text-sm text-emerald-200/70">
          <div>Pot: {isLoading ? "Loading..." : `$${total.toFixed(2)}`} USDC</div>
          {chainBalances.map((c) => (
            <div key={c.chainId} className="text-xs text-slate-400">
              {c.label}: ${c.amount.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <EspressoConfirmationBadge pulse={isExecuting} />
      </div>

      {players.length === 0 ? (
        <p className="mt-4 text-sm text-emerald-200/70">No deposits yet.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {players.map((player) => (
            <PlayerPayoutRow
              key={player}
              player={player}
              chainAmounts={amounts[player] ?? {}}
              onChange={(chainId, value) => handleChange(player, chainId, value)}
            />
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-1 text-sm text-emerald-200/70">
        <div>Total payouts: ${totalPayout.toFixed(2)}</div>
        {chainOverflows.map((msg) => (
          <div key={msg} className="text-amber-300 text-xs">{msg}</div>
        ))}
      </div>

      {globalError ? <p className="mt-3 text-sm text-amber-300">{globalError}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isExecuting || players.length === 0 || exceedsPot || payoutEntries.length === 0}
          onClick={() => setShowConfirm(true)}
          className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExecuting ? "Settling..." : "Settle Game"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-emerald-300/40 px-6 py-3 text-sm font-semibold text-emerald-100"
        >
          Clear status
        </button>
      </div>

      <div className="mt-6">
        <PayoutProgress statuses={statuses} />
      </div>

      {showConfirm ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0f0e] px-6 py-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-emerald-100">Confirm settlement</h3>
            <p className="mt-2 text-sm text-emerald-200/70">
              You&apos;re about to settle {payoutEntries.length} payouts totaling ${totalPayout.toFixed(2)} USDC across {chainTotals.size} chain{chainTotals.size > 1 ? "s" : ""}.
            </p>
            {exceedsPot ? (
              <p className="mt-3 text-sm text-amber-300">Some chain payouts exceed available balance. Adjust amounts.</p>
            ) : null}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={exceedsPot || payoutEntries.length === 0}
                onClick={handleConfirm}
                className="flex-1 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-full border border-emerald-300/40 px-5 py-3 text-sm font-semibold text-emerald-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
