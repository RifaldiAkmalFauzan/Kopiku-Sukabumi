// 📁 src/js/main.js (REVISI)
import {
  loadComponent,
  setActiveNav,
  setDynamicHeader,
  renderProducts,
  renderCatalog,
} from './core.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DEBUG] 🚀 Inisialisasi main.js dimulai');
  const path = window.location.pathname.toLowerCase(); // 🚫 Jangan jalankan apa-apa kalau sedang di ProductDetail // (Asumsi ProductDetail punya logikanya sendiri)

  if (path.includes('productdetail')) return;

  try {
    // ===============================
    // 🧩 1️⃣ Muat komponen Header & Navigasi
    // ===============================
    // ❗️ PENTING: Panggil loadComponent dulu
    await loadComponent('../components/Header.html', 'header-container');
    console.log('[DEBUG] ✅ Header termuat');

    await loadComponent('../components/Nav.html', 'nav-container');
    console.log('[DEBUG] ✅ Navigasi termuat'); // =============================== // 🧭 2️⃣ Deteksi halaman, SET HEADER, & render konten // =============================== // ❗️ Logika header dipindah ke sini, SETELAH header-container 100% siap.

    if (document.getElementById('product-list')) {
      console.log('[DEBUG] 🏠 Halaman Home terdeteksi'); // Panggil header default (sesuai core.js)
      setDynamicHeader();
      renderProducts();
    } else if (document.getElementById('product-catalog-grid')) {
      console.log('[DEBUG] 🛍️ Halaman Katalog Produk terdeteksi'); // Panggil header SPESIFIK untuk Katalog
      setDynamicHeader({
        title: 'Katalog Produk',
        showBack: true,
        backLink: '../pages/Home.html', // atau '#' jika tidak mau kembali
        showCart: true,
      });
      renderCatalog();
    } // // ❗️ Tambahkan juga untuk halaman lain //
    else if (document.getElementById('cart-items')) {
      console.log('[DEBUG] 💳 Halaman Checkout terdeteksi');
      setDynamicHeader({
        title: 'Detail Pembayaran',
        showBack: true, // backLink default ke Home.html, jadi tidak perlu di-set
      }); // ... (panggil fungsi renderCart() jika ada)
    } else if (document.getElementById('profile-container')) {
      console.log('[DEBUG] 👤 Halaman Profile terdeteksi');
      setDynamicHeader({
        title: 'Profil Saya',
        showBack: true,
      });
    } else if (document.body.dataset.page === 'ordersuccess') {
      console.log('[DEBUG] 🎉 Halaman Order Success terdeteksi');
      setDynamicHeader({
        title: 'Pesanan Berhasil',
        showBack: false, // Tidak bisa kembali
        showLogo: false, // Hilangkan logo
        showCart: false, // Keranjang tidak relevan
      });
    } else {
      // Halaman lain yang tidak dikenal, pakai default
      setDynamicHeader();
    } // =============================== // ✨ 3️⃣ Aktifkan sisanya // ===============================

    setActiveNav(); 
    document.body.style.opacity = '1'; // Tampilkan body
    document.body.classList.add('page-loaded'); // Mulai animasi
  } catch (err) {
    console.error('[ERROR] ❌ Gagal memuat komponen penting:', err);
    document.body.style.opacity = '1'; // Tampilkan halaman walau error
  }

  console.log('[DEBUG] ✅ main.js selesai dijalankan');
});
