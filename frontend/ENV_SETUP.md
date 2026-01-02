# Frontend Environment Variables Setup

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# PayPal Client ID (same as backend)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Important Notes

- Use the `NEXT_PUBLIC_` prefix for variables that need to be exposed to the browser
- The PayPal Client ID is safe to expose publicly (it's used in the frontend)
- **NEVER** expose your PayPal Client Secret in frontend code
- For production, update `NEXT_PUBLIC_API_URL` to your production API domain

## Production Configuration

For production deployment, update your `.env.local` (or environment variables in your hosting platform):

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_production_paypal_client_id
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Security Notes

- `.env.local` is automatically ignored by git (don't commit it)
- Only the PayPal Client ID should be in the frontend
- All sensitive operations happen on the backend
- API calls to your backend should be over HTTPS in production

