# Invoice Generation

## Invoice Number Format

```
INV-2026-0001, INV-2026-0002, ...
```

Year + sequential number। প্রতিটি order-এর জন্য auto-generate হয়।

## Next.js

Invoice page: `/api/invoices/[id]` → printable HTML

```tsx
// lib/invoice.ts
import { invoiceHTML } from '@/lib/invoice';
const html = invoiceHTML(order); // browser-এ Print → Save as PDF
```

## PDF Generation (Production)

HTML invoice-কে PDF-এ convert করতে:

- **Puppeteer** (Node): HTML → PDF
- **Dompdf / Snappy** (Laravel): Blade view → PDF
- **Browser Print**: এই starter-এ built-in — user Print button থেকে PDF save করতে পারবে

## Invoice-এ যা থাকে

- Invoice number, order ID
- Customer name, phone, email
- Product, amount (৳ format)
- Gateway, transaction ID
- Status, date, paid date
