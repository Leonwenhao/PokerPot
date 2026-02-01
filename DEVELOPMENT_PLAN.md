# PokerPot Development Plan

**Project:** Cross-chain poker settlement app  
**Hackathon:** SF Crosschain Hackathon (Jan 31, 2026)  
**Time Budget:** ~8 hours  
**Team:** Leon + AI agents (Claude Code, Codex, Gemini)

---

## Vision

PokerPot eliminates the pain of settling poker games. A host creates a game, players deposit USDC from any chain into a shared pot, and when the game ends, payouts happen instantly — regardless of which chain each player uses. It shouldn't feel like crypto. No chain switching, no gas fumbling, no waiting. Just money moving.

---

## Demo Script (What Judges See)

**Setup:** Two browser windows side by side — Host view and Player view

1. **[0:00] Host creates game**
   - Opens PokerPot, connects wallet (has USDC on Base)
   - Clicks "Create Game" → Gets game code: `FRIDAY-NIGHT-2847`
   - Screen shows empty pot: $0

2. **[0:30] Player 1 joins from Base**
   - Opens PokerPot, enters game code
   - Connects wallet, sees "Deposit" screen
   - Deposits $100 USDC from Base
   - Pot updates: $100 (animated chip stack grows)

3. **[1:00] Player 2 joins from ApeChain**
   - Different wallet, has USDC on ApeChain
   - Deposits $100 USDC
   - Pot updates: $200
   - **Key moment:** "Notice this player deposited from a completely different chain"

4. **[1:30] Show pot visualization**
   - Quick view of both players' contributions
   - Chain badges subtly visible (Base logo, ApeChain logo)

5. **[2:00] Game ends — Host inputs results**
   - Host clicks "End Game"
   - Inputs: Player 1 cashes out $150, Player 2 cashes out $50

6. **[2:30] Instant cross-chain settlement**
   - Host clicks "Settle"
   - Player 1 receives $150 on Base
   - Player 2 receives $50 on ApeChain
   - **Key moment:** "Both payouts confirmed in seconds via Espresso's shared sequencing"

7. **[3:00] Wrap-up**
   - Show transaction confirmations
   - "No bridging required. Players never left their native chain."

**Total demo time:** 3 minutes

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React/Next.js)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Create Game │  │  Join Game  │  │  Pot View   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│  ┌─────────────┐  ┌─────────────┐                      │
│  │   Deposit   │  │   Payout    │                      │
│  └─────────────┘  └─────────────┘                      │
└─────────────────────────┬───────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │      THIRDWEB SDK         │
            │  - ConnectWallet          │
            │  - Multi-chain switching  │
            │  - Contract interactions  │
            │  - (Stretch: Gas sponsor) │
            └─────────────┬─────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│                  ESPRESSO LAYER                         │
│  - Monitors deposits across chains                      │
│  - Provides fast cross-chain confirmation               │
│  - Coordinates payout execution                         │
│  (May be simulated if integration too complex)          │
└─────────────────────────┬───────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
    │  BASE   │     │APECHAIN │     │ SOLANA  │
    │ Escrow  │     │ Escrow  │     │(Stretch)│
    │Contract │     │Contract │     │         │
    └─────────┘     └─────────┘     └─────────┘
