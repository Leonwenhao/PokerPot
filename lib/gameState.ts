import { getDepositsForGame } from "./deposit";

export type GameState = {
  code: string;
  hostAddress: string;
  createdAt: string;
  potTotal: number;
};

const STORAGE_KEY = "pokerpot:games";

function loadGames(): Record<string, GameState> {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, GameState>;
  } catch {
    return {};
  }
}

function saveGames(games: Record<string, GameState>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

function generateCode(existing: Record<string, GameState>) {
  let attempts = 0;
  while (attempts < 20) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    if (!existing[code]) {
      return code;
    }
    attempts += 1;
  }

  return Date.now().toString().slice(-4);
}

export function createGame(hostAddress: string) {
  const games = loadGames();
  const code = generateCode(games);
  const game: GameState = {
    code,
    hostAddress,
    createdAt: new Date().toISOString(),
    potTotal: 0
  };

  games[code] = game;
  saveGames(games);
  return game;
}

export function getGame(code: string) {
  const games = loadGames();
  return games[code] ?? null;
}

export type MyGame = GameState & { role: "Host" | "Player" };

export function getGamesForAddress(address: string): MyGame[] {
  const games = loadGames();
  const lower = address.toLowerCase();
  const results: MyGame[] = [];

  for (const game of Object.values(games)) {
    if (game.hostAddress.toLowerCase() === lower) {
      results.push({ ...game, role: "Host" });
      continue;
    }
    const deposits = getDepositsForGame(game.code);
    const depositors = Object.keys(deposits).map((a) => a.toLowerCase());
    if (depositors.includes(lower)) {
      results.push({ ...game, role: "Player" });
    }
  }

  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return results;
}
