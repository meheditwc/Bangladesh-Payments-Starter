/**
 * Demo DB — JSON file-এ orders/payments save করে।
 * Production-এ Prisma/Postgres দিয়ে replace করুন (schema: docs/SETUP.md)।
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type Gateway = 'bkash' | 'nagad' | 'sslcommerz';

export interface Order {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  product: string;
  amount: number; // BDT
  currency: string;
  gateway: Gateway | null;
  status: OrderStatus;
  gatewayTransactionId: string | null;
  paymentId: string | null;
  createdAt: string;
  paidAt: string | null;
  meta: Record<string, unknown>;
}

interface DB { orders: Order[]; webhooks: Array<Record<string, unknown>> }

function readDB(): DB {
  try {
    if (!fs.existsSync(DB_PATH)) return { orders: [], webhooks: [] };
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch { return { orders: [], webhooks: [] }; }
}
function writeDB(db: DB) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function createOrder(input: Omit<Order, 'id' | 'invoiceNo' | 'status' | 'gatewayTransactionId' | 'paymentId' | 'createdAt' | 'paidAt'>): Order {
  const db = readDB();
  const year = new Date().getFullYear();
  const order: Order = {
    ...input,
    id: crypto.randomUUID(),
    invoiceNo: `INV-${year}-${String(db.orders.length + 1).padStart(4, '0')}`,
    status: 'pending',
    gatewayTransactionId: null,
    paymentId: null,
    createdAt: new Date().toISOString(),
    paidAt: null,
  };
  db.orders.unshift(order);
  writeDB(db);
  return order;
}

export function getOrder(id: string): Order | null {
  return readDB().orders.find((o) => o.id === id) || null;
}
export function getOrderByInvoice(invoiceNo: string): Order | null {
  return readDB().orders.find((o) => o.invoiceNo === invoiceNo) || null;
}
export function listOrders(): Order[] { return readDB().orders; }

export function updateOrder(id: string, patch: Partial<Order>): Order | null {
  const db = readDB();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  db.orders[idx] = { ...db.orders[idx], ...patch };
  if (patch.status === 'paid' && !db.orders[idx].paidAt) db.orders[idx].paidAt = new Date().toISOString();
  writeDB(db);
  return db.orders[idx];
}

export function logWebhook(event: Record<string, unknown>) {
  const db = readDB();
  db.webhooks.unshift({ ...event, receivedAt: new Date().toISOString() });
  writeDB(db);
}
