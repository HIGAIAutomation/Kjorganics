const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    bannerImage: {
      type: String, // Optional image URL
      default: "",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    showInMenu: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
