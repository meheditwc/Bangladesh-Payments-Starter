/**
 * Unified webhook receiver — সব gateway-এর webhook এখানে আসবে।
 * Production-এ: signature verify + idempotency key check + async queue।
 * Docs: docs/WEBHOOK.md
 */
import { NextRequest, NextResponse } from 'next/server';
import { logWebhook } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const gateway = req.headers.get('x-gateway') || body.gateway || 'unknown';
  // TODO (production): gateway অনুযায়ী signature verify করুন
  // bKash: x-verify? Nagad: signature field, SSLCommerz: val_id দিয়ে validate
  logWebhook({ gateway, body, headers: Object.fromEntries(req.headers.entries()) });
  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: 'webhook endpoint ready', docs: '/docs/WEBHOOK.md' });
}
