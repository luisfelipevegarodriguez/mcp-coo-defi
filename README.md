# 🤖 MCP COO DeFi v2.0

Servidor MCP autónomo para optimización de yield DeFi con integración GitHub Copilot.

## 🚀 Deploy rápido

```bash
# 1. Clonar y configurar
git clone https://github.com/luisfelipevegarodriguez/mcp-coo-defi
cd mcp-coo-defi
cp .env.example .env
# Editar .env con tus keys

# 2. Local
npm ci && npm start
curl http://localhost:8080/health

# 3. Cloud Run (1-click via GitHub Actions)
# Añade GCP_SA_KEY + secrets en GitHub Settings → Secrets
# Push a main → deploy automático
```

## 🔌 Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/health` | GET | Status |
| `/mcp` | POST | Ejecutar tool |
| `/mcp/tools` | GET | Listar tools |

## 📊 Tools MCP

```json
{"tool": "get_defi_yield_opportunities", "params": {"minApy": 3, "limit": 5}}
{"tool": "get_treasury_snapshot", "params": {}}
{"tool": "get_market_signals", "params": {"query": "DeFi APY"}}
{"tool": "rebalance_portfolio", "params": {"targetAllocation": {"USDC": 60, "ETH": 40}}}
```

## 🔑 Secrets necesarios

Ver `CONFIGURE_SECRETS.sh` para instrucciones paso a paso.

## ☁️ CI/CD

Push a `main` → GitHub Actions → Cloud Run (europe-west1) automático.
Requiere: `GCP_SA_KEY`, `MCP_API_KEYS` en GitHub Secrets.
