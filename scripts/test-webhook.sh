#!/usr/bin/env bash
# Webhook test script — usage: ./scripts/test-webhook.sh http://localhost:3000/api/webhooks
set -e
URL="${1:-http://localhost:3000/api/webhooks}"
echo "Testing webhook at: $URL"
echo "--- SSLCommerz IPN (mock) ---"
curl -s -X POST "$URL" -H "Content-Type: application/json" -H "X-Gateway: sslcommerz" \
  -d '{"tran_id":"test-order","val_id":"MOCK-123","status":"VALID","amount":"999"}' | head -c 500
echo ""
echo "--- bKash webhook (mock) ---"
curl -s -X POST "$URL" -H "Content-Type: application/json" -H "X-Gateway: bkash" \
  -d '{"paymentID":"MOCK-BK-123","status":"completed"}' | head -c 500
echo ""
echo "✅ Done. Check server logs / DB for received events."
