# 🚀 Razorpay Integration - Quick Start

Your Quick Bites app is now ready for secure Razorpay payments!

## ✅ What's Been Done

1. **Backend Server** (`server.js`)
   - Express.js server with payment verification
   - Secure HMAC-SHA256 signature verification
   - CORS enabled for frontend requests
   - Ready to deploy

2. **Frontend Updates** (`index.html`)
   - Razorpay Checkout integration
   - Secure payment modal
   - Payment verification flow
   - Works with existing Supabase setup

3. **Configuration Files**
   - `package.json` - Node.js dependencies
   - `.env.example` - Template for environment variables
   - Setup & deployment guides

---

## 🔧 Quick Setup (5 minutes)

### 1. Get Razorpay API Keys
```
1. Visit https://dashboard.razorpay.com
2. Sign up or login
3. Go to Settings → API Keys
4. Copy Key ID and Key Secret (use Test keys for development)
```

### 2. Create `.env` File
```bash
# Copy this into a new file named .env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
PORT=5000
```

### 3. Install & Run Backend
```bash
npm install
npm start
```

### 4. Update Frontend Configuration
In `index.html`, find this section (~line 434):
```javascript
const PAYMENT_BACKEND_URL = 'http://localhost:5000';
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID_HERE';
```

Replace with your actual values from Razorpay dashboard.

### 5. Test Payment
- Open `index.html` in browser
- Login and add items to cart
- Click "Proceed to Checkout"
- Select "Pay Online (Razorpay)"
- Use test card: `4111 1111 1111 1111` (any future date, any CVV)

✅ Order should be created with token number!

---

## 📚 Files Overview

| File | Purpose |
|------|---------|
| `server.js` | Node.js backend for payment verification |
| `package.json` | Project dependencies & scripts |
| `.env.example` | Environment variable template |
| `index.html` | Updated frontend with Razorpay |
| `RAZORPAY_SETUP.md` | Detailed setup guide |
| `DEPLOYMENT.md` | Production deployment guide |

---

## 🔐 Security Features

✓ **Server-side Verification**: Backend verifies payment signature using secret key
✓ **HMAC-SHA256**: Industry-standard cryptographic signing
✓ **Secret Key Protection**: Never exposed in frontend code
✓ **Order Verification**: Payment must be verified before order creation
✓ **XSS Protection**: Proper error handling & validation

---

## 🚢 Deployment Options

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel
# Set environment variables in Vercel dashboard
vercel env add RAZORPAY_KEY_ID your_key_id
vercel env add RAZORPAY_KEY_SECRET your_key_secret
```

### Option 2: Railway.app (Simplest)
- Push to GitHub
- Connect to Railway
- Add env variables
- Auto-deploys on push

### Option 3: Heroku
```bash
heroku create app-name
git push heroku main
heroku config:set RAZORPAY_KEY_ID=...
```

See `DEPLOYMENT.md` for detailed instructions.

---

## 🧪 Test Cards

| Card | Number | Expiry | CVV | Status |
|------|--------|--------|-----|--------|
| Success | 4111 1111 1111 1111 | Any future | Any | ✅ Works |
| Declined | 4000 0000 0000 0002 | Any future | Any | ❌ Fails |

Test Mode: `rzp_test_*` Keys | Live Mode: `rzp_live_*` Keys

---

## ⚙️ Configuration

### Local Testing
```javascript
const PAYMENT_BACKEND_URL = 'http://localhost:5000';
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_TEST_KEY_ID';
```

### Production (Live)
```javascript
const PAYMENT_BACKEND_URL = 'https://your-backend.vercel.app';
const RAZORPAY_KEY_ID = 'rzp_live_YOUR_LIVE_KEY_ID';
```

---

## 📋 Verification Flow

```
Student clicks "Pay Online"
         ↓
Razorpay Checkout Opens
         ↓
Student completes payment
         ↓
Frontend receives: payment_id + signature
         ↓
Backend verifies signature with secret key
         ↓
✓ Verified → Order created in Supabase
✗ Failed → Error message, retry payment
         ↓
Order confirmation with token number
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Backend cannot be reached" | Ensure `npm start` is running |
| "Invalid signature" | Check `.env` file - verify KEY_SECRET is correct |
| "Razorpay is not defined" | Check script tag in HTML is loaded |
| "CORS error" | Backend has CORS enabled, should work |
| "Payment verified but no order" | Check browser console & Supabase dashboard |

See `RAZORPAY_SETUP.md` for detailed troubleshooting.

---

## 📖 Documentation

- **Full Setup Guide**: [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Razorpay Docs**: https://razorpay.com/docs/
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-cards/

---

## 💡 Key Endpoints

### Backend API
- `POST /create-order` - Create Razorpay order
- `POST /verify-payment` - Verify payment signature  
- `GET /health` - Health check

### Frontend Functions
- `openRazorpayCheckout(amount)` - Open Razorpay modal
- `createRazorpayOrder(amount)` - Create order on backend
- `verifyPaymentSignature(data)` - Verify signature on backend

---

## ✨ Features

✅ Razorpay Checkout integration  
✅ Secure server-side verification  
✅ Automatic order creation  
✅ Token number generation  
✅ Payment metadata storage  
✅ Test & Live mode support  
✅ Error handling & validation  
✅ CORS enabled  
✅ Production-ready  

---

## 🎯 Next Steps

1. **Test locally** with test cards
2. **Deploy backend** to Vercel/Railway
3. **Update frontend** URL to backend
4. **Go live** with Razorpay live keys
5. **Monitor** payments in Razorpay dashboard

---

Happy coding! 🎉

For questions, refer to [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md) or Razorpay's official documentation.
