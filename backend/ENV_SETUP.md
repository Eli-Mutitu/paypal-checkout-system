# Backend Environment Variables Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_MODE=sandbox
PAYPAL_WEBHOOK_ID=your_webhook_id_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000

# API Base URL (for webhook return URLs)
API_BASE_URL=http://localhost:3001
```

## How to Get PayPal Credentials

1. Go to https://developer.paypal.com/
2. Log in with your PayPal account
3. Navigate to Dashboard > My Apps & Credentials
4. Under "REST API apps", click "Create App"
5. Fill in app details and click "Create App"
6. Copy your Client ID and Secret
7. For testing, use Sandbox credentials
8. For production, switch to Live credentials and set `PAYPAL_MODE=live`

## Webhook Setup

1. In your PayPal app settings, go to "Webhooks"
2. Click "Add Webhook"
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/paypal`
4. Select events to subscribe to:
   - PAYMENT.CAPTURE.COMPLETED
   - PAYMENT.CAPTURE.DENIED
   - PAYMENT.CAPTURE.REFUNDED
   - CHECKOUT.ORDER.APPROVED
   - CHECKOUT.ORDER.COMPLETED
5. Copy the Webhook ID and add it to your `.env` file

## Security Notes

- **NEVER** commit your `.env` file to version control
- Use strong, unique credentials for production
- Rotate credentials regularly
- Use environment-specific credentials (sandbox vs. live)

