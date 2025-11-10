const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

// ---------------------------------
// Multer Memory Storage Setup
// ---------------------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------------------------
// Product Routes
// ---------------------------------

// Upload product image
router.post("/upload-image", upload.single("my_file"), handleImageUpload);

// Add new product
router.post("/add", addProduct);

// Fetch all products
router.get("/get", fetchAllProducts);

// Edit product
router.put("/edit/:id", editProduct);

// Delete product
router.delete("/delete/:id", deleteProduct);

module.exports = router;
