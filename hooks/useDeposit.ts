"use client";

import { useMemo, useState } from "react";
import { useAddress, useChainId, useContract, useContractRead, useContractWrite, useSwitchChain } from "@thirdweb-dev/react";
import { BigNumber, utils } from "ethers";
import { CONTRACTS } from "../lib/contracts";
import { getChainConfigById, getDefaultChain, getExplorerTxUrl, markDeposit } from "../lib/deposit";
import { ESCROW_ABI } from "../lib/escrowAbi";

const USDC_DECIMALS = 6;

type DepositStatus = "idle" | "approving" | "depositing" | "success" | "error";

type UseDepositOptions = {
  gameCode: string;
  targetChainId?: number;
};

export function useDeposit({ gameCode, targetChainId }: UseDepositOptions) {
  const address = useAddress();
  const chainId = useChainId() ?? CONTRACTS.baseSepolia.chainId;
  const switchChain = useSwitchChain();

  const [status, setStatus] = useState<DepositStatus>("idle");
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  const preferredChainId = targetChainId ?? getDefaultChain().chainId;
  const activeChain = useMemo(() => getChainConfigById(chainId), [chainId]);
  const targetChain = useMemo(
    () => getChainConfigById(preferredChainId) ?? getDefaultChain(),
    [preferredChainId]
  );

  const { contract: usdcContract } = useContract(targetChain.usdcAddress, "token");
  const { contract: escrowContract } = useContract(targetChain.escrowAddress, ESCROW_ABI);

  const { data: allowance } = useContractRead(
    usdcContract,
    "allowance",
    address ? [address, targetChain.escrowAddress] : undefined
  );

  const { mutateAsync: approve } = useContractWrite(usdcContract, "approve");
  const { mutateAsync: deposit } = useContractWrite(escrowContract, "deposit");

  const parsedAllowance = useMemo(() => {
    if (!allowance) return BigNumber.from(0);
    return BigNumber.from(allowance);
  }, [allowance]);

  const reset = () => {
    setStatus("idle");
    setError("");
    setTxHash("");
  };

  const ensureChain = async () => {
    if (chainId === targetChain.chainId) {
      return true;
    }

    if (!switchChain) {
      setError("Wallet does not support chain switching.");
      setStatus("error");
      return false;
    }

    try {
      await switchChain(targetChain.chainId);
      return true;
    } catch (err) {
      setError("Could not switch to the required chain.");
      setStatus("error");
      return false;
    }
  };

  const executeDeposit = async (amount: string) => {
    if (!address) {
      setError("Connect your wallet to deposit.");
      setStatus("error");
      return;
    }

    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError("Enter a valid amount.");
      setStatus("error");
      return;
    }

    const canProceed = await ensureChain();
    if (!canProceed) return;

    try {
      const value = utils.parseUnits(numeric.toString(), USDC_DECIMALS);

      if (parsedAllowance.lt(value)) {
        setStatus("approving");
        await approve({ args: [targetChain.escrowAddress, value] });
      }

      setStatus("depositing");
      const receipt = await deposit({ args: [value] });
      const hash = receipt?.receipt?.transactionHash ?? "";
      setTxHash(hash);
      markDeposit(gameCode, address, targetChain.chainId);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError("Transaction failed. Please retry.");
    }
  };

  return {
    address,
    chainId,
    activeChain,
    targetChain,
    status,
    error,
    txHash,
    explorerUrl: txHash ? getExplorerTxUrl(targetChain.chainId, txHash) : "",
    reset,
    executeDeposit
  };
}
