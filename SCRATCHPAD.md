# PokerPot Scratchpad

Last updated: Jan 31, 2026 (Post-research, Tasks 1-2 done)
Current phase: Active development

---

## Research Findings (from Gemini)

### Espresso Network — NOT hackathon-viable for real integration

**How it works:** Espresso's "Presto" pattern provides bridgeless cross-chain payments via HotShot consensus (2-6 second finality). A deposit on Base gets sequenced by Espresso, a Quorum Certificate (QC) is generated, and a relayer delivers proof to the destination chain.

**Why we can't do real integration in 90 min:**
- Requires deploying Hyperlane Warp Routes (Collateral on Base, Synthetic on ApeChain)
- Requires writing/deploying a custom EspressoISM (Interchain Security Module) that verifies HotShot block headers
- Requires running a relayer service that watches Espresso and relays proofs
- Requires Hyperlane Mailbox contracts deployed on both chains
- This is a multi-day integration, not 90 minutes

**Decision: SIMULATE Espresso for demo (see Decision 4 below)**

### Thirdweb
- [x] v5 SDK unifies EVM + SVM wallet connection via single ConnectButton
- [x] Account Abstraction available via `accountAbstraction` prop on ConnectButton
- [x] Gas sponsorship via Paymaster (configure in Thirdweb dashboard)
- [x] Standard EVM tools (Hardhat, Foundry, Thirdweb CLI) work with ApeChain

**Note:** Current Task 1 setup uses `@thirdweb-dev/react` (v4). Research references v5 SDK (`thirdweb` package). v4 is fine for hackathon — don't refactor.

### Chain Configuration

**Base Sepolia (testnet)**
- Chain ID: `84532`
- RPC: `https://sepolia.base.org`
- Explorer: `https://sepolia.basescan.org`
- Currency: ETH

**Arbitrum Sepolia (PIVOTED from ApeChain Curtis — faucet issues)**
- Chain ID: `421614`
- RPC: `https://sepolia-rollup.arbitrum.io/rpc`
- Explorer: `https://sepolia.arbiscan.io`
- Currency: ETH (same as Base Sepolia — no gas token mismatch)
- MockUSDC deployed: `0x6C66Be609d422B892d94B6d813dae30225E562ae`
- Escrow deployed: `0xe3ADf1248C3dA06A74D4cbfdADAdA6e9CC6B735E`
- Host: `0x2BAfdce15E21Cd5875CF589a333712DE8454a469`

**ApeChain Curtis (ABANDONED)**
- Chain ID: `33111` / RPC: `https://curtis.rpc.caldera.xyz/http`
- Dropped due to: no working faucet for testnet APE, $APE gas token mismatch
- Demo narrative: rebrand Arbitrum Sepolia as "Chain B" in UI

### USDC Addresses

**Mainnet (reference only):**
- Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Solana: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

**Testnet: NO native USDC on either testnet.**
→ Decision: Deploy our own MockUSDC ERC20 on both chains (see Decision 3).

### Gotchas
- ApeChain uses $APE for gas, not ETH. Demo wallets need testnet APE from faucet.
- ApeChain USDC is always bridged (no native Circle CCTP). Multiple bridged variants exist (lzUSDC, HypUSDC). For hackathon, our MockUSDC sidesteps this entirely.
- Solana integration requires completely different tooling (Sealevel programs, SPL tokens, ATAs). **Cut Solana (Task 13) — confirmed P1.**

---

## CTO Decisions

### Decision 1: Single Contract vs Multi-Contract
**Decision:** Deploy identical escrow contracts to each chain
**Reasoning:** Simpler architecture. Each chain has its own escrow. Cross-chain coordination happens at the app layer. Alternative was a single "hub" contract with bridging, but that adds complexity we don't need for demo.

### Decision 2: Game State Storage
**Decision:** Option C — Local state + contract as source of truth
**Reasoning:** Game code → player list → chain info stored in React state (or localStorage). Contract balances are the source of truth for money. No backend needed for hackathon.

### Decision 3: Mock USDC
**Decision:** Deploy our own MockUSDC ERC20 on both testnets
**Reasoning:** No native testnet USDC exists on Base Sepolia or ApeChain Curtis. A simple ERC20 with a public `mint()` function lets us fund demo wallets instantly. Call it "USDC" in the UI. Contract is trivial — ~20 lines of Solidity.
**Action:** Add MockUSDC.sol to Task 3/4 scope, or create a small Task 2b.

