const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const adminProductRouter=require('./routes/admin/products-routes')
const authRouter = require('./routes/auth-routes');
const shoptProductsRouter=require('./routes/shop/products-routes');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(
  'mongodb://ameerhamza:ameerhamza@ac-jp3ihl2-shard-00-00.q800t9k.mongodb.net:27017,ac-jp3ihl2-shard-00-01.q800t9k.mongodb.net:27017,ac-jp3ihl2-shard-00-02.q800t9k.mongodb.net:27017/?ssl=true&replicaSet=atlas-jxxex0-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'
)
.then(() => console.log('✅ MongoDB Connected'))
.catch((error) => console.log('❌ MongoDB Error:', error));

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
   
    credentials: true, // ✅ must be true for cookies
  })
);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/admin/products',adminProductRouter)
app.use('/api/shop/products',shoptProductsRouter)

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
