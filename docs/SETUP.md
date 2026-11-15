# Setup Guide (Bangla)

## ১. কোন stack বাছবেন?

| Stack | কখন ব্যবহার করবেন |
|---|---|
| **Next.js** | React/Next.js project, full-stack চান |
| **Node/Express** | API-only backend, যেকোনো frontend-এর সাথে |
| **Laravel** | Laravel project আছে |

## ২. Next.js Setup

```bash
cd examples/nextjs
npm install
cp .env.example .env.local
npm run dev
# http://localhost:3000
```

Default `PAYMENT_MODE=mock` — কোনো key ছাড়াই checkout flow test করতে পারবেন।

## ৩. Sandbox Key বসানো

1. `.env.local` খুলুন
2. `PAYMENT_MODE=sandbox` করুন
3. Gateway অনুযায়ী key বসান (নিচের docs দেখুন)
4. `npm run dev` restart করুন

## ৪. Production DB (Prisma)

Demo-তে JSON file DB ব্যবহার হয় (`data/db.json`)। Production-এ:

```prisma
// prisma/schema.prisma
model Order {
  id          String   @id @default(uuid())
  invoiceNo   String   @unique
  customerName String
  customerEmail String
  customerPhone String
  product     String
  amount      Float
  currency    String   @default("BDT")
  gateway     String?
  status      String   @default("pending")
  gatewayTransactionId String?
  paymentId   String?
  createdAt   DateTime @default(now())
  paidAt      DateTime?
}
```

`lib/db.ts`-এর functions গুলো Prisma দিয়ে replace করুন — interface একই থাকবে।

## ৫. Deploy

- **Vercel:** Next.js example root হিসেবে deploy করুন, env vars dashboard-এ বসান
- **Node:** যেকোনো VPS / Render / Railway — `npm start`
- **Laravel:** `php artisan migrate`, webhook URL public হতে হবে (ngrok দিয়ে test করুন)

## ৬. Security Checklist

- [ ] `.env` কখনো Git-এ commit করবেন না
- [ ] Webhook-এ signature verify করুন
- [ ] Payment verify না করে order-কে `paid` mark করবেন না
- [ ] Amount server-side validate করুন (client থেকে পাঠানো amount trust করবেন না)
- [ ] Idempotency: একই transaction দুবার process করবেন না
