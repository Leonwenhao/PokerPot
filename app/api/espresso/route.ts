import { NextResponse } from "next/server";

const ESPRESSO_QUERY_URL = "https://query.main.net.espresso.network/v0";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const heightRes = await fetch(`${ESPRESSO_QUERY_URL}/node/block-height`, {
      cache: "no-store",
    });
    if (!heightRes.ok) {
      return NextResponse.json(
        { error: `block-height returned ${heightRes.status}` },
        { status: 502 }
      );
    }
    const heightText = await heightRes.text();
    // Use a slightly older block to ensure the header is available
    const height = Number(heightText.trim()) - 5;

    const headerRes = await fetch(
      `${ESPRESSO_QUERY_URL}/availability/header/${height}`,
      { cache: "no-store" }
    );
    if (!headerRes.ok) {
      return NextResponse.json(
        { error: `header returned ${headerRes.status}` },
        { status: 502 }
      );
    }
    const data = await headerRes.json();
    const fields = data.fields;

    return NextResponse.json({
      blockHeight: fields.height,
      timestamp: fields.timestamp,
      l1Head: fields.l1_head,
      merkleRoot: fields.block_merkle_tree_root,
      confirmedAt: new Date(fields.timestamp * 1000).toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { error: `Espresso fetch failed: ${message}` },
      { status: 502 }
    );
  }
}
