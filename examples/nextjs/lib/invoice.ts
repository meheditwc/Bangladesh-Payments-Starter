import type { Order } from './db';

export function formatBDT(n: number) {
  return `৳${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Printable HTML invoice — browser থেকে Print → Save as PDF করা যাবে। */
export function invoiceHTML(order: Order): string {
  const rows = `
    <tr><td>Invoice No</td><td><b>${order.invoiceNo}</b></td></tr>
    <tr><td>Order ID</td><td>${order.id}</td></tr>
    <tr><td>Customer</td><td>${order.customerName} (${order.customerPhone})</td></tr>
    <tr><td>Email</td><td>${order.customerEmail}</td></tr>
    <tr><td>Product</td><td>${order.product}</td></tr>
    <tr><td>Gateway</td><td>${order.gateway?.toUpperCase() || '—'}</td></tr>
    <tr><td>Transaction ID</td><td>${order.gatewayTransactionId || '—'}</td></tr>
    <tr><td>Status</td><td><span class="badge">${order.status.toUpperCase()}</span></td></tr>
    <tr><td>Date</td><td>${new Date(order.createdAt).toLocaleString('en-GB')}</td></tr>
    ${order.paidAt ? `<tr><td>Paid At</td><td>${new Date(order.paidAt).toLocaleString('en-GB')}</td></tr>` : ''}
  `;
  return `<!doctype html><html lang="bn"><head><meta charset="utf-8"><title>Invoice ${order.invoiceNo}</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 20px;color:#111}
    .head{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #006a4e;padding-bottom:16px}
    .head h1{color:#006a4e;margin:0;font-size:24px}
    table{width:100%;border-collapse:collapse;margin-top:20px}
    td{padding:10px 12px;border-bottom:1px solid #eee;font-size:14px}
    td:first-child{color:#666;width:160px}
    .total{font-size:20px;font-weight:800;color:#006a4e;text-align:right;margin-top:16px}
    .badge{background:#e6f4ea;color:#006a4e;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:700}
    .print{margin-top:24px;text-align:center}
    button{background:#006a4e;color:#fff;border:0;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700}
    @media print{.print{display:none}}
  </style></head><body>
  <div class="head"><h1>🇧🇩 Bangladesh Payments</h1><span>INVOICE</span></div>
  <table>${rows}</table>
  <div class="total">Total: ${formatBDT(order.amount)}</div>
  <p style="color:#888;font-size:12px;margin-top:24px">This is a computer-generated invoice. ধন্যবাদ!</p>
  <div class="print"><button onclick="window.print()">🖨️ Print / Save as PDF</button></div>
  </body></html>`;
}
