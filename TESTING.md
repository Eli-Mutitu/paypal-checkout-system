# Testing Guide

This guide covers testing your PayPal checkout system.

## Test Environment Setup

### PayPal Sandbox Accounts

1. Go to https://developer.paypal.com/dashboard/accounts
2. You'll see automatically created sandbox accounts:
   - **Business Account**: For receiving payments (API credentials)
   - **Personal Accounts**: For making test payments

3. View account credentials:
   - Click on any account
   - Note the email and password
   - These are for logging into PayPal during test checkouts

### Creating Custom Test Accounts

1. In PayPal Developer Dashboard → Sandbox → Accounts
2. Click "Create Account"
3. Select account type (Business or Personal)
4. Set country and currency
5. Set balance amount for testing
6. Create and note credentials

## Manual Testing

### Complete Checkout Flow

1. **Start Checkout**
   - Navigate to http://localhost:3000
   - Click "Start Checkout"
   - Verify page loads correctly

2. **Enter Order Details**
   - Enter amount: `25.00`
   - Select currency: `USD`
   - Enter description: `Test Product`
   - Click "Proceed to Payment"

3. **PayPal Payment**
   - PayPal buttons should appear
   - Click "PayPal" button
   - Log in with sandbox buyer account
   - Review payment details
   - Click "Pay Now"

4. **Success Page**
   - Should redirect to success page
   - Verify order details are displayed
   - Check that order ID and transaction ID are shown

5. **Backend Logs**
   - Check backend terminal for logs
   - Should see order creation log
   - Should see capture completion log

### Cancel Flow

1. Start checkout process
2. Click PayPal button
3. Click "Cancel and return to merchant" in PayPal
4. Should redirect to cancel page
5. Verify cancel message is displayed

### Error Scenarios

#### Invalid Amount
- Enter `0` or negative amount
- Should show validation error
- Should not proceed to PayPal

#### Missing Credentials
- Remove `NEXT_PUBLIC_PAYPAL_CLIENT_ID` from `.env.local`
- Restart frontend
- Should show configuration error

#### Backend Offline
- Stop backend server
- Try to create order
- Should show connection error

#### Expired Order
- Create order but wait 3+ hours
- Try to capture
- Should show order expired error

## API Testing

### Using cURL

#### Create Order
```bash
curl -X POST http://localhost:3001/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "25.00",
    "currency": "USD",
    "description": "Test Product"
  }'
```

Expected response:
```json
{
  "orderID": "ORDER_ID_HERE",
  "status": "CREATED",
  "links": [...]
}
```

#### Capture Order (requires approval first)
```bash
curl -X POST http://localhost:3001/api/orders/capture/ORDER_ID_HERE \
  -H "Content-Type: application/json"
```

#### Get Order Details
```bash
curl http://localhost:3001/api/orders/ORDER_ID_HERE
```

#### Health Check
```bash
curl http://localhost:3001/health
```

### Using Postman

1. Import collection from `postman_collection.json` (create if needed)
2. Set environment variables:
   - `API_URL`: http://localhost:3001
3. Test each endpoint
4. Save responses for documentation

## Webhook Testing

### Local Testing with ngrok

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Start ngrok tunnel**
   ```bash
   ngrok http 3001
   ```

3. **Configure webhook in PayPal**
   - Go to your app in PayPal Dashboard
   - Add webhook URL: `https://YOUR-NGROK-URL.ngrok.io/api/webhooks/paypal`
   - Select events to monitor
   - Save webhook ID to `.env`

4. **Test webhook**
   - Make a payment
   - Check backend logs for webhook events
   - Verify webhook signature validation

### Manual Webhook Simulation

```bash
curl -X POST http://localhost:3001/api/webhooks/paypal \
  -H "Content-Type: application/json" \
  -H "paypal-transmission-id: test-id" \
  -H "paypal-transmission-time: 2024-01-01T00:00:00Z" \
  -H "paypal-transmission-sig: test-sig" \
  -H "paypal-cert-url: https://example.com" \
  -H "paypal-auth-algo: SHA256withRSA" \
  -d '{
    "event_type": "PAYMENT.CAPTURE.COMPLETED",
    "resource": {
      "id": "CAPTURE_ID",
      "amount": {
        "value": "25.00",
        "currency_code": "USD"
      },
      "status": "COMPLETED"
    }
  }'
```

