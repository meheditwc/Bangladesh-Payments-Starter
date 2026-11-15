import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';
import { nagadCreatePayment } from '@/lib/payments/nagad';

export async function POST(req: NextRequest) {
  try {
    const { amount, customerName, customerEmail, customerPhone, product } = await req.json();
    const order = createOrder({
      customerName: customerName || 'Demo User', customerEmail: customerEmail || 'demo@example.com',
      customerPhone: customerPhone || '01700000000', product: product || 'Starter Product',
      amount: Number(amount) || 100, currency: 'BDT', gateway: 'nagad', meta: {},
    });
    const result = await nagadCreatePayment(order.id, order.amount, order.customerPhone);
    return NextResponse.json({ order, payment: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
