/**
 * bKash Tokenized Checkout — https://developer.bkash.com/docs
 * Flow: grant token → create payment → execute payment
 */
import { config, isMock } from '../config';

async function grantToken(): Promise<string> {
  const res = await fetch(`${config.bkash.baseUrl}/tokenized/checkout/token/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      username: config.bkash.username,
      password: config.bkash.password,
    },
    body: JSON.stringify({ app_key: config.bkash.appKey, app_secret: config.bkash.appSecret }),
  });
  const data = await res.json();
  if (!res.ok || !data.id_token) throw new Error(`bKash grant failed: ${JSON.stringify(data)}`);
  return data.id_token;
}

export async function bkashCreatePayment(orderId: string, amount: number) {
  if (isMock()) {
    return { mock: true, paymentID: `MOCK-BK-${Date.now()}`, bkashURL: `/api/payments/bkash/execute?paymentID=MOCK-BK-${Date.now()}&orderId=${orderId}`, message: 'Mock mode — real টাকা কাটবে না' };
  }
  const token = await grantToken();
  const res = await fetch(`${config.bkash.baseUrl}/tokenized/checkout/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', authorization: `Bearer ${token}`, 'x-app-key': config.bkash.appKey },
    body: JSON.stringify({
      mode: '0011', // 0011 = checkout
      payerReference: orderId,
      callbackURL: `${config.appUrl}/api/payments/bkash/execute`,
      amount: amount.toFixed(2),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: orderId,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`bKash create failed: ${JSON.stringify(data)}`);
  return data; // { paymentID, bkashURL, ... }
}

export async function bkashExecutePayment(paymentID: string) {
  if (paymentID.startsWith('MOCK-')) return { mock: true, status: 'completed', trxID: paymentID, amount: '0.00' };
  const token = await grantToken();
  const res = await fetch(`${config.bkash.baseUrl}/tokenized/checkout/payment/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', authorization: `Bearer ${token}`, 'x-app-key': config.bkash.appKey },
    body: JSON.stringify({ paymentID }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`bKash execute failed: ${JSON.stringify(data)}`);
  return data;
}
