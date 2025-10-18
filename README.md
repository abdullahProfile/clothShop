# Online Cloth Store - Concurrency-Safe E-commerce Application

A full-stack web application demonstrating **concurrency-safe e-commerce** using Node.js, Express.js, MongoDB, and vanilla JavaScript. This application handles multiple concurrent users, prevents race conditions, and implements atomic stock management using MongoDB transactions.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse shirts, jeans, jackets, dresses, and accessories
- **Shopping Cart**: Session-based cart management with persistent storage
- **Search & Filter**: Real-time product search and category filtering
- **Stock Management**: Real-time stock validation and atomic updates
- **Payment Simulation**: Event-driven payment processing with success/failure simulation
- **Order Management**: Complete order lifecycle with tracking

### Concurrency Safety Features
- **Atomic Stock Operations**: MongoDB transactions prevent overselling
- **Race Condition Prevention**: Optimistic locking and version control
- **Session Isolation**: Independent cart sessions for concurrent users
- **Deadlock Avoidance**: Fair request handling and non-blocking operations
- **Event-Driven Architecture**: Asynchronous payment processing with EventEmitter

## 🏗 Architecture Overview

### Backend (Node.js + Express.js + MongoDB)
```
backend/
├── server.js                    # Express server with session handling
├── config/db.js                 # MongoDB connection setup
├── models/                      # Mongoose schemas
│   ├── Product.js              # Product schema with atomic operations
│   ├── Cart.js                 # Session-based cart schema
│   └── Order.js                # Order schema with transaction support
├── controllers/                 # Request handlers
│   ├── productController.js    # Product CRUD operations
│   ├── cartController.js       # Cart management with concurrency
│   ├── orderController.js      # Order processing
│   └── paymentController.js    # Payment handling
├── services/                   # Business logic
│   ├── InventoryService.js     # Atomic stock management
│   ├── PaymentService.js       # Event-driven payment simulation
│   └── ConcurrencyService.js   # Race condition handling
├── routes/                     # API routes
├── middlewares/                # Error handling and validation
├── utils/                      # Logging and utilities
└── events/                     # EventEmitter for async processing
```

### Frontend (HTML/CSS/JavaScript)
```
frontend/
├── index.html                  # Product catalog page
├── cart.html                   # Shopping cart page
├── checkout.html               # Checkout and payment
├── success.html                # Payment success page
├── failure.html                # Payment failure page
├── css/styles.css              # Responsive CSS styling
└── js/
    ├── api.js                  # API communication layer
    ├── main.js                 # Product display and cart management
    ├── cart.js                 # Cart page functionality
    └── checkout.js             # Payment processing
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd cloth-store
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Setup MongoDB**
   - **Local MongoDB**: Ensure MongoDB is running on `mongodb://localhost:27017`
   - **MongoDB Atlas**: Update connection string in `backend/config/db.js`

4. **Environment Configuration** (Optional)
```bash
# Create .env file in backend directory
PORT=5000
MONGO_URI=mongodb://localhost:27017/cloth_store
SESSION_SECRET=your-session-secret-key
NODE_ENV=development
```

5. **Seed Database** (Optional)
```bash
npm run seed
```

6. **Start the application**
```bash
npm start
```

7. **Access the application**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 🔒 Concurrency Mechanisms

### 1. Atomic Stock Operations
```javascript
// MongoDB transaction ensures atomicity
productSchema.statics.reserveStock = async function(productId, quantity, session) {
    const result = await this.findOneAndUpdate(
        {
            _id: productId,
            availableStock: { $gte: quantity },
            isActive: true
        },
        {
            $inc: { reservedStock: quantity, version: 1 },
            $set: { lastStockUpdate: new Date() }
        },
        { new: true, session }
    );
    
    if (!result) {
        throw new Error('Insufficient stock or product not available');
    }
    return result;
};
```

### 2. Race Condition Prevention
- **Optimistic Locking**: Version field prevents conflicting updates
- **Conditional Updates**: MongoDB queries with stock constraints
- **Transaction Rollback**: Automatic rollback on conflicts

### 3. Session-Based Isolation
```javascript
// Each user session gets independent cart
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
```

