const Order = require("../model/Order");
const Cart = require("../model/Cart");
const Product = require("../model/Product");

// Create new order from cart
exports.createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      deliveryNotes,
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total and create order items
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    // Create new order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      deliveryNotes,
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    await order.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the order belongs to the requesting user or if user is admin
    if (order.user._id.toString() !== req.user._id.toString() && 
        req.user.access !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    if (status === "delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Only allow cancellation of pending or processing orders
    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({ error: "Order cannot be cancelled" });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString() && 
        req.user.access !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    order.status = "cancelled";
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};
