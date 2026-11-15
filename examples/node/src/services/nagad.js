const axios = require('axios');
const crypto = require('crypto');
const isMock = () => (process.env.PAYMENT_MODE || 'mock') === 'mock';

async function createPayment(orderId, amount, accountNumber = '01700000000') {
  if (isMock()) return { mock: true, paymentRefId: `MOCK-NG-${Date.now()}` };
  const now = new Date();
  const datetime = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const sensitive = { merchantId: process.env.NAGAD_MERCHANT_ID, datetime, orderId, accountNumber, amount: Number(amount).toFixed(2), currency: 'BDT', challenge: crypto.randomBytes(20).toString('hex') };
  const sensitiveData = crypto.publicEncrypt({ key: process.env.NAGAD_PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(JSON.stringify(sensitive))).toString('base64');
  const signature = crypto.createSign('RSA-SHA256').update(sensitiveData).sign(process.env.NAGAD_PRIVATE_KEY, 'base64');
  const { data } = await axios.post(`${process.env.NAGAD_BASE_URL}/remote/api/apply-token`, { sensitiveData, signature },
    { headers: { 'X-Kit-Type': '1', 'X-Kit-Info': Buffer.from(JSON.stringify({ kitType: '1', kitInfo: process.env.NAGAD_MERCHANT_ID })).toString('base64') } });
  return data;
}

async function verifyPayment(paymentRefId) {
  if (paymentRefId.startsWith('MOCK-')) return { mock: true, status: 'SUCCESS' };
  const { data } = await axios.post(`${process.env.NAGAD_BASE_URL}/remote/api/verify-payment`, { paymentRefId, merchantId: process.env.NAGAD_MERCHANT_ID });
  return data;
}

module.exports = { createPayment, verifyPayment };
