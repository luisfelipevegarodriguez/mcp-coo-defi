const axios = require('axios');

async function getSnapshot() {
  const shareToken = process.env.COINSTATS_SHARE_TOKEN;
  const apiKey = process.env.COINSTATS_API_KEY;

  if (!shareToken || shareToken === 'PENDIENTE') {
    return {
      status: 'demo',
      totalUsd: 12500,
      totalStablesUsd: 7500,
      note: 'Configure COINSTATS_SHARE_TOKEN para datos reales'
    };
  }

  const { data } = await axios.get(
    `https://openapi.coinstats.app/public/v1/portfolio/summary`,
    { headers: { 'X-API-KEY': apiKey } }
  );
  return data;
}

async function rebalance({ targetAllocation = {} } = {}) {
  const snapshot = await getSnapshot();
  return {
    currentSnapshot: snapshot,
    targetAllocation,
    status: 'simulation',
    message: 'Connect exchange API for live execution'
  };
}

module.exports = { getSnapshot, rebalance };
