"use client";

import { useMemo, useState } from "react";
import ChainBadge from "./ChainBadge";
import ConfirmationStatus from "./ConfirmationStatus";
import EspressoConfirmationBadge from "./EspressoConfirmation";
import { useDeposit } from "../hooks/useDeposit";
import { getDefaultChain, SUPPORTED_CHAINS } from "../lib/deposit";

const PRESET_AMOUNTS = [50, 100, 200];

type DepositModalProps = {
  open: boolean;
  onClose: () => void;
  gameCode: string;
};

export default function DepositModal({ open, onClose, gameCode }: DepositModalProps) {
  const [amount, setAmount] = useState("100");
  const defaultChain = useMemo(() => getDefaultChain(), []);
  const [selectedChainId, setSelectedChainId] = useState(defaultChain.chainId);

  const {
    activeChain,
    targetChain,
    status,
    error,
    txHash,
    explorerUrl,
    executeDeposit,
    reset
  } = useDeposit({ gameCode, targetChainId: selectedChainId });

  const isSubmitting = status === "approving" || status === "depositing";

  if (!open) return null;

  const closeModal = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0f0e] px-6 py-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-emerald-100">Deposit to pot</h2>
          <button
            type="button"
            onClick={closeModal}
            className="text-sm text-emerald-200/70 transition hover:text-emerald-100"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SUPPORTED_CHAINS.map((chain) => (
            <button
              key={chain.chainId}
              type="button"
              onClick={() => {
                reset();
                setSelectedChainId(chain.chainId);
              }}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                selectedChainId === chain.chainId
                  ? "border-emerald-300/60 bg-emerald-400/10 text-emerald-100"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedChainId === chain.chainId ? "bg-emerald-300" : "bg-slate-500"
                }`}
              />
              {chain.name}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <label className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">
            Amount (USDC)
          </label>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-2xl border border-emerald-300/30 bg-black/40 px-5 py-4 text-2xl font-semibold text-emerald-100 outline-none transition focus:border-emerald-300"
            inputMode="decimal"
          />
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="rounded-full border border-emerald-300/40 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:-translate-y-0.5"
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        {status === "success" ? (
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              Deposit confirmed.
              {txHash ? (
                <div className="mt-2 text-xs text-emerald-200/80">
                  Tx: {explorerUrl ? (
                    <a className="underline" href={explorerUrl} target="_blank" rel="noreferrer">
                      {txHash.slice(0, 10)}...
                    </a>
                  ) : (
                    `${txHash.slice(0, 10)}...`
                  )}
                </div>
              ) : null}
            </div>
            <ConfirmationStatus txHash={txHash} />
            <EspressoConfirmationBadge pulse />
          </div>
        ) : null}

        {error ? <p className="mt-3 text-sm text-amber-300">{error}</p> : null}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => executeDeposit(amount)}
            className="w-full rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "approving" && "Approving USDC..."}
            {status === "depositing" && "Depositing..."}
            {status === "success" && "Deposit another"}
            {status === "idle" && "Confirm deposit"}
            {status === "error" && "Retry deposit"}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-full rounded-full border border-emerald-300/40 px-6 py-3 text-sm font-semibold text-emerald-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
