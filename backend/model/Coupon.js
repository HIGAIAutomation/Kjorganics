const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  minPurchase: {
    type: Number,
    min: 0,
    default: 0,
  },
  maxDiscount: {
    type: Number,
    min: 0,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    min: 0,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});


// Add index for faster querying
couponSchema.index({ validUntil: 1 });
couponSchema.index({ isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
