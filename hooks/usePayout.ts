"use client";

import { useState } from "react";
import { useAddress, useChainId, useSigner, useSwitchChain } from "@thirdweb-dev/react";
import { Contract, utils } from "ethers";
import { CONTRACTS } from "../lib/contracts";
import { getChainConfigById } from "../lib/deposit";
import { ESCROW_ABI } from "../lib/escrowAbi";
import type { PayoutEntry, PayoutStatus } from "../lib/payout";

const USDC_DECIMALS = 6;

const ESCROW_BY_CHAIN: Record<number, string> = {
  [CONTRACTS.arbitrumSepolia.chainId]: CONTRACTS.arbitrumSepolia.escrow,
  [CONTRACTS.baseSepolia.chainId]: CONTRACTS.baseSepolia.escrow,
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function usePayout() {
  const address = useAddress();
  const chainId = useChainId() ?? CONTRACTS.baseSepolia.chainId;
  const switchChain = useSwitchChain();
  const signer = useSigner();

  const [statuses, setStatuses] = useState<Record<string, PayoutStatus>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const reset = () => {
    setStatuses({});
    setIsExecuting(false);
    setGlobalError("");
  };

  const executePayouts = async (entries: PayoutEntry[]) => {
    if (!address || !signer) {
      setGlobalError("Connect your wallet to settle the game.");
      return;
    }

    setIsExecuting(true);
    setGlobalError("");

    const initial: Record<string, PayoutStatus> = {};
    entries.forEach((entry) => {
      initial[`${entry.player}:${entry.chainId}`] = { status: "pending" };
    });
    setStatuses(initial);

    // Group entries by chain so we minimize chain switches
    const byChain = new Map<number, PayoutEntry[]>();
    for (const entry of entries) {
      const group = byChain.get(entry.chainId) || [];
      group.push(entry);
      byChain.set(entry.chainId, group);
    }

    let currentChainId = chainId;

    for (const [targetChainId, chainEntries] of byChain) {
      const chain = getChainConfigById(targetChainId);
      const escrowAddress = ESCROW_BY_CHAIN[targetChainId];

      if (!chain || !escrowAddress) {
        for (const entry of chainEntries) {
          setStatuses((prev) => ({
            ...prev,
            [`${entry.player}:${entry.chainId}`]: { status: "error", error: "Unsupported chain." }
          }));
        }
        continue;
      }

      // Switch chain if needed
      if (currentChainId !== targetChainId) {
        if (!switchChain) {
          for (const entry of chainEntries) {
            setStatuses((prev) => ({
              ...prev,
              [`${entry.player}:${entry.chainId}`]: { status: "error", error: "Wallet does not support chain switching." }
            }));
          }
          continue;
        }

        try {
          await switchChain(targetChainId);
          // Wait for the provider/signer to update after chain switch
          await delay(1500);
          currentChainId = targetChainId;
        } catch {
          for (const entry of chainEntries) {
            setStatuses((prev) => ({
              ...prev,
              [`${entry.player}:${entry.chainId}`]: { status: "error", error: "Failed to switch chain." }
            }));
          }
          continue;
        }
      }

      // Get a fresh signer from the provider after chain switch
      let activeSigner = signer;
      try {
        if (signer.provider) {
          activeSigner = (signer.provider as any).getSigner?.() ?? signer;
        }
      } catch {
        // fall back to the existing signer
      }

      const escrow = new Contract(escrowAddress, ESCROW_ABI, activeSigner);

      for (const entry of chainEntries) {
        try {
          setStatuses((prev) => ({
            ...prev,
            [`${entry.player}:${entry.chainId}`]: { status: "pending" }
          }));

          const value = utils.parseUnits(entry.amount.toString(), USDC_DECIMALS);
          const tx = await escrow.payout(entry.player, value);
          const receipt = await tx.wait();
          const hash = receipt?.transactionHash ?? "";

          setStatuses((prev) => ({
            ...prev,
            [`${entry.player}:${entry.chainId}`]: { status: "success", txHash: hash }
          }));
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Payout failed.";
          setStatuses((prev) => ({
            ...prev,
            [`${entry.player}:${entry.chainId}`]: {
              status: "error",
              error: message.includes("execution reverted")
                ? "Transaction reverted — check escrow balance and host permissions."
                : "Payout failed."
            }
          }));
        }
      }
    }

    setIsExecuting(false);
  };

  return {
    address,
    chainId,
    statuses,
    isExecuting,
    globalError,
    reset,
    executePayouts
  };
}
