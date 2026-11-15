/**
 * SSLCommerz — https://sslcommerz.com/developer/
 * Flow: init payment (GW) → redirect → IPN/notify → validate via Validation API
 */
import { config, isMock } from '../config';

export async function sslcommerzInitPayment(orderId: string, amount: number, customer: { name: string; email: string; phone: string }) {
  if (isMock()) {
    return { mock: true, redirectUrl: `/api/payments/sslcommerz/ipn?tran_id=${orderId}&val_id=MOCK-${Date.now()}&amount=${amount}&status=VALID`, message: 'Mock mode — auto VALID' };
  }
  const params = new URLSearchParams({
    store_id: config.sslcommerz.storeId,
    store_passwd: config.sslcommerz.storePassword,
    total_amount: amount.toFixed(2),
    currency: 'BDT',
    tran_id: orderId,
    success_url: `${config.appUrl}/api/payments/sslcommerz/ipn`,
    fail_url: `${config.appUrl}/fail?orderId=${orderId}`,
    cancel_url: `${config.appUrl}/cancel?orderId=${orderId}`,
    ipn_url: `${config.appUrl}/api/payments/sslcommerz/ipn`,
    notify_url: `${config.appUrl}/api/payments/sslcommerz/ipn`,
    cus_name: customer.name,
    cus_email: customer.email,
    cus_phone: customer.phone,
    cus_add1: 'Dhaka, Bangladesh',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    shipping_method: 'NO',
    product_name: 'Starter Product',
    product_category: 'General',
    product_profile: 'general',
    num_of_item: '1',
    amount: amount.toFixed(2),
    type: 'json',
  });
  const res = await fetch(`${config.sslcommerz.baseUrl}/gwprocess/v4/gw.php`, { method: 'POST', body: params });
  const data = await res.json();
  if (data.status !== 'SUCCESS') throw new Error(`SSLCommerz init failed: ${JSON.stringify(data)}`);
  return data; // { GatewayPageURL, sessionkey, ... }
}

export async function sslcommerzValidate(valId: string, amount: number) {
  if (valId.startsWith('MOCK-')) return { mock: true, status: 'VALID', amount: String(amount) };
  const url = `${config.sslcommerz.baseUrl}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${config.sslcommerz.storeId}&store_passwd=${config.sslcommerz.storePassword}&v=1&format=json`;
  const res = await fetch(url);
  return res.json(); // { status: 'VALID' | 'INVALID', ... }
}
