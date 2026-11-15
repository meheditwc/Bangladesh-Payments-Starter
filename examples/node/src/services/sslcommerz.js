const axios = require('axios');
const isMock = () => (process.env.PAYMENT_MODE || 'mock') === 'mock';

async function initPayment(orderId, amount, customer) {
  if (isMock()) return { mock: true, redirectUrl: `${process.env.APP_URL}/api/payments/sslcommerz/ipn?tran_id=${orderId}&val_id=MOCK-${Date.now()}&status=VALID` };
  const params = new URLSearchParams({
    store_id: process.env.SSLCOMMERZ_STORE_ID, store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
    total_amount: Number(amount).toFixed(2), currency: 'BDT', tran_id: orderId,
    success_url: `${process.env.APP_URL}/api/payments/sslcommerz/ipn`, fail_url: `${process.env.APP_URL}/fail`,
    cancel_url: `${process.env.APP_URL}/cancel`, ipn_url: `${process.env.APP_URL}/api/payments/sslcommerz/ipn`,
    notify_url: `${process.env.APP_URL}/api/payments/sslcommerz/ipn`,
    cus_name: customer.name, cus_email: customer.email, cus_phone: customer.phone,
    cus_add1: 'Dhaka', cus_city: 'Dhaka', cus_country: 'Bangladesh',
    shipping_method: 'NO', product_name: 'Starter Product', product_category: 'General', product_profile: 'general', num_of_item: '1', amount: Number(amount).toFixed(2), type: 'json',
  });
  const { data } = await axios.post(`${process.env.SSLCOMMERZ_BASE_URL}/gwprocess/v4/gw.php`, params);
  return data;
}

async function validate(valId) {
  if (valId.startsWith('MOCK-')) return { mock: true, status: 'VALID' };
  const { data } = await axios.get(`${process.env.SSLCOMMERZ_BASE_URL}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&v=1&format=json`);
  return data;
}

module.exports = { initPayment, validate };
