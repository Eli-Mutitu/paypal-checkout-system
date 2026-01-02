# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-02

### Added - Multi-Payment Method Support

#### Backend Changes (`backend/src/controllers/orderController.js`)
- ✅ Enhanced order creation to support multiple payment methods
- ✅ Expanded supported currencies from 5 to 10 (USD, EUR, GBP, CAD, AUD, JPY, CHF, SEK, DKK, NOK)
- ✅ Added `payment_method` configuration in `application_context`
- ✅ Removed hardcoded `payment_source` to allow PayPal auto-determination
- ✅ Added soft descriptor for bank statement clarity
- ✅ Set `shipping_preference` to `NO_SHIPPING` for digital goods
- ✅ Enhanced logging to track available payment methods
- ✅ Added response field documenting enabled payment methods

**Payment Methods Now Supported:**
- PayPal Balance
- Credit/Debit Cards (Visa, Mastercard, Amex, etc.)
- Bank Transfers (ACH, SEPA, Faster Payments, giropay, iDEAL)
- Direct Debit (SEPA Direct Debit, Bacs)
- Region-specific methods (Venmo, Pay Later)

#### Frontend Changes (`frontend/app/checkout/page.js`)
- ✅ Updated PayPalScriptProvider with funding source configuration
- ✅ Enabled all funding sources: `enable-funding: 'venmo,paylater,card'`
- ✅ Set `disable-funding: ''` to not restrict any methods
- ✅ Added `funding-eligibility` component loading
- ✅ Removed hardcoded `fundingSource` to show all available options
- ✅ Added `forceReRender` prop to update buttons on currency change
- ✅ Expanded currency dropdown from 5 to 10 currencies
- ✅ Added currency descriptions (SEPA, Faster Payments indicators)
- ✅ Added payment methods information box on checkout
- ✅ Added helptext explaining regional availability

#### Documentation
- ✅ Created `PAYMENT_METHODS.md` - Comprehensive guide to multi-payment support
  - Payment method availability by region
  - Processing times for each method
  - Testing instructions
  - Webhook event flows
  - Configuration requirements
  - Best practices
  - Troubleshooting guide
  - Production checklist

### Technical Details

**API Version:** PayPal Orders API v2
**Intent:** CAPTURE
**Payment Flow:** Automatic method determination based on:
- Buyer's country/region
- Currency selected
- Merchant account configuration
- Real-time eligibility checks by PayPal

### Breaking Changes
None - Backward compatible with existing integrations.

### Migration Notes
No migration required. Existing orders will continue to work. New orders automatically support additional payment methods.

### Configuration Required
To enable bank transfers in production:
1. Verify PayPal business account
2. Enable "Advanced Credit and Debit Card Payments" in PayPal dashboard
3. Contact PayPal to enable bank transfer receiving (may require additional verification)
4. Ensure webhooks are properly configured for async payment methods

---

## [1.0.0] - 2026-01-02

### Initial Release
- Full-stack PayPal checkout system
- Next.js 14 frontend with TailwindCSS
- Express backend with PayPal SDK
- Secure order creation and capture
- Webhook support
- Comprehensive documentation
- Production-ready configuration

