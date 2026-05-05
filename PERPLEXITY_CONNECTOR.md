# 🔌 Perplexity Remote MCP Connector

## Configuración

| Campo | Valor |
|-------|-------|
| **Name** | MCP COO DeFi Live |
| **URL** | `https://TU_SERVICE_URL/mcp` |
| **API Key Header** | `x-api-key` |

## Tools disponibles

| Tool | Descripción |
|------|-------------|
| `get_defi_yield_opportunities` | Top pools DeFi por APY (vía DefiLlama) |
| `get_treasury_snapshot` | Portfolio snapshot (vía CoinStats) |
| `get_market_signals` | Señales Twitter/X DeFi |
| `rebalance_portfolio` | Simulación de rebalanceo |

## Prompt de prueba

```
Analiza mi portfolio DeFi actual y dame las 3 mejores oportunidades
yield >3% APY con recomendaciones específicas. Usa datos live.
```

## Registrar en Perplexity

1. Ve a [Perplexity Settings → MCP](https://www.perplexity.ai/settings)
2. Add Server → Remote
3. Pega URL + API Key
4. Test: `get_defi_yield_opportunities({"minApy":3,"limit":3})`
