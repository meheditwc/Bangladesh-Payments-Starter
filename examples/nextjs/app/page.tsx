export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>বাংলাদেশি Payment Integration<br /><em>এক repo-তেই।</em></h1>
        <p>bKash + Nagad + SSLCommerz — webhook, invoice আর sandbox সহ। Copy → paste → deploy। কোনো key ছাড়াই mock mode-এ test করুন।</p>
        <div className="badges">
          <span className="badge">🟣 bKash</span><span className="badge">🟠 Nagad</span><span className="badge">🔵 SSLCommerz</span>
          <span className="badge">⚡ Webhook</span><span className="badge">🧾 Invoice</span><span className="badge">🧪 Sandbox + Mock</span>
        </div>
        <a className="btn btn-green" style={{ maxWidth: 320, margin: '8px auto' }} href="/checkout">🛒 Checkout Demo-তে যান →</a>
      </section>

      <div className="grid">
        <div className="card"><h3>🟣 bKash</h3><p>Tokenized Checkout — grant token, create, execute। Sandbox-এ test করুন।</p><div className="price">৳100+</div><a className="btn btn-pink" href="/checkout?gateway=bkash">Pay with bKash</a></div>
        <div className="card"><h3>🟠 Nagad</h3><p>Checkout API — RSA encrypted sensitive data, callback verify।</p><div className="price">৳100+</div><a className="btn btn-orange" href="/checkout?gateway=nagad">Pay with Nagad</a></div>
        <div className="card"><h3>🔵 SSLCommerz</h3><p>Hosted gateway — card, mobile banking, net banking। IPN + Validate API।</p><div className="price">৳100+</div><a className="btn btn-dark" href="/checkout?gateway=sslcommerz">Pay with SSLCommerz</a></div>
      </div>

      <div className="notice" style={{ marginTop: 24 }}>
        <b>🚀 Quickstart:</b> <code>npm install && cp .env.example .env.local && npm run dev</code> — default <b>mock mode</b>-এ real টাকা কাটবে না। Sandbox key বসালেই live gateway-এ যাবে।
      </div>

      <h2 style={{ marginTop: 32 }}>📦 Products</h2>
      <div className="grid">
        {[
          { name: 'Starter Plan', price: 499, desc: '১ মাসের access, সব gateway' },
          { name: 'Pro Plan', price: 999, desc: '১ বছরের access, priority support' },
          { name: 'Lifetime', price: 4999, desc: 'Lifetime access, সব feature' },
        ].map((p) => (
          <div className="card" key={p.name}><h3>{p.name}</h3><p>{p.desc}</p><div className="price">৳{p.price.toLocaleString()}</div><a className="btn btn-outline" href={`/checkout?amount=${p.price}&product=${encodeURIComponent(p.name)}`}>কিনুন →</a></div>
        ))}
      </div>
    </>
  );
}
