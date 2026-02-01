"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import PotDisplay from "../../../components/PotDisplay";
import PlayerStatus from "../../../components/PlayerStatus";
import DepositModal from "../../../components/DepositModal";
import PayoutPanel from "../../../components/PayoutPanel";
import EspressoConfirmationBadge from "../../../components/EspressoConfirmation";
import { usePotBalance } from "../../../hooks/usePotBalance";
import { getGame, type GameState } from "../../../lib/gameState";
import { getDepositsForGame } from "../../../lib/deposit";

export default function GameRoomPage() {
  const params = useParams();
  const router = useRouter();
  const address = useAddress();
  const [game, setGame] = useState<GameState | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [hasDeposits, setHasDeposits] = useState(false);
  const pot = usePotBalance(8000);

  const code = useMemo(() => {
    const raw = params?.code;
    if (Array.isArray(raw)) {
      return raw[0];
    }
    return raw ?? "";
  }, [params]);

  useEffect(() => {
    if (!code) {
      return;
    }
    setGame(getGame(code));
  }, [code]);

  useEffect(() => {
    if (!code) return;
    const check = () => {
      const deposits = getDepositsForGame(code);
      setHasDeposits(Object.keys(deposits).length > 0);
    };
    check();
    const interval = setInterval(check, 4000);
    return () => clearInterval(interval);
  }, [code]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#14532d,_#0b0f0e_65%)] px-6 py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300/80">PokerPot · Game Room</p>
            <button
              onClick={() => router.push("/")}
              className="rounded-lg border border-emerald-500/30 px-4 py-1.5 text-sm text-emerald-300 transition hover:bg-emerald-500/10"
            >
              ← Home
            </button>
          </div>
          <h1 className="text-3xl font-semibold sm:text-5xl">
            Game Code: <span className="text-emerald-300">{code || "----"}</span>
          </h1>
          <p className="text-sm text-emerald-100/80">
            Share this 4-digit code with players to join your table.
          </p>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4">
          <ConnectWallet theme="dark" />
          <p className="mt-3 text-xs text-emerald-200/70">Connect to deposit into the pot.</p>
        </div>

        <PotDisplay
          amount={pot.total}
          isLoading={pot.isLoading}
          error={pot.error}
          breakdown={pot.chains.map((c) => ({ label: c.label, amount: c.amount }))}
        />

        <EspressoConfirmationBadge pulse={isDepositOpen} enabled={hasDeposits} />

        <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5">
          <div className="flex flex-col gap-3 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-emerald-200/70">Host wallet</span>
              <span className="font-mono text-xs text-emerald-100">
                {game?.hostAddress ?? address ?? "Not connected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-200/70">Status</span>
              <span className="text-emerald-200">Waiting for deposits</span>
            </div>
          </div>
        </section>

        <PlayerStatus gameCode={code} onDepositClick={() => setIsDepositOpen(true)} />

        <PayoutPanel gameCode={code} hostAddress={game?.hostAddress} />

        {!game ? (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
            We couldn't find this game in local storage. If you just created it,
            head back and generate a new code.
          </div>
        ) : null}
      </div>

      <DepositModal open={isDepositOpen} onClose={() => setIsDepositOpen(false)} gameCode={code} />
    </main>
  );
}
