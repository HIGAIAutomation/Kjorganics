const express = require("express");
const { Login, RegisterUser, editUser, logout,refreshToken,getUserCookies } = require("../controller/User.Controller");

const router = express.Router();

// Routes
router.post("/register", RegisterUser);
router.post("/login", Login);          // Optional, for completeness
router.put("/user/:id", editUser);     // Optional, update user by ID
router.delete("/logout",logout)
router.post("/newtoken",refreshToken)
router.get("/getuser",getUserCookies)

module.exports = router;
