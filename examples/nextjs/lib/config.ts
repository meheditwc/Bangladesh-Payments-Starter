/**
 * Central config — সব gateway-এর env এক জায়গায়।
 * PAYMENT_MODE=mock হলে কোনো key ছাড়াই demo চলবে (real টাকা কাটবে না)।
 */
export const config = {
  mode: (process.env.PAYMENT_MODE || 'mock') as 'mock' | 'sandbox' | 'live',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  bkash: {
    appKey: process.env.BKASH_APP_KEY || '',
    appSecret: process.env.BKASH_APP_SECRET || '',
    username: process.env.BKASH_USERNAME || '',
    password: process.env.BKASH_PASSWORD || '',
    baseUrl: process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
  },

  nagad: {
    merchantId: process.env.NAGAD_MERCHANT_ID || '',
    merchantKey: process.env.NAGAD_MERCHANT_KEY || '',
    publicKey: process.env.NAGAD_PUBLIC_KEY || '',
    privateKey: process.env.NAGAD_PRIVATE_KEY || '',
    baseUrl: process.env.NAGAD_BASE_URL || 'https://api.mfs.sandbox.nagad.com.bd',
  },

  sslcommerz: {
    storeId: process.env.SSLCOMMERZ_STORE_ID || '',
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
    baseUrl: process.env.SSLCOMMERZ_BASE_URL || 'https://sandbox.sslcommerz.com',
  },
};

export const isMock = () => config.mode === 'mock';
export const isConfigured = (gateway: 'bkash' | 'nagad' | 'sslcommerz') => {
  if (isMock()) return false;
  if (gateway === 'bkash') return !!(config.bkash.appKey && config.bkash.appSecret);
  if (gateway === 'nagad') return !!(config.nagad.merchantId && config.nagad.merchantKey);
  return !!(config.sslcommerz.storeId && config.sslcommerz.storePassword);
};
