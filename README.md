# ☕ Kopiku Sukabumi

Kopiku Sukabumi adalah aplikasi web e-commerce sederhana yang dibuat sebagai proyek mata kuliah **Rekayasa Perangkat Lunak**. Aplikasi ini mensimulasikan platform penjualan kopi UMKM dengan fitur autentikasi pengguna, manajemen produk oleh admin, serta sistem keranjang belanja hingga checkout.

## 📌 Tujuan Proyek

- Mengimplementasikan konsep **Front-End dan Back-End Integration**
- Menerapkan **CRUD (Create, Read, Update, Delete)** pada data utama
- Menerapkan **sistem autentikasi (login & register)**
- Menghubungkan UI dengan data dinamis (API / LocalStorage)
- Memenuhi kriteria tugas Implementasi Back-End dan Integrasi Front-End

## 🧩 Fitur Utama

### 👤 Autentikasi
- Login User & Admin
- Register User
- Proteksi halaman

### 📦 Manajemen Produk
- Menampilkan daftar produk
- Detail produk
- Produk unggulan (Best Seller)
- **CRUD Produk (Admin):**
  - Tambah produk
  - Edit produk
  - Hapus produk

### 🛒 Keranjang Belanja
- Tambah ke keranjang
- Update quantity
- Hapus item
- Perhitungan total, ongkir, dan grand total

### 💳 Checkout
- Ringkasan pesanan
- Informasi pelanggan
- Simulasi pembayaran
- Halaman Order Success

## 🛠️ Teknologi yang Digunakan

- **HTML5**
- **CSS / Tailwind CSS**
- **JavaScript (ES6 Modules)**
- **JSON Server** (Backend lokal)
- **LocalStorage** (Session & Cart)
- **Git & GitHub**
- **Netlify** (Hosting)

## 🌐 Live Demo
**Hosting:** (https://kopiku-sukabumi.netlify.app/)


## ⚠️ Catatan Penting
Backend menggunakan JSON Server (lokal)
Fokus proyek ini adalah implementasi konsep, bukan untuk produksi
Pastikan JSON Server berjalan di port 3000 sebelum menggunakan aplikasi

## 👥 Anggota Kelompok :
* Angelita Tiara Nofriyanti Sidabalok
* Fitriyani  
* Mohamad Arief Rifansyah
* Mohammad Daffa Lutf Reytsaqif Al-Ghifari
* Muhamad Rifki Maulana
* Rifaldi Akmal Fauzan

## 📅 Status Project
✅ Implementasi Back-End
✅ Integrasi Front-End & Back-End
✅ Siap dipresentasikan


## 🚀 Cara Menjalankan Proyek (Lokal)
### 1. Clone Repository
```bash
git clone https://github.com/RifaldiAkmalFauzan/Kopiku-Sukabumi.git
cd Kopiku-Sukabumi

### 2. Install JSON Server
```bash
npm install -g json-server

### 3. Jalankan Backend
```bash
json-server --watch db.json --port 3000

### 4. Buka Aplikasi
```bash
Buka file Index.html melalui browser atau menggunakan Live Server Extension.


