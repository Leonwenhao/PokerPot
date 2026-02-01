"use client";

import Link from "next/link";
import JoinGameForm from "../../components/JoinGameForm";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#14532d,_#0b0f0e_65%)] px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300/80">PokerPot</p>
          <h1 className="text-3xl font-semibold sm:text-5xl">Join a game</h1>
          <p className="text-sm text-emerald-100/80">
            Enter the host&apos;s 4-digit code to see the pot and deposit.
          </p>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6">
          <JoinGameForm />
        </div>

        <Link
          href="/"
          className="text-center text-sm text-emerald-200/70 transition hover:text-emerald-100"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
