# Troubleshooting

## General

| সমস্যা | সমাধান |
|---|---|
| `PAYMENT_MODE=mock` কিন্তু real gateway call হচ্ছে | `.env.local` restart করুন (`npm run dev` আবার চালান) |
| Port already in use | `lsof -i :3000` → process kill করুন, অথবা `npm run dev -- -p 3001` |
| `Module not found` | `npm install` আবার চালান, `node_modules` delete করে install করুন |
| Webhook আসছে না | URL public কিনা check করুন (ngrok), firewall check করুন |

## bKash

| Error | সমাধান |
|---|---|
| 401 Unauthorized | App key/secret ভুল — sandbox dashboard থেকে আবার copy করুন |
| Payment expired | Payment create-এর ১ ঘণ্টার মধ্যে execute করুন |

## Nagad

| Error | সমাধান |
|---|---|
| Invalid signature | Private key-এর `\n` real newline করুন |
| Decryption failed | Public key mismatch — সঠিক merchant key ব্যবহার করুন |

## SSLCommerz

| Error | সমাধান |
|---|---|
| Invalid Store ID | Sandbox URL + sandbox store_id match করুন |
| IPN not received | `APP_URL` public domain হতে হবে |

## এখনো সমস্যা?

1. `docs/`-এর gateway-specific guide পড়ুন
2. Gateway-এর official docs check করুন
3. GitHub Issue খুলুন — error message + `.env` (keys ছাড়া) সহ
