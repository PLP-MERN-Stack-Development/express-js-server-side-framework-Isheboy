// Validation Middleware

const { ValidationError } = require("../utils/errors");

// Validation Middleware for Product Creation/Update
const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];

  // For POST requests, all fields are required
  if (req.method === "POST") {
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.push("Name is required and must be at least 2 characters long");
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 5
    ) {
      errors.push(
        "Description is required and must be at least 5 characters long"
      );
    }
    if (price === undefined || typeof price !== "number" || price < 0) {
      errors.push("Price is required and must be a positive number");
    }
    if (
      !category ||
      typeof category !== "string" ||
      category.trim().length < 2
    ) {
      errors.push(
        "Category is required and must be at least 2 characters long"
      );
    }
  }

  // For PUT requests, validate only provided fields
  if (req.method === "PUT") {
    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim().length < 2)
    ) {
      errors.push("Name must be at least 2 characters long");
    }
    if (
      description !== undefined &&
      (typeof description !== "string" || description.trim().length < 5)
    ) {
      errors.push("Description must be at least 5 characters long");
    }
    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      errors.push("Price must be a positive number");
    }
    if (
      category !== undefined &&
      (typeof category !== "string" || category.trim().length < 2)
    ) {
      errors.push("Category must be at least 2 characters long");
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError(`Validation failed: ${errors.join(", ")}`));
  }

  next();
};

// Validate query parameters for filtering
const validateQueryParams = (req, res, next) => {
  const { page, limit, minPrice, maxPrice } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return next(new ValidationError("Page must be a positive integer"));
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return next(
      new ValidationError("Limit must be a positive integer between 1 and 100")
    );
  }

  if (minPrice && (isNaN(minPrice) || parseFloat(minPrice) < 0)) {
    return next(new ValidationError("Minimum price must be a positive number"));
  }

  if (maxPrice && (isNaN(maxPrice) || parseFloat(maxPrice) < 0)) {
    return next(new ValidationError("Maximum price must be a positive number"));
  }

  if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
    return next(
      new ValidationError("Minimum price cannot be greater than maximum price")
    );
  }

  next();
};

module.exports = {
  validateProduct,
  validateQueryParams,
};
