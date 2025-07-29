const Coupon = require('../model/Coupon');

// Create new coupon
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      description,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      description,
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Create Coupon Error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error('Get Coupons Error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

// Get single coupon
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    console.error('Get Coupon Error:', error);
    res.status(500).json({ error: 'Failed to fetch coupon' });
  }
};

// Update coupon
exports.updateCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      description,
    } = req.body;

    // Check if new code already exists (excluding current coupon)
    if (code) {
      const existingCoupon = await Coupon.findOne({
        code: code.toUpperCase(),
        _id: { $ne: req.params.id },
      });
      if (existingCoupon) {
        return res.status(400).json({ error: 'Coupon code already exists' });
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code: code?.toUpperCase(),
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        validFrom,
        validUntil,
        usageLimit,
        description,
      },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error) {
    console.error('Update Coupon Error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete Coupon Error:', error);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
};

// Validate coupon
exports.validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(400).json({ error: 'Invalid or expired coupon' });
    }

    // Check minimum purchase amount
    if (coupon.minPurchase && amount < coupon.minPurchase) {
      return res.status(400).json({
        error: `Minimum purchase amount of ₹${coupon.minPurchase} required`,
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit exceeded' });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    // Make sure discount doesn't exceed cart amount
    discount = Math.min(discount, amount);

    res.json({
      valid: true,
      discount,
      coupon,
    });
  } catch (error) {
    console.error('Validate Coupon Error:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
};

// Apply coupon (increment usage count)
exports.applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ message: 'Coupon applied successfully', coupon });
  } catch (error) {
    console.error('Apply Coupon Error:', error);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
};
