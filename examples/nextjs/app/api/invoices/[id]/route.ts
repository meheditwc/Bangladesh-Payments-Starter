import { NextRequest, NextResponse } from 'next/server';
import { getOrder, getOrderByInvoice } from '@/lib/db';
import { invoiceHTML } from '@/lib/invoice';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const order = getOrder(params.id) || getOrderByInvoice(params.id);
  if (!order) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  return new NextResponse(invoiceHTML(order), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
