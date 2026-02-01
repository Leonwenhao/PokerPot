# PokerPot Task Queue

Last updated: Jan 31, 2026 (Hackathon start)

---

## Task 1: Project Setup
Status: done
Priority: P0
Est: 30 min

**What:** Initialize Next.js 14 project with Thirdweb SDK, Tailwind CSS, and folder structure.

**Acceptance:**
- [ ] Next.js app runs locally on port 3000
- [ ] Thirdweb provider wrapped around app
- [ ] Tailwind configured and working
- [ ] Folder structure: `/app`, `/components`, `/contracts`, `/lib`
- [ ] Environment variables set up for RPC endpoints

**Files:**
- package.json
- tailwind.config.js
- app/layout.tsx
- app/page.tsx
- app/providers.tsx
- .env.local.example

**Blocked by:** none

---

## Task 2: Escrow Smart Contract
Status: done
Priority: P0
Est: 45 min

**What:** Write Solidity escrow contract with deposit, balance check, and host-only payout functions.

**Acceptance:**
- [ ] Contract compiles without errors
- [ ] `deposit()` accepts USDC and tracks depositor balance
- [ ] `getGameBalance()` returns total pot
- [ ] `getPlayerBalance(address)` returns individual balance
- [ ] `payout(address player, uint256 amount)` sends funds (host-only)
- [ ] `host` address set at deployment
- [ ] Events emitted for deposits and payouts

**Files:**
- contracts/PokerPotEscrow.sol

**Blocked by:** none

---

## Task 3: Deploy to Base Testnet
Status: done
Priority: P0
Est: 15 min

**What:** Deploy escrow contract to Base Sepolia testnet using Thirdweb or Hardhat.

**Acceptance:**
- [ ] Contract deployed and verified
- [ ] Contract address saved to config
- [ ] Test deposit works via block explorer

**Files:**
- lib/contracts.ts (addresses config)
- scripts/deploy.ts (if using Hardhat)

**Blocked by:** Task 2

---

## Task 4: Deploy to Arbitrum Sepolia (pivoted from ApeChain)
Status: done
Priority: P0
Est: 15 min

**What:** Deploy MockUSDC + escrow contract to Arbitrum Sepolia (pivoted from ApeChain Curtis due to faucet issues).

**Acceptance:**
- [ ] Contract deployed and verified
- [ ] Contract address saved to config
- [ ] Test deposit works

**Files:**
- lib/contracts.ts (add ApeChain address)

**Blocked by:** Task 2

---

## Task 5: Create Game UI
Status: done
Priority: P0
Est: 45 min

**What:** Build the host's "Create Game" screen with game code generation and pot display.

**Acceptance:**
- [ ] "Create Game" button generates unique 4-digit game code
- [ ] Game code displayed prominently (shareable)
- [ ] Pot balance display shows $0 initially
- [ ] Host wallet address stored as game host
- [ ] Basic dark theme with poker aesthetic

**Files:**
- app/page.tsx (landing)
- app/game/[code]/page.tsx (game room)
- components/CreateGameButton.tsx
- components/PotDisplay.tsx
- lib/gameState.ts

**Blocked by:** Task 1

---

## Task 6: Join Game UI
Status: done
Priority: P0
Est: 45 min

**What:** Build player's join flow — enter code, see game, see deposit option.

**Acceptance:**
- [ ] Input field to enter game code
- [ ] "Join" navigates to game room
- [ ] Game room shows pot balance
- [ ] Shows player's own deposit status
- [ ] "Deposit" button visible for players who haven't deposited

**Files:**
- app/join/page.tsx
- components/JoinGameForm.tsx
- components/PlayerStatus.tsx

**Blocked by:** Task 1, Task 5

---

## Task 7: Deposit Flow
Status: done
Priority: P0
Est: 60 min

**What:** Full deposit flow — connect wallet, select amount, approve USDC, deposit to escrow.

**Acceptance:**
- [ ] Thirdweb ConnectWallet button works
- [ ] Chain detection (knows if user is on Base or ApeChain)
- [ ] Amount input with common presets ($50, $100, $200)
- [ ] USDC approval transaction if needed
- [ ] Deposit transaction to correct chain's escrow
- [ ] Success confirmation with transaction hash
- [ ] Pot updates after deposit

**Files:**
- components/DepositModal.tsx
- components/ChainBadge.tsx
- lib/deposit.ts
- hooks/useDeposit.ts

**Blocked by:** Task 3, Task 4, Task 6

