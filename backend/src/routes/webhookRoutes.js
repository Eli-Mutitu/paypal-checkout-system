const express = require('express');
const router = express.Router();
const { handlePayPalWebhook } = require('../controllers/webhookController');

/**
 * POST /api/webhooks/paypal
 * Handle PayPal webhook events
 */
router.post('/paypal', handlePayPalWebhook);

module.exports = router;

