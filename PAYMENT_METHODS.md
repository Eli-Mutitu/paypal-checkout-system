# PayPal Multi-Payment Methods Support

This system supports multiple payment methods through PayPal's Orders API v2, including bank transfers, direct debit, credit cards, and PayPal balance.

## Supported Payment Methods

### 1. **PayPal Balance**
- Standard PayPal account payments
- Available globally
- Instant processing

### 2. **Credit & Debit Cards**
- Visa, Mastercard, American Express, Discover
- Processed through PayPal's card processing
- Available globally

### 3. **Bank Transfers**
Payment method availability by region:

#### United States
- **ACH (Automated Clearing House)**
  - Processing time: 3-5 business days
  - No fees for buyers
  - Supported currencies: USD

#### European Union
- **SEPA (Single Euro Payments Area)**
  - Processing time: 1-3 business days
  - Available in EUR
  - Covers 36 European countries

#### United Kingdom
- **Faster Payments Service**
  - Processing time: Same day
  - Available in GBP
  - UK banks only

#### Germany
- **giropay**
  - Real-time bank transfer
  - Available in EUR
  - German banks

- **Sofort (Klarna)**
  - Real-time transfer
  - Available in multiple European countries

#### Netherlands
- **iDEAL**
  - Real-time bank transfer
  - Available in EUR
  - Dutch banks only

### 4. **Direct Debit**
- **SEPA Direct Debit** (Europe)
- Processing time: 2-5 business days
- Requires buyer authorization

### 5. **Additional Methods** (Region-Specific)
- **Venmo** (US only)
- **PayPal Pay Later** (Select markets)
- **Local payment methods** (Country-specific)

## How It Works

### Backend Configuration

The backend automatically enables all payment methods:

```javascript
// backend/src/controllers/orderController.js
{
  intent: 'CAPTURE',
  application_context: {
    payment_method: {
      payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
    },
    // No payment_source specified = all methods enabled
  }
}
```

**Key Points:**
- We do NOT specify `payment_source` in order creation
- PayPal automatically determines available methods based on:
  - Buyer's country/region
  - Currency selected
  - Merchant account configuration
  - Payment amount

### Frontend Configuration

The frontend enables all funding sources in PayPal buttons:

```javascript
// frontend/app/checkout/page.js
<PayPalScriptProvider
  options={{
    'enable-funding': 'venmo,paylater,card',
    'disable-funding': '', // Don't disable anything
    components: 'buttons,funding-eligibility',
  }}
>
  <PayPalButtons
    fundingSource={undefined} // Show all available
  />
</PayPalScriptProvider>
```

## Payment Method Availability Matrix

| Currency | Region | PayPal | Cards | Bank Transfer | Direct Debit |
|----------|--------|--------|-------|---------------|--------------|
| USD      | US     | ✅     | ✅    | ✅ (ACH)      | ❌           |
| EUR      | EU     | ✅     | ✅    | ✅ (SEPA)     | ✅ (SEPA DD) |
| GBP      | UK     | ✅     | ✅    | ✅ (Faster)   | ✅ (Bacs)    |
| EUR      | DE     | ✅     | ✅    | ✅ (giropay)  | ✅ (SEPA DD) |
| EUR      | NL     | ✅     | ✅    | ✅ (iDEAL)    | ✅ (SEPA DD) |
| CAD      | CA     | ✅     | ✅    | ❌            | ❌           |
| AUD      | AU     | ✅     | ✅    | ❌            | ❌           |
| JPY      | JP     | ✅     | ✅    | ❌            | ❌           |

## Processing Times

| Method | Time to Capture | Settlement Time |
|--------|----------------|-----------------|
| PayPal Balance | Instant | Instant |
| Credit/Debit Card | Instant | 1-2 days |
| ACH (US) | 3-5 business days | 3-5 business days |
| SEPA (EU) | 1-3 business days | 1-3 business days |
| Faster Payments (UK) | Same day | Same day |
| giropay (DE) | Instant | 1-2 days |
| iDEAL (NL) | Instant | 1-2 days |
| Direct Debit | 2-5 business days | 2-5 business days |

## Testing Payment Methods

### Sandbox Testing

1. **PayPal Balance:** Use sandbox personal account
2. **Credit Cards:** Use PayPal's test card numbers
3. **Bank Transfers:** Simulated in sandbox (instant approval)

### Test Cards

```
Visa: 4032039605150620
Mastercard: 5424057185981815
Amex: 379204446667319
CVV: Any 3 digits
Expiry: Any future date
```

### Bank Transfer Testing

In sandbox mode:
- Bank transfers are simulated
- Instant approval (not realistic timing)
- Use for integration testing only

For production testing:
- Use small amounts ($0.01-$1.00)
- Test in sandbox first
- Verify webhook events

## Webhook Events

