const Product = require("../model/Product");
const Category = require("../model/Category");
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


// Create a new product
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
      isNew = false,
      isSnack = false,
    } = req.body;

    // Required fields validation
    if (!name || price == null || stock == null || !unit || unitQuantity == null || !type || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Enforce unique name before creation
    const existing = await Product.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: `Product name \"${name}\" already exists.` });
    }

    // Resolve category ID
    let categoryId;
    try {
      categoryId = await resolveCategory(category);
    } catch (err) {
      return res.status(400).json({ error: err.message });
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
      isNew,
      isSnack,
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (err) {
    console.error("Create Product Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Get all products with optional filters/search
exports.getAllProducts = async (req, res) => {
  try {
    const { q, trending, newly } = req.query;
    const filter = {};
    if (q) filter.$or = [
      { name: new RegExp(q, "i") },
      { description: new RegExp(q, "i") },
    ];
    if (trending === "true") filter.isTrending = true;
    if (newly === "true") filter.isNew = true;

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    return res.json(products);
  } catch (err) {
    console.error("Get All Products Error:", err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get single product by ID
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (err) {
    console.error("Get Single Product Error:", err);
    return res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const updates = req.body;

    // Enforce unique name on update
    if (updates.name && updates.name.trim() !== product.name) {
      const exists = await Product.findOne({ name: updates.name.trim() });
      if (exists) {
        return res.status(400).json({ error: `Product name \"${updates.name}\" already exists.` });
      }
      product.name = updates.name.trim();
    }

    // Resolve category if provided
    if (updates.category) {
      try {
        product.category = await resolveCategory(updates.category);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }

    // Handle new images
    if (req.files && req.files.length) {
      product.images = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        product.images.push(result.secure_url);
      }
    }

    // Apply other updates
    const fields = [
      'description', 'price', 'stock', 'unit', 'unitQuantity', 'type',
      'ingredients', 'isVisible', 'isTrending', 'isNew', 'isSnack'
    ];
    fields.forEach(field => {
      if (updates[field] !== undefined) product[field] = updates[field];
    });

    await product.save();
    return res.json(product);
  } catch (err) {
    console.error("Update Product Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete Product Error:", err);
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

// Search products by query
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query required" });
    const regex = new RegExp(q, "i");
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }],
    }).populate("category");
    return res.json(products);
  } catch (err) {
    console.error("Search Products Error:", err);
    return res.status(500).json({ error: "Search failed" });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = await resolveCategory(req.params.categoryId);
    const products = await Product.find({ category: categoryId }).populate("category");
    return res.json(products);
  } catch (err) {
    console.error("Products By Category Error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Get trending products
exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).populate("category");
    return res.json(products);
  } catch (err) {
    console.error("Trending Products Error:", err);
    return res.status(500).json({ error: "Failed to fetch trending products" });
  }
};

// Get new products
exports.getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNew: true }).populate("category");
    return res.json(products);
  } catch (err) {
    console.error("New Products Error:", err);
    return res.status(500).json({ error: "Failed to fetch new products" });
  }
};
