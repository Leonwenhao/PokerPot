import type { PayoutStatus } from "../lib/payout";
import { formatChainLabel } from "../lib/payout";

const STATUS_LABELS: Record<PayoutStatus["status"], string> = {
  idle: "Idle",
  pending: "Pending",
  success: "Complete",
  error: "Failed"
};

type PayoutProgressProps = {
  statuses: Record<string, PayoutStatus>;
};

export default function PayoutProgress({ statuses }: PayoutProgressProps) {
  const entries = Object.entries(statuses);
  if (!entries.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5">
      <h3 className="text-sm font-semibold text-emerald-100">Settlement progress</h3>
      <div className="mt-4 space-y-2">
        {entries.map(([key, status]) => {
          const [player, chainIdStr] = key.split(":");
          const chainId = Number(chainIdStr);
          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
            >
              <div>
                <span className="text-emerald-100">{player.slice(0, 6)}...{player.slice(-4)}</span>
                {chainId ? (
                  <span className="ml-2 text-xs text-slate-400">{formatChainLabel(chainId)}</span>
                ) : null}
              </div>
              <span
                className={`text-xs font-semibold ${
                  status.status === "success"
                    ? "text-emerald-300"
                    : status.status === "error"
                    ? "text-amber-300"
                    : "text-emerald-200/70"
                }`}
              >
                {STATUS_LABELS[status.status]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
