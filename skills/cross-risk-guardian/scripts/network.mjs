#!/usr/bin/env node
import { CROSS_CHAIN_ID, client, networkSnapshot } from './_chain.mjs';
import { handleMain, out } from './_json.mjs';

async function main() {
  const snap = await networkSnapshot(client());
  out({
    ok: snap.ok,
    skill: 'cross-risk-guardian',
    command: 'network',
    expectedChainId: CROSS_CHAIN_ID,
    ...snap,
  });
}

handleMain(main());
