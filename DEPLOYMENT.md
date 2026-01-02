# Deployment Guide

This guide covers deploying your PayPal checkout system to production.

## Pre-Deployment Checklist

- [ ] Obtain production PayPal API credentials
- [ ] Set up SSL/HTTPS for both frontend and backend
- [ ] Configure production environment variables
- [ ] Set up webhook endpoints with PayPal
- [ ] Test thoroughly in sandbox mode
- [ ] Set up monitoring and logging
- [ ] Configure CORS for production domains
- [ ] Set up database (if needed for order tracking)
- [ ] Review security settings

## Backend Deployment

### Recommended Platforms

- **Heroku**: Easy deployment with add-ons
- **AWS Elastic Beanstalk**: Scalable and reliable
- **DigitalOcean App Platform**: Simple and affordable
- **Railway**: Modern deployment platform
- **Render**: Free tier available

### Environment Variables (Production)

```env
PAYPAL_CLIENT_ID=<production_client_id>
PAYPAL_CLIENT_SECRET=<production_client_secret>
PAYPAL_MODE=live
PAYPAL_WEBHOOK_ID=<production_webhook_id>
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
API_BASE_URL=https://api.yourdomain.com
```

### Deployment Steps

1. **Build your application**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables** in your hosting platform

3. **Set up process manager** (PM2 for VPS)
   ```bash
   npm install -g pm2
   pm2 start server.js --name paypal-api
   pm2 startup
   pm2 save
   ```

4. **Configure reverse proxy** (Nginx example)
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set up SSL** with Let's Encrypt
   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

## Frontend Deployment

### Recommended Platforms

- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Great for static sites
- **AWS Amplify**: AWS integration
- **Cloudflare Pages**: Fast global CDN

### Environment Variables (Production)

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<production_client_id>
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deployment Steps (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure environment variables** in Vercel dashboard

4. **Set up custom domain** in Vercel settings

### Deployment Steps (Manual)

1. **Build the application**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Configure Nginx** (if needed)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## PayPal Production Setup

1. **Switch to Live Mode**
   - Go to PayPal Developer Dashboard
   - Switch from Sandbox to Live
   - Create or select your production app
   - Copy Live credentials

2. **Update Webhook URLs**
   - Update webhook URL to production domain
   - Re-subscribe to webhook events
   - Copy production Webhook ID

3. **Test with Real Payments**
   - Start with small test transactions
   - Verify all flows work correctly
   - Check webhook events are received

## Security Considerations

### Backend Security

1. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

2. **Helmet Configuration**
   Already implemented in `server.js`

3. **Input Validation**
   Already implemented in controllers

4. **HTTPS Only**
   Enforce HTTPS in production:
   ```javascript
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

### Frontend Security

1. **Content Security Policy**
   Add to `next.config.js`:
   ```javascript
   const securityHeaders = [
     {
       key: 'X-DNS-Prefetch-Control',
       value: 'on'
     },
     {
       key: 'Strict-Transport-Security',
       value: 'max-age=63072000; includeSubDomains; preload'
     },
     {
       key: 'X-Frame-Options',
       value: 'SAMEORIGIN'
     },
     {
       key: 'X-Content-Type-Options',
       value: 'nosniff'
     }
   ];
   
   module.exports = {
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: securityHeaders,
         },
       ];
     },
   };
   ```

## Monitoring

### Recommended Services

- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog**: Infrastructure monitoring
- **New Relic**: Application performance

### Health Checks

Backend health check is available at: `https://api.yourdomain.com/health`

Monitor this endpoint for uptime.

## Backup and Recovery

1. **Database Backups** (if applicable)
   - Set up automated daily backups
   - Store backups in secure location
   - Test recovery procedures

2. **Configuration Backups**
   - Keep encrypted copies of environment variables
   - Document all configuration settings
   - Store securely (password manager, secure vault)

## Scaling Considerations

1. **Horizontal Scaling**
   - Use load balancer for multiple backend instances
   - Ensure session management works across instances
   - Use Redis for shared state if needed

2. **Database**
   - Add database for order tracking and history
   - Index frequently queried fields
   - Set up read replicas for high traffic

3. **Caching**
   - Cache static assets with CDN
   - Implement Redis for API caching
   - Use Next.js static generation where possible

## Troubleshooting

### Common Issues

1. **Webhook not received**
   - Check webhook URL is publicly accessible
   - Verify HTTPS is configured
   - Check PayPal webhook logs in dashboard

2. **CORS errors**
   - Verify FRONTEND_URL is set correctly
   - Check CORS configuration in backend

3. **PayPal API errors**
   - Verify credentials are for correct environment (sandbox/live)
   - Check PAYPAL_MODE matches credentials
   - Review PayPal API logs in dashboard

## Support

For issues with:
- **PayPal API**: https://developer.paypal.com/support/
- **Next.js**: https://nextjs.org/docs
- **Express**: https://expressjs.com/

## Post-Deployment

- [ ] Test complete checkout flow
- [ ] Verify webhooks are received
- [ ] Monitor error logs
- [ ] Set up alerts for critical errors
- [ ] Document any custom configurations
- [ ] Train team on monitoring and support

