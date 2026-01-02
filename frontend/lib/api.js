/**
 * API utility functions for backend communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Create a new PayPal order
 * @param {Object} orderData - Order details
 * @param {string} orderData.amount - Amount to charge
 * @param {string} orderData.currency - Currency code
 * @param {string} orderData.description - Order description
 * @returns {Promise<Object>} Order data with orderID
 */
export async function createOrder(orderData) {
  const response = await fetch(`${API_URL}/api/orders/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }

  return response.json();
}

/**
 * Capture a PayPal order after approval
 * @param {string} orderID - PayPal order ID
 * @returns {Promise<Object>} Capture details
 */
export async function captureOrder(orderID) {
  const response = await fetch(`${API_URL}/api/orders/capture/${orderID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to capture order');
  }

  return response.json();
}

/**
 * Get order details
 * @param {string} orderID - PayPal order ID
 * @returns {Promise<Object>} Order details
 */
export async function getOrderDetails(orderID) {
  const response = await fetch(`${API_URL}/api/orders/${orderID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch order details');
  }

  return response.json();
}

/**
 * Check backend health
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  const response = await fetch(`${API_URL}/health`);
  
  if (!response.ok) {
    throw new Error('Backend is not responding');
  }

  return response.json();
}

