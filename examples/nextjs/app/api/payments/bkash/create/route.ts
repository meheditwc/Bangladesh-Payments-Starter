import { NextRequest, NextResponse } from 'next/server';
import { createOrder, updateOrder } from '@/lib/db';
import { bkashCreatePayment } from '@/lib/payments/bkash';

export async function POST(req: NextRequest) {
  try {
    const { amount, customerName, customerEmail, customerPhone, product } = await req.json();
    const order = createOrder({
      customerName: customerName || 'Demo User', customerEmail: customerEmail || 'demo@example.com',
      customerPhone: customerPhone || '01700000000', product: product || 'Starter Product',
      amount: Number(amount) || 100, currency: 'BDT', gateway: 'bkash', meta: {},
    });
    const result = await bkashCreatePayment(order.id, order.amount);
    updateOrder(order.id, { paymentId: (result as any).paymentID || null });
    return NextResponse.json({ order, payment: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
