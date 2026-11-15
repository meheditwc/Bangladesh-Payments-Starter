import { Suspense } from 'react';
import { getOrder } from '@/lib/db';
import { formatBDT } from '@/lib/invoice';

async function Inner({ orderId }: { orderId: string }) {
  const order = orderId ? getOrder(orderId) : null;
  return (
    <div className="success-box">
      <div className="icon">✅</div>
      <h1>Payment Successful! 🎉</h1>
      <p>ধন্যবাদ! আপনার payment সফল হয়েছে।</p>
      {order && (
        <div className="card" style={{ textAlign: 'left', maxWidth: 480, margin: '20px auto' }}>
          <p><b>Invoice:</b> {order.invoiceNo}</p>
          <p><b>Product:</b> {order.product}</p>
          <p><b>Amount:</b> {formatBDT(order.amount)}</p>
          <p><b>Gateway:</b> {order.gateway?.toUpperCase()}</p>
          <p><b>Transaction:</b> {order.gatewayTransactionId || '—'}</p>
          <a className="btn btn-green" href={`/api/invoices/${order.id}`}>🧾 Invoice দেখুন / Print করুন</a>
        </div>
      )}
      <a className="btn btn-outline" style={{ maxWidth: 320, margin: '8px auto' }} href="/">← Home-এ ফিরুন</a>
    </div>
  );
}

export default async function SuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  return <Suspense fallback={<p>Loading…</p>}><Inner orderId={searchParams.orderId || ''} /></Suspense>;
}
