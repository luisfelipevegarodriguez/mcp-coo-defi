const express = require('express');
const router = express.Router();
const defiService = require('../services/defiService');
const twitterService = require('../services/twitterService');
const treasuryService = require('../services/treasuryService');

const TOOLS = {
  get_defi_yield_opportunities: (p) => defiService.getYieldOpportunities(p),
  get_treasury_snapshot: (p) => treasuryService.getSnapshot(p),
  get_market_signals: (p) => twitterService.getSignals(p),
  rebalance_portfolio: (p) => treasuryService.rebalance(p)
};

router.post('/', async (req, res) => {
  const { tool, params = {} } = req.body;
  if (!tool || !TOOLS[tool]) return res.status(400).json({ error: `Unknown tool: ${tool}` });
  try {
    const result = await TOOLS[tool](params);
    res.json({ tool, result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/tools', (req, res) => res.json({ tools: Object.keys(TOOLS) }));
module.exports = { router };
