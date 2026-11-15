const axios = require('axios');
const isMock = () => (process.env.PAYMENT_MODE || 'mock') === 'mock';

async function grantToken() {
  const { data } = await axios.post(`${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`,
    { app_key: process.env.BKASH_APP_KEY, app_secret: process.env.BKASH_APP_SECRET },
    { headers: { username: process.env.BKASH_USERNAME, password: process.env.BKASH_PASSWORD } });
  return data.id_token;
}

async function createPayment(orderId, amount) {
  if (isMock()) return { mock: true, paymentID: `MOCK-BK-${Date.now()}` };
  const token = await grantToken();
  const { data } = await axios.post(`${process.env.BKASH_BASE_URL}/tokenized/checkout/payment/create`,
    { mode: '0011', payerReference: orderId, callbackURL: `${process.env.APP_URL}/api/payments/bkash/execute`, amount: Number(amount).toFixed(2), currency: 'BDT', intent: 'sale', merchantInvoiceNumber: orderId },
    { headers: { authorization: `Bearer ${token}`, 'x-app-key': process.env.BKASH_APP_KEY } });
  return data;
}

async function executePayment(paymentID) {
  if (paymentID.startsWith('MOCK-')) return { mock: true, status: 'completed', trxID: paymentID };
  const token = await grantToken();
  const { data } = await axios.post(`${process.env.BKASH_BASE_URL}/tokenized/checkout/payment/execute`, { paymentID },
    { headers: { authorization: `Bearer ${token}`, 'x-app-key': process.env.BKASH_APP_KEY } });
  return data;
}

module.exports = { createPayment, executePayment };
