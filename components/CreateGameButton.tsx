"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddress } from "@thirdweb-dev/react";
import { createGame } from "../lib/gameState";

export default function CreateGameButton() {
  const router = useRouter();
  const address = useAddress();
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!address) {
      setError("Connect your wallet to create a game.");
      return;
    }

    const game = createGame(address);
    router.push(`/game/${game.code}`);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleCreate}
        className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5"
      >
        Create Game
      </button>
      {error ? <p className="text-xs text-amber-300">{error}</p> : null}
    </div>
  );
}
