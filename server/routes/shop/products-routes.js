const express = require("express");
const router = express.Router();
const { getFilteredProducts, getProductDetails } = require("../../controllers/shop/products-controler");

// List / Filtered products
router.get("/get", getFilteredProducts);

// Single product details (matches frontend)
router.get("/:id", getProductDetails);

module.exports = router;
