// // const express = require("express");
// // const router = express.Router();
// // const db = require("../db");

// // router.post("/login", (req, res) => {
// //   const { username, password } = req.body;

// //   const sql = "SELECT * FROM users WHERE username=? AND password=?";
// //   db.query(sql, [username, password], (err, result) => {
// //     if (err) return res.status(500).json({ message: "Server error" });

// //     if (result.length > 0) {
// //       res.json({
// //         message: "Login berhasil",
// //         user: {
// //           id: result[0].id,
// //           username: result[0].username,
// //           role: result[0].role
// //         }
// //       });
// //     } else {
// //       res.status(401).json({ message: "Login gagal" });
// //     }
// //   });
// // });

// // module.exports = router;

// // backend/routes/auth.js
// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// // @route   POST /auth/login
// // @desc    Login user
// // @access  Public
// router.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   // Validasi input
//   if (!username || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Username dan password harus diisi"
//     });
//   }

//   const sql = "SELECT id, username, role FROM users WHERE username = ? AND password = ?";

//   db.query(sql, [username, password], (err, results) => {
//     if (err) {
//       console.error("Login error:", err);
//       return res.status(500).json({
//         success: false,
//         message: "Server error"
//       });
//     }

//     if (results.length > 0) {
//       const user = results[0];
//       res.json({
//         success: true,
//         message: "Login berhasil",
//         user: {
//           id: user.id,
//           username: user.username,
//           role: user.role || 'user'
//         }
//       });
//     } else {
//       res.status(401).json({
//         success: false,
//         message: "Username atau password salah"
//       });
//     }
//   });
// });

// // @route   POST /auth/register
// // @desc    Register new user
// // @access  Public
// router.post("/register", (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Username dan password harus diisi"
//     });
//   }

//   // Cek apakah username sudah terdaftar
//   const checkSql = "SELECT id FROM users WHERE username = ?";

//   db.query(checkSql, [username], (err, results) => {
//     if (err) {
//       console.error("Check username error:", err);
//       return res.status(500).json({
//         success: false,
//         message: "Server error"
//       });
//     }

//     if (results.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Username sudah digunakan"
//       });
//     }

//     // Insert user baru
//     const insertSql = "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')";

//     db.query(insertSql, [username, password], (err, result) => {
//       if (err) {
//         console.error("Register error:", err);
//         return res.status(500).json({
//           success: false,
//           message: "Gagal mendaftarkan user"
//         });
//       }

//       res.status(201).json({
//         success: true,
//         message: "Registrasi berhasil",
//         userId: result.insertId
//       });
//     });
//   });
// });

// module.exports = router;

// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username dan password harus diisi',
    });
  }

  const sql = 'SELECT id, username, role FROM users WHERE username = ? AND password = ?';

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({
        success: true,
        message: 'Login berhasil',
        user: {
          id: user.id,
          username: user.username,
          role: user.role || 'user',
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Username atau password salah',
      });
    }
  });
});

// @route   POST /auth/register
// @desc    Register new user
// @access  Public
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username dan password harus diisi',
    });
  }

  // Cek apakah username sudah terdaftar
  const checkSql = 'SELECT id FROM users WHERE username = ?';

  db.query(checkSql, [username], (err, results) => {
    if (err) {
      console.error('Check username error:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username sudah digunakan',
      });
    }

    // Insert user baru
    const insertSql = "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')";

    db.query(insertSql, [username, password], (err, result) => {
      if (err) {
        console.error('Register error:', err);
        return res.status(500).json({
          success: false,
          message: 'Gagal mendaftarkan user',
        });
      }

      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        userId: result.insertId,
      });
    });
  });
});

module.exports = router;
