"use client";

import Link from "next/link";
import { getGamesForAddress, type MyGame } from "../lib/gameState";
import { useEffect, useState } from "react";

export default function MyGames({ address }: { address: string }) {
  const [games, setGames] = useState<MyGame[]>([]);

  useEffect(() => {
    setGames(getGamesForAddress(address));
  }, [address]);

  if (games.length === 0) {
    return (
      <div className="w-full max-w-md text-center text-sm text-slate-400">
        No games yet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-300/80">
        My Games
      </h2>
      {games.map((g) => (
        <Link
          key={g.code}
          href={`/game/${g.code}`}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10"
        >
          <div>
            <span className="font-mono text-lg text-white">{g.code}</span>
            <span className="ml-3 rounded-full bg-emerald-900/50 px-2 py-0.5 text-xs text-emerald-300">
              {g.role}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {new Date(g.createdAt).toLocaleDateString()}
          </span>
        </Link>
      ))}
    </div>
  );
}
