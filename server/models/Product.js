const mongoose = require("mongoose");

// ----------------------------
// Product Schema
// ----------------------------
const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Product image URL is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: [50, "Brand cannot exceed 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    salePrice: {
      type: Number,
      min: [0, "Sale price cannot be negative"],
      default: 0,
    },
    totalStock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0, // allows "Best Rated" sorting
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ----------------------------
// Virtual: effectivePrice
// ----------------------------
ProductSchema.virtual("effectivePrice").get(function () {
  return this.salePrice && this.salePrice > 0 ? this.salePrice : this.price;
});

// ----------------------------
// Indexes for faster queries
// ----------------------------
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 }); // for newest sort

// ----------------------------
// Export model
// ----------------------------
module.exports = mongoose.model("Product", ProductSchema);
