/**
 * Unified payment interface — তিন gateway, এক API।
 * Usage:
 *   const result = await createPayment('bkash', orderId, amount, customer)
 */
import { bkashCreatePayment } from './bkash';
import { nagadCreatePayment } from './nagad';
import { sslcommerzInitPayment } from './sslcommerz';
import type { Gateway } from '../db';

export interface Customer { name: string; email: string; phone: string }

export async function createPayment(gateway: Gateway, orderId: string, amount: number, customer: Customer) {
  switch (gateway) {
    case 'bkash': return bkashCreatePayment(orderId, amount);
    case 'nagad': return nagadCreatePayment(orderId, amount, customer.phone);
    case 'sslcommerz': return sslcommerzInitPayment(orderId, amount, customer);
    default: throw new Error(`Unknown gateway: ${gateway}`);
  }
}

export { bkashExecutePayment } from './bkash';
export { nagadVerifyPayment } from './nagad';
export { sslcommerzValidate } from './sslcommerz';
