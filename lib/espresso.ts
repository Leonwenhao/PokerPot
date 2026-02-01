const ESPRESSO_QUERY_URL = "https://query.main.net.espresso.network/v0";

export type EspressoHeader = {
  height: number;
  timestamp: number;
  l1_head: number;
  l1_finalized: {
    number: number;
    timestamp: string;
    hash: string;
  };
  payload_commitment: string;
  block_merkle_tree_root: string;
};

export type EspressoConfirmation = {
  blockHeight: number;
  timestamp: number;
  l1Head: number;
  merkleRoot: string;
  confirmedAt: string;
};

export async function getEspressoBlockHeight(): Promise<number> {
  const res = await fetch(`${ESPRESSO_QUERY_URL}/node/block-height`);
  if (!res.ok) throw new Error("Failed to fetch Espresso block height");
  const height = await res.json();
  return Number(height);
}

export async function getEspressoHeader(height: number): Promise<EspressoHeader> {
  const res = await fetch(`${ESPRESSO_QUERY_URL}/availability/header/${height}`);
  if (!res.ok) throw new Error(`Failed to fetch Espresso header at ${height}`);
  const data = await res.json();
  return data.fields as EspressoHeader;
}

export async function getLatestConfirmation(): Promise<EspressoConfirmation> {
  const height = await getEspressoBlockHeight();
  const header = await getEspressoHeader(height);
  return {
    blockHeight: header.height,
    timestamp: header.timestamp,
    l1Head: header.l1_head,
    merkleRoot: header.block_merkle_tree_root,
    confirmedAt: new Date(header.timestamp * 1000).toISOString(),
  };
}
