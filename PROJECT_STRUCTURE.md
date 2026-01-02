# Project Structure

Complete overview of the PayPal Checkout System file structure.

```
Payment Gateway/
│
├── README.md                    # Main project documentation
├── QUICKSTART.md               # Quick setup guide (start here!)
├── DEPLOYMENT.md               # Production deployment guide
├── SECURITY.md                 # Security best practices
├── TESTING.md                  # Testing guide and procedures
├── PROJECT_STRUCTURE.md        # This file
├── .cursorrules                # Cursor AI rules for this project
├── .gitignore                  # Git ignore patterns
│
├── backend/                    # Express.js API Server
│   ├── server.js              # Entry point, server configuration
│   ├── package.json           # Dependencies and scripts
│   ├── ENV_SETUP.md          # Environment setup guide
│   ├── .env                   # Environment variables (DO NOT COMMIT)
│   │
│   └── src/
│       ├── config/
│       │   └── paypal.js      # PayPal SDK configuration
│       │
│       ├── controllers/
│       │   ├── orderController.js    # Order creation & capture logic
│       │   └── webhookController.js  # Webhook event handlers
│       │
│       ├── routes/
│       │   ├── orderRoutes.js        # Order API routes
│       │   └── webhookRoutes.js      # Webhook API routes
│       │
│       ├── middleware/
│       │   └── errorHandler.js       # Global error handling
│       │
│       └── utils/
│           └── (future utilities)
│
└── frontend/                   # Next.js 14 Application
    ├── package.json           # Dependencies and scripts
    ├── next.config.js         # Next.js configuration
    ├── tailwind.config.js     # TailwindCSS configuration
    ├── postcss.config.js      # PostCSS configuration
    ├── .eslintrc.json        # ESLint configuration
    ├── ENV_SETUP.md          # Environment setup guide
    ├── .env.local            # Environment variables (DO NOT COMMIT)
    │
    ├── app/                   # Next.js App Router
    │   ├── layout.js         # Root layout component
    │   ├── page.js           # Home page
    │   ├── globals.css       # Global styles & Tailwind
    │   │
    │   ├── checkout/
    │   │   └── page.js       # Checkout page with PayPal integration
    │   │
    │   ├── success/
    │   │   └── page.js       # Payment success page
    │   │
    │   └── cancel/
    │       └── page.js       # Payment cancelled page
    │
    ├── components/            # Reusable React components
    │   ├── LoadingSpinner.js # Loading spinner component
    │   └── ErrorAlert.js     # Error alert component
    │
    └── lib/                   # Utility functions
        ├── api.js            # API client functions
        └── utils.js          # General utilities
```

## Key Files Explained

### Root Level

- **README.md**: Start here for project overview and setup instructions
- **QUICKSTART.md**: Get running in under 10 minutes
- **DEPLOYMENT.md**: Production deployment guide
- **SECURITY.md**: Critical security information
- **TESTING.md**: Testing procedures and test cases
- **.gitignore**: Prevents committing sensitive files

### Backend

#### Core Files
- **server.js**: Express server setup, middleware, routes
- **package.json**: Node dependencies (express, @paypal/checkout-server-sdk, etc.)

#### Configuration
- **src/config/paypal.js**: PayPal client initialization, webhook verification

#### Controllers (Business Logic)
- **src/controllers/orderController.js**: 
  - `createOrder()`: Creates PayPal orders
  - `captureOrder()`: Captures approved payments
  - `getOrderDetails()`: Fetches order info

- **src/controllers/webhookController.js**: 
  - `handlePayPalWebhook()`: Processes webhook events
  - Event handlers for various PayPal events

#### Routes (API Endpoints)
- **src/routes/orderRoutes.js**: 
  - `POST /api/orders/create`
  - `POST /api/orders/capture/:orderID`
  - `GET /api/orders/:orderID`

- **src/routes/webhookRoutes.js**: 
  - `POST /api/webhooks/paypal`

#### Middleware
- **src/middleware/errorHandler.js**: Global error handling

### Frontend

#### Core Files
- **package.json**: React dependencies (next, react, @paypal/react-paypal-js)
- **next.config.js**: Next.js configuration
- **tailwind.config.js**: Tailwind styling configuration

