# PokerPot Hackathon Workflow

A cross-chain crypto-native poker settlement app. Built at SF Crosschain Hackathon (Jan 31, 2026).

---

## Workflow Architecture (Hackathon-Optimized)

Three AI agents coordinated by Leon, adapted for speed.

**Gemini (Research)** — Front-loaded research only. Before coding begins, Gemini investigates:
- Espresso SDK documentation and example repos
- Thirdweb cross-chain and account abstraction patterns  
- ApeChain, Base, Solana USDC contract addresses and bridging
- Any competitive poker/settlement apps for UX reference

Research is compiled into a single RESEARCH_DUMP.md that Claude Code and Codex reference. No mid-build research pauses.

**Claude Code (CTO)** — Strategic planning, task creation, code review, and final integration. Creates the development plan, writes task specs, reviews Codex output. In hackathon mode, reviews are binary: "works" or "fix this specific thing." No architectural debates mid-sprint.

**Codex (Senior Dev)** — All implementation. Reads task specs, writes code, runs local tests, writes completion report. Stays in scope. Stops after each task.

**Leon (Coordinator)** — Manages handoffs, runs integration tests in browser, makes scope cut decisions, handles demo prep.

---

## File System (Simplified for Hackathon)

Four files in project root:

### DEVELOPMENT_PLAN.md
Created once at start. Contains:
- Product vision (one paragraph)
- Demo script (what judges see)
- Technical architecture diagram
- Task list with priorities (P0 = demo-critical, P1 = nice-to-have, P2 = cut)
- Time estimates

### TASK_QUEUE.md
All tasks with status. Hackathon format (leaner than Jianghu):

```
## Task [NUMBER]: [NAME]
Status: pending | in-progress | review | done | cut
Priority: P0 | P1 | P2
Est: [minutes]

**What:** [1-2 sentences]

**Acceptance:** 
- [ ] Criterion 1
- [ ] Criterion 2

**Files:** [list of files to create/modify]

**Blocked by:** [task numbers or "none"]
```

### SCRATCHPAD.md
Living memory. Contains:
- CTO decisions with reasoning
- Research insights from Gemini
- Blockers and their resolutions
- Demo prep notes

### COMPLETION_REPORT.md
Ephemeral handoff from Codex → Claude Code. Overwritten each task.

```
# Task [NUMBER] Complete

## What I Did
[2-3 sentences]

## Files Changed
- [file]: [what changed]

## It Works Because
[How you tested it]

## Concerns
[Anything risky, or "None"]
```

---

## Prompt Templates (Hackathon Edition)

### Gemini: Research Sprint

Run this FIRST, before any coding:

```
I'm building a cross-chain poker settlement app at a hackathon. I need you to research and compile documentation for:

1. **Espresso Network**
   - How does shared sequencing work?
   - SDK/API for cross-chain confirmations
   - Example repos or starter code
   - How to get fast finality across chains

2. **Thirdweb**
   - Cross-chain SDK capabilities
   - Account abstraction / smart wallets
   - Gas sponsorship setup
   - Connect wallet components (React)

3. **Chain-specific**
   - USDC contract addresses on Base, ApeChain, Solana
   - Any bridging infrastructure between these three
   - RPC endpoints

4. **Escrow patterns**
   - Simple escrow smart contract patterns
   - Multi-party payout logic

Compile this into a single reference document I can hand to my development agents. Include code snippets and repo links where available.
```

### Codex: Cold Start

```
You are Senior Developer on PokerPot, a cross-chain poker settlement app being built at a hackathon. You report to the CTO (Claude Code) who reviews your work.

Read these files:
- DEVELOPMENT_PLAN.md — Product vision, architecture, task list
- TASK_QUEUE.md — Current tasks and statuses
- SCRATCHPAD.md — CTO decisions and research notes

Your working style (hackathon mode):
- Speed over perfection. Working code beats elegant code.
- Implement exactly what's specified. No scope creep.
- If something is unclear, make a reasonable assumption and document it.
- Test that it works locally before signaling completion.
- Stay within listed files. Don't touch other parts of the codebase.

When done, overwrite COMPLETION_REPORT.md with your report, then STOP.

Your current task: Execute Task [NUMBER] from TASK_QUEUE.md
```

### Codex: Continue (Same Session)

```
Execute Task [NUMBER] from TASK_QUEUE.md
```

### Codex: Fix Rejection

```
Read SCRATCHPAD.md for fix notes on Task [NUMBER]. Fix and update COMPLETION_REPORT.md.
```

### Claude Code: Cold Start

```
You are CTO of PokerPot, a cross-chain poker settlement app at a hackathon. You manage a task-based workflow where Codex implements and you review.

Read these files:
- DEVELOPMENT_PLAN.md — Vision, architecture, tasks
- TASK_QUEUE.md — Task statuses  
- SCRATCHPAD.md — Your decisions, research insights
- COMPLETION_REPORT.md — Latest Codex output (if exists)

Give me:
1. Current status (tasks done / total, what's in progress)
2. Any blockers
3. Recommended next action
```

### Claude Code: Review Task

```
Read COMPLETION_REPORT.md and review Task [NUMBER].

Check:
1. Does it meet the acceptance criteria in TASK_QUEUE.md?
2. Does the code actually work (based on Codex's testing notes)?
3. Any obvious bugs or issues?

If approved: Update TASK_QUEUE.md status to "done", note any lessons in SCRATCHPAD.md
If rejected: Write specific fix instructions in SCRATCHPAD.md under "## Fix Notes: Task [NUMBER]"

Be fast. This is a hackathon. If it works, ship it.
```

### Claude Code: Create Development Plan

```
Create DEVELOPMENT_PLAN.md for PokerPot with:

1. **Vision** (one paragraph): What we're building and why it matters

2. **Demo Script**: The exact flow judges will see, step by step

3. **Architecture**: 
   - Frontend (React + Thirdweb)
   - Cross-chain layer (Espresso)
   - Contracts (escrow on each chain)
   - How they connect

4. **Task Breakdown**: All tasks needed, with:
   - Priority (P0 = demo-critical, P1 = nice-to-have, P2 = cut if needed)
   - Time estimate in minutes
   - Dependencies
   
   Start with P0 tasks that form the critical path.

5. **Risk Assessment**: What could go wrong, mitigation plan

Use the research in SCRATCHPAD.md to inform technical decisions.
```

---

## Hackathon Task Loop (Compressed)

```
┌─────────────────────────────────────────────────┐
│  1. Claude Code: "Next P0 task from queue"      │
│  2. Leon: Hand task number to Codex             │
│  3. Codex: Implement → COMPLETION_REPORT.md     │
│  4. Claude Code: Review (fast binary decision)  │
│  5. If broken: Fix notes → back to step 3       │
│  6. If works: Mark done → back to step 1        │
└─────────────────────────────────────────────────┘
```

Target: 15-30 min per task cycle. If a task is taking longer than 45 min, consider cutting scope.

---

## Demo Prep Checklist (Final Hour)

- [ ] All P0 tasks done and working
- [ ] Happy path tested end-to-end in browser
- [ ] Demo wallet funded with testnet USDC on all three chains
- [ ] Screen recording backup in case live demo fails
- [ ] 2-minute pitch script written
- [ ] Know exactly which features to skip if time is short

---

## Scope Cut Triggers

Immediately cut to P1/P2 if:
- Any single task exceeds 1 hour
- Espresso integration proves too complex → fall back to simulated cross-chain
- Solana bridge doesn't work → demo with Base + ApeChain only
- Privy login taking too long → stick with basic wallet connect

The demo must work. Features are negotiable.
