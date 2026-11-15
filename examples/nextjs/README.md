# Next.js Example 🇧🇩

Full working Next.js 14 app — bKash + Nagad + SSLCommerz, webhook, invoice, mock/sandbox mode.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
# http://localhost:3000
```

## Routes

| Route | Description |
|---|---|
| `/` | Home + products |
| `/checkout` | Checkout form |
| `/success`, `/fail`, `/cancel` | Payment result pages |
| `POST /api/orders` | Create order |
| `GET /api/orders` | List orders |
| `POST /api/payments/bkash/create` | bKash create |
| `GET /api/payments/bkash/execute` | bKash callback |
| `POST /api/payments/nagad/create` | Nagad create |
| `GET /api/payments/nagad/callback` | Nagad callback |
| `POST /api/payments/sslcommerz/init` | SSLCommerz init |
| `GET/POST /api/payments/sslcommerz/ipn` | SSLCommerz IPN |
| `POST /api/webhooks` | Unified webhook |
| `GET /api/invoices/[id]` | Printable invoice |
