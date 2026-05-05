#!/bin/bash
# === Configurar Secrets para Funcionalidad 100% Real ===

SERVICE_NAME=mcp-coo-defi
REGION=europe-west1

echo "🔧 Pasos para activar datos reales:"

echo ""
echo "📊 1. CoinStats (gratis, 5min):"
echo "   Portfolio Share Token: https://coinstats.app/ → Portfolio → Share → Copy Token"
echo "   API Key: https://openapi.coinstats.app/ → Developer → Generate Key"
echo ""
echo "🐦 2. Twitter/X Bearer (gratis):"
echo "   https://developer.twitter.com/en/portal/dashboard → New App → Bearer Token"
echo ""
echo "🔑 3. GitHub Secrets (para CI/CD auto-deploy):"
echo "   https://github.com/luisfelipevegarodriguez/mcp-coo-defi/settings/secrets/actions"
echo ""
echo "☁️  4. Una vez tengas los tokens, actualiza Cloud Run:"
echo "   gcloud run services update $SERVICE_NAME --region $REGION \\"
echo "     --update-env-vars COINSTATS_API_KEY=TU_KEY,COINSTATS_SHARE_TOKEN=TU_SHARE,X_BEARER_TOKEN=TU_BEARER"
