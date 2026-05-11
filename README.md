<div align="center">

# ⚡ Grok World Orchestrator

**Autonomous DeFi Yield Autopilot for Worldcoin Mini Apps**

[![Status](https://img.shields.io/badge/status-production-BEFF00?style=for-the-badge)]()
[![World Chain](https://img.shields.io/badge/chain-World%20Chain-000000?style=for-the-badge)]()
[![License](https://img.shields.io/badge/license-MIT-FAFAFA?style=for-the-badge)]()

*Verified humans only. Zero-friction. AI-driven. 24/7 autonomous.*

</div>

---

## 🎯 What it does

Idle WLD/USDC in World App → automatically deployed to the highest-yield, risk-adjusted Morpho Blue market on World Chain, continuously monitored and rebalanced by an autonomous Grok-powered worker.

Sign once. Earn forever. Verified by World ID. No bots. No seed phrases.

---

## 🏗️ Architecture

```
World App (Mini App)
    ↓  MiniKit.signMessage (EIP-191)
Vercel Edge (Next.js 15)
    ↓  POST /api/inference
Railway API (Grok + Gemini fallback)
    ↓  DecisionZ → BullMQ
Railway Worker (24/7)
    ├─ Morpho Blue executor (viem)
    ├─ APY monitor (60s loop)
    ├─ Auto-rebalance engine
    └─ Session-key withdrawals (ERC-4337)
    ↓
PostgreSQL + Redis + Prometheus + Grafana
```

---

## 🚀 Quick Deploy (production)

```bash
# 1. Repo
gh repo create grok-world-orchestrator --private --clone && cd grok-world-orchestrator

# 2. Merge monorepo
git remote add fincloud ../fincloud-mono
git fetch fincloud
git merge fincloud/main --allow-unrelated-histories -m "chore: merge fincloud-mono"

# 3. Railway (API + Worker — set Root Directory per service)
railway link && railway up

# 4. Vercel (Mini App + Dashboard)
cd apps/web && vercel --prod
```

**Required env vars (Railway):** `EXECUTOR_PK`, `WORLD_CHAIN_RPC`, `DATABASE_URL`, `REDIS_URL`, `XAI_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `BACKEND_INTERNAL_KEY`, `CALLBACK_HMAC_SECRET`.

**Required env vars (Vercel):** `NEXT_PUBLIC_WORLD_APP_ID`, `NEXT_PUBLIC_API_URL`.

---

## 🔐 Security

| Layer | Defense |
|-------|---------|
| Auth | EIP-191 via `viem.verifyMessage` + nonce + 5min TTL |
| Rate | Redis 10 req/min per IP+address |
| Secrets | Railway/Vercel encrypted, never in code, rotated 90d |
| Contracts | Morpho Blue `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` (audited) |
| Exec | maxAmount cap, minAPY 4.5%, maxSlippage 0.5%, Safe + 48h timelock |
| CI | Slither + Mythril + Foundry invariants 100k runs + TruffleHog |
| Headers | CSP, XFO, XXSS, Referrer-Policy strict |
| Kill-switch | `GLOBAL_PAUSE=true` via Railway → instant halt |

---

## 📊 APIs

| Endpoint | Description |
|----------|--------------|
| `POST /api/inference` | Sign → Grok decision → auto-queue |
| `GET /api/health` | DB + Redis + LLM status |
| `GET /api/decisions/recent?risk=high&limit=10` | Recent decisions feed |
| `GET /api/decisions/:id` | Decision detail + execution result |
| `POST /api/decisions/:id/resolve` | Approve/block manual override |

---

## 🎨 Design System

```ts
font: PP Neue Montreal + Söhne + JetBrains Mono
color: #0A0A0A / #FAFAFA / #BEFF00 (acid accent) / #FF2D75 (danger)
motion: Framer Motion spring (380/30), 160-240ms transitions
shadow: 0 0 80px rgba(190,255,0,0.15) glow
```

Reference tier: Linear · Arc · Rainbow · Phantom · Family.

---

## 🌏 Growth mechanics

- **Red envelopes (红包)** — Friday 20:00 CET random WLD airdrop to top 100 active users
- **Group buying** — +0.5% APY boost when 3 World-ID-verified friends deposit
- **Lucky draw** — 1 ticket per $10 deposited, weekly $1K WLD prize
- **Live counter** — Server-Sent Events feed: "X users earned Y WLD today"
- **Super-app** — yield → swap → lend → insurance in one mini app

---

## 📈 Metrics & Observability

- Grafana dashboards: queue backlog, failed jobs, inference P95, risk distribution
- Prometheus alerts: backlog >20, failed >10%/h, latency >10s
- Pino structured logs with secret redaction

---

## 🗺️ Roadmap

| Phase | Milestone |
|-------|-----------|
| Week 1 | Mainnet launch, invite-only 1K verified users |
| Week 4 | Public launch + Layer3 quest + Galxe campaign |
| Month 2 | Featured in World App store |
| Month 3 | Multi-protocol expansion (Aave + Pendle + Re7) |
| Month 6 | Insurance vault + social yield boost |
| Month 12 | Full super-app: swap + lending + insurance |

---

## 🧪 Local development

```bash
pnpm install
pnpm --filter backend prisma generate
pnpm --filter backend prisma db push
pnpm --filter backend prisma db seed
docker compose up -d
curl localhost:3001/api/health  # ✅ healthy
```

---

## 🛑 Emergency

```bash
railway variables set GLOBAL_PAUSE=true --service backend --service worker
# Smart contract: guardian.pause() via Safe (instant)
```

---

## 📦 Monorepo structure

```
grok-world-orchestrator/
├── apps/
│   ├── web/         → Mini App (Vercel, Next.js 15)
│   ├── api/         → Backend (Railway, Route Handlers)
│   ├── worker/      → Autonomous executor (Railway, BullMQ)
│   └── dashboard/   → Ops dashboard (Vercel)
├── packages/
│   ├── shared/      → Zod schemas, prompts, verifySignature
│   ├── ui/          → Design tokens + components
│   └── queue/       → BullMQ wrappers
├── infra/
│   ├── prometheus/  → metrics config
│   └── grafana/     → provisioning
├── prisma/          → schema + seed
├── .github/workflows/ → ci.yml + deploy.yml + audit.yml
├── docker-compose.yml
├── turbo.json
└── README.md
```

---

## 📜 License

MIT © 2026 Luis Felipe Vega Rodriguez

---

<div align="center">

**Built for the 25M+ verified humans on World App.**

[Worldcoin](https://worldcoin.org) · [Morpho](https://morpho.org) · [Railway](https://railway.app) · [Vercel](https://vercel.com)

</div>
