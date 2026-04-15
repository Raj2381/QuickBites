# 🍽️ QuickBites - Smart Canteen System

A modern, responsive, and fully-featured Smart Canteen management web application. Quick Bites provides a seamless experience for students/customers to browse the menu, manage their carts, and securely pay online, while offering administrators a powerful dashboard to manage menu items and monitor orders in real-time.

![Quick Bites](https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80) 
*(Note: Replace this placeholder image with an actual screenshot of your app)*

---

## ✨ Key Features

### For Users / Students
- **🔐 Secure Authentication:** Role-based login and registration (Student/Admin).
- **🍔 Interactive Menu:** Browse available food items with prices, categories, and vibrant images.
- **🛒 Shopping Cart:** Real-time cart management to add, update, or remove items.
- **💳 Secure Payments:** Integrated Razorpay checkout for seamless online transactions (Cards, UPI, NetBanking).
- **🧾 Order Tracking:** Generate token numbers and check real-time order status.

### For Administrators
- **📊 Admin Dashboard:** Monitor live orders and manage incoming requests.
- **🥘 Menu Management:** Easily add new food items to the database.
- **🔄 Order Fulfillment:** Update order statuses (Pending → Preparing → Ready → Completed).
- **📈 Sales Insights:** View total earnings, active orders, and completed orders at a glance.

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3 (Custom Glassmorphism & UI theme)
- Vanilla JavaScript (ES6+)
- [Supabase JS SDK](https://supabase.com/) (Auth, Real-time DB, Storage)

**Backend (Payment Gateway):**
- [Node.js](https://nodejs.org/en) & [Express.js](https://expressjs.com/)
- [Razorpay API](https://razorpay.com/) (Secure payment signature verification)
- CORS & Crypto for security

---

## 📂 Project Structure

```text
├── img/                # Assorted image assets
├── index.html          # Main Frontend Single Page Application (SPA)
├── server.js           # Express Backend for Razorpay payment verification
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
└── *.md                # Deployment and Setup documentation
```

---

## 🚀 Quick Setup Guide

### 1. Prerequisites
- **Node.js** (v14 or higher) installed on your system.
- An active **Supabase** account with configured database tables (Profiles, Menu, Cart, Orders).
- A **Razorpay** account to get your Test/Live API keys.

### 2. Backend Setup
The backend handles the critical and secure payment signature verification process.

```bash
# Clone the repository
git clone https://github.com/yourusername/quickbites.git
cd quickbites

# Install dependencies
npm install

# Setup Environment variables
cp .env.example .env
```

Open `.env` and configure your Razorpay Keys:
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
PORT=5000
```

Start the backend server:
```bash
npm run dev
# Server will start on http://localhost:5000
```

### 3. Frontend Setup
Open `index.html` in your favorite code editor and scroll down to the **CONFIGURATION** section (around line ~430). 
Update the credentials carefully:

```javascript
// Supabase Configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Payment Backend URL
const PAYMENT_BACKEND_URL = 'http://localhost:5000';

// Razorpay Key ID
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID';
```

Launch the frontend using a local dev server (e.g., VS Code Live Server extension or `npx serve .`).

---

## 📘 Documentation

For more deep-dive documentation on specific parts of this project, please refer to the dedicated markdown files included in the repository:
- 📖 [Razorpay Integration Guide](RAZORPAY_SETUP.md)
- 🚀 [Deployment & Hosting Instructions](DEPLOYMENT.md)
- ⚡ [Quick Start Guide](QUICK_START.md)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check out the [issues page](https://github.com/yourusername/quickbites/issues).

---

## 📝 License

This project is licensed under the **MIT License**. See the `package.json` file for details.
