import { NextRequest, NextResponse } from 'next/server';
import { getOrder, updateOrder, logWebhook } from '@/lib/db';
import { nagadVerifyPayment } from '@/lib/payments/nagad';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentRefId = searchParams.get('payment_ref_id') || '';
  const orderId = searchParams.get('orderId') || '';
  logWebhook({ gateway: 'nagad', type: 'callback', paymentRefId });
  try {
    const verify: any = await nagadVerifyPayment(paymentRefId);
    const order = orderId ? getOrder(orderId) : null;
    if (order && (verify.status === 'SUCCESS' || verify.mock)) {
      updateOrder(order.id, { status: 'paid', gatewayTransactionId: paymentRefId });
      return NextResponse.redirect(new URL(`/success?orderId=${order.id}`, req.url));
    }
    return NextResponse.redirect(new URL(`/fail?orderId=${orderId}`, req.url));
  } catch {
    return NextResponse.redirect(new URL(`/fail?orderId=${orderId}`, req.url));
  }
}
