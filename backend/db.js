// backend/db.js
const mysql = require('mysql2');

// Konfigurasi koneksi database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dodo2025",           // Password kosong untuk Laragon
    database: "kopiku_db",  // Nama database yang benar
    port: 3306
});

// Test koneksi saat aplikasi dimulai
db.connect((err) => {
    if (err) {
        console.error("❌ MySQL gagal terhubung:", err.message);
        console.log("\n🔧 Solusi:");
        console.log("1. Pastikan Laragon sedang berjalan");
        console.log("2. Pastikan MySQL service berjalan (lampu hijau)");
        console.log("3. Database 'kopiku_db' harus sudah dibuat");
        console.log("4. Cek di phpMyAdmin: http://localhost/phpmyadmin");
    } else {
        console.log("✅ MySQL berhasil terhubung ke database kopiku_db");
    }
});

module.exports = db;