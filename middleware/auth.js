// Authentication Middleware

const { AuthenticationError } = require("../utils/errors");

// Authentication Middleware (checks for API key)
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  // For demo purposes, we'll use a simple API key
  const validApiKey = process.env.API_KEY || "your-secret-api-key-123";

  if (!apiKey) {
    return next(
      new AuthenticationError(
        "API key is required. Please include x-api-key in headers."
      )
    );
  }

  if (apiKey !== validApiKey) {
    return next(new AuthenticationError("Invalid API key"));
  }

  next();
};

module.exports = {
  authenticateApiKey,
};
