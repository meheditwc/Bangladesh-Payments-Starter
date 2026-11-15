/**
 * Nagad Checkout — https://developer.nagad.com.bd
 * Flow: apply token → encrypt sensitive data (RSA) → checkout → callback verify
 * Note: Nagad-এর sensitive data encryption-এর জন্য merchant public key লাগে।
 * Mock mode-এ encryption skip হয়।
 */
import crypto from 'crypto';
import { config, isMock } from '../config';

function encryptSensitiveData(data: object): string {
  const payload = JSON.stringify(data);
  const key = config.nagad.publicKey.replace(/\\n/g, '\n');
  return crypto.publicEncrypt({ key, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(payload)).toString('base64');
}

export async function nagadCreatePayment(orderId: string, amount: number, accountNumber = '01700000000') {
  if (isMock()) {
    return { mock: true, paymentRefId: `MOCK-NG-${Date.now()}`, callBackUrl: `/api/payments/nagad/callback?payment_ref_id=MOCK-NG-${Date.now()}&orderId=${orderId}`, message: 'Mock mode' };
  }
  const date = new Date();
  const dateTime = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
  const sensitive = { merchantId: config.nagad.merchantId, datetime: dateTime, orderId, accountNumber, amount: amount.toFixed(2), currency: 'BDT', challenge: crypto.randomBytes(20).toString('hex') };
  const sensitiveData = encryptSensitiveData(sensitive);
  const signature = crypto.createSign('RSA-SHA256').update(sensitiveData).sign(config.nagad.privateKey.replace(/\\n/g, '\n'), 'base64');

  const res = await fetch(`${config.nagad.baseUrl}/remote/api/apply-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Kit-Type': '1', 'X-Kit-Info': Buffer.from(JSON.stringify({ kitType: '1', kitInfo: config.nagad.merchantId })).toString('base64') },
    body: JSON.stringify({ sensitiveData, signature }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Nagad apply-token failed: ${JSON.stringify(data)}`);
  return data; // { sensitiveData, signature, callBackUrl, ... } — frontend redirect to callBackUrl
}

export async function nagadVerifyPayment(paymentRefId: string) {
  if (paymentRefId.startsWith('MOCK-')) return { mock: true, status: 'SUCCESS', amount: '0.00' };
  // Verify via Nagad "verify-payment" endpoint — docs দেখুন: docs/NAGAD.md
  const res = await fetch(`${config.nagad.baseUrl}/remote/api/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentRefId, merchantId: config.nagad.merchantId }),
  });
  return res.json();
}