#### Pages (App Router)
- **app/page.js**: Home page with "Start Checkout" button
- **app/checkout/page.js**: Main checkout page
  - Order form
  - PayPal buttons integration
  - Payment flow handling
- **app/success/page.js**: Post-payment success page
- **app/cancel/page.js**: Payment cancelled page

#### Layout & Styles
- **app/layout.js**: Root layout, applies to all pages
- **app/globals.css**: Global styles, Tailwind directives, custom classes

#### Components
- **components/LoadingSpinner.js**: Reusable loading indicator
- **components/ErrorAlert.js**: Error message display

#### Utilities
- **lib/api.js**: Backend API communication
  - `createOrder()`
  - `captureOrder()`
  - `getOrderDetails()`
  - `checkHealth()`

- **lib/utils.js**: Helper functions
  - Currency formatting
  - Validation
  - Date formatting
  - Input sanitization

## Data Flow

### Order Creation Flow
```
1. User enters amount on checkout page
   ↓
2. User clicks "Proceed to Payment"
   ↓
3. Frontend calls createOrder()
   ↓
4. Backend calls PayPal API
   ↓
5. PayPal returns order ID
   ↓
6. Frontend displays PayPal buttons
```

### Payment Capture Flow
```
1. User approves payment in PayPal
   ↓
2. PayPal calls onApprove()
   ↓
3. Frontend calls captureOrder()
   ↓
4. Backend captures payment via PayPal API
   ↓
5. PayPal confirms capture
   ↓
6. Backend returns capture details
   ↓
7. Frontend redirects to success page
```

### Webhook Flow
```
1. PayPal event occurs (payment captured, refunded, etc.)
   ↓
2. PayPal sends webhook to backend
   ↓
3. Backend verifies webhook signature
   ↓
4. Backend processes event
   ↓
5. Backend returns 200 OK
```

## API Endpoints

### Order Management
- `POST /api/orders/create` - Create new order
- `POST /api/orders/capture/:orderID` - Capture approved order
- `GET /api/orders/:orderID` - Get order details

### Webhooks
- `POST /api/webhooks/paypal` - Receive PayPal events

### Health
- `GET /health` - Server health check

## Environment Variables

### Backend (.env)
```
PAYPAL_CLIENT_ID        # PayPal REST API Client ID
PAYPAL_CLIENT_SECRET    # PayPal REST API Secret
PAYPAL_MODE            # sandbox or live
PAYPAL_WEBHOOK_ID      # PayPal webhook identifier
PORT                   # Server port (default: 3001)
NODE_ENV               # development or production
FRONTEND_URL           # Frontend URL for CORS
API_BASE_URL           # Backend URL for webhooks
```

### Frontend (.env.local)
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID  # PayPal Client ID (public)
NEXT_PUBLIC_API_URL           # Backend API URL
```

## Dependencies

### Backend
- `express`: Web framework
- `@paypal/checkout-server-sdk`: PayPal integration
- `cors`: CORS middleware
- `dotenv`: Environment variables
- `helmet`: Security headers
- `morgan`: HTTP logging

### Frontend
- `next`: React framework
- `react`: UI library
- `react-dom`: React DOM rendering
- `@paypal/react-paypal-js`: PayPal React components
- `tailwindcss`: Utility-first CSS
- `postcss`: CSS processing
- `autoprefixer`: CSS vendor prefixes

## Getting Started

1. Read **QUICKSTART.md** for setup instructions
2. Follow **backend/ENV_SETUP.md** for backend configuration
3. Follow **frontend/ENV_SETUP.md** for frontend configuration
4. Run both servers
5. Test the checkout flow

## Production Deployment

1. Read **DEPLOYMENT.md** for detailed instructions
2. Review **SECURITY.md** for security requirements
3. Configure production environment variables
4. Set up webhooks with PayPal
5. Deploy backend and frontend
6. Test thoroughly
7. Monitor logs and errors

## Need Help?

- **Setup issues**: Check QUICKSTART.md
- **Deployment questions**: Check DEPLOYMENT.md
- **Security concerns**: Check SECURITY.md
- **Testing help**: Check TESTING.md
- **PayPal API docs**: https://developer.paypal.com/docs/

