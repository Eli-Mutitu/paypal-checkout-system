const express = require('express');
const router = express.Router();
const {
  createOrder,
  captureOrder,
  getOrderDetails
} = require('../controllers/orderController');

/**
 * POST /api/orders/create
 * Create a new PayPal order
 */
router.post('/create', createOrder);

/**
 * POST /api/orders/capture/:orderID
 * Capture payment for an approved order
 */
router.post('/capture/:orderID', captureOrder);

/**
 * GET /api/orders/:orderID
 * Get order details
 */
router.get('/:orderID', getOrderDetails);

module.exports = router;

