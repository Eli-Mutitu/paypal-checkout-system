const { verifyWebhookSignature } = require('../config/paypal');

/**
 * Handle PayPal webhook events
 * POST /api/webhooks/paypal
 */
async function handlePayPalWebhook(req, res, next) {
  try {
    const webhookEvent = req.body;
    const headers = req.headers;

    // Verify webhook signature for security
    const isValid = await verifyWebhookSignature(webhookEvent, headers);
    
    if (!isValid) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid webhook signature'
      });
    }

    // Extract event details
    const eventType = webhookEvent.event_type;
    const resourceId = webhookEvent.resource?.id;

    console.log('📨 Webhook received:', {
      eventType: eventType,
      resourceId: resourceId,
      timestamp: new Date().toISOString()
    });

    // Handle different event types
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptureCompleted(webhookEvent);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentCaptureDenied(webhookEvent);
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentCaptureRefunded(webhookEvent);
        break;

      case 'CHECKOUT.ORDER.APPROVED':
        await handleCheckoutOrderApproved(webhookEvent);
        break;

      case 'CHECKOUT.ORDER.COMPLETED':
        await handleCheckoutOrderCompleted(webhookEvent);
        break;

      default:
        console.log(`ℹ️  Unhandled event type: ${eventType}`);
    }

    // Always return 200 to acknowledge receipt
    // PayPal will retry if we don't acknowledge
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    // Still return 200 to prevent retries for unrecoverable errors
    res.status(200).json({ received: true, error: 'Processing error' });
  }
}

/**
 * Handle payment capture completed event
 */
async function handlePaymentCaptureCompleted(event) {
  const capture = event.resource;
  
  console.log('✓ Payment captured:', {
    captureId: capture.id,
    amount: capture.amount.value,
    currency: capture.amount.currency_code,
    status: capture.status,
    orderId: capture.supplementary_data?.related_ids?.order_id
  });

  // TODO: In production, implement:
  // - Update order status in database
  // - Send confirmation email to customer
  // - Trigger fulfillment process
  // - Update inventory
  // - Log transaction for accounting
}

/**
 * Handle payment capture denied event
 */
async function handlePaymentCaptureDenied(event) {
  const capture = event.resource;
  
  console.log('❌ Payment capture denied:', {
    captureId: capture.id,
    orderId: capture.supplementary_data?.related_ids?.order_id,
    reason: capture.status_details?.reason
  });

  // TODO: In production, implement:
  // - Update order status to failed
  // - Notify customer of payment failure
  // - Log for fraud analysis if suspicious
}

/**
 * Handle payment refund event
 */
async function handlePaymentCaptureRefunded(event) {
  const refund = event.resource;
  
  console.log('💰 Payment refunded:', {
    refundId: refund.id,
    captureId: refund.links?.find(l => l.rel === 'up')?.href?.split('/').pop(),
    amount: refund.amount.value,
    currency: refund.amount.currency_code,
    status: refund.status
  });

  // TODO: In production, implement:
  // - Update order status to refunded
  // - Notify customer of refund
  // - Update inventory if applicable
  // - Log refund for accounting
}

/**
 * Handle checkout order approved event
 */
async function handleCheckoutOrderApproved(event) {
  const order = event.resource;
  
  console.log('✓ Order approved by customer:', {
    orderId: order.id,
    status: order.status,
    amount: order.purchase_units[0].amount.value
  });

  // TODO: In production, implement:
  // - Update order status to approved
  // - Prepare for capture
}

/**
 * Handle checkout order completed event
 */
async function handleCheckoutOrderCompleted(event) {
  const order = event.resource;
  
  console.log('✓ Order completed:', {
    orderId: order.id,
    status: order.status
  });

  // TODO: In production, implement:
  // - Final order status update
  // - Reconciliation checks
}

module.exports = {
  handlePayPalWebhook
};

