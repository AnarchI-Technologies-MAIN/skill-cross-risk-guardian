import { fail } from './_json.mjs';

export function parseArgs(argv) {
  const opts = {};
  const rest = [];
  for (const arg of argv) {
    if (!arg.startsWith('--')) {
      rest.push(arg);
      continue;
    }
    const [key, value = 'true'] = arg.slice(2).split('=');
    opts[key] = value;
  }
  return { opts, rest };
}

export function numberOpt(opts, name, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const raw = opts[name] ?? process.env[name.toUpperCase().replaceAll('-', '_')] ?? fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < min || n > max) fail(`${name} must be a number between ${min} and ${max}`);
  return n;
}
