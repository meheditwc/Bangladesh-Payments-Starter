# Node / Express Starter

```bash
npm install
cp .env.example .env   # PAYMENT_MODE=mock default — key ছাড়াই চলবে
npm start              # http://localhost:4000
```

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/payments/bkash/create` | bKash create |
| POST | `/api/payments/bkash/execute` | bKash execute |
| POST | `/api/payments/nagad/create` | Nagad create |
| GET | `/api/payments/nagad/callback` | Nagad callback |
| POST | `/api/payments/sslcommerz/init` | SSLCommerz init |
| GET/POST | `/api/payments/sslcommerz/ipn` | SSLCommerz IPN |
| POST | `/api/webhooks` | Unified webhook |

```bash
curl -X POST http://localhost:4000/api/payments/bkash/create \
  -H "Content-Type: application/json" \
  -d '{"amount": 999, "orderId": "ORD-001"}'
```