## Test Scenarios

### Happy Path
- [x] Create order successfully
- [x] Display PayPal buttons
- [x] Complete payment
- [x] Capture payment
- [x] Redirect to success
- [x] Display transaction details

### Edge Cases
- [x] Very small amount ($0.01)
- [x] Very large amount ($9,999.99)
- [x] Different currencies
- [x] Long product descriptions
- [x] Special characters in description
- [x] Multiple rapid orders
- [x] Browser back button during checkout

### Error Cases
- [x] Invalid amount (0, negative, non-numeric)
- [x] Invalid currency
- [x] Missing required fields
- [x] Backend offline
- [x] PayPal API errors
- [x] Network timeouts
- [x] Cancelled payments
- [x] Expired orders

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Mobile Testing

Test responsive design:
- [ ] Portrait orientation
- [ ] Landscape orientation
- [ ] Different screen sizes
- [ ] Touch interactions
- [ ] PayPal mobile UI

## Performance Testing

### Load Testing (Production)

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3001/health

# Using Artillery
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:3001/health
```

### Metrics to Monitor
- Response time
- Error rate
- Concurrent connections
- Memory usage
- CPU usage

## Security Testing

### Input Validation
- [x] SQL injection attempts (if using database)
- [x] XSS attempts in description field
- [x] Invalid data types
- [x] Extremely long strings
- [x] Special characters
- [x] Unicode characters

### Authentication/Authorization
- [x] Webhook signature verification
- [x] CORS headers
- [x] API rate limiting (if implemented)

### SSL/TLS (Production)
- [x] HTTPS enforced
- [x] Valid SSL certificate
- [x] Secure headers present
- [x] No mixed content warnings

## Regression Testing Checklist

Before each release:
- [ ] Complete checkout flow
- [ ] Cancel flow
- [ ] Success page displays correctly
- [ ] Cancel page displays correctly
- [ ] Error handling works
- [ ] Backend logs are correct
- [ ] Webhooks are received
- [ ] API endpoints respond correctly
- [ ] Environment variables work
- [ ] Build process succeeds

## Automated Testing (Future Enhancement)

### Backend Tests
```javascript
// Example Jest test
describe('Order Controller', () => {
  test('creates order with valid data', async () => {
    // Test implementation
  });

  test('rejects invalid amount', async () => {
    // Test implementation
  });
});
```

### Frontend Tests
```javascript
// Example React Testing Library test
describe('Checkout Page', () => {
  test('renders checkout form', () => {
    // Test implementation
  });

  test('validates amount input', () => {
    // Test implementation
  });
});
```

### E2E Tests
```javascript
// Example Playwright test
test('complete checkout flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Start Checkout');
  // ... rest of test
});
```

## Test Data

### Valid Test Amounts
- $0.01 (minimum)
- $1.00 (small)
- $25.00 (typical)
- $100.00 (large)
- $9,999.99 (maximum recommended)

### Valid Test Currencies
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)

### PayPal Test Cards (Sandbox)

For credit card testing in sandbox:
- Visa: 4032039605150620
- Mastercard: 5424057185981815
- Amex: 379204446667319

CVV: Any 3 digits
Expiry: Any future date

## Troubleshooting Tests

### Tests Failing
1. Check environment variables
2. Verify backend is running
3. Check PayPal credentials
4. Review error messages
5. Check network connectivity

### Inconsistent Results
1. Clear browser cache
2. Restart servers
3. Check for rate limiting
4. Verify sandbox vs. live mode
5. Check PayPal service status

## Test Reporting

Document test results:
- Date/time of testing
- Environment (dev/staging/prod)
- Test scenarios executed
- Pass/fail status
- Issues found
- Screenshots for bugs
- Steps to reproduce issues

## Continuous Testing

For production:
1. Set up uptime monitoring
2. Configure error tracking (Sentry, etc.)
3. Monitor API response times
4. Track conversion rates
5. Review logs regularly
6. Test after each deployment
7. Run periodic security scans

## Resources

- PayPal Testing Guide: https://developer.paypal.com/tools/sandbox/
- PayPal Test Cards: https://developer.paypal.com/tools/sandbox/card-testing/
- PayPal API Status: https://www.paypal-status.com/

