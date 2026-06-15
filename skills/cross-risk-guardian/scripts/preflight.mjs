#!/usr/bin/env node
import { formatEther, formatUnits } from 'viem';
import { parseArgs, numberOpt } from './_args.mjs';
import { checkedAddress, parseNative, parseToken, tokenSnapshot, walletSnapshot } from './_chain.mjs';
import { fail, handleMain, out } from './_json.mjs';

function gate(name, pass, detail) {
  return { name, pass, detail };
}

function allowedSpenders() {
  return (process.env.ALLOWED_SPENDERS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => checkedAddress(s, 'allowed spender').toLowerCase());
}

async function main() {
  const { opts, rest } = parseArgs(process.argv.slice(2));
  const owner = rest[0];
  if (!owner) fail('owner address required');

  const minGas = numberOpt(opts, 'min-gas', process.env.MIN_GAS_NATIVE_CROSS || 0.05, { min: 0 });
  const maxAction = numberOpt(opts, 'max-action', process.env.MAX_ACTION_CROSS || 10, { min: 0 });
  const nativeSpend = numberOpt(opts, 'native-spend', 0, { min: 0 });
  const wallet = await walletSnapshot(owner);
  const minGasWei = parseNative(minGas);
  const nativeSpendWei = parseNative(nativeSpend);
  const maxActionWei = parseNative(maxAction);

  const gates = [
    gate('chain-id', wallet.chainId === 612055, `observed ${wallet.chainId}`),
    gate('gas-floor', wallet.nativeWei >= minGasWei, `${wallet.nativeCROSS} CROSS available; min ${minGas}`),
    gate('native-affordability', wallet.nativeWei >= nativeSpendWei + minGasWei, `spend ${nativeSpend} + gas floor ${minGas}`),
    gate('max-native-action', nativeSpendWei <= maxActionWei, `native spend ${nativeSpend}; max ${maxAction}`),
  ];
  const warnings = [];
  let token = null;

  if (opts.token || opts.spender || opts['token-spend']) {
    if (!opts.token) gates.push(gate('token-present', false, '--token is required for token spend checks'));
    if (!opts.spender) gates.push(gate('spender-present', false, '--spender is required for token spend checks'));
    if (!opts['token-spend']) gates.push(gate('token-spend-present', false, '--token-spend is required for token spend checks'));

    if (opts.token && opts.spender && opts['token-spend']) {
      token = await tokenSnapshot({ token: opts.token, owner, spender: opts.spender, decimals: opts.decimals });
      const tokenSpendWei = parseToken(opts['token-spend'], token.decimals);
      gates.push(gate('token-balance', BigInt(token.balanceWei) >= tokenSpendWei, `${token.balance} available; spend ${opts['token-spend']}`));
      gates.push(gate('token-allowance', BigInt(token.allowanceWei) >= tokenSpendWei, `${token.allowance} approved; spend ${opts['token-spend']}`));
      const allowlist = allowedSpenders();
      if (allowlist.length) {
        gates.push(gate('spender-allowlist', allowlist.includes(token.spender.toLowerCase()), `${token.spender}`));
      } else {
        warnings.push('ALLOWED_SPENDERS is not configured; spender allowlist gate skipped');
      }
      token = {
        ...token,
        requestedSpend: opts['token-spend'],
        requestedSpendWei: tokenSpendWei.toString(),
        requestedSpendFormatted: formatUnits(tokenSpendWei, token.decimals),
      };
    }
  }

  if (nativeSpendWei === 0n && !opts['token-spend']) warnings.push('zero requested spend');

  out({
    ok: gates.every((g) => g.pass),
    skill: 'cross-risk-guardian',
    command: 'preflight',
    owner: wallet.address,
    chainId: wallet.chainId,
    blockNumber: wallet.blockNumber,
    native: {
      balanceCROSS: wallet.nativeCROSS,
      minGasCROSS: String(minGas),
      nativeSpendCROSS: String(nativeSpend),
      maxActionCROSS: String(maxAction),
      nativeSpendWei: nativeSpendWei.toString(),
      minGasWei: minGasWei.toString(),
      maxActionWei: maxActionWei.toString(),
      remainingAfterNativeSpendAndGasCROSS: formatEther(wallet.nativeWei - nativeSpendWei - minGasWei),
    },
    token,
    gates,
    blocked: gates.filter((g) => !g.pass).map((g) => `${g.name}: ${g.detail}`),
    warnings,
  });
}

handleMain(main());
