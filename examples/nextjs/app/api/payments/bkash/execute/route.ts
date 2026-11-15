import { NextRequest, NextResponse } from 'next/server';
import { getOrder, updateOrder } from '@/lib/db';
import { bkashExecutePayment } from '@/lib/payments/bkash';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get('paymentID') || '';
  const orderId = searchParams.get('orderId') || '';
  try {
    const result = await bkashExecutePayment(paymentID);
    const order = orderId ? getOrder(orderId) : null;
    if (order && (result.status === 'completed' || result.mock)) {
      updateOrder(order.id, { status: 'paid', gatewayTransactionId: result.trxID || paymentID });
      return NextResponse.redirect(new URL(`/success?orderId=${order.id}`, req.url));
    }
    return NextResponse.redirect(new URL(`/fail?orderId=${orderId}`, req.url));
  } catch {
    return NextResponse.redirect(new URL(`/fail?orderId=${orderId}`, req.url));
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const result = await bkashExecutePayment(body.paymentID || '');
  return NextResponse.json(result);
}
