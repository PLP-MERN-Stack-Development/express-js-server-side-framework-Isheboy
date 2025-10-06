# Products API - Express.js RESTful Server

A comprehensive RESTful API built with Express.js for managing products. This API implements CRUD operations, authentication, validation, error handling, and advanced features like filtering, pagination, and search.

## 🚀 Features

- ✅ Full CRUD operations for products
- ✅ Request logging middleware
- ✅ API key authentication
- ✅ Input validation and sanitization
- ✅ Global error handling with custom error classes
- ✅ Product filtering by category, price range, and stock status
- ✅ Pagination support
- ✅ Product search functionality
- ✅ Product statistics endpoint
- ✅ Comprehensive error responses with proper HTTP status codes

## 📦 Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 🔑 Authentication

Most write operations require API key authentication. Include the following header in your requests:

```
x-api-key: your-secret-api-key-123
```

## 📚 API Endpoints

### Root Endpoint

- **GET** `/` - Welcome message

### Products

#### Get All Products (with filtering and pagination)

- **GET** `/api/products`
- **Query Parameters:**
  - `page` (number): Page number for pagination (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `category` (string): Filter by product category
  - `inStock` (boolean): Filter by stock status (true/false)
  - `minPrice` (number): Filter by minimum price
  - `maxPrice` (number): Filter by maximum price
  - `search` (string): Search in product name and description

**Example:**

```bash
GET /api/products?page=1&limit=5&category=electronics&inStock=true&minPrice=100&maxPrice=1000
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 2,
    "limit": 5
  },
  "data": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

#### Get Single Product

- **GET** `/api/products/:id`

**Example:**

```bash
GET /api/products/1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  }
}
```

#### Create New Product

- **POST** `/api/products`
- **Headers:** `x-api-key: your-secret-api-key-123`
- **Body:**

```json
{
  "name": "New Product",
  "description": "Product description (min 5 characters)",
  "price": 99.99,
  "category": "category-name",
  "inStock": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "generated-uuid",
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "category": "category-name",
    "inStock": true
  }
}
```

#### Update Product

- **PUT** `/api/products/:id`
- **Headers:** `x-api-key: your-secret-api-key-123`
- **Body:** (all fields optional)

```json
{
  "name": "Updated Product Name",
  "price": 149.99
}
```

#### Delete Product

- **DELETE** `/api/products/:id`
- **Headers:** `x-api-key: your-secret-api-key-123`

### Search

#### Search Products

- **GET** `/api/products/search?q=searchTerm`

**Example:**

```bash
GET /api/products/search?q=laptop
```

### Statistics

#### Get Product Statistics

- **GET** `/api/products/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "totalProducts": 3,
    "inStockProducts": 2,
    "outOfStockProducts": 1,
    "categoryBreakdown": {
      "electronics": 2,
      "kitchen": 1
    },
    "priceStatistics": {
      "min": 50,
      "max": 1200,
      "average": 683.33
    }
  }
}
```

## ❌ Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid API key)
- `404` - Not Found
- `500` - Internal Server Error

### Example Error Responses:

**Validation Error (400):**

```json
{
  "success": false,
  "message": "Validation failed: Name is required and must be at least 2 characters long"
}
```

**Authentication Error (401):**

```json
{
  "success": false,
  "message": "API key is required. Please include x-api-key in headers."
}
```

**Not Found Error (404):**

```json
{
  "success": false,
  "message": "Product not found"
}
```

## 🧪 Testing with cURL

### Get all products:

```bash
curl http://localhost:3000/api/products
```

### Get product by ID:

```bash
curl http://localhost:3000/api/products/1
```

### Create a product:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-123" \
  -d '{
    "name": "Test Product",
    "description": "This is a test product",
    "price": 29.99,
    "category": "test",
    "inStock": true
  }'
```

### Update a product:

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-123" \
  -d '{
    "name": "Updated Product Name",
    "price": 39.99
  }'
```

### Delete a product:

```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "x-api-key: your-secret-api-key-123"
```

### Search products:

```bash
curl "http://localhost:3000/api/products/search?q=laptop"
```

### Get statistics:

```bash
curl http://localhost:3000/api/products/stats
```

## 🏗️ Project Structure

```
├── server.js                    # Main application file
├── package.json                 # Dependencies and scripts
├── README.md                    # API documentation
├── .env.example                 # Environment variables template
├── middleware/                  # Custom middleware modules
│   ├── auth.js                 # Authentication middleware
│   ├── errorHandler.js         # Global error handling
│   ├── logger.js               # Request logging middleware
│   └── validation.js           # Input validation middleware
├── routes/                     # Route modules
│   └── productRoutes.js        # Product-related routes
└── utils/                      # Utility modules
    ├── asyncHandler.js         # Async error handling wrapper
    ├── errors.js               # Custom error classes
    └── productController.js    # Product business logic
```

## 🛠️ Technologies Used

- **Express.js** - Web framework
- **body-parser** - Parse JSON request bodies
- **uuid** - Generate unique IDs
- **Node.js** - Runtime environment

## 🏛️ Architecture

This project follows a modular architecture pattern with clear separation of concerns:

### **Middleware Layer**

- **Logger**: Logs all incoming requests with timestamps and details
- **Authentication**: Validates API keys for protected routes
- **Validation**: Validates input data and query parameters
- **Error Handler**: Catches and formats all errors consistently

### **Route Layer**

- **Product Routes**: Handles all product-related HTTP requests
- Uses Express Router for modular route organization
- Applies appropriate middleware to each route

### **Business Logic Layer**

- **Product Controller**: Contains all product operations (CRUD, search, stats)
- **Error Classes**: Custom error types for different scenarios
- **Async Handler**: Wrapper for handling async/await errors

### **Benefits of this Architecture:**

- ✅ **Maintainability**: Each component has a single responsibility
- ✅ **Reusability**: Middleware can be applied to any route
- ✅ **Testability**: Each module can be tested independently
- ✅ **Scalability**: Easy to add new features and routes
- ✅ **Error Handling**: Consistent error responses across the API

## 📝 License

MIT License

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling.

## Assignment Overview

You will:

1. Set up an Express.js server
2. Create RESTful API routes for a product resource
3. Implement custom middleware for logging, authentication, and validation
4. Add comprehensive error handling
5. Develop advanced features like filtering, pagination, and search

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install dependencies:
   ```
   npm install
   ```
4. Run the server:
   ```
   npm start
   ```

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Starter Express.js server file
- `.env.example`: Example environment variables file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## API Endpoints

The API will have the following endpoints:

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all the required API endpoints
2. Implement the middleware and error handling
3. Document your API in the README.md
4. Include examples of requests and responses

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
