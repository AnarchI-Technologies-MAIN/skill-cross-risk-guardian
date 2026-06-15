# cross-risk-guardian

AnarchI Technologies (TM) CROSS Mainnet transaction risk preflight skill.

Hardcoding freedom into the systems of tomorrow.

## Purpose

Provides a read-only safety layer before any CROSS Mainnet write. It checks chain id, wallet balance, gas floor, native spend affordability, ERC-20 balances, token allowances, spender allowlists, and max action caps.

## Use Cases

- Verify CROSS chain id and wallet balance.
- Check gas floor and native spend affordability.
- Check ERC-20 token balance and allowance for a spender.
- Enforce configured spender allowlists.
- Block oversized staking, swap, bridge, Forge, game, or treasury actions.

## Setup

~~~bash
git clone https://github.com/AnarchI-Technologies/skill-cross-risk-guardian.git
cd skill-cross-risk-guardian
./install.sh
~~~

The installer symlinks skills/cross-risk-guardian into ~/.claude/skills/cross-risk-guardian and installs the package dependencies.

## Common Commands

~~~bash
cd skills/cross-risk-guardian
node scripts/network.mjs
node scripts/wallet.mjs <0xOwner>
node scripts/allowance.mjs <0xToken> <0xOwner> <0xSpender>
node scripts/preflight.mjs <0xOwner> --native-spend=1 --min-gas=0.05 --max-action=10
node scripts/preflight.mjs <0xOwner> --token=<0xToken> --spender=<0xSpender> --token-spend=100 --decimals=18
~~~

## Configuration

- CROSS_RPC_URL: CROSS Mainnet RPC override.
- ALLOWED_SPENDERS: comma-separated public spender allowlist.
- MIN_GAS_NATIVE_CROSS: default gas floor.
- MAX_ACTION_CROSS: default maximum native action.

## Alternative Configurations

- No allowlist: omit ALLOWED_SPENDERS; the skill warns that spender checks were skipped.
- Strict allowlist: include only known routers, staking contracts, game contracts, or treasury contracts.
- Hosted preflight: run before cross-treasury, cross-forge, cross-stake, or game writes.
- Token-specific checks: pass --decimals when token metadata is unreliable.

## Validation

~~~bash
npm run check
npm run smoke:read
~~~

Run the skill validator after documentation or frontmatter changes:

~~~bash
python C:\Users\Administrator\.codex\skills\.system\skill-creator\scripts\quick_validate.py C:\Users\Administrator\Desktop\cross-skills\skill-cross-risk-guardian\skills\cross-risk-guardian
~~~

## Trademark Notice

AnarchI Technologies (TM) and the phrase "Hardcoding freedom into the systems of tomorrow" are used as source-identifying marks of AnarchI Technologies. This project is not an official to-nexus package unless and until the upstream team adopts it.

## License

Apache License 2.0. See LICENSE and NOTICE.md.
