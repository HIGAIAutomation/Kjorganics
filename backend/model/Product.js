const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    unique:true
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price can't be negative"],
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock can't be negative"],
  },
  unit: {
    type: String,
    enum: ["g", "kg", "ml", "ltr", "pack", "box"],
    required: true,
  },
  unitQuantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["veg", "non-veg", "egg", "vegan"],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  ingredients: {
    type: [String], // Ingredient list
  },
  images: {
    type: [String], // Cloudinary URLs
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isNewProduct: {
    type: Boolean,
    default: false,
  },
  isSnack: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);
