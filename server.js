// server.js - Main Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");

// Import custom middleware
const logger = require("./middleware/logger");
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./middleware/errorHandler");

// Import routes
const productRoutes = require("./routes/productRoutes");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Global Middleware setup
app.use(bodyParser.json());
app.use(logger);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Products API!",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      search: "/api/products/search",
      statistics: "/api/products/stats",
    },
    documentation: "Please refer to README.md for complete API documentation",
  });
});

// API Routes
app.use("/api/products", productRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
