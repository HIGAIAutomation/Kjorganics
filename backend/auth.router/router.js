const express = require("express");
const upload = require("../middleware/uploadImages"); // Multer middleware

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

const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} = require("../controller/cartController");


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
  getVisibleProducts,
  toggleProductFlag,
} = require("../controller/Product.Controller");

const router = express.Router();

// -------------------- USER ROUTES --------------------
router.post("/register", RegisterUser);
router.post("/login", Login);
router.put("/user/:id", editUser);
router.delete("/logout", logout);
router.post("/newtoken", refreshToken);
router.get("/getuser", getUserCookies);

// -------------------- PRODUCT ROUTES --------------------
// Product CRUD
router.post("/product", upload.array("images", 5), createProduct);
router.get("/product", getAllProducts); // admin/all
router.get("/product/visible", getVisibleProducts); // for home page
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", upload.array("images", 5), updateProduct);
router.delete("/product/:id", deleteProduct);
router.patch("/product/:id/flag", toggleProductFlag); // toggle isVisible, isTrending, etc
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



//cart route
router.post("/cart/add", addToCart);
router.get("/cart", getCart);
router.put("/cart/update", updateCartItem);
router.delete("/cart/remove", removeFromCart);
router.delete("/cart/clear", clearCart);

// Import Order Controllers
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controller/Order.Controller");

// Import Payment Controllers
const {
  createOrder: createPaymentOrder,
  verifyPayment,
  getPaymentKey,
} = require("../controller/Payment.Controller");

// Order routes
router.post("/orders", createOrder);
router.get("/orders", getUserOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:id/cancel", cancelOrder);

// Payment routes
router.post("/payment/create", createPaymentOrder);
router.post("/payment/verify", verifyPayment);
router.get("/payment/key", getPaymentKey);

module.exports = router;
