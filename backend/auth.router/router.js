const express = require("express");
const { Login, RegisterUser, editUser, logout,refreshToken } = require("../controller/User.Controller");

const router = express.Router();

// Routes
router.post("/api/register", RegisterUser);
router.post("/api/login", Login);          // Optional, for completeness
router.put("/api/user/:id", editUser);     // Optional, update user by ID
router.delete("/api/logout",logout)
router.post("/api/newtoken",refreshToken)

module.exports = router;
