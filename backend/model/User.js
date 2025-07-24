const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      minLength: 10,
      unique:true,
      maxLength: 15,
      trim: true,
    },
    address: {
      type: String,
      minLength: 10,
      maxLength: 100,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    access: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
