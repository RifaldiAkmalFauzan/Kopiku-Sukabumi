const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend Kopiku Sukabumi berjalan..." });
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
