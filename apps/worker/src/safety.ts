import { parseEther } from 'viem';
import { publicClient, account } from './clients';
import { prisma } from './prisma';

const HARD_LIMITS = {
  maxTxValueUSD: 5_000,
  maxDailyVolumeUSD: 50_000,
  minExecutorBalanceETH: 0.01,
  allowedContracts: new Set([
    '0xbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb', // Morpho Blue
    '0x79a02482a880bce3f13e09da970dc34db4cd24d1', // USDC World
    '0x2cfc85d8e48f8eab294be644d9e25c3030863003', // WLD
  ]),
  pauseFlag: 'GLOBAL_PAUSE',
};

export async function preflight(to: `0x${string}`, valueUSD: number): Promise<true> {
  if (process.env[HARD_LIMITS.pauseFlag] === 'true') throw new Error('GLOBAL_PAUSE active');

  if (!HARD_LIMITS.allowedContracts.has(to.toLowerCase()))
    throw new Error(`Contract ${to} not whitelisted`);

  if (valueUSD > HARD_LIMITS.maxTxValueUSD)
    throw new Error(`Tx value $${valueUSD} exceeds cap $${HARD_LIMITS.maxTxValueUSD}`);

  const dailyVol = await prisma.execution.aggregate({
    _sum: { valueUSD: true },
    where: {
      createdAt: { gte: new Date(Date.now() - 86_400_000) },
      status: 'success',
    },
  });
  const usedToday = dailyVol._sum.valueUSD ?? 0;
  if (usedToday + valueUSD > HARD_LIMITS.maxDailyVolumeUSD)
    throw new Error(`Daily volume cap reached ($${usedToday} + $${valueUSD} > $${HARD_LIMITS.maxDailyVolumeUSD})`);

  const bal = await publicClient.getBalance({ address: account.address });
  if (bal < parseEther(String(HARD_LIMITS.minExecutorBalanceETH)))
    throw new Error(`Executor gas wallet low (${bal} < ${HARD_LIMITS.minExecutorBalanceETH} ETH)`);

  return true;
}
