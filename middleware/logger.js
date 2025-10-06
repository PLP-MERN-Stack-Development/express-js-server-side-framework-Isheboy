// Logger Middleware

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get("User-Agent") || "Unknown";

  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);

  // Log request body for POST/PUT requests (excluding sensitive data)
  if ((method === "POST" || method === "PUT") && req.body) {
    const logBody = { ...req.body };
    // Remove any sensitive fields from logging
    delete logBody.password;
    delete logBody.apiKey;
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(logBody));
  }

  next();
};

module.exports = logger;
