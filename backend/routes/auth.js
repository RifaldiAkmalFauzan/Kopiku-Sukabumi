const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const usersFile = path.join(__dirname, "../data/users.json");

// REGISTER
router.post("/register", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

  // cek user sudah ada
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username sudah digunakan" });
  }

  const newUser = { id: Date.now(), username, password, role: role || "user" };
  users.push(newUser);

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.json({ message: "Registrasi berhasil", user: newUser });
});


// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Isi username dan password" });
  }

  const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

  const found = users.find(
    user => user.username === username && user.password === password
  );

  if (!found) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  const token = "TOKEN-" + found.id; // sederhana dulu

  res.json({
    message: "Login berhasil",
    token,
    role: found.role
  });
});

module.exports = router;
