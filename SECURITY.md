# Security

This skill is read-only. It should not request, read, print, or store private keys.

Do not add signing, approvals, revocations, swaps, staking, or bridge execution here. Put write behavior in dedicated protocol skills and call `cross-risk-guardian` before those writes.
