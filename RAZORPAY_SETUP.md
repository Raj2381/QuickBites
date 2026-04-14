# Razorpay Payment Integration - Setup Guide

This guide explains how to set up and deploy the Razorpay payment integration for the Quick Bites application.

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Razorpay API Keys](#getting-razorpay-api-keys)
3. [Backend Setup](#backend-setup)
4. [Frontend Configuration](#frontend-configuration)
5. [Local Testing](#local-testing)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The Razorpay integration replaces the manual transaction ID entry with a secure, industry-standard payment gateway. The flow works as follows:

```
Student clicks "Pay Online"
    ↓
Frontend opens Razorpay Checkout modal
    ↓
Student completes payment (Card/UPI/Net Banking/Wallet)
    ↓
Razorpay returns payment_id and signature
    ↓
Frontend sends payment details to Node.js backend
    ↓
Backend verifies signature using Razorpay secret key
    ↓
If verified ✓ → Order is created in Supabase
If failed ✗ → Payment rejected, student must retry
```

### Key Benefits:
- ✅ **Secure**: Server-side signature verification prevents tampering
- ✅ **Easy**: Student uses Razorpay interface (familiar & trusted)
- ✅ **Flexible**: Supports Cards, UPI, Net Banking, Wallets, etc.
- ✅ **Verified**: Backend confirms payment before order creation

---

## Getting Razorpay API Keys

### Step 1: Create Razorpay Account

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or log in with your account
3. Complete KYC verification (required for live payments)

### Step 2: Get API Keys

1. Go to **Settings → API Keys** in the dashboard
2. You'll see two keys:
   - **Key ID** (public, used in frontend)
   - **Key Secret** (private, used in backend - KEEP SECRET!)

3. Copy both keys to a safe location

### Step 3: Enable Test Mode (for development)

1. All Razorpay accounts start in **Test Mode**
2. In test mode, use these test cards:
   - **Card**: `4111 1111 1111 1111` (any future expiry, any CVV)
   - **UPI**: `test@razorpay` (accept all)
   - **Amount**: Any amount (₹1 to ₹1,00,000)

3. No real money is charged in test mode!

---

## Backend Setup

### Step 1: Install Dependencies

Open terminal in your project folder and run:

```bash
npm install
```

This installs:
- `express` - Web server framework
- `cors` - Enable cross-origin requests
- `dotenv` - Load environment variables

### Step 2: Create `.env` File

Create a file named `.env` in the project root (same folder as `server.js`):

```bash
# .env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
PORT=5000
```

**Replace with your actual keys!**

### Step 3: Verify `.env` is in `.gitignore`

Make sure `.env` is listed in `.gitignore` to prevent accidentally committing secrets:

```bash
# .gitignore
.env
node_modules/
```

### Step 4: Start Backend Server

```bash
npm start
```

You should see:
```
✅ Quick Bites Payment Server running on http://localhost:5000
📝 API endpoints:
   - POST /create-order
   - POST /verify-payment
   - GET /health
```

---

## Frontend Configuration

### Step 1: Update `index.html`

Open `index.html` and find the configuration section at the top of the `<script>` tag:

```javascript
// ============================================================
// CONFIGURATION - UPDATE THESE SETTINGS
// ============================================================

// Supabase Configuration
const SUPABASE_URL = 'https://mecnrhnfthulhclouoxd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bxbdGvLmiVJaXNa1H4EJLg_Hkg1ZBCt';

// Payment Backend URL - UPDATE THIS!
const PAYMENT_BACKEND_URL = 'http://localhost:5000';

// Razorpay Key ID - GET THIS FROM DASHBOARD!
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID_HERE';
```

**Update these values:**

1. **PAYMENT_BACKEND_URL**: 
   - For local testing: `'http://localhost:5000'`
   - For production: `'https://your-backend-domain.com'`

2. **RAZORPAY_KEY_ID**: 
   - Paste your Razorpay public key ID here

### Step 2: Test on Local Machine

1. Run backend: `npm start` (terminal 1)
2. Open `index.html` in browser (terminal 2 not needed)
3. Create a student account
4. Add items to cart
5. Click "Proceed to Checkout"
6. Select "Pay Online (Razorpay)"
7. Click "Open Razorpay Checkout"
8. Use test card: `4111 1111 1111 1111`

---

## Local Testing

### Test Scenario 1: Successful Payment

```
Card Details:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- OTP: 000000 (when prompted)

Expected Result:
- Payment modal closes
- Order confirmation page shows
- Token number is generated
- Order appears in admin dashboard
```

### Test Scenario 2: Payment Failure

```
Card Details:
- Card Number: 4000 0000 0000 0002
- Expiry: Any future date
- CVV: Any 3 digits

Expected Result:
- Payment fails
- Error message: "Your card has been declined"
- Modal stays open, student can retry
```

### Test Scenario 3: UPI Payment

```
UPI ID: test@razorpay
OTP: 000000

Expected Result:
- Same as card payment
- Works from any device
```

### Debug: Check Browser Console

If payment fails, check:

1. **Browser Console** (F12 → Console):
   - Look for error messages
   - Check network requests to backend

2. **Backend Logs** (terminal running server):
   - Should show POST requests to `/create-order` and `/verify-payment`
   - Check for CORS errors or invalid signature warnings

3. **Common Errors**:

| Error | Solution |
|-------|----------|
| "Backend error: Failed to fetch" | Check if `npm start` is running on port 5000 |
| "Invalid signature" | Backend keys don't match. Verify `.env` file |
| "Razorpay not defined" | Check if Razorpay script loaded. Look at HTML line 4 |
| "PAYMENT_BACKEND_URL is not reachable" | Check firewall, ensure backend is running |

---

## API Endpoints Reference

### 1. POST /create-order

**Purpose**: Create a Razorpay order before showing checkout

**Request**:
```javascript
{
  "amount": 105.50,        // Total amount in rupees
  "description": "Quick Bites Order Payment"
}
```

**Response**:
```javascript
{
  "success": true,
  "order": {
    "id": "order_123456789",
    "amount": 10550,         // Amount in paise
    "currency": "INR",
    "status": "created"
  },
  "keyId": "rzp_test_ABC123"
}
```

### 2. POST /verify-payment

**Purpose**: Verify payment signature (most important for security!)

**Request**:
```javascript
{
  "razorpay_order_id": "order_123456789",
  "razorpay_payment_id": "pay_ABC123",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response (Success)**:
```javascript
{
  "success": true,
  "message": "Payment verified successfully",
  "razorpay_order_id": "order_123456789",
  "razorpay_payment_id": "pay_ABC123"
}
```

**Response (Failure)**:
```javascript
{
  "success": false,
  "message": "Payment verification failed: Invalid signature"
}
```

---

## Production Deployment

### Option 1: Deploy Backend on Heroku (Free)

1. **Create Heroku Account**:
   - Visit [heroku.com](https://heroku.com)
   - Sign up (free tier available)

2. **Connect Git Repository**:
   ```bash
   heroku login
   heroku create smart-canteen-payment
   git push heroku main
   ```

3. **Set Environment Variables on Heroku**:
   ```bash
   heroku config:set RAZORPAY_KEY_ID=your_key_id
   heroku config:set RAZORPAY_KEY_SECRET=your_key_secret
   ```

4. **Update Frontend URL**:
   - In `index.html`, change:
   ```javascript
   const PAYMENT_BACKEND_URL = 'https://smart-canteen-payment.herokuapp.com';
   ```

### Option 2: Deploy Backend on Railway.app (Easier)

1. Visit [railway.app](https://railway.app)
2. Connect GitHub repo
3. Add environment variables in Railways dashboard
4. Deploy automatically on every push

### Option 3: Deploy Backend on AWS/GCP

Follow standard Node.js deployment guides for AWS Lambda, Google Cloud Run, or EC2.

### Switch Razorpay to Live Mode

**When ready for real payments:**

1. Complete KYC verification in Razorpay Dashboard
2. Switch from Test to Live keys
3. Get new `Key ID` and `Key Secret` (live credentials)
4. Update `.env` file with live keys
5. Update `index.html` with live `RAZORPAY_KEY_ID`
6. Redeploy backend

**⚠️ WARNING**: Live mode charges real money. Test thoroughly first!

---

## Troubleshooting

### "Razorpay script not loaded"

**Error in console**: `Razorpay is not defined`

**Solution**:
- Check if Razorpay script tag is in `index.html`:
  ```html
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  ```
- Check browser Network tab - should show successful load

### "CORS Error: Access blocked"

**Error**: `Cross-Origin Request Blocked`

**Solution**:
- Backend has CORS enabled for multiple origins
- If still blocked, check backend logs
- Ensure frontend and backend can communicate

### "Payment verification failed: Invalid signature"

**Error**: Payment succeeded but verification failed

**Solution**:
- **Most likely**: `RAZORPAY_KEY_SECRET` is wrong in `.env`
- Double-check key in Razorpay Dashboard
- Restart backend server: `npm start`
- Try payment again

### "Cannot find module 'express'"

**Error**: `Cannot find module 'express'`

**Solution**:
- Run `npm install` again
- Check `package.json` has dependencies listed
- Delete `node_modules` folder and run `npm install`

### "Backend server won't start"

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
- Another process is using port 5000
- Kill existing processes:
  ```bash
  # On Windows:
  netstat -ano | findstr :5000
  taskkill /PID <process_id> /F
  
  # On Mac/Linux:
  lsof -i :5000
  kill -9 <process_id>
  ```
- Or change PORT in `.env`:
  ```
  PORT=5001
  ```

### "Payment works but order not created"

**Error**: Payment verified but order doesn't appear

**Possible Causes**:
1. Supabase database error - check browser console
2. Cart items not loading - check Supabase tables
3. User not logged in - try logging in again

**Debug**:
- Open browser DevTools (F12)
- Go to Network tab
- Look for POST requests to Supabase
- Check for 400/500 errors

---

## Security Checklist

Before going live, ensure:

- ✅ `.env` file is in `.gitignore` (never commit secrets!)
- ✅ `RAZORPAY_KEY_SECRET` is never exposed in frontend code
- ✅ Backend validates every payment signature
- ✅ HTTPS is used in production (not HTTP)
- ✅ Database has proper auth checks
- ✅ CORS is restricted to trusted origins only

---

## Support & Documentation

- **Razorpay Docs**: https://razorpay.com/docs/
- **Razorpay Test Cards**: https://razorpay.com/docs/payments/payments/test-cards/
- **Node.js Docs**: https://nodejs.org/docs/
- **Express Docs**: https://expressjs.com/

---

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with keys
echo "RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
PORT=5000" > .env

# 3. Start backend server
npm start

# 4. Open index.html in browser (file:// protocol works)
# Update PAYMENT_BACKEND_URL and RAZORPAY_KEY_ID in index.html

# 5. Test payment with test card
# Card: 4111 1111 1111 1111
# Expiry: Any future date
# CVV: Any 3 digits
```

---

**Congratulations! 🎉 Your Razorpay integration is ready!**

For questions or issues, check the troubleshooting section or refer to Razorpay's official documentation.
