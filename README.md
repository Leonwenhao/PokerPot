# PokerPot

Cross-chain poker settlement app built for the SF Crosschain Hackathon. Players deposit USDC from different chains into a shared pot, and the host settles payouts back to each player's original chain — no bridging required.

## How It Works

1. **Host creates a game** and shares a 4-digit code with players
2. **Players join and deposit USDC** from either Base Sepolia or Arbitrum Sepolia
3. **Pot aggregates across chains** — everyone sees a unified balance
4. **Host settles the game** — each player receives winnings on their original chain
5. **Espresso shared sequencer** provides cross-chain confirmation

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Wallet:** Thirdweb SDK for multi-chain wallet connection and contract interactions
- **Contracts:** Solidity 0.8.20, Hardhat
- **Chains:** Base Sepolia, Arbitrum Sepolia
- **Sequencer:** Espresso Network for cross-chain settlement coordination

## Smart Contracts

**PokerPotEscrow** — Holds the pot, accepts deposits, host-only payouts

**MockUSDC** — ERC-20 test token (6 decimals) for demo purposes

### Deployed Addresses

| Contract | Base Sepolia | Arbitrum Sepolia |
|----------|-------------|-----------------|
| MockUSDC | `0xff6f423cFDd53E88eb60a0E6BF5c6D2F90e5D9c5` | `0x6C66Be609d422B892d94B6d813dae30225E562ae` |
| Escrow | `0xCf518966D025C1c49b9942044DE09f50CCeF9B2b` | `0xe3ADf1248C3dA06A74D4cbfdADAdA6e9CC6B735E` |

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_THIRDWEB_CLIENT_ID and DEPLOYER_PRIVATE_KEY
```

### Run locally

```bash
npm run dev
```

### Deploy contracts

```bash
npx hardhat run scripts/deploy-base.ts --network baseSepolia
npx hardhat run scripts/deploy.ts --network arbitrumSepolia
```

### Mint test USDC

```bash
npx hardhat run scripts/mint-demo.ts --network baseSepolia
npx hardhat run scripts/mint-arb.ts --network arbitrumSepolia
```

## Demo Flow

1. Host creates game → shares 4-digit code
2. Player 1 deposits $100 from Base
3. Player 2 deposits $100 from Arbitrum
4. Unified pot shows $200 across chains
5. Host settles: Player 1 gets $150 on Base, Player 2 gets $50 on Arbitrum
6. Confirmations shown via Espresso shared sequencer
