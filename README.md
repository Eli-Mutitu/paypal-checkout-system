# PayPal Checkout System

A production-ready full-stack PayPal checkout implementation with Next.js 14 and Express.

## Architecture

- **Frontend**: Next.js 14 (App Router) with TailwindCSS
- **Backend**: Node.js with Express and PayPal REST SDK
- **Security**: Environment-based configuration, webhook verification

## Project Structure

```
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Custom middleware
│   │   └── utils/       # Helper functions
│   └── server.js        # Entry point
│
└── frontend/         # Next.js application
    ├── app/             # App Router pages
    ├── components/      # React components
    └── lib/             # Utilities and helpers
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PayPal Business Account
- PayPal REST API credentials (Client ID and Secret)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   - `PAYPAL_CLIENT_ID`: Your PayPal REST API Client ID
   - `PAYPAL_CLIENT_SECRET`: Your PayPal REST API Client Secret
   - `PAYPAL_MODE`: Set to `sandbox` for testing, `live` for production
   - `WEBHOOK_ID`: Your PayPal webhook ID (create in PayPal Developer Dashboard)

5. Start the server:
   ```bash
   npm run dev
   ```

   The API will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file (copy from `.env.local.example`):
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: Your PayPal Client ID (same as backend)
   - `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:3001`)

5. Start the development server:
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:3000`

## API Endpoints

### POST `/api/orders/create`
Creates a new PayPal order.

**Request Body:**
```json
{
  "amount": "100.00",
  "currency": "USD",
  "description": "Order description"
}
```

### POST `/api/orders/capture/:orderID`
Captures a completed PayPal order.

### POST `/api/webhooks/paypal`
Handles PayPal webhook events (payment capture, refund, etc.)

## Security Considerations

- **Never commit `.env` files** - they contain sensitive credentials
- **Webhook verification** - All webhook events are verified using PayPal's signature
- **CORS configuration** - Restricted to frontend origin in production
- **Input validation** - All inputs are validated before processing
- **Error handling** - Errors don't leak sensitive information to clients

## PayPal Dashboard Setup

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a REST API app
3. Get your Client ID and Secret from the app credentials
4. Set up webhooks:
   - Go to your app settings
   - Add webhook URL: `https://your-domain.com/api/webhooks/paypal`
   - Select events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, etc.
   - Copy the Webhook ID to your `.env` file

## Production Deployment

1. Set `PAYPAL_MODE=live` in backend `.env`
2. Use production PayPal credentials
3. Configure webhook URL to production domain
4. Enable HTTPS/SSL
5. Set appropriate CORS origins
6. Implement rate limiting and monitoring

## Testing

Use PayPal Sandbox accounts for testing:
- Buyer account for making test purchases
- Business account credentials for API access

## Support

For PayPal API documentation: https://developer.paypal.com/docs/api/orders/v2/

