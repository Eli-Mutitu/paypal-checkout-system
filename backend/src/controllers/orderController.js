const paypal = require('@paypal/checkout-server-sdk');
const { getPayPalClient } = require('../config/paypal');

/**
 * Create a PayPal order
 * POST /api/orders/create
 */
async function createOrder(req, res, next) {
  try {
    const { amount, currency = 'USD', description = 'Purchase' } = req.body;

    // Input validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be a positive number'
      });
    }

    // Validate currency code
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    if (!validCurrencies.includes(currency)) {
      return res.status(400).json({
        error: 'Invalid currency',
        message: `Currency must be one of: ${validCurrencies.join(', ')}`
      });
    }

    // Create PayPal order request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: parseFloat(amount).toFixed(2)
          },
          description: description
        }
      ],
      application_context: {
        brand_name: 'Your Business Name',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`
      }
    });

    // Execute PayPal order creation
    const client = getPayPalClient();
    const order = await client.execute(request);

    // Log order creation for audit trail
    console.log('✓ Order created:', {
      orderId: order.result.id,
      amount: amount,
      currency: currency,
      status: order.result.status,
      timestamp: new Date().toISOString()
    });

    // Return order details to client
    res.status(201).json({
      orderID: order.result.id,
      status: order.result.status,
      links: order.result.links
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    next(error);
  }
}

/**
 * Capture a PayPal order after customer approval
 * POST /api/orders/capture/:orderID
 */
async function captureOrder(req, res, next) {
  try {
    const { orderID } = req.params;

    // Input validation
    if (!orderID || orderID.length < 10) {
      return res.status(400).json({
        error: 'Invalid order ID',
        message: 'A valid PayPal order ID is required'
      });
    }

    // Create capture request
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    // Execute capture
    const client = getPayPalClient();
    const capture = await client.execute(request);

    // Extract capture details
    const captureId = capture.result.purchase_units[0].payments.captures[0].id;
    const captureStatus = capture.result.purchase_units[0].payments.captures[0].status;
    const captureAmount = capture.result.purchase_units[0].payments.captures[0].amount;

    // Log successful capture for audit trail
    console.log('✓ Order captured:', {
      orderId: orderID,
      captureId: captureId,
      status: captureStatus,
      amount: captureAmount.value,
      currency: captureAmount.currency_code,
      timestamp: new Date().toISOString()
    });

    // Return capture details
    res.status(200).json({
      orderID: capture.result.id,
      captureID: captureId,
      status: captureStatus,
      payer: {
        email: capture.result.payer.email_address,
        name: capture.result.payer.name.given_name + ' ' + capture.result.payer.name.surname
      },
      amount: captureAmount,
      completedAt: capture.result.update_time
    });

  } catch (error) {
    console.error('❌ Error capturing order:', error);
    
    // Handle specific PayPal errors
    if (error.statusCode === 404) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The specified order does not exist or has expired'
      });
    }
    
    if (error.statusCode === 422) {
      return res.status(422).json({
        error: 'Cannot capture order',
        message: 'The order cannot be captured. It may have already been captured or cancelled.'
      });
    }

    next(error);
  }
}

/**
 * Get order details
 * GET /api/orders/:orderID
 */
async function getOrderDetails(req, res, next) {
  try {
    const { orderID } = req.params;

    // Input validation
    if (!orderID || orderID.length < 10) {
      return res.status(400).json({
        error: 'Invalid order ID',
        message: 'A valid PayPal order ID is required'
      });
    }

    // Create get order request
    const request = new paypal.orders.OrdersGetRequest(orderID);

    // Execute request
    const client = getPayPalClient();
    const order = await client.execute(request);

    // Return order details
    res.status(200).json({
      orderID: order.result.id,
      status: order.result.status,
      amount: order.result.purchase_units[0].amount,
      createdAt: order.result.create_time,
      updatedAt: order.result.update_time
    });

  } catch (error) {
    console.error('❌ Error fetching order:', error);
    
    if (error.statusCode === 404) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The specified order does not exist'
      });
    }

    next(error);
  }
}

module.exports = {
  createOrder,
  captureOrder,
  getOrderDetails
};

