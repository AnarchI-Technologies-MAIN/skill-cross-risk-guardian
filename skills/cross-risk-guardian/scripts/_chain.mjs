import { createPublicClient, defineChain, formatEther, formatUnits, getAddress, http, isAddress, parseEther, parseUnits } from 'viem';
import 'dotenv/config';
import { fail } from './_json.mjs';

export const CROSS_CHAIN_ID = 612055;

export const crossChain = defineChain({
  id: CROSS_CHAIN_ID,
  name: 'CROSS Chain Mainnet',
  nativeCurrency: { name: 'CROSS', symbol: 'CROSS', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.CROSS_RPC_URL || 'https://mainnet.crosstoken.io:22001/'] },
  },
  blockExplorers: {
    default: { name: 'CROSS Explorer', url: 'https://explorer.crosstoken.io/612055' },
  },
});

export const ERC20_ABI = [
  { inputs: [{ name: 'a', type: 'address' }], name: 'balanceOf', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'o', type: 'address' }, { name: 's', type: 'address' }], name: 'allowance', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'decimals', outputs: [{ type: 'uint8' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'symbol', outputs: [{ type: 'string' }], stateMutability: 'view', type: 'function' },
];

export function client() {
  return createPublicClient({ chain: crossChain, transport: http() });
}

export function checkedAddress(value, label = 'address') {
  if (!isAddress(value || '')) fail(`invalid ${label}: ${value}`);
  return getAddress(value);
}

export async function networkSnapshot(publicClient = client()) {
  const [chainId, blockNumber] = await Promise.all([
    publicClient.getChainId(),
    publicClient.getBlockNumber(),
  ]);
  return {
    chainId,
    blockNumber: blockNumber.toString(),
    ok: chainId === CROSS_CHAIN_ID,
  };
}

export async function walletSnapshot(owner, publicClient = client()) {
  const address = checkedAddress(owner, 'owner');
  const [net, nativeWei] = await Promise.all([
    networkSnapshot(publicClient),
    publicClient.getBalance({ address }),
  ]);
  return {
    ...net,
    address,
    nativeWei,
    nativeCROSS: formatEther(nativeWei),
  };
}

export async function tokenSnapshot({ token, owner, spender = null, decimals = null, publicClient = client() }) {
  const tokenAddress = checkedAddress(token, 'token');
  const ownerAddress = checkedAddress(owner, 'owner');
  const calls = [
    publicClient.readContract({ address: tokenAddress, abi: ERC20_ABI, functionName: 'balanceOf', args: [ownerAddress] }),
  ];
  const symbolPromise = publicClient.readContract({ address: tokenAddress, abi: ERC20_ABI, functionName: 'symbol' }).catch(() => null);
  const decimalsPromise = decimals == null
    ? publicClient.readContract({ address: tokenAddress, abi: ERC20_ABI, functionName: 'decimals' }).catch(() => 18)
    : Promise.resolve(Number(decimals));
  if (spender) {
    calls.push(publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [ownerAddress, checkedAddress(spender, 'spender')],
    }));
  }
  const [balance, allowance = null] = await Promise.all(calls);
  const [symbol, tokenDecimals] = await Promise.all([symbolPromise, decimalsPromise]);
  return {
    token: tokenAddress,
    owner: ownerAddress,
    spender: spender ? checkedAddress(spender, 'spender') : null,
    symbol,
    decimals: tokenDecimals,
    balanceWei: balance.toString(),
    balance: formatUnits(balance, tokenDecimals),
    allowanceWei: allowance == null ? null : allowance.toString(),
    allowance: allowance == null ? null : formatUnits(allowance, tokenDecimals),
  };
}

export function parseNative(amount) {
  return parseEther(String(amount));
}

export function parseToken(amount, decimals) {
  return parseUnits(String(amount), Number(decimals));
}
