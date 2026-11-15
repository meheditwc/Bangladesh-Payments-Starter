# bKash Tokenized Checkout

Docs: https://developer.bkash.com/docs

## Sandbox Account

1. https://developer.bkash.com → Sign up → Create App
2. App Key, App Secret, Username, Password পাবেন
3. `.env`-এ বসান, `BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta`

## Flow

```
1. POST /tokenized/checkout/token/grant        → id_token
2. POST /tokenized/checkout/payment/create     → paymentID + bkashURL
3. User bkashURL-এ redirect → login → approve
4. callbackURL-এ paymentID সহ redirect
5. POST /tokenized/checkout/payment/execute    → status: completed, trxID
```

## Code

Next.js: `examples/nextjs/lib/payments/bkash.ts`
Node: `examples/node/src/services/bkash.js`
Laravel: `examples/laravel/app/Services/Payment/BkashService.php`

## Refund

`POST /tokenized/checkout/payment/refund` — paymentID, amount, trxID, reason সহ।

## Common Errors

| Error | কারণ | Fix |
|---|---|---|
| `401 Unauthorized` | ভুল app_key/secret | Sandbox credentials check করুন |
| `paymentID not found` | Expired payment | নতুন payment create করুন |
| `amount mismatch` | Create vs execute amount আলাদা | Server-side amount use করুন |