---

## Task 8: Live Pot Display
Status: done
Priority: P0
Est: 30 min

**What:** Pot display that aggregates balances from both chain escrows in real-time.

**Acceptance:**
- [ ] Fetches balance from Base escrow
- [ ] Fetches balance from ApeChain escrow
- [ ] Displays combined total
- [ ] Shows breakdown by chain (subtle)
- [ ] Auto-refreshes or updates on new deposits
- [ ] Number animation on balance change (nice to have)

**Files:**
- components/PotDisplay.tsx (enhance)
- hooks/usePotBalance.ts

**Blocked by:** Task 3, Task 4, Task 6

---

## Task 9: Host Payout UI
Status: done
Priority: P0
Est: 45 min

**What:** Interface for host to input final amounts and trigger settlement.

**Acceptance:**
- [ ] Only visible to host wallet
- [ ] Lists all players who deposited
- [ ] Input field for each player's payout amount
- [ ] Validation: total payouts ≤ total pot
- [ ] "Settle Game" button
- [ ] Confirmation modal before execution

**Files:**
- components/PayoutPanel.tsx
- components/PlayerPayoutRow.tsx
- app/game/[code]/page.tsx (add host controls)

**Blocked by:** Task 5, Task 7

---

## Task 10: Payout Execution
Status: done
Priority: P0
Est: 45 min

**What:** Execute payouts — call escrow contract on each player's chain.

**Acceptance:**
- [ ] Determines which chain each player deposited from
- [ ] Calls `payout()` on correct escrow contract
- [ ] Handles multiple payouts (batch or sequential)
- [ ] Shows progress/status for each payout
- [ ] Success state when all payouts complete
- [ ] Error handling if a payout fails

**Files:**
- lib/payout.ts
- hooks/usePayout.ts
- components/PayoutProgress.tsx

**Blocked by:** Task 9

---

## Task 11: Espresso Integration (Simulated)
Status: done
Priority: P0
Est: 90 min

**What:** Integrate Espresso for cross-chain confirmation — show fast finality on deposits and payouts.

**Acceptance:**
- [ ] Espresso SDK/API integrated
- [ ] Deposit shows "Confirming via Espresso..." state
- [ ] Fast confirmation (< 5 seconds) displayed
- [ ] Cross-chain payout coordination via Espresso
- [ ] Visual indicator of Espresso confirmation
- [ ] Fallback gracefully if Espresso unavailable

**Files:**
- lib/espresso.ts
- hooks/useEspressoConfirmation.ts
- components/ConfirmationStatus.tsx

**Blocked by:** Task 7, Task 10

**Notes:** This task depends heavily on Gemini research. May need to pivot to simulated confirmation if SDK is too complex.

---

## P1 Tasks (Nice to Have)

## Task 12: Visual Polish
Status: pending
Priority: P1
Est: 60 min

**What:** Chip stack animations, poker table aesthetic, smooth transitions.

**Acceptance:**
- [ ] Pot display has chip stack visualization
- [ ] Chips animate in on deposit
- [ ] Green felt texture or poker table background
- [ ] Smooth number transitions on balance changes
- [ ] Chain badges styled nicely

**Files:**
- components/ChipStack.tsx
- components/PotDisplay.tsx (enhance)
- styles/poker-theme.css

**Blocked by:** Task 8

---

## Task 13: Solana Support
Status: pending
Priority: P1
Est: 120 min

**What:** Add Solana as third supported chain.

**Acceptance:**
- [ ] Solana wallet connection works
- [ ] USDC deposit from Solana
- [ ] Payout to Solana addresses
- [ ] Integrated into pot display

**Files:**
- lib/solana.ts
- Various component updates

**Blocked by:** Task 7

**Notes:** May require different escrow approach (Solana program vs Solidity). High risk task.

---

## Task 14: Privy Login
Status: pending
Priority: P1
Est: 60 min

**What:** Add Privy for email/social login option.

**Files:**
- app/providers.tsx (add Privy)
- components/LoginOptions.tsx

**Blocked by:** Task 1

---

## Task 15: Gas Sponsorship
Status: pending
Priority: P1
Est: 45 min

**What:** Sponsor gas for deposits so users don't need native tokens.

**Blocked by:** Task 7

---

## P2 Tasks (Cut if Needed)

## Task 16: Multiple Games
Status: pending
Priority: P2

## Task 17: Game History
Status: pending
Priority: P2

## Task 18: Mobile Responsive
Status: pending
Priority: P2
