const express = require("express");
const multer = require("multer");
const router = express.Router();

// Multer setup: store uploads to `uploads/` folder temporarily
const upload = multer({ dest: "uploads/" });

// Import Category Controllers
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/Category.Controller");

// Import User Controllers
const {
  Login,
  RegisterUser,
  editUser,
  logout,
  refreshToken,
  getUserCookies,
} = require("../controller/User.Controller");

// Import Product Controllers
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getTrendingProducts,
  getNewProducts,
  getProductsByCategory,
} = require("../controller/Product.Controller");

// -------------------- USER ROUTES --------------------
router.post("/register", RegisterUser);
router.post("/login", Login);
router.put("/user/:id", editUser);
router.delete("/logout", logout);
router.post("/newtoken", refreshToken);
router.get("/getuser", getUserCookies);

// -------------------- PRODUCT ROUTES --------------------
// Note the `upload.array("images", 5)` middleware to handle up to 5 images
router.post("/product/add", upload.array("images", 5), createProduct);
router.get("/product/all", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", upload.array("images", 5), updateProduct);
router.delete("/product/:id", deleteProduct);
router.get("/product/trending", getTrendingProducts);
router.get("/product/new", getNewProducts);
router.get("/product/search", searchProducts);
router.get("/product/category/:categoryId", getProductsByCategory);

// -------------------- CATEGORY ROUTES --------------------
router.post("/category/add", createCategory);
router.get("/category/all", getAllCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

module.exports = router;
