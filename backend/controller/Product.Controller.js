// controllers/Product.Controller.js

const Product = require("../model/Product");
const Category = require("../model/Category");
const cloudinary = require("../config/cloudinary");

// Helper: resolve category name → ObjectId
async function resolveCategory(categoryInput) {
  if (!categoryInput) throw new Error("Category is required");

  // If looks like ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(categoryInput)) {
    const byId = await Category.findById(categoryInput);
    if (byId) return byId._id;
  }
  // Else by name
  const byName = await Category.findOne({ name: categoryInput.trim() });
  if (!byName) throw new Error(`Category "${categoryInput}" not found`);
  return byName._id;
}

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const {
      name, description, price, stock,
      unit, unitQuantity, type, category,
      ingredients = [], isVisible, isTrending, isNew, isSnack,
    } = req.body;

    // resolve category
    const categoryId = await resolveCategory(category);

    // upload images
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        images.push(result.secure_url);
      }
    }

    const product = new Product({
      name, description, price, stock,
      unit, unitQuantity, type,
      category: categoryId,
      ingredients,
      images,
      isVisible, isTrending, isNew, isSnack,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// GET ALL (with optional filters/search)
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

    res.json(products);
  } catch (err) {
    console.error("Get All Products Error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// GET ONE
exports.getSingleProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id).populate("category");
    if (!prod) return res.status(404).json({ error: "Product not found" });
    res.json(prod);
  } catch (err) {
    console.error("Get Single Product Error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ error: "Product not found" });

    // fields
    const up = req.body;
    if (up.category) {
      up.category = await resolveCategory(up.category);
    }

    // handle new images
    if (req.files && req.files.length) {
      // Optionally clear old images in Cloudinary here...
      const newImgs = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        newImgs.push(result.secure_url);
      }
      up.images = newImgs;
    }

    Object.assign(prod, up);
    await prod.save();
    res.json(prod);
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
};

// PRODUCTS BY CATEGORY
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = await resolveCategory(req.params.categoryId);
    const products = await Product.find({ category: categoryId }).populate("category");
    res.json(products);
  } catch (err) {
    console.error("Products By Category Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// TRENDING
exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).populate("category");
    res.json(products);
  } catch (err) {
    console.error("Trending Products Error:", err);
    res.status(500).json({ error: "Failed to fetch trending" });
  }
};

// NEW
exports.getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNew: true }).populate("category");
    res.json(products);
  } catch (err) {
    console.error("New Products Error:", err);
    res.status(500).json({ error: "Failed to fetch new products" });
  }
};

// SEARCH
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query required" });
    const regex = new RegExp(q, "i");
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }],
    }).populate("category");
    res.json(products);
  } catch (err) {
    console.error("Search Products Error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};
