# cross-risk-guardian

Read-only CROSS Mainnet risk preflight skill.

Use it before any CROSS skill moves funds. It checks chain id, wallet balance, gas floor, native spend affordability, ERC-20 token balances, specific token allowances, spender allowlists, and max-action caps.

It never needs a private key.

## Commands

```bash
node skills/cross-risk-guardian/scripts/network.mjs
node skills/cross-risk-guardian/scripts/wallet.mjs 0x0000000000000000000000000000000000000000
node skills/cross-risk-guardian/scripts/allowance.mjs <token> <owner> <spender>
node skills/cross-risk-guardian/scripts/preflight.mjs <owner> --native-spend=1 --min-gas=0.05 --max-action=10
```

All commands emit one JSON object.

## Limits

Generic EVM chains do not expose a single canonical list of every approval a wallet has ever granted. This skill checks explicit token/spender pairs and documented allowlists. Use an indexer skill or explorer export for historical approval discovery.
