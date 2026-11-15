require('dotenv').config();
const express = require('express');
const cors = require('cors');
const payments = require('./routes/payments');
const webhooks = require('./routes/webhooks');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ status: 'ok', mode: process.env.PAYMENT_MODE || 'mock', gateways: ['bkash', 'nagad', 'sslcommerz'] }));
app.use('/api/payments', payments);
app.use('/api/webhooks', webhooks);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🇧🇩 Bangladesh Payments (Node) → http://localhost:${PORT}`));
