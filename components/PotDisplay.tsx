type PotDisplayProps = {
  amount?: number;
  label?: string;
  breakdown?: Array<{ label: string; amount: number }>;
  isLoading?: boolean;
  error?: string;
};

export default function PotDisplay({
  amount = 0,
  label = "Total Pot",
  breakdown = [],
  isLoading = false,
  error
}: PotDisplayProps) {
  return (
    <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-900/40 via-emerald-900/10 to-black/60 px-8 py-6 shadow-2xl shadow-black/40">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-semibold text-emerald-100">
          {isLoading ? "--" : `$${amount.toFixed(0)}`}
        </span>
        <span className="text-sm text-emerald-200/70">USDC</span>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-amber-300/90">{error}</p>
      ) : null}
      <div className="mt-4 h-2 w-full rounded-full bg-emerald-400/10">
        <div className="h-full w-10 rounded-full bg-emerald-400/50" />
      </div>
      {breakdown.length > 0 ? (
        <div className="mt-4 grid gap-2 text-xs text-emerald-200/70 sm:grid-cols-2">
          {breakdown.map((entry) => (
            <div key={entry.label} className="flex items-center justify-between">
              <span>{entry.label}</span>
              <span className="text-emerald-100">${entry.amount.toFixed(0)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
