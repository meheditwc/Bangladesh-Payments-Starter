# Webhook & IPN

## কেন Webhook দরকার?

User browser বন্ধ করে দিলে বা redirect fail হলে payment status জানা যাবে না। Webhook (server-to-server) নিশ্চিত করে order সঠিকভাবে `paid` হবে।

## Unified Endpoint

```
POST /api/webhooks
```

সব gateway-এর webhook এখানে আসবে। Gateway অনুযায়ী routing করুন:

| Gateway | Method | Verify পদ্ধতি |
|---|---|---|
| bKash | POST | Execute API দিয়ে status check |
| Nagad | GET/POST | verify-payment API |
| SSLCommerz | POST (IPN) | Validation API (`val_id`) |

## Production Checklist

1. **Signature verify** — gateway-এর signature check করুন
2. **Idempotency** — একই `transactionId` দুবার process করবেন না (DB unique constraint)
3. **Async processing** — webhook-এ heavy কাজ করবেন না, queue-তে পাঠান
4. **Retry handling** — gateway retry পাঠালে duplicate handle করুন
5. **Logging** — সব webhook payload log করুন (debug-এর জন্য)

## Test করুন

```bash
# scripts/test-webhook.sh ব্যবহার করুন
./scripts/test-webhook.sh http://localhost:3000/api/webhooks
```

অথবা manual:

```bash
curl -X POST http://localhost:3000/api/webhooks \
  -H "Content-Type: application/json" \
  -H "X-Gateway: sslcommerz" \
  -d '{"tran_id":"test","val_id":"MOCK-123","status":"VALID"}'
```

## Local Testing (ngrok)

Webhook URL public হতে হবে:

```bash
ngrok http 3000
# https://xxxx.ngrok-free.app/api/payments/sslcommerz/ipn
```

এই URL-টা gateway dashboard-এ (বা `.env`-এ `APP_URL`) বসান।
