/**
 * SSLCommerz IPN / Notify / Success handler (একই endpoint)।
 * ⚠️ IPN-কে কখনো browser redirect হিসেবে trust করবেন না — validate API call করুন।
 */
import { NextRequest, NextResponse } from 'next/server';
import { getOrder, updateOrder, logWebhook } from '@/lib/db';
import { sslcommerzValidate } from '@/lib/payments/sslcommerz';

async function handle(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const params: Record<string, string> = {};
  if (form) form.forEach((v, k) => { params[k] = String(v); });
  const { searchParams } = new URL(req.url);
  searchParams.forEach((v, k) => { if (!params[k]) params[k] = v; });

  logWebhook({ gateway: 'sslcommerz', type: 'ipn', params });
  const tranId = params.tran_id || '';
  const valId = params.val_id || '';
  const order = tranId ? getOrder(tranId) : null;

  try {
    const validation: any = await sslcommerzValidate(valId, order?.amount || 0);
    if (order && validation.status === 'VALID') {
      updateOrder(order.id, { status: 'paid', gatewayTransactionId: valId });
      return NextResponse.redirect(new URL(`/success?orderId=${order.id}`, req.url));
    }
    if (order) updateOrder(order.id, { status: 'failed' });
    return NextResponse.redirect(new URL(`/fail?orderId=${tranId}`, req.url));
  } catch {
    return NextResponse.redirect(new URL(`/fail?orderId=${tranId}`, req.url));
  }
}

export async function GET(req: NextRequest) { return handle(req); }
export async function POST(req: NextRequest) { return handle(req); }
