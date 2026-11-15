const router = require('express').Router();

// Unified webhook — signature verify + idempotency এখানে করুন (docs/WEBHOOK.md)
router.post('/', (req, res) => {
  console.log('[webhook]', req.headers['x-gateway'] || 'unknown', JSON.stringify(req.body).slice(0, 500));
  res.json({ received: true });
});

module.exports = router;
