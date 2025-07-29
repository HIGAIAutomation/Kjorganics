const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/userMiddleware');
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
} = require('../controller/Coupon.Controller');

// Admin routes
router.post('/', isAdmin, createCoupon);
router.put('/:id', isAdmin, updateCoupon);
router.delete('/:id', isAdmin, deleteCoupon);

// Public routes
router.get('/', getAllCoupons);
router.get('/:id', getCouponById);
router.post('/validate', validateCoupon);
router.post('/apply', applyCoupon);

module.exports = router;
