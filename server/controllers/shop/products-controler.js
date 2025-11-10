const Product = require("../../models/Product");

// -----------------------------
// GET Filtered + Sorted Products
// -----------------------------
const getFilteredProducts = async (req, res) => {
  try {
    const { category = "", brand = "", sortBy = "price-lowtoHigh" } = req.query;

    console.log("[ProductController] Incoming query params:", { category, brand, sortBy });

    // Build filter object
    const filters = {};

    if (category) {
      filters.category = { $in: category.split(",") };
    }

    if (brand) {
      filters.brand = { $in: brand.split(",") };
    }

    console.log("[ProductController] MongoDB filters:", filters);

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case "price-lowtoHigh":
        sort = { price: 1 };
        break;
      case "price-hightoLow":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "best-rated":
        sort = { rating: -1 };
        break;
      default:
        sort = { price: 1 };
    }

    console.log("[ProductController] MongoDB sort:", sort);

    // Fetch products from DB
    const products = await Product.find(filters).sort(sort);

    console.log(`[ProductController] Fetched ${products.length} products`);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    console.error("[ProductController] Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// -----------------------------
// GET Single Product Details
// -----------------------------
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params; // <-- FIXED

    console.log("[ProductController] Fetching product ID:", id);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error("[ProductController] Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
