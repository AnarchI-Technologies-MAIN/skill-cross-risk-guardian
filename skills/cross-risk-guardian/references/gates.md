# Risk gates

Core hard blockers:

- Wrong chain id.
- Native balance below gas floor.
- Requested native spend plus gas floor exceeds native balance.
- Requested action exceeds `MAX_ACTION_CROSS`.
- Token spend requested without token, spender, or token amount.
- Token balance below requested token spend.
- Allowance below requested token spend.
- Spender not in `ALLOWED_SPENDERS` when the allowlist is configured.

Warnings:

- No spender allowlist configured.
- Token decimals supplied manually rather than read from contract.
- Zero requested spend.
