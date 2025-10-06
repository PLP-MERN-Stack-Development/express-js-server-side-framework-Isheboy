// Product Routes

const express = require("express");
const router = express.Router();

// Import utilities and middleware
const asyncHandler = require("../utils/asyncHandler");
const { NotFoundError, ValidationError } = require("../utils/errors");
const { authenticateApiKey } = require("../middleware/auth");
const {
  validateProduct,
  validateQueryParams,
} = require("../middleware/validation");
const productController = require("../utils/productController");

// GET /api/products - Get all products with filtering, pagination, and search
router.get(
  "/",
  validateQueryParams,
  asyncHandler(async (req, res) => {
    const result = productController.getAllProducts(req.query);

    res.json({
      success: true,
      count: result.count,
      pagination: result.pagination,
      data: result.products,
    });
  })
);

// GET /api/products/search - Search products by name
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
      throw new ValidationError("Search query is required. Use ?q=searchTerm");
    }

    const searchResults = productController.searchProducts(q);

    res.json({
      success: true,
      query: q,
      count: searchResults.length,
      data: searchResults,
    });
  })
);

// GET /api/products/stats - Get product statistics
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const stats = productController.getProductStats();

    res.json({
      success: true,
      data: stats,
    });
  })
);

// GET /api/products/:id - Get a specific product
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const product = productController.getProductById(req.params.id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.json({
      success: true,
      data: product,
    });
  })
);

// POST /api/products - Create a new product
router.post(
  "/",
  authenticateApiKey,
  validateProduct,
  asyncHandler(async (req, res) => {
    const newProduct = productController.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  })
);

// PUT /api/products/:id - Update a product
router.put(
  "/:id",
  authenticateApiKey,
  validateProduct,
  asyncHandler(async (req, res, next) => {
    const updatedProduct = productController.updateProduct(
      req.params.id,
      req.body
    );

    if (!updatedProduct) {
      throw new NotFoundError("Product not found");
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  })
);

// DELETE /api/products/:id - Delete a product
router.delete(
  "/:id",
  authenticateApiKey,
  asyncHandler(async (req, res, next) => {
    const deletedProduct = productController.deleteProduct(req.params.id);

    if (!deletedProduct) {
      throw new NotFoundError("Product not found");
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  })
);

module.exports = router;