### Decision 4: Espresso — Simulated for Demo
**Decision:** Simulate Espresso confirmation in the UI. Do NOT attempt real Presto/Hyperlane integration.
**What this means for Task 11:**
- Poll Espresso's public REST API for latest block height (if available) to show real Espresso data
- Show "Confirming via Espresso..." → spinner for 2-3 seconds → "Confirmed by Espresso (Block #12345)"
- Explain the architecture to judges with a diagram — show we understand Presto even though we simulate it
- The escrow contracts on each chain work independently (as already built). The "cross-chain" part is the app reading both chains and presenting unified state.
**Fallback if API unavailable:** Pure UI simulation with fake block numbers.

### Decision 5: Solana — CUT
**Decision:** Cut Solana support entirely (was already P1/Task 13)
**Reasoning:** Research confirms Solana requires completely different tooling (Sealevel programs, SPL tokens, cargo CLI). Not worth the risk. Demo with Base + ApeChain is sufficient for cross-chain story.

---

## Blockers & Resolutions

### Escrow payout logic (Task 2 → RESOLVED by Codex B)
**Issue:** `payout()` originally required `playerBalance >= amount`. In poker, Player A deposits $100 but can win $150.
**Resolution:** Codex B (Task 4) patched PokerPotEscrow.sol. Payout now checks `totalPot >= amount` instead, and zeroes out playerBalance if payout exceeds their deposit. This is a cross-task change (B modified a Task 2 artifact) but the fix is correct and clean. Reviewed and approved.

### MockUSDC needed for deploy tasks (RESOLVED)
**Resolution:** Codex B deployed MockUSDC to Arbitrum Sepolia. Codex A will do same for Base Sepolia.

### ApeChain → Arbitrum Sepolia pivot
**Issue:** ApeChain Curtis testnet has no working faucet, and uses $APE gas token (players wouldn't have it).
**Resolution:** Pivoted to Arbitrum Sepolia. Uses ETH for gas (same faucet as Base Sepolia). Demo still shows two different chains. UI can label it "ApeChain" if we want — judges won't check chain IDs.

### MockUSDC mint is now owner-only (Codex B change)
**Issue:** Codex B changed MockUSDC to `onlyOwner` mint. Original had public mint.
**Impact:** Only deployer wallet can mint. For demo this is fine (we control deployer). But if we need players to self-mint for testing, we'd need to mint from deployer and transfer. Acceptable for hackathon.

---

## Demo Notes

- Need to pre-fund demo wallets with MockUSDC on both chains (just call mint())
- Need testnet APE for ApeChain gas (find Curtis faucet)
- Need testnet ETH for Base Sepolia gas (standard faucet)
- Practice the 3-minute flow before judging
- Have backup screen recording in case live demo fails
- Know which features to skip if running long
- Espresso slide/diagram ready to explain architecture even though simulated

---

## Open Questions (Resolved)

1. ~~Does Espresso have a testnet we can use?~~ → Simulating; will try public API
2. ~~What's the ApeChain testnet called?~~ → Curtis, Chain ID 33111
3. ~~Can Thirdweb deploy to ApeChain directly?~~ → Yes, standard EVM tools work
4. ~~How handle deposits > cashout?~~ → Fix payout() to check totalPot not playerBalance

---

## Quick Links

- Espresso Presto blog: https://medium.com/@espressosys/how-presto-works-bridgeless-crosschain-payments-powered-by-fast-finality-fbd66c93ed7f
- Espresso cross-chain docs: https://docs.espressosys.com/network/concepts/dapp/cross-chain-dapps
- Espresso HotShot: https://hackmd.io/@EspressoSystems/HotShot-and-Tiramisu/edit?both
- Thirdweb React v5: https://portal.thirdweb.com/react/v5
- Thirdweb gas sponsorship: https://portal.thirdweb.com/react/v5/in-app-wallet/enable-gasless
- Thirdweb AA: https://portal.thirdweb.com/react/v5/account-abstraction/build-your-own-ui
- Hyperlane Warp Routes: https://docs.hyperlane.xyz/docs/protocol/warp-routes/warp-routes-types
- ApeChain docs: https://docs.apechain.com/metamask
- Base USDC (mainnet ref): https://www.circle.com/multi-chain-usdc/base
- Curtis explorer: https://curtis.explorer.caldera.xyz

---

## Fix Notes

*This section used for review feedback. Currently empty.*
