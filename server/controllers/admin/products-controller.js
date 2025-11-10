// controllers/admin/products-controller.js

const { imageUploadUtils } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

// ----------------------------
// Upload Product Image (Cloudinary)
// ----------------------------
const handleImageUpload = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Convert uploaded file to Base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary using helper
    const uploadResult = await imageUploadUtils(base64Image);

    // Validate Cloudinary response
    if (!uploadResult || !uploadResult.url) {
      console.error("❌ Cloudinary Upload Failed:", uploadResult);
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed. Please try again.",
      });
    }

    // ✅ Success response
    console.log("✅ Cloudinary Upload Successful:", uploadResult.url);
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
      },
    });
  } catch (error) {
    console.error("❌ Image Upload Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during image upload",
      error: error.message || "Unknown error",
    });
  }
};

// ----------------------------
// Add New Product
// ----------------------------
const addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      result: newProduct, // ✅ match consistent key name
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Adding product failed",
    });
  }
};


// ----------------------------
// Fetch All Products
// ----------------------------
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Fetching products failed",
    });
  }
};

// ----------------------------
// Edit Product
// ----------------------------
const editProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Edit Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Updating product failed",
    });
  }
};

// ----------------------------
// Delete Product
// ----------------------------
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Deleting product failed",
    });
  }
};

// ----------------------------
// Exports
// ----------------------------
module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
