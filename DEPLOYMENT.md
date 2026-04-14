# Quick Deployment Guide

## Deploy Backend Instantly (Recommended)

### Option 1: Vercel (Easiest for Node.js)

```bash
npm install -g vercel
vercel
```

Follow prompts, then:
```bash
vercel env add RAZORPAY_KEY_ID your_key_id
vercel env add RAZORPAY_KEY_SECRET your_key_secret
vercel --prod
```

Your backend URL: `https://your-project.vercel.app`

### Option 2: Railway.app (Simplest)

1. Visit https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
5. Railway auto-deploys on every push!

Your backend URL: `https://your-project-production.railway.app`

### Option 3: Render.com

1. Push code to GitHub
2. Visit https://render.com
3. Create New → Web Service
4. Connect GitHub
5. Set environment variables
6. Deploy!

---

## Update Frontend for Production

In `index.html`, find:

```javascript
const PAYMENT_BACKEND_URL = 'http://localhost:5000';
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID_HERE';
```

Change to:

```javascript
// Replace with your deployed URL
const PAYMENT_BACKEND_URL = 'https://your-backend-url.vercel.app';
const RAZORPAY_KEY_ID = 'rzp_live_YOUR_LIVE_KEY_ID';  // Use LIVE key
```

---

## Razorpay Live Mode

1. Complete KYC in Razorpay Dashboard
2. Switch to Live keys
3. Update `.env` with live credentials:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxx
   RAZORPAY_KEY_SECRET=xxx
   ```
4. Redeploy backend
5. Update frontend with live key ID

---

Done! Your payment system is live. 🚀
