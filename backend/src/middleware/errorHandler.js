/**
 * Global error handling middleware
 * This must be the last middleware in the chain
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging (in production, use proper logging service)
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle PayPal SDK errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: 'PayPal API Error',
      message: isDevelopment ? err.message : 'An error occurred processing your payment',
      details: isDevelopment ? err.details : undefined
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      fields: err.errors
    });
  }

  // Handle generic errors
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'An unexpected error occurred',
    stack: isDevelopment ? err.stack : undefined
  });
}

module.exports = errorHandler;

