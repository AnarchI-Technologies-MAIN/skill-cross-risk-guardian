#!/usr/bin/env node
import { walletSnapshot } from './_chain.mjs';
import { handleMain, out, fail } from './_json.mjs';

async function main() {
  const owner = process.argv[2];
  if (!owner) fail('owner address required');
  const snap = await walletSnapshot(owner);
  out({
    ok: snap.ok,
    skill: 'cross-risk-guardian',
    command: 'wallet',
    ...snap,
    nativeWei: snap.nativeWei.toString(),
  });
}

handleMain(main());
