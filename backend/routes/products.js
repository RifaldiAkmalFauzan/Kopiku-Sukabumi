// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// // GET semua produk
// router.get("/", (req, res) => {
//   const sql = `SELECT id, name, price, weight, stock, img, description, isBestSeller FROM products`;
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ message: "Gagal ambil produk" });
//     res.json(results);
//   });
// });

// // GET produk by ID
// router.get("/:id", (req, res) => {
//   const sql = `SELECT id, name, price, weight, stock, img, description, isBestSeller FROM products WHERE id=?`;
//   db.query(sql, [req.params.id], (err, results) => {
//     if (err) return res.status(500).json({ message: "Error server" });
//     if (results.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
//     res.json(results[0]);
//   });
// });

// // CREATE produk
// router.post("/", (req, res) => {
//   const { name, price, weight, stock, img, description, isBestSeller } = req.body;
//   const sql = `
//     INSERT INTO products (name, price, weight, stock, img, description, isBestSeller)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;
//   db.query(sql, [name, price, weight, stock, img, description, isBestSeller ? 1 : 0], (err, result) => {
//     if (err) return res.status(500).json({ message: "Gagal menambah produk" });
//     res.status(201).json({ message: "Produk berhasil ditambahkan", id: result.insertId });
//   });
// });

// // UPDATE produk
// router.put("/:id", (req, res) => {
//   const { name, price, weight, stock, img, description, isBestSeller } = req.body;
//   const sql = `
//     UPDATE products
//     SET name=?, price=?, weight=?, stock=?, img=?, description=?, isBestSeller=?
//     WHERE id=?
//   `;
//   db.query(sql, [name, price, weight, stock, img, description, isBestSeller ? 1 : 0, req.params.id], (err, result) => {
//     if (err) return res.status(500).json({ message: "Gagal mengupdate produk" });
//     if (result.affectedRows === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
//     res.json({ message: "Produk berhasil diupdate" });
//   });
// });

// // DELETE produk
// router.delete("/:id", (req, res) => {
//   const sql = `DELETE FROM products WHERE id=?`;
//   db.query(sql, [req.params.id], (err, result) => {
//     if (err) return res.status(500).json({ message: "Gagal menghapus produk" });
//     if (result.affectedRows === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
//     res.json({ message: "Produk berhasil dihapus" });
//   });
// });

// module.exports = router;

// backend/routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   GET /products
// @desc    Get all products
// @access  Public
// Di routes/products.js - GET /products
router.get('/', (req, res) => {
  const sql = `SELECT * FROM products ORDER BY id DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Get products error:', err);
      return res.status(500).json({ message: 'Gagal mengambil produk' });
    }

    // Return langsung array, TANPA wrapper success/data
    res.json(results);
  });
});

// GET product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM products WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Get product by ID error:', err);
      return res.status(500).json({ message: 'Error server' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Return langsung object produk
    res.json(results[0]);
  });
});
// @route   POST /products
// @desc    Create new product
// @access  Private (Admin)
router.post('/', (req, res) => {
  const { name, price, weight, stock, img, description, isBestSeller } = req.body;

  // Validasi input
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Nama dan harga harus diisi',
    });
  }

  const sql = `
    INSERT INTO products (name, price, weight, stock, img, description, isBestSeller)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const isBestSellerValue = isBestSeller ? 1 : 0;

  db.query(
    sql,
    [name, price, weight || 0, stock || 0, img || '', description || '', isBestSellerValue],
    (err, result) => {
      if (err) {
        console.error('Create product error:', err);
        return res.status(500).json({
          success: false,
          message: 'Gagal menambah produk',
        });
      }

      res.status(201).json({
        success: true,
        message: 'Produk berhasil ditambahkan',
        id: result.insertId,
      });
    }
  );
});

// @route   PUT /products/:id
// @desc    Update product
// @access  Private (Admin)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, weight, stock, img, description, isBestSeller } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Nama dan harga harus diisi',
    });
  }

  const sql = `
    UPDATE products
    SET name = ?, price = ?, weight = ?, stock = ?, 
        img = ?, description = ?, isBestSeller = ?
    WHERE id = ?
  `;

  const isBestSellerValue = isBestSeller ? 1 : 0;

  db.query(
    sql,
    [name, price, weight || 0, stock || 0, img || '', description || '', isBestSellerValue, id],
    (err, result) => {
      if (err) {
        console.error('Update product error:', err);
        return res.status(500).json({
          success: false,
          message: 'Gagal mengupdate produk',
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Produk tidak ditemukan',
        });
      }

      res.json({
        success: true,
        message: 'Produk berhasil diupdate',
      });
    }
  );
});

// @route   DELETE /products/:id
// @desc    Delete product
// @access  Private (Admin)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM products WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Delete product error:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus produk',
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Produk berhasil dihapus',
    });
  });
});

module.exports = router;
