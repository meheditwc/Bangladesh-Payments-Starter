'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CheckoutInner() {
  const sp = useSearchParams();
  const [form, setForm] = useState({ name: 'Demo User', email: 'demo@example.com', phone: '01700000000', amount: sp.get('amount') || '999', product: sp.get('product') || 'Pro Plan' });
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  async function pay(gateway: string) {
    setLoading(gateway); setError('');
    try {
      const res = await fetch(`/api/payments/${gateway}/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Number(form.amount), customerName: form.name, customerEmail: form.email, customerPhone: form.phone, product: form.product }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');
      const url = data.payment?.bkashURL || data.payment?.callBackUrl || data.payment?.GatewayPageURL || data.payment?.redirectUrl;
      if (url) window.location.href = url;
      else if (data.payment?.mock) window.location.href = `/success?orderId=${data.order.id}`;
      else throw new Error('No redirect URL from gateway');
    } catch (e: any) { setError(e.message); setLoading(''); }
  }

  return (
    <>
      <h1>🛒 Checkout</h1>
      <p style={{ color: '#555' }}>তথ্য দিন, gateway বাছুন — mock mode-এ real টাকা কাটবে না।</p>
      <div className="form">
        <label>নাম</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>ইমেইল</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label>মোবাইল (bKash/Nagad)</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <label>Product</label><input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
        <label>Amount (BDT ৳)</label><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        {error && <div className="notice" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>❌ {error}</div>}
        <div style={{ display: 'grid', gap: 8, marginTop: 20 }}>
          <button className="btn btn-pink" disabled={!!loading} onClick={() => pay('bkash')}>{loading === 'bkash' ? 'Processing…' : '🟣 Pay with bKash'}</button>
          <button className="btn btn-orange" disabled={!!loading} onClick={() => pay('nagad')}>{loading === 'nagad' ? 'Processing…' : '🟠 Pay with Nagad'}</button>
          <button className="btn btn-dark" disabled={!!loading} onClick={() => pay('sslcommerz')}>{loading === 'sslcommerz' ? 'Processing…' : '🔵 Pay with SSLCommerz (Card / MFS)'}</button>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return <Suspense fallback={<p>Loading…</p>}><CheckoutInner /></Suspense>;
}
