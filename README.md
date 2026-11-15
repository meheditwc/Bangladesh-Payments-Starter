# Bangladesh Payments Starter 🇧🇩

> **bKash + Nagad + SSLCommerz — এক repo-তেই, copy → paste → deploy.**
> Next.js / Node (Express) / Laravel — তিন stack-এর জন্য production-ready starter kit, webhook + invoice + sandbox সহ।

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Laravel](https://img.shields.io/badge/Laravel-11-red) ![Node](https://img.shields.io/badge/Node-20-green) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## ⚡ ৩০ সেকেন্ডে শুরু করুন (Quickstart)

### Option A — Next.js (সবচেয়ে সহজ, live demo সহ)

```bash
git clone https://github.com/meheditwc/Bangladesh-Payments-Starter.git
cd Bangladesh-Payments-Starter/examples/nextjs
npm install
cp .env.example .env.local   # default: PAYMENT_MODE=mock — কোনো key ছাড়াই চলবে!
npm run dev
# → http://localhost:3000  — checkout page-এ যান, mock payment test করুন
```

### Option B — Node / Express

```bash
cd examples/node
npm install
cp .env.example .env
npm start
# → http://localhost:4000/health
```

### Option C — Laravel

```bash
cd examples/laravel
# README.md-এর instruction follow করুন — copy-paste ready controllers + services
```

> **Mock mode-এ কোনো real টাকা কাটবে না।** Sandbox key বসালেই real gateway-এ যাবে। নিচে দেখুন কীভাবে।

---

## ✨ Features

| Feature | bKash | Nagad | SSLCommerz |
|---|:---:|:---:|:---:|
| Create payment | ✅ Tokenized Checkout | ✅ Checkout | ✅ Hosted / GW |
| Execute / Verify | ✅ | ✅ Callback | ✅ Validate API |
| Refund | ✅ | ✅ | ✅ |
| Webhook / IPN | ✅ | ✅ | ✅ IPN + Notify |
| Sandbox mode | ✅ | ✅ | ✅ |
| Mock mode (key ছাড়া demo) | ✅ | ✅ | ✅ |
| Invoice generation | ✅ | ✅ | ✅ |
| Idempotency + signature verify | ✅ | ✅ | ✅ |

- **Unified API** — একই `createPayment({ gateway, amount, orderId })` interface তিন gateway-এ
- **Webhook receiver** — signature verify, idempotent handling, event log
- **Invoice** — printable HTML invoice + PDF-ready, auto invoice number (`INV-2026-XXXX`)
- **Order / transaction DB** — JSON file (demo) + Prisma schema (production)
- **Bangla + English UI** — checkout, success, fail, cancel page সহ
- **Copy-paste friendly** — প্রতিটি example standalone, কোনো monorepo build step নেই

---

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Checkout   │────▶│  Payment Service │────▶│  bKash       │
│  (UI)       │     │  (lib/payments)  │────▶│  Nagad       │
│             │◀────│                  │────▶│  SSLCommerz  │
└──────┬──────┘     └────────┬─────────┘     └──────────────┘
       │                     │
       │              ┌──────▼───────┐     ┌──────────────┐
       └─────────────▶│  Webhook /   │◀────│  Gateway     │
                      │  IPN Handler │     │  (callback)  │
                      └──────┬───────┘     └──────────────┘
                             │
                      ┌──────▼───────┐
                      │  DB + Invoice│
                      └──────────────┘
```

**Flow:** `Create Order → Gateway Payment → Callback/Webhook → Verify → Mark Paid → Generate Invoice`

---

## 📁 Repo Structure

```
Bangladesh-Payments-Starter/
├── README.md                  ← আপনি এখানে আছেন
├── docs/
│   ├── SETUP.md               ← Step-by-step setup (Bangla)
│   ├── BKASH.md               ← bKash Tokenized Checkout guide
│   ├── NAGAD.md               ← Nagad Checkout guide
│   ├── SSLCOMMERZ.md          ← SSLCommerz guide
│   ├── WEBHOOK.md             ← Webhook / IPN handling
│   ├── INVOICE.md             ← Invoice generation
│   └── TROUBLESHOOTING.md     ← Common errors & fixes
├── examples/
│   ├── nextjs/                ← ✅ Full working Next.js 14 app (live demo)
│   ├── node/                  ← Express API starter
│   └── laravel/               ← Laravel controllers + services + migration
└── scripts/
    └── test-webhook.sh        ← Webhook test script
```

---

## 🔑 Sandbox Credentials নিন (৫ মিনিট)

| Gateway | কোথায় পাবেন | Sandbox |
|---|---|---|
| **bKash** | [developer.bkash.com](https://developer.bkash.com) → Create App | `sandbox` base URL auto |
| **Nagad** | [developer.nagad.com.bd](https://developer.nagad.com.bd) → Merchant Onboarding | Sandbox keys via email |
| **SSLCommerz** | [sslcommerz.com](https://sslcommerz.com) → Merchant Panel | `sandbox.sslcommerz.com` |

> ⚠️ **কখনো `.env` Git-এ commit করবেন না।** `.env.example`-তে শুধু placeholder রাখুন।

`.env.local` example:

```env
PAYMENT_MODE=mock   # mock | sandbox | live

# bKash
BKASH_APP_KEY=your_app_key
BKASH_APP_SECRET=your_app_secret
BKASH_USERNAME=your_username
BKASH_PASSWORD=your_password
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta

# Nagad
NAGAD_MERCHANT_ID=your_merchant_id
NAGAD_MERCHANT_KEY=your_merchant_key
NAGAD_PUBLIC_KEY=your_public_key
NAGAD_PRIVATE_KEY=your_private_key
NAGAD_BASE_URL=https://api.mfs.sandbox.nagad.com.bd

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_BASE_URL=https://sandbox.sslcommerz.com

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Test করুন

```bash
# Next.js demo-তে:
# 1. http://localhost:3000 → product select → Pay with bKash (mock)
# 2. Success page → Invoice download/print
# 3. Webhook test:
./scripts/test-webhook.sh http://localhost:3000/api/webhooks/sslcommerz
```

---

## 📚 Docs

- [Setup Guide (Bangla)](docs/SETUP.md)
- [bKash Integration](docs/BKASH.md)
- [Nagad Integration](docs/NAGAD.md)
- [SSLCommerz Integration](docs/SSLCOMMERZ.md)
- [Webhook & IPN](docs/WEBHOOK.md)
- [Invoice](docs/INVOICE.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

---

## 🤝 Contributing

PR welcome! নতুন gateway (Rocket, DBBL Nexus, etc.) বা নতুন stack যোগ করতে চাইলে `docs/`-এ guide লিখে PR দিন।

## 📄 License

MIT — free for personal & commercial use.

---

**Made with ❤️ in Bangladesh** — ঢাকা থেকে, বাংলাদেশি developers-দের জন্য।
