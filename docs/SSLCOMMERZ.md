# SSLCommerz

Docs: https://sslcommerz.com/developer/

## Sandbox Account

1. https://sslcommerz.com → Merchant Panel → Sandbox credentials
2. Store ID + Store Password পাবেন
3. `.env`-এ বসান, `SSLCOMMERZ_BASE_URL=https://sandbox.sslcommerz.com`

## Flow

```
1. POST /gwprocess/v4/gw.php (form data) → GatewayPageURL
2. User-কে GatewayPageURL-এ redirect → card / bKash / Nagad / net banking
3. success_url / fail_url / cancel_url-এ redirect
4. ipn_url + notify_url-এ server-to-server POST (IPN)
5. val_id দিয়ে Validation API → status: VALID হলে paid
```

## ⚠️ IPN Security

IPN-কে কখনো সরাসরি trust করবেন না। সবসময় Validation API call করে `status === 'VALID'` check করুন।

## Code

Next.js: `examples/nextjs/lib/payments/sslcommerz.ts`
Node: `examples/node/src/services/sslcommerz.js`
Laravel: `examples/laravel/app/Services/Payment/SslcommerzService.php`

## Test Cards (Sandbox)

SSLCommerz sandbox-এ test card details merchant panel-এ পাবেন। সাধারণত:
- Visa: `4000056655665556`
- Mastercard: `4200070000000010`

## Common Errors

| Error | কারণ | Fix |
|---|---|---|
| `Invalid Store ID` | ভুল store_id | Sandbox vs live URL mismatch check করুন |
| `IPN not received` | URL public নয় | ngrok / public domain ব্যবহার করুন |
