export default function CancelPage() {
  return (
    <div className="success-box">
      <div className="icon">⚠️</div>
      <h1>Payment Cancelled</h1>
      <p>আপনি payment cancel করেছেন। কোনো টাকা কাটা হয়নি।</p>
      <a className="btn btn-green" style={{ maxWidth: 320, margin: '12px auto' }} href="/checkout">আবার চেষ্টা করুন</a>
    </div>
  );
}
