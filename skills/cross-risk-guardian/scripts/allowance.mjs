#!/usr/bin/env node
import { tokenSnapshot } from './_chain.mjs';
import { handleMain, out, fail } from './_json.mjs';

async function main() {
  const [token, owner, spender] = process.argv.slice(2);
  if (!token || !owner || !spender) fail('usage: node allowance.mjs <token> <owner> <spender>');
  out({
    ok: true,
    skill: 'cross-risk-guardian',
    command: 'allowance',
    ...(await tokenSnapshot({ token, owner, spender })),
  });
}

handleMain(main());
