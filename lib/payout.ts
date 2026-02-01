import { getChainConfigById } from "./deposit";

export type PayoutEntry = {
  player: string;
  amount: number;
  chainId: number;
};

export type PayoutStatus = {
  status: "idle" | "pending" | "success" | "error";
  txHash?: string;
  error?: string;
};

export function formatChainLabel(chainId: number) {
  const chain = getChainConfigById(chainId);
  if (!chain) return `Chain ${chainId}`;
  return chain.name;
}
