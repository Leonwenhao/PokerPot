import { useEffect, useMemo, useState } from "react";
import { BigNumber, providers, utils } from "ethers";
import { CONTRACTS } from "../lib/contracts";

type ChainBalance = {
  key: string;
  label: string;
  amount: number;
  raw: BigNumber;
  chainId: number;
};

type PotBalanceState = {
  total: number;
  chains: ChainBalance[];
  isLoading: boolean;
  error?: string;
};

const FUNCTION_SELECTOR = utils.id("getGameBalance()").slice(0, 10);

async function fetchChainBalance(
  rpcUrl: string,
  chainId: number,
  escrow: string
): Promise<BigNumber> {
  const provider = new providers.JsonRpcProvider(rpcUrl, chainId);
  const result = await provider.call({ to: escrow, data: FUNCTION_SELECTOR });
  return BigNumber.from(result);
}

export function usePotBalance(pollMs: number = 10000): PotBalanceState {
  const chains = useMemo(
    () =>
      Object.entries(CONTRACTS).map(([key, config]) => ({
        key,
        label: key.replace(/([A-Z])/g, " $1").trim(),
        chainId: config.chainId,
        rpcUrl: config.rpcUrl,
        escrow: config.escrow
      })),
    []
  );

  const [state, setState] = useState<PotBalanceState>({
    total: 0,
    chains: [],
    isLoading: true
  });

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    const poll = async () => {
      try {
        const balances = await Promise.all(
          chains.map(async (chain) => {
            const raw = await fetchChainBalance(chain.rpcUrl, chain.chainId, chain.escrow);
            const amount = Number(utils.formatUnits(raw, 6));
            return {
              key: chain.key,
              label: chain.label,
              amount,
              raw,
              chainId: chain.chainId
            };
          })
        );

        if (!mounted) {
          return;
        }

        const total = balances.reduce((sum, entry) => sum + entry.amount, 0);
        setState({ total, chains: balances, isLoading: false });
      } catch (error) {
        if (!mounted) {
          return;
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load pot balance."
        }));
      }
    };

    poll();
    timer = setInterval(poll, pollMs);

    return () => {
      mounted = false;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [chains, pollMs]);

  return state;
}
