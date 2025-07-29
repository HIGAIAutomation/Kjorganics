const express = require("express");
const mongoose = require("mongoose");
const router = require("./auth.router/router");
const couponRoutes = require("./routes/coupon.routes");
const dotenv = require("dotenv");
const {redisConnector}=require("./config/redisconfig");
const cookie=require("cookie-parser")
const cors=require("cors")


dotenv.config(); // ✅ Make sure you load environment variables

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // your Next.js URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middleware
app.use(express.json());
app.use(cookie());

// Import Redis session middleware
const { trackUserActivity, validateUserSession, cacheUserData } = require("./middleware/redisSession");

// Routes with Redis session management
app.use('/api', validateUserSession, trackUserActivity, cacheUserData, router); // Adding /api prefix to all routes
app.use('/api/coupons', validateUserSession, couponRoutes); // Coupon routes


//Redis Connector

redisConnector();

// Database connection
const dbConnector = require("./config/dbConfig");
dbConnector();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Application running on PORT:", PORT);
});
