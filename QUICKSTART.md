# Quick Start Guide

Get your PayPal checkout system running in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- npm installed
- PayPal Business account (or sandbox account for testing)

## Step 1: Get PayPal Credentials (2 minutes)

1. Visit https://developer.paypal.com/
2. Log in and go to **Dashboard** → **My Apps & Credentials**
3. Under **Sandbox** (for testing), click **Create App**
4. Name your app and click **Create App**
5. Copy your **Client ID** and **Secret**

## Step 2: Backend Setup (3 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_MODE=sandbox
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:3001
EOF

# Start the server
npm run dev
```

The backend should now be running at `http://localhost:3001`

## Step 3: Frontend Setup (3 minutes)

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

# Start the development server
npm run dev
```

The frontend should now be running at `http://localhost:3000`

## Step 4: Test It Out (2 minutes)

1. Open http://localhost:3000 in your browser
2. Click **"Start Checkout"**
3. Enter an amount (e.g., 10.00)
4. Click **"Proceed to Payment"**
5. Click the PayPal button
6. Log in with a PayPal Sandbox buyer account:
   - Go to https://developer.paypal.com/dashboard/accounts
   - Click on a buyer account to see credentials
   - Or create a new test buyer account
7. Complete the payment
8. You'll be redirected to the success page!

## What You Just Built

✅ Full-stack payment system
✅ Secure order creation
✅ PayPal button integration
✅ Payment capture
✅ Success/cancel flows
✅ Webhook endpoint (ready for configuration)

## Next Steps

### 1. Set Up Webhooks (Optional)

1. In PayPal Dashboard, go to your app settings
2. Click **Add Webhook**
3. For local testing, use ngrok:
   ```bash
   ngrok http 3001
   ```
4. Add webhook URL: `https://your-ngrok-url.ngrok.io/api/webhooks/paypal`
5. Select events to monitor
6. Copy Webhook ID to backend `.env`

### 2. Customize Your App

- **Frontend**: Edit files in `frontend/app/`
- **Backend**: Edit files in `backend/src/`
- **Styling**: Modify `frontend/app/globals.css`

### 3. Add Features

Common additions:
- Database for order history
- Email notifications
- User authentication
- Order tracking
- Admin dashboard
- Refund functionality

### 4. Prepare for Production

- Read `DEPLOYMENT.md` for deployment guide
- Read `SECURITY.md` for security best practices
- Switch to live PayPal credentials
- Set `PAYPAL_MODE=live`
- Enable HTTPS

## Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (should be 18+)
- Verify `.env` file exists and has correct values
- Check if port 3001 is available
- Look for error messages in terminal

### Frontend won't start
- Check if backend is running first
- Verify `.env.local` file exists
- Check if port 3000 is available
- Clear `.next` folder and reinstall: `rm -rf .next && npm install`

### PayPal buttons don't appear
- Check browser console for errors
- Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set
- Ensure Client ID matches your PayPal app
- Try refreshing the page

### Payment fails
- Check backend logs for errors
- Verify PayPal credentials are correct
- Ensure using sandbox mode with sandbox credentials
- Check network tab for API errors

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Restart backend after changing `.env`

## Test Credentials

For testing, PayPal provides sandbox accounts:

1. Go to https://developer.paypal.com/dashboard/accounts
2. You'll see test buyer and merchant accounts
3. Click "View/Edit account" to see login details
4. Use these for testing payments

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # PayPal configuration
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Error handling, etc.
│   │   └── utils/          # Helper functions
│   ├── server.js           # Entry point
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── checkout/       # Checkout page
    │   ├── success/        # Success page
    │   ├── cancel/         # Cancel page
    │   └── layout.js       # App layout
    └── package.json
```

## Useful Commands

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## API Endpoints

- `POST /api/orders/create` - Create new order
- `POST /api/orders/capture/:orderID` - Capture payment
- `GET /api/orders/:orderID` - Get order details
- `POST /api/webhooks/paypal` - Handle PayPal webhooks
- `GET /health` - Health check

## Getting Help

- **PayPal Docs**: https://developer.paypal.com/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com/

## What's Next?

Now that you have a working system:

1. ✅ Test thoroughly with different amounts and currencies
2. ✅ Review the code to understand how it works
3. ✅ Customize the UI to match your brand
4. ✅ Add any additional features you need
5. ✅ Read security documentation
6. ✅ Plan your production deployment

Happy coding! 🚀