### 4. Event-Driven Payment Processing
```javascript
// Non-blocking payment processing
paymentService.on('paymentSuccess', async (data) => {
    const order = await Order.confirmOrder(data.orderId, data.transactionId);
    eventHandler.emit('orderConfirmed', order);
});
```

## 📊 Testing Concurrency

### Simulate Multiple Users
1. Open multiple browser tabs/windows
2. Add same products to cart simultaneously
3. Attempt checkout at the same time
4. Observe stock validation and atomic updates

### Monitor Concurrent Operations
```bash
# View server logs for concurrency tracking
npm start
# Watch console for session IDs and concurrent request handling
```

### API Endpoints for Testing
```bash
# Check inventory status
GET /api/products/inventory-status

# Monitor API health
GET /api/status

# Simulate high load
POST /api/products/:id/availability
```

## 🎯 Demonstration Scenarios

### Scenario 1: Race Condition Prevention
1. **Setup**: Product with stock = 1
2. **Action**: Two users add item to cart simultaneously
3. **Result**: Only one user successfully purchases, other gets "out of stock"

### Scenario 2: Payment Processing
1. **Setup**: User completes checkout
2. **Action**: Random payment success/failure (70% success rate)
3. **Result**: Stock reserved → Payment processed → Order confirmed/cancelled

### Scenario 3: Cart Synchronization
1. **Setup**: Items in cart, admin changes prices
2. **Action**: Cart auto-syncs every 30 seconds
3. **Result**: User notified of price changes, cart updated

## 🐛 Error Handling

### Backend Error Handling
- **MongoDB Connection**: Automatic reconnection with graceful degradation
- **Transaction Failures**: Automatic rollback and stock release
- **Payment Failures**: Order cancellation and stock restoration
- **Validation Errors**: Comprehensive input validation

### Frontend Error Handling
- **Network Errors**: Retry logic with exponential backoff
- **API Failures**: User-friendly error messages
- **Cart Sync Issues**: Automatic recovery mechanisms

## 📈 Performance Optimizations

### Database Optimizations
- **Indexes**: Optimized queries for products, cart, and orders
- **Connection Pooling**: Efficient MongoDB connection management
- **Aggregation**: Efficient data retrieval for complex queries

### Frontend Optimizations
- **Lazy Loading**: Progressive product loading
- **Caching**: Client-side caching for repeated requests
- **Debouncing**: Search input debouncing to reduce API calls

## 🔍 Monitoring & Logging

### Request Logging
```javascript
// Every request logged with session ID for concurrency tracking
[2024-10-17T21:40:49Z] POST /api/cart/add - Session: abc123 - Duration: 45ms
```

### Stock Operation Logging
```javascript
// Atomic operations logged for audit
Stock reserved: Product 64f..., Quantity: 2, Session: abc123
Payment successful: Order 64f..., Transaction TXN-ABC123
```

## 🚨 Known Limitations

1. **Horizontal Scaling**: Current implementation is single-server
2. **Payment Gateway**: Simulated payments only (not production-ready)
3. **User Authentication**: Session-based only (no user accounts)
4. **Real-time Updates**: Polling-based (no WebSocket implementation)

## 🛠 Future Enhancements

- **Real Payment Integration**: Stripe/PayPal integration
- **User Authentication**: JWT-based user management
- **Real-time Notifications**: WebSocket implementation
- **Horizontal Scaling**: Redis session store for multiple servers
- **Advanced Search**: Elasticsearch integration
- **Performance Monitoring**: Application performance monitoring (APM)

## 📝 API Documentation

### Products API
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search?query=term` - Search products

### Cart API
- `GET /api/cart` - Get current cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove cart item

### Orders API
- `POST /api/orders/create` - Create order from cart
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order

### Payment API
- `POST /api/payment/process` - Process payment
- `GET /api/payment/status/:orderId` - Get payment status

## 📄 License

This project is for educational purposes demonstrating concurrency-safe e-commerce implementation.

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment with different concurrency patterns and optimizations.

---

**Built with ❤️ to demonstrate safe concurrent programming in Node.js**