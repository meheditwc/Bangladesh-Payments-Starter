const router = require('express').Router();
const bkash = require('../services/bkash');
const nagad = require('../services/nagad');
const sslcommerz = require('../services/sslcommerz');

// POST /api/payments/bkash/create  { amount, orderId }
router.post('/bkash/create', async (req, res) => {
  try { res.json(await bkash.createPayment(req.body.orderId || `ORD-${Date.now()}`, req.body.amount || 100)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/bkash/execute', async (req, res) => {
  try { res.json(await bkash.executePayment(req.body.paymentID)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/payments/nagad/create
router.post('/nagad/create', async (req, res) => {
  try { res.json(await nagad.createPayment(req.body.orderId || `ORD-${Date.now()}`, req.body.amount || 100, req.body.phone)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/nagad/callback', async (req, res) => {
  const result = await nagad.verifyPayment(req.query.payment_ref_id || '');
  res.json(result);
});

// POST /api/payments/sslcommerz/init
router.post('/sslcommerz/init', async (req, res) => {
  try { res.json(await sslcommerz.initPayment(req.body.orderId || `ORD-${Date.now()}`, req.body.amount || 100, req.body.customer || { name: 'Demo', email: 'demo@example.com', phone: '01700000000' })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// SSLCommerz IPN (GET + POST)
async function ipnHandler(req, res) {
  const params = { ...req.query, ...req.body };
  const validation = await sslcommerz.validate(params.val_id || '');
  // TODO: order update করুন — validation.status === 'VALID' হলে paid mark করুন
  res.json({ received: true, validation });
}
router.get('/sslcommerz/ipn', ipnHandler);
router.post('/sslcommerz/ipn', ipnHandler);

module.exports = router;
