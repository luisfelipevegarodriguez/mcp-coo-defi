const axios = require('axios');

const DEFILLAMA_BASE = 'https://yields.llama.fi';

async function getYieldOpportunities({ minApy = 3, limit = 10, stablecoinOnly = false } = {}) {
  const { data } = await axios.get(`${DEFILLAMA_BASE}/pools`);
  let pools = data.data
    .filter(p => p.apy >= minApy && p.status === 'active')
    .filter(p => !stablecoinOnly || p.stablecoin)
    .sort((a, b) => b.apy - a.apy)
    .slice(0, limit)
    .map(p => ({
      project: p.project,
      symbol: p.symbol,
      chain: p.chain,
      apy: parseFloat(p.apy.toFixed(2)),
      tvlUsd: p.tvlUsd,
      stablecoin: p.stablecoin
    }));

  return {
    topOpportunities: pools,
    recommendedActions: pools.slice(0, 3).map(p => ({
      action: 'allocate_yield',
      to: `${p.project} ${p.symbol}`,
      apy: p.apy,
      chain: p.chain
    }))
  };
}

module.exports = { getYieldOpportunities };
