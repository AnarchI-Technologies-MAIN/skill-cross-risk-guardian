---
name: cross-risk-guardian
description: Read-only CROSS Mainnet transaction risk preflight skill. Use when the user or an agent needs to check chain id, wallet balance, gas reserve, token balance, allowance, spender allowlist, affordability, or max-action risk before staking, swapping, bridging, approving, buying Forge tokens, joining games, moving funds, or running autonomous treasury actions on CROSS Chain 612055.
---

# cross-risk-guardian

Use this skill before any CROSS Mainnet write action. It is a read-only guardian that emits deterministic pass/fail gates.

## Rules

- Never request, load, print, or derive from a private key.
- Never submit transactions.
- Treat missing token/spender inputs as blockers for token-spend checks.
- Treat unallowlisted spenders as blockers when `ALLOWED_SPENDERS` is configured.
- Use chain id `612055` only.
- Emit one JSON object on stdout.

## Commands

Run from `skills/cross-risk-guardian`.

```bash
node scripts/network.mjs
node scripts/wallet.mjs <owner>
node scripts/allowance.mjs <token> <owner> <spender>
node scripts/preflight.mjs <owner> --native-spend=1 --min-gas=0.05 --max-action=10
node scripts/preflight.mjs <owner> --token=<erc20> --spender=<spender> --token-spend=100 --decimals=18
```

## Verdict Semantics

- `ok: true` means all requested gates passed.
- `ok: false` means at least one gate failed.
- `blocked` contains hard failures that should stop execution.
- `warnings` contains non-fatal conditions that should be surfaced to the user or higher-level agent.

## Approval Discovery Limit

This skill checks explicit token/spender pairs. CROSS Mainnet does not provide a single on-chain method to list every historical approval by wallet. For full historical discovery, combine this with explorer/indexer data.
