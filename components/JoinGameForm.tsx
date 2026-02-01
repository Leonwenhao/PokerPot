"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getGame } from "../lib/gameState";

export default function JoinGameForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = code.trim();

    if (!/^[0-9]{4}$/.test(trimmed)) {
      setError("Enter a valid 4-digit game code.");
      return;
    }

    const game = getGame(trimmed);
    if (!game) {
      setError("Game not found. Ask the host to create a new code.");
      return;
    }

    setError("");
    router.push(`/game/${trimmed}`);
  };

  return (
    <form onSubmit={handleJoin} className="flex w-full flex-col gap-4">
      <label className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">
        Game Code
      </label>
      <input
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="1234"
        className="w-full rounded-2xl border border-emerald-300/30 bg-black/40 px-5 py-4 text-2xl font-semibold text-emerald-100 outline-none transition focus:border-emerald-300"
        maxLength={4}
        inputMode="numeric"
      />
      {error ? <p className="text-sm text-amber-300">{error}</p> : null}
      <button
        type="submit"
        className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5"
      >
        Join Game
      </button>
    </form>
  );
}
