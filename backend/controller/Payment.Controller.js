const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../model/Order");
const Cart = require("../model/Cart");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Update order status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.paymentStatus = "completed";
    order.paymentId = razorpay_payment_id;
    order.razorpayOrderId = razorpay_order_id;
    order.status = "processing";
    await order.save();

    // Clear user's cart after successful payment
    await Cart.findOneAndDelete({ user: req.user._id });

    res.json({
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

exports.getPaymentKey = async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};
