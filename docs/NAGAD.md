# Nagad Checkout

Docs: https://developer.nagad.com.bd

## Sandbox Account

1. https://developer.nagad.com.bd → Merchant Onboarding
2. Merchant ID, Merchant Key, Public Key, Private Key পাবেন (email-এ)
3. `.env`-এ বসান

## Flow

```
1. Sensitive data তৈরি করুন (merchantId, datetime, orderId, accountNumber, amount, challenge)
2. Public key দিয়ে RSA encrypt → sensitiveData (base64)
3. Private key দিয়ে SHA256 sign → signature
4. POST /remote/api/apply-token → callBackUrl
5. User-কে callBackUrl-এ redirect → Nagad login → approve
6. Callback-এ payment_ref_id → verify-payment API
```

## Code

Next.js: `examples/nextjs/lib/payments/nagad.ts`
Node: `examples/node/src/services/nagad.js`
Laravel: `examples/laravel/app/Services/Payment/NagadService.php`

## Note

- `accountNumber` = customer-এর Nagad number (01XXXXXXXXX)
- `datetime` format: `YYYYMMDDHHMMSS`
- Private key-এ `\n` escape থাকলে real newline-এ convert করুন (code-এ করা আছে)

## Common Errors

| Error | কারণ | Fix |
|---|---|---|
| `Invalid signature` | Private key format ভুল | `\n` handle করুন, PEM format check করুন |
| `Decryption failed` | Public key mismatch | Merchant-এর সঠিক public key ব্যবহার করুন |
