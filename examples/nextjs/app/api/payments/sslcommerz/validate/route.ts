import { NextRequest, NextResponse } from 'next/server';
import { sslcommerzValidate } from '@/lib/payments/sslcommerz';

export async function GET(req: NextRequest) {
  const valId = new URL(req.url).searchParams.get('val_id') || '';
  const amount = Number(new URL(req.url).searchParams.get('amount') || 0);
  const result = await sslcommerzValidate(valId, amount);
  return NextResponse.json(result);
}
