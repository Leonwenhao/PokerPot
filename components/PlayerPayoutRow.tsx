import { SUPPORTED_CHAINS } from "../lib/deposit";

type PlayerPayoutRowProps = {
  player: string;
  chainAmounts: Record<number, string>;
  onChange: (chainId: number, value: string) => void;
};

export default function PlayerPayoutRow({ player, chainAmounts, onChange }: PlayerPayoutRowProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
      <p className="text-sm text-emerald-100">{player.slice(0, 6)}...{player.slice(-4)}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SUPPORTED_CHAINS.map((chain) => (
          <div key={chain.chainId} className="flex items-center gap-2">
            <span className="text-xs text-emerald-200/70">{chain.name}</span>
            <input
              value={chainAmounts[chain.chainId] ?? "0"}
              onChange={(e) => onChange(chain.chainId, e.target.value)}
              className="w-20 rounded-xl border border-emerald-300/30 bg-black/40 px-2 py-1.5 text-sm font-semibold text-emerald-100 outline-none transition focus:border-emerald-300"
              inputMode="decimal"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
