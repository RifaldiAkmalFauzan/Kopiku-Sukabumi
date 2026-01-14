// const path = require("path");
// const express = require("express");
// const cors = require("cors");

// const authRoutes = require("./routes/auth");
// const productRoutes = require("./routes/products");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // API
// app.use("/auth", authRoutes);
// app.use("/products", productRoutes);

// // Frontend folder statis
// app.use(express.static(path.join(__dirname, "../src/user")));

// // Admin folder statis
// app.use("/admin", express.static(path.join(__dirname, "../src/admin")));

// // Mount user folder dengan prefix /user
// app.use("/user", express.static(path.join(__dirname, "../src/user")));


// // Admin components
// app.use("/admin/components", express.static(path.join(__dirname, "../src/admin/components")));
// // Folder dist (CSS/JS hasil build)
// app.use("/dist", express.static(path.join(__dirname, "../dist")));

// // Folder assets
// app.use("/assets", express.static(path.join(__dirname, "../src/assets")));

// // Root page
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../src/user/pages/index.html"));
// });

// app.listen(3000, () => {
//   console.log("Server jalan di http://localhost:3000");
// });

// backend/server.js
const path = require("path");
const express = require("express");
const cors = require("cors");

// Import koneksi database
require("./db"); // Ini akan menjalankan koneksi database

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

// Static Files Middleware
app.use(express.static(path.join(__dirname, "../src/user")));
app.use("/admin", express.static(path.join(__dirname, "../src/admin")));
app.use("/user", express.static(path.join(__dirname, "../src/user")));
app.use("/admin/components", express.static(path.join(__dirname, "../src/admin/components")));
app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use("/src/assets", express.static(path.join(__dirname, "../src/assets")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/user/pages/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});