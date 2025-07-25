const express = require("express");
const mongoose = require("mongoose");
const router = require("./auth.router/router");
const dotenv = require("dotenv");
const {redisConnector}=require("./config/redisconfig");
const cookie=require("cookie-parser")



dotenv.config(); // ✅ Make sure you load environment variables

const app = express();

app.use(express.json());
// Routes
app.use(router); // ✅ Fix: use `app.use()`, not `app.router()`

//cookies
app.use(cookie());

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
