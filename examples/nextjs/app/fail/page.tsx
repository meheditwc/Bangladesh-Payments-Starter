export default function FailPage({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <div className="success-box">
      <div className="icon">❌</div>
      <h1>Payment Failed</h1>
      <p>দুঃখিত, payment সফল হয়নি। আবার চেষ্টা করুন।</p>
      {searchParams.orderId && <p style={{ color: '#888' }}>Order: {searchParams.orderId}</p>}
      <a className="btn btn-green" style={{ maxWidth: 320, margin: '12px auto' }} href="/checkout">আবার চেষ্টা করুন</a>
    </div>
  );
}
