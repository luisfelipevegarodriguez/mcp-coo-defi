const axios = require('axios');

async function getSignals({ query = 'DeFi yield APY', maxResults = 10 } = {}) {
  const bearer = process.env.X_BEARER_TOKEN;

  if (!bearer || bearer === 'PENDIENTE') {
    return {
      status: 'demo',
      signals: [
        { text: 'Maple Finance USDC pool hitting 4.89% APY - solid risk-adjusted yield', sentiment: 'bullish' },
        { text: 'Pendle PT-sUSDe yield stabilizing around 8% with maturity in 60 days', sentiment: 'bullish' }
      ],
      note: 'Configure X_BEARER_TOKEN para señales reales'
    };
  }

  const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}&tweet.fields=created_at,public_metrics`;
  const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${bearer}` } });
  return { signals: data.data || [], meta: data.meta };
}

module.exports = { getSignals };