Different payment methods trigger different webhook events:

### Standard Flow (Cards, PayPal)
```
1. CHECKOUT.ORDER.APPROVED
2. PAYMENT.CAPTURE.COMPLETED
```

### Bank Transfer Flow
```
1. CHECKOUT.ORDER.APPROVED
2. PAYMENT.CAPTURE.PENDING (waiting for bank)
3. PAYMENT.CAPTURE.COMPLETED (after bank confirmation)
```

### Failed Payments
```
PAYMENT.CAPTURE.DENIED
PAYMENT.CAPTURE.DECLINED
```

## Configuration Requirements

### PayPal Account Setup

1. **Enable Advanced Credit and Debit Card Payments**
   - Go to PayPal Business Account
   - Settings → Payment Methods
   - Enable "Advanced Credit and Debit Card Payments"

2. **Enable Bank Transfer Receiving**
   - Contact PayPal to enable (may require business verification)
   - Available based on merchant country
   - May have eligibility requirements

3. **Currency Settings**
   - Enable multi-currency receiving if needed
   - Set up currency conversion preferences

### Merchant Eligibility

Bank transfer availability depends on:
- ✅ Verified business account
- ✅ Good standing with PayPal
- ✅ Merchant country supports bank transfers
- ✅ Buyer country supports bank transfers
- ✅ Currency compatibility

## Best Practices

### 1. **Always Use Webhooks**
Bank transfers are asynchronous - don't rely on frontend callbacks:

```javascript
// ✅ Good - Use webhooks
app.post('/api/webhooks/paypal', handleWebhook);

// ❌ Bad - Only relying on frontend
// Bank transfers won't trigger frontend callback immediately
```

### 2. **Handle Pending States**
```javascript
if (captureStatus === 'PENDING') {
  // Update order status to "Processing"
  // Send email: "Payment being processed"
  // Don't fulfill order yet
}

if (captureStatus === 'COMPLETED') {
  // Fulfill order
  // Send confirmation
}
```

### 3. **Set Expectations**
Inform customers about processing times:
- Cards: Instant
- Bank transfers: 1-5 business days
- Direct debit: 2-5 business days

### 4. **Currency Selection**
Offer local currencies for better conversion rates:
```javascript
// US customer → USD (ACH available)
// EU customer → EUR (SEPA available)
// UK customer → GBP (Faster Payments available)
```

## Troubleshooting

### Bank Transfer Not Showing

**Possible reasons:**
1. Buyer's country doesn't support it
2. Currency not compatible
3. Merchant account not enabled
4. Amount too large/small for bank transfer
5. Buyer doesn't have eligible bank account

**Solution:**
- Check PayPal dashboard → Payment Methods
- Contact PayPal support to enable
- Verify currency and country compatibility

### Payment Stuck in PENDING

**For bank transfers:**
- This is normal (waiting for bank)
- Can take 1-5 business days
- Monitor webhook events
- Update customer via email

### Webhook Not Received

**Checklist:**
- ✅ Webhook URL is publicly accessible (HTTPS)
- ✅ Webhook ID is in environment variables
- ✅ Signature verification is correct
- ✅ Endpoint returns 200 OK quickly

## Production Checklist

Before going live with multi-payment support:

- [ ] PayPal business account verified
- [ ] Advanced card payments enabled
- [ ] Bank transfer receiving enabled (if needed)
- [ ] Multi-currency enabled (if needed)
- [ ] Webhooks configured and tested
- [ ] Webhook signature verification implemented
- [ ] Pending payment handling implemented
- [ ] Customer notification emails set up
- [ ] Order status tracking in place
- [ ] Tested all payment methods in sandbox
- [ ] Small-amount production testing complete
- [ ] Customer support briefed on payment methods
- [ ] Processing time expectations documented

## Security Considerations

1. **Always verify webhooks** - Don't trust unverified events
2. **Check payment status** - Before fulfillment
3. **Handle refunds properly** - Bank transfers take longer to refund
4. **Monitor for fraud** - Bank transfers can be disputed
5. **Keep audit logs** - Track all payment events

## Resources

- [PayPal Orders API v2 Documentation](https://developer.paypal.com/docs/api/orders/v2/)
- [PayPal Payment Methods Guide](https://developer.paypal.com/docs/checkout/apm/)
- [PayPal Webhooks Documentation](https://developer.paypal.com/api/rest/webhooks/)
- [PayPal Sandbox Testing](https://developer.paypal.com/tools/sandbox/)

## Support

For payment method issues:
- PayPal Technical Support: https://developer.paypal.com/support/
- PayPal Merchant Support: Contact via dashboard
- Integration Issues: Check webhook logs and PayPal dashboard

---

**Note:** Payment method availability is dynamic and controlled by PayPal based on real-time eligibility checks. This documentation reflects general availability as of 2026.

