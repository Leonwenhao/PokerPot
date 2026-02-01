"use client";

import Link from "next/link";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import CreateGameButton from "../components/CreateGameButton";
import MyGames from "../components/MyGames";

export default function HomePage() {
  const address = useAddress();
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#14532d,_#0b0f0e_65%)] px-6">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-10 py-16 text-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300/80">PokerPot</p>
          <h1 className="text-4xl font-semibold sm:text-6xl">
            Settle poker games across chains.
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            One pot, multiple chains, instant payouts.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4">
          <ConnectWallet theme="dark" />
          <p className="mt-3 text-xs text-emerald-200/70">Host wallet required to create a game.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <CreateGameButton />
          <Link
            href="/join"
            className="rounded-full border border-emerald-300/40 px-6 py-3 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5"
          >
            Join Game
          </Link>
        </div>

        {address && <MyGames address={address} />}

        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm text-slate-300">
          Demo mode: create a host code and share it with your table.
        </div>
      </div>
    </main>
  );
}
