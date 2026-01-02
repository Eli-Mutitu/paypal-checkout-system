/**
 * Utility functions for the frontend
 */

/**
 * Format currency amount
 * @param {number|string} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numAmount);
}

/**
 * Validate amount input
 * @param {string} amount - Amount to validate
 * @returns {boolean} Whether amount is valid
 */
export function isValidAmount(amount) {
  if (!amount || amount.trim() === '') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num < 1000000;
}

/**
 * Format date
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Validate currency code
 * @param {string} currency - Currency code to validate
 * @returns {boolean} Whether currency is supported
 */
export function isValidCurrency(currency) {
  const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  return supportedCurrencies.includes(currency);
}

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currency) {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
  };
  return symbols[currency] || currency;
}

/**
 * Sanitize order description
 * @param {string} description - Description to sanitize
 * @returns {string} Sanitized description
 */
export function sanitizeDescription(description) {
  if (!description) return 'Purchase';
  // Remove special characters but keep spaces and basic punctuation
  return description.replace(/[^a-zA-Z0-9 .,!?-]/g, '').substring(0, 127);
}

/**
 * Parse query parameters from URL
 * @param {string} url - URL to parse
 * @returns {Object} Query parameters object
 */
export function parseQueryParams(url) {
  const params = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

