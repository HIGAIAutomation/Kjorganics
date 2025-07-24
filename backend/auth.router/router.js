// auth.router/router.js

const express = require("express");
const { Login, RegisterUser, editUser } = require("../controller/User.Controller");

const router = express.Router();

// Routes
router.post("/api/register", RegisterUser);
router.post("/api/login", Login);          // Optional, for completeness
router.put("/api/user/:id", editUser);     // Optional, update user by ID

module.exports = router;
