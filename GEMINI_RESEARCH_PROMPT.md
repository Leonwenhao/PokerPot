# Gemini Research Sprint Prompt

Copy this into Gemini Deep Research (gemini.google.com) BEFORE starting any development.

---

## Prompt:

I'm building a cross-chain poker settlement app called PokerPot at a hackathon today. The app lets a poker game host create a game, players deposit USDC from different chains (Base, ApeChain, Solana) into a virtual cross-chain pot, and when the game ends, players can request payouts that are settled instantly back to their original chains.

The sponsor tech stack is:
- **Espresso Network** — for cross-chain sequencing and fast confirmations
- **Thirdweb** — for wallet connection, account abstraction, smart contract deployment
- **ApeChain** — one of the supported chains (EVM-compatible, built on Arbitrum Orbit)

I need comprehensive research on:

## 1. Espresso Network Integration
- What is Espresso's shared sequencer and how does it enable cross-chain confirmations?
- What SDK, API, or smart contract integrations are available?
- Find their GitHub repos, documentation, and any starter templates
- How do I get "fast finality" confirmation that a transaction on Chain A has been confirmed before releasing funds on Chain B?
- Any example code for listening to cross-chain events?

## 2. Thirdweb Cross-Chain Capabilities  
- How does Thirdweb's SDK handle multi-chain operations?
- Smart Wallet / Account Abstraction setup — can I sponsor gas for users?
- ConnectWallet React component — does it support chain switching seamlessly?
- Pre-built contract templates for escrow or payment splitting?
- How to deploy the same contract to multiple chains?

## 3. Chain-Specific Details
- **Base**: USDC contract address (mainnet and testnet), RPC endpoints
- **ApeChain**: USDC or stablecoin contract address, RPC endpoints, any special considerations
- **Solana**: USDC address, how to integrate with EVM-focused stack (is there a bridge? do I need separate handling?)

## 4. Escrow Smart Contract Patterns
- Simple multi-party escrow pattern in Solidity
- How to handle deposits from multiple addresses
- How to handle payouts approved by a single "host" address
- Any security considerations for hackathon-grade code

## 5. Cross-Chain Bridging (Fallback)
- If Espresso integration is too complex, what's the fastest way to bridge USDC between Base ↔ ApeChain?
- Any existing bridge aggregators or APIs I could use?

## 6. Competitive/Reference Apps
- Any existing crypto poker settlement or peer-to-peer payment apps I should look at for UX inspiration?
- How do apps like Splits, PaySplitter, or similar handle multi-party payouts?

---

**Output Format:**

Please compile your findings into a structured document with:
1. Key concepts explained simply
2. Code snippets where available
3. Direct links to repos and docs
4. Recommended approach for hackathon scope
5. Potential gotchas or blockers to watch for

I have about 8 hours to build this, so prioritize practical, working solutions over theoretical completeness.
