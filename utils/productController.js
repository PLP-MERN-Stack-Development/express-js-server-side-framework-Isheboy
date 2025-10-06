// Product Data Model and Controller Functions

const { v4: uuidv4 } = require("uuid");

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Helper functions for product operations
const productController = {
  // Get all products with filtering and pagination
  getAllProducts: (queryParams) => {
    let filteredProducts = [...products];

    // Search functionality
    if (queryParams.search) {
      const searchTerm = queryParams.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (queryParams.category) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === queryParams.category.toLowerCase()
      );
    }

    // Filter by inStock status
    if (queryParams.inStock !== undefined) {
      const inStock = queryParams.inStock === "true";
      filteredProducts = filteredProducts.filter(
        (product) => product.inStock === inStock
      );
    }

    // Filter by price range
    if (queryParams.minPrice) {
      const minPrice = parseFloat(queryParams.minPrice);
      if (!isNaN(minPrice)) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= minPrice
        );
      }
    }

    if (queryParams.maxPrice) {
      const maxPrice = parseFloat(queryParams.maxPrice);
      if (!isNaN(maxPrice)) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= maxPrice
        );
      }
    }

    // Pagination
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Pagination info
    const pagination = {
      current: page,
      pages: Math.ceil(total / limit),
      total: total,
      limit: limit,
    };

    if (endIndex < total) {
      pagination.next = page + 1;
    }

    if (startIndex > 0) {
      pagination.prev = page - 1;
    }

    return {
      products: paginatedProducts,
      pagination,
      count: paginatedProducts.length,
    };
  },

  // Get product by ID
  getProductById: (id) => {
    return products.find((p) => p.id === id);
  },

  // Create new product
  createProduct: (productData) => {
    const newProduct = {
      id: uuidv4(),
      name: productData.name.trim(),
      description: productData.description.trim(),
      price: productData.price,
      category: productData.category.trim(),
      inStock: productData.inStock !== undefined ? productData.inStock : true,
    };

    products.push(newProduct);
    return newProduct;
  },

  // Update product
  updateProduct: (id, updateData) => {
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return null;
    }

    // Update only provided fields
    if (updateData.name !== undefined)
      products[productIndex].name = updateData.name.trim();
    if (updateData.description !== undefined)
      products[productIndex].description = updateData.description.trim();
    if (updateData.price !== undefined)
      products[productIndex].price = updateData.price;
    if (updateData.category !== undefined)
      products[productIndex].category = updateData.category.trim();
    if (updateData.inStock !== undefined)
      products[productIndex].inStock = updateData.inStock;

    return products[productIndex];
  },

  // Delete product
  deleteProduct: (id) => {
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return null;
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    return deletedProduct;
  },

  // Search products
  searchProducts: (searchQuery) => {
    const searchTerm = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  },

  // Get product statistics
  getProductStats: () => {
    const totalProducts = products.length;
    const inStockProducts = products.filter((p) => p.inStock).length;
    const outOfStockProducts = totalProducts - inStockProducts;

    // Count by category
    const categoryCount = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    // Price statistics
    const prices = products.map((p) => p.price);
    const priceStats =
      prices.length > 0
        ? {
            min: Math.min(...prices),
            max: Math.max(...prices),
            average: parseFloat(
              (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
            ),
          }
        : { min: 0, max: 0, average: 0 };

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      categoryBreakdown: categoryCount,
      priceStatistics: priceStats,
    };
  },
};

module.exports = productController;