```

### Component Breakdown

**Frontend Stack:**
- Next.js 14 (App Router)
- Thirdweb React SDK for wallet + contracts
- Tailwind CSS for styling
- Framer Motion for animations (if time)

**Smart Contracts:**
- Simple escrow contract deployed to Base and ApeChain
- Functions: `deposit()`, `getBalance()`, `payout(address, amount)` (host-only)
- Written in Solidity, deployed via Thirdweb

**Cross-Chain Coordination:**
- Espresso SDK for confirmation layer (research pending)
- Fallback: Backend service that monitors both chains and coordinates state

**State Management:**
- Game state stored in simple backend or Firebase (for hackathon speed)
- Or: Purely on-chain state if contracts support it

---

## Task Breakdown

### P0: Demo-Critical (Must Have)

| # | Task | Est | Depends On |
|---|------|-----|------------|
| 1 | Project setup (Next.js + Thirdweb + Tailwind) | 30m | - |
| 2 | Escrow contract: deposit + payout functions | 45m | - |
| 3 | Deploy escrow to Base testnet | 15m | 2 |
| 4 | Deploy escrow to ApeChain testnet | 15m | 2 |
| 5 | Create Game UI (generates game code, shows pot) | 45m | 1 |
| 6 | Join Game UI (enter code, see pot, deposit button) | 45m | 1, 5 |
| 7 | Deposit flow: connect wallet → approve → deposit | 60m | 3, 4, 6 |
| 8 | Pot display: live balance from both chains | 30m | 3, 4, 6 |
| 9 | Host payout UI: input amounts, trigger settlement | 45m | 5, 7 |
| 10 | Payout execution: call contract on correct chain | 45m | 9 |
| 11 | Espresso integration: cross-chain confirmation | 90m | 7, 10 |

**P0 Total: ~8 hours** (tight but doable)

### P1: Nice to Have

| # | Task | Est | Depends On |
|---|------|-----|------------|
| 12 | Visual polish: chip animations, poker table UI | 60m | 8 |
| 13 | Solana support (third chain) | 120m | 7 |
| 14 | Privy login (email/social) | 60m | 1 |
| 15 | Gas sponsorship for deposits | 45m | 7 |

### P2: Cut if Needed

| # | Task | Est |
|---|------|-----|
| 16 | Multiple game support (not just one active game) | 90m |
| 17 | Game history / receipts | 60m |
| 18 | Mobile responsive design | 45m |

---

## Critical Path

```
Setup (1) ──┬── Contract (2) ── Deploy Base (3) ──┐
            │                                      │
            │── Deploy ApeChain (4) ───────────────┤
            │                                      │
            └── Create Game UI (5) ── Join UI (6) ─┴── Deposit (7) ── Pot Display (8)
                                                                            │
                                                              Payout UI (9) ── Payout Exec (10)
                                                                            │
                                                              Espresso (11) ─┘
```

**Parallel tracks:**
- Contract work (2-4) can happen while UI scaffolding (5-6) is built
- Espresso research should happen early so we know if it's viable

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Espresso SDK too complex | Medium | Fall back to simulated cross-chain (just show it working, fake the confirmation) |
| ApeChain testnet issues | Low | Use Arbitrum Sepolia as standin, rebrand in demo |
| USDC not available on testnet | Medium | Use mock ERC20 token, call it "USDC" in UI |
| Time overrun on contracts | Medium | Use Thirdweb pre-built if custom takes too long |
| Solana integration breaks EVM flow | High | Cut Solana, demo with Base + ApeChain only |

---

## Success Criteria

**Minimum Viable Demo:**
- [ ] Host creates game, gets code
- [ ] Player joins from Chain A, deposits
- [ ] Player joins from Chain B, deposits  
- [ ] Pot shows combined balance
- [ ] Host triggers payout
- [ ] Both players receive funds on their respective chains

**Winning Demo (stretch):**
- [ ] All above, plus Espresso confirmation visible
- [ ] Smooth animations
- [ ] Three chains (including Solana)
- [ ] Privy social login

---

## Time Allocation

| Phase | Time | Tasks |
|-------|------|-------|
| Research (Gemini) | 30m | Run research prompt, compile findings |
| Setup + Contracts | 2h | Tasks 1-4 |
| Core UI | 2h | Tasks 5-8 |
| Payout Flow | 1.5h | Tasks 9-10 |
| Espresso Integration | 1.5h | Task 11 |
| Polish + Demo Prep | 30m | Testing, script practice |

**Buffer:** 0 hours (it's a hackathon 😅)
