const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sizes: [
    {
      size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  images: [
    {
      type: String, // Store image URLs
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to the Category model
    required: true,
  },
  isActive: { type: Boolean, default: true },
  isSold: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
