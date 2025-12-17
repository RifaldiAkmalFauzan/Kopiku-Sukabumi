// backend/routes/products.js
import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const __dirname = new URL('.', import.meta.url).pathname;
const dataPath = path.join(__dirname, '../data/products.json');

// helper
const readProducts = () =>
  JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const writeProducts = (data) =>
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// 🔹 GET semua produk
router.get('/', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// 🔹 GET produk by ID
router.get('/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id == req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  res.json(product);
});

// 🔹 CREATE produk (ADMIN)
router.post('/', (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: Date.now(),
    ...req.body,
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// 🔹 UPDATE produk
router.put('/:id', (req, res) => {
  let products = readProducts();
  const index = products.findIndex(p => p.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  products[index] = { ...products[index], ...req.body };
  writeProducts(products);

  res.json(products[index]);
});

// 🔹 DELETE produk
router.delete('/:id', (req, res) => {
  let products = readProducts();
  products = products.filter(p => p.id != req.params.id);

  writeProducts(products);
  res.json({ message: 'Produk berhasil dihapus' });
});

export default router;
