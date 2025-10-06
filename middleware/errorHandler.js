// Global Error Handling Middleware

const { NotFoundError, ValidationError } = require("../utils/errors");

// 404 Handler - Must be placed after all routes
const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
};

// Global Error Handler
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error("Error:", err);

  // Mongoose bad ObjectId (if using MongoDB in the future)
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new NotFoundError(message);
  }

  // Mongoose duplicate key (if using MongoDB in the future)
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ValidationError(message);
  }

  // Mongoose validation error (if using MongoDB in the future)
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ValidationError(message);
  }

  // JSON parsing error
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    error = new ValidationError("Invalid JSON format");
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
