const defiService = require('../src/services/defiService');

describe('DeFi Service', () => {
  it('returns yield opportunities', async () => {
    const result = await defiService.getYieldOpportunities({ minApy: 3, limit: 3 });
    expect(result.topOpportunities).toBeDefined();
    expect(result.topOpportunities.length).toBeGreaterThan(0);
    expect(result.topOpportunities[0].apy).toBeGreaterThanOrEqual(3);
  }, 15000);
});
