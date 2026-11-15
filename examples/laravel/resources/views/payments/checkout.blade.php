<!doctype html>
<html lang="bn"><head><meta charset="utf-8"><title>Checkout</title>
<style>body{font-family:system-ui;max-width:520px;margin:40px auto;padding:0 20px}input{width:100%;padding:10px;margin:6px 0 14px;border:1px solid #ddd;border-radius:8px}button{width:100%;padding:12px;border:0;border-radius:8px;font-weight:700;cursor:pointer;margin-top:8px}.bkash{background:#e2136e;color:#fff}.nagad{background:#f6921e;color:#fff}.ssl{background:#111;color:#fff}</style>
</head><body>
<h1>🛒 Checkout</h1>
<form method="POST" action="{{ route('payments.bkash.create') }}">@csrf
  <label>নাম</label><input name="name" value="Demo User">
  <label>Amount (BDT)</label><input name="amount" type="number" value="999">
  <button class="bkash">🟣 Pay with bKash</button>
</form>
<form method="POST" action="{{ route('payments.nagad.create') }}">@csrf
  <input type="hidden" name="amount" value="999"><button class="nagad">🟠 Pay with Nagad</button>
</form>
<form method="POST" action="{{ route('payments.sslcommerz.init') }}">@csrf
  <input type="hidden" name="amount" value="999"><button class="ssl">🔵 Pay with SSLCommerz</button>
</form>
</body></html>
