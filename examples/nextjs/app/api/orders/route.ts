import { NextRequest, NextResponse } from 'next/server';
import { createOrder, listOrders } from '@/lib/db';

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { customerName, customerEmail, customerPhone, product, amount, gateway } = body;
  if (!customerName || !amount || Number(amount) <= 0) {
    return NextResponse.json({ error: 'customerName and valid amount required' }, { status: 400 });
  }
  const order = createOrder({
    customerName, customerEmail: customerEmail || 'test@example.com',
    customerPhone: customerPhone || '01700000000',
    product: product || 'Starter Product', amount: Number(amount),
    currency: 'BDT', gateway: gateway || null, meta: {},
  });
  return NextResponse.json({ order }, { status: 201 });
}
