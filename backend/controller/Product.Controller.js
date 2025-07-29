const Product = require("../model/Product");
const Category = require("../model/category");
const cloudinary = require("../config/cloudinary");

// Helper to resolve category by name or ID
async function resolveCategory(categoryInput) {
  if (!categoryInput) throw new Error("Category is required");

  // Check if it's a valid MongoDB ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(categoryInput)) {
    const byId = await Category.findById(categoryInput);
    if (byId) return byId._id;
  }

  // Otherwise, try resolving by name
  const byName = await Category.findOne({ name: categoryInput });
  if (byName) return byName._id;

  throw new Error("Category not found");
}


// Create a new product (admin)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      unit,
      unitQuantity,
      type,
      category,
      ingredients = [],
      isVisible = true,
      isTrending = false,
      isNewProduct = false,
      isSnack = false,
    } = req.body;

    if (!name || price == null || stock == null || !unit || unitQuantity == null || !type || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Enforce unique name before creation
    const existing = await Product.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Product name \"${name}\" already exists.` });
    }

    // Resolve category ID
    let categoryId;
    try {
      categoryId = await resolveCategory(category);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // Upload images if provided
    const images = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        images.push(result.secure_url);
      }
    }

    const newProduct = new Product({
      name: name.trim(),
      description,
      price,
      stock,
      unit,
      unitQuantity,
      type,
      category: categoryId,
      ingredients,
      images,
      isVisible,
      isTrending,
      isNewProduct,
      isSnack,
    });
    await newProduct.save();
    res.status(201).json({ success: true, message: "Product created", data: newProduct });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// (Removed duplicate exports for getAllProducts, getSingleProduct, createProduct)

// Get all products (admin)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get single product by ID
exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query is required" });
    
    const products = await Product.find({
      $and: [
        { isVisible: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { type: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).populate("category");
    
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get trending products
exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true, isTrending: true })
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get new products
exports.getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true, isNewProduct: true })
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ 
      category: categoryId,
      isVisible: true 
    }).populate("category");
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get visible/flagged products for home page
exports.getVisibleProducts = async (req, res) => {
  try {
    // Only show products that are visible and at least one flag is true
    const products = await Product.find({
      isVisible: true,
      $or: [
        { isTrending: true },
        { isNewProduct: true },
        { isSnack: true }
      ]
    }).populate("category").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update product (admin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (update.category) {
      update.category = await resolveCategory(update.category);
    }
    // Merge existing image URLs and new uploads
    let images = [];
    // Existing image URLs from form field (may be string or array)
    if (update.existingImages) {
      if (Array.isArray(update.existingImages)) {
        images = images.concat(update.existingImages);
      } else if (typeof update.existingImages === 'string') {
        images.push(update.existingImages);
      }
    }
    // Handle new image uploads if present
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        images.push(result.secure_url);
      }
    }
    if (images.length) {
      update.images = images;
    }
    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product updated", data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete product (admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Toggle product flags (isVisible, isTrending, isNewProduct, isSnack)
exports.toggleProductFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const { flag, value } = req.body;
    if (!['isVisible', 'isTrending', 'isNewProduct', 'isSnack'].includes(flag)) {
      return res.status(400).json({ success: false, message: "Invalid flag" });
    }
    const product = await Product.findByIdAndUpdate(id, { [flag]: value }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: `Product ${flag} updated`, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
