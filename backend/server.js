const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
host: process.env.DB_HOST || "localhost",
user: process.env.DB_USER || "robouser",
password: process.env.DB_PASSWORD || "robopassword",
database: process.env.DB_NAME || "robostore",
port: process.env.DB_PORT || 3306,
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0,
});

// Test database connection
async function testDatabaseConnection() {
try {
const connection = await db.getConnection();

```
console.log("MySQL database connected successfully");

connection.release();
```

} catch (error) {
console.error("MySQL connection failed:", error.message);
}
}

// Home route
app.get("/", (req, res) => {
res.json({
message: "RoboStore backend is running",
});
});

// Health check
app.get("/api/health", async (req, res) => {
try {
await db.query("SELECT 1");

```
res.json({
  status: "UP",
  database: "CONNECTED",
  service: "RoboStore Backend",
});
```

} catch (error) {
res.status(500).json({
status: "DOWN",
database: "DISCONNECTED",
error: error.message,
});
}
});

// Get all products from MySQL
app.get("/api/products", async (req, res) => {
try {
const [products] = await db.query(
"SELECT * FROM products ORDER BY id"
);

```
res.json(products);
```

} catch (error) {
console.error("Error fetching products:", error.message);

```
res.status(500).json({
  error: "Failed to fetch products",
});
```

}
});

// Get a single product
app.get("/api/products/:id", async (req, res) => {
try {
const [products] = await db.query(
"SELECT * FROM products WHERE id = ?",
[req.params.id]
);

```
if (products.length === 0) {
  return res.status(404).json({
    error: "Product not found",
  });
}

res.json(products[0]);
```

} catch (error) {
console.error("Error fetching product:", error.message);

```
res.status(500).json({
  error: "Failed to fetch product",
});
```

}
});

// Export app for testing
module.exports = app;

// Start server only when this file is run directly
if (require.main === module) {
app.listen(PORT, async () => {
console.log(`RoboStore backend running on port ${PORT}`);

```
await testDatabaseConnection();
```

});
}
