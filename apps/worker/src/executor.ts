import { createWalletClient, createPublicClient, http, parseUnits, erc20Abi } from 'viem';
import { worldchain } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { preflight } from './safety';
import { prisma } from './prisma';

export const account = privateKeyToAccount(process.env.EXECUTOR_PK as `0x${string}`);
export const publicClient = createPublicClient({ chain: worldchain, transport: http(process.env.WORLD_CHAIN_RPC!) });
const walletClient = createWalletClient({ account, chain: worldchain, transport: http(process.env.WORLD_CHAIN_RPC!) });

const MORPHO_BLUE = '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb' as const;
const USDC       = '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1' as const;

const SAFETY = { maxAmountUSD: 5_000, minAPY: 0.045, maxUtilization: 0.92 };

async function fetchBestMarket() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8_000);
  try {
    const res = await fetch('https://api.morpho.org/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ markets(first:10,where:{chainId_in:[480]}) { items { id state { supplyApy utilization } marketParams { loanToken collateralToken oracle irm lltv } } } }`,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    const { data } = await res.json();
    return data.markets.items
      .filter((m: any) => m.state.supplyApy > SAFETY.minAPY && m.state.utilization < SAFETY.maxUtilization)
      .sort((a: any, b: any) => b.state.supplyApy - a.state.supplyApy)[0];
  } catch (e) { clearTimeout(t); throw e; }
}

export async function executeAction(ctx: { decisionId: string; userAddress: `0x${string}`; action: any }) {
  const { decisionId, userAddress, action } = ctx;
  if (action.target_protocol !== 'morpho_blue') return { status: 'skipped' };

  const bestMarket = await fetchBestMarket();
  if (!bestMarket) throw new Error('No viable Morpho market');

  const amountUSD = Number(action.meta?.amount ?? 500);
  await preflight(MORPHO_BLUE, amountUSD);

  const amount = parseUnits(amountUSD.toString(), 6);

  await walletClient.writeContract({ address: USDC, abi: erc20Abi, functionName: 'approve', args: [MORPHO_BLUE, amount] });
  const hash = await walletClient.writeContract({
    address: MORPHO_BLUE,
    abi: [],
    functionName: 'supply',
    args: [bestMarket.marketParams, amount, 0n, userAddress, '0x'],
  });
  await publicClient.waitForTransactionReceipt({ hash });

  await prisma.execution.create({
    data: { decisionId, txHash: hash, status: 'success', protocol: 'morpho_blue', apyAtExecution: bestMarket.state.supplyApy, valueUSD: amountUSD },
  });

  return { status: 'success', txHash: hash, apy: bestMarket.state.supplyApy };
}

// Auto-rebalance loop
setInterval(async () => {
  if (process.env.GLOBAL_PAUSE === 'true') return;
  try {
    const bestMarket = await fetchBestMarket();
    if (!bestMarket) return;
    // rebalance logic: pull positions, compare APY delta, re-supply if > threshold
  } catch (_) {}
}, 60_000);
