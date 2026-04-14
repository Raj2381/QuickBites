const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
app.use(express.json());

const allowedExactOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'https://localhost',
  'null'
]);

const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin or non-browser requests (e.g. curl/Postman)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedExactOrigins.has(origin) || localOriginPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Razorpay credentials from environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error('ERROR: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env file');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

/**
 * Endpoint: POST /create-order
 * Creates a Razorpay order for the payment
 * Frontend sends this to create order before opening checkout
 */
app.post('/create-order', async (req, res) => {
  try {
    const { amount, description } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // Amount should be in paise (1 rupee = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);
    const receiptId = `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        description: description || 'Quick Bites Order Payment'
      }
    });

    res.json({
      success: true,
      order: razorpayOrder,
      keyId: RAZORPAY_KEY_ID,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    const statusCode = Number(error?.statusCode) || 500;
    const friendlyMessage = error?.error?.description || error?.description || error?.message || 'Failed to create order';
    res.status(statusCode).json({ success: false, message: friendlyMessage, error: friendlyMessage });
  }
});

/**
 * Endpoint: POST /verify-payment
 * Verifies the payment signature using Razorpay's verification method
 * Frontend sends payment_id, order_id, and signature after payment
 */
app.post('/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature' 
      });
    }

    // Create the body string that needs to be verified
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Generate the expected signature using the secret key
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Compare the provided signature with the expected one
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return res.json({
        success: true,
        message: 'Payment verified successfully',
        razorpay_order_id,
        razorpay_payment_id
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification error', 
      error: error.message 
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Quick Bites Payment Server',
    endpoints: {
      createOrder: 'POST /create-order',
      verifyPayment: 'POST /verify-payment',
      health: 'GET /health'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Quick Bites Payment Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   - POST /create-order`);
  console.log(`   - POST /verify-payment`);
  console.log(`   - GET /health`);
});
