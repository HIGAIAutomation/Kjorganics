const Cart = require("../model/Cart");
const Product = require("../model/Product");

// 1. Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) return res.status(200).json({ items: [] }); // empty cart
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to get cart" });
  }
};

// 2. Add to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // If cart doesn't exist, create one
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity; // Update quantity
      } else {
        cart.items.push({ product: productId, quantity }); // Add new item
      }
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// 3. Update quantity
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Quantity updated", cart });
    } else {
      res.status(404).json({ error: "Item not in cart" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity" });
  }
};

// 4. Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { product: productId } } },
      { new: true }
    );
    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item" });
  }
};

// 5. Clear cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
