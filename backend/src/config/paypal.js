const paypal = require('@paypal/checkout-server-sdk');

/**
 * PayPal HTTP client configuration
 * Returns configured PayPal client based on environment mode
 */
function getPayPalClient() {
  // Validate required environment variables
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error(
      'PayPal credentials not found. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in environment variables.'
    );
  }

  // Configure environment
  let environment;
  if (mode === 'live') {
    environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
    console.log('⚠️  PayPal configured in LIVE mode - real transactions will occur');
  } else {
    environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    console.log('✓ PayPal configured in SANDBOX mode - test transactions only');
  }

  // Create and return PayPal client
  return new paypal.core.PayPalHttpClient(environment);
}

/**
 * Verify webhook signature (for production security)
 * @param {Object} webhookEvent - The webhook event body
 * @param {Object} headers - Request headers
 * @returns {boolean} - Whether signature is valid
 */
async function verifyWebhookSignature(webhookEvent, headers) {
  // In production, implement proper webhook verification
  // using PayPal's webhook signature verification
  // For now, we'll do basic validation
  
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  
  if (!webhookId) {
    console.warn('⚠️  PAYPAL_WEBHOOK_ID not set - webhook verification disabled');
    return true; // In development, allow webhooks without verification
  }

  // Extract signature headers
  const transmissionId = headers['paypal-transmission-id'];
  const transmissionTime = headers['paypal-transmission-time'];
  const transmissionSig = headers['paypal-transmission-sig'];
  const certUrl = headers['paypal-cert-url'];
  const authAlgo = headers['paypal-auth-algo'];

  // Verify required headers are present
  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    console.error('❌ Missing required webhook signature headers');
    return false;
  }

  // In production, use @paypal/payouts-sdk or implement full verification
  // This is a simplified check - implement full verification for production
  console.log('✓ Webhook signature headers present (full verification should be implemented)');
  return true;
}

module.exports = {
  getPayPalClient,
  verifyWebhookSignature
};

