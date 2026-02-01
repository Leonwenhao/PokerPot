type ChainBadgeProps = {
  name: string;
  chainId: number;
  isActive?: boolean;
};

export default function ChainBadge({ name, chainId, isActive = false }: ChainBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
        isActive
          ? "border-emerald-300/60 bg-emerald-400/10 text-emerald-100"
          : "border-white/10 bg-white/5 text-slate-200"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-emerald-300" />
      {name} · {chainId}
    </span>
  );
}
