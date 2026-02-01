import { CONTRACTS } from "./contracts";

type ChainConfig = {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorer: string;
  usdcAddress: string;
  escrowAddress: string;
};

export const CHAIN_CONFIG: Record<string, ChainConfig> = {
  arbitrumSepolia: {
    chainId: CONTRACTS.arbitrumSepolia.chainId,
    name: "Arbitrum Sepolia",
    rpcUrl: CONTRACTS.arbitrumSepolia.rpcUrl,
    explorer: CONTRACTS.arbitrumSepolia.explorer,
    usdcAddress: CONTRACTS.arbitrumSepolia.mockUsdc,
    escrowAddress: CONTRACTS.arbitrumSepolia.escrow
  },
  baseSepolia: {
    chainId: CONTRACTS.baseSepolia.chainId,
    name: "Base Sepolia",
    rpcUrl: CONTRACTS.baseSepolia.rpcUrl,
    explorer: CONTRACTS.baseSepolia.explorer,
    usdcAddress: CONTRACTS.baseSepolia.mockUsdc,
    escrowAddress: CONTRACTS.baseSepolia.escrow
  }
};

export const SUPPORTED_CHAINS = Object.values(CHAIN_CONFIG);

export function getChainConfigById(chainId?: number) {
  if (!chainId) return null;
  return SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId) ?? null;
}

export function getDefaultChain() {
  return SUPPORTED_CHAINS[0];
}

export function getExplorerTxUrl(chainId: number, hash: string) {
  const chain = getChainConfigById(chainId);
  if (!chain) return "";
  return `${chain.explorer}/tx/${hash}`;
}

export type DepositRecord = {
  chainId: number;
  depositedAt: string;
};

const DEPOSIT_STORAGE_KEY = "pokerpot:deposits";

function loadDeposits(): Record<string, Record<string, DepositRecord>> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(DEPOSIT_STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, Record<string, DepositRecord>>;
  } catch {
    return {};
  }
}

function saveDeposits(data: Record<string, Record<string, DepositRecord>>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEPOSIT_STORAGE_KEY, JSON.stringify(data));
}

export function markDeposit(gameCode: string, address: string, chainId: number) {
  if (typeof window === "undefined") return;
  const data = loadDeposits();
  if (!data[gameCode]) data[gameCode] = {};
  data[gameCode][address] = {
    chainId,
    depositedAt: new Date().toISOString()
  };
  saveDeposits(data);
}

export function getDepositsForGame(gameCode: string) {
  const data = loadDeposits();
  const gameDeposits = data[gameCode] ?? {};
  const normalized: Record<string, DepositRecord> = {};

  Object.entries(gameDeposits).forEach(([address, record]) => {
    if (record && typeof (record as DepositRecord).chainId === "number") {
      normalized[address] = record as DepositRecord;
      return;
    }

    const fallbackChain = getDefaultChain();
    normalized[address] = {
      chainId: fallbackChain.chainId,
      depositedAt: new Date().toISOString()
    };
  });

  return normalized;
}
