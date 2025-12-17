import { getBestSellerProducts } from './catalog.js';
import {
  loadComponent,
  setActiveNav,
  setDynamicHeader,
  renderProducts,
  renderCatalog,
} from './core.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DEBUG] 🚀 Inisialisasi main.js dimulai');

   const page = document.body.dataset.page;

  if (page === 'home') {
    renderProducts();
  }

  const path = window.location.pathname.toLowerCase();


  // Jika sedang di halaman ProductDetail, biarkan JS lain yang meng-handle
  if (path.includes('productdetail')) {
    console.log('[DEBUG] ⛔ Lewat — halaman ProductDetail di-handle file lain');
    return;
  }

  try {
    // ============================================================
    // 1️⃣ LOAD HEADER & NAV — WAJIB SEBELUM SET HEADER DINAMIS
    // ============================================================
    await loadComponent('../components/Header.html', 'header-container');
    console.log('[DEBUG] ✅ Header termuat');

    await loadComponent('../components/Nav.html', 'nav-container');
    console.log('[DEBUG] ✅ Navigasi termuat');

    // ============================================================
    // 2️⃣ DETEKSI HALAMAN → SET HEADER + RENDER DATA
    // ============================================================

    // HOME.HTML
    if (document.getElementById('product-list')) {
      console.log('[DEBUG] 🏠 Halaman Home');

      setDynamicHeader();

      const productList = document.getElementById('product-list');
      const products = await getBestSellerProducts();

      if (products.length === 0) {
        productList.innerHTML = `
      <p class="text-gray-500 text-center">
        Belum ada produk unggulan
      </p>
    `;
        return;
      }

      productList.innerHTML = products
        .map(
          (product) => `
      <div class="bg-white rounded-xl shadow-soft p-4">
        <img
          src="${product.img}"
          class="w-full h-40 object-cover rounded-lg mb-3"
          onerror="this.src='/src/user/assets/img/default.png'"
        />

        <h3 class="font-semibold text-dark">
          ${product.name}
        </h3>

        <p class="text-primary font-bold mb-2">
          Rp ${Number(product.price).toLocaleString('id-ID')}
        </p>

        <a
          href="./ProductDetail.html?id=${product.id}"
          class="block text-center bg-primary text-white py-2 rounded-lg hover:bg-hover-primary transition"
        >
          Lihat Detail
        </a>
      </div>
    `
        )
        .join('');
    }
    // PRODUCT CATALOG
    else if (document.getElementById('product-catalog-grid')) {
      console.log('[DEBUG] 🛍️ Halaman Katalog terdeteksi');

      setDynamicHeader({
        title: 'Katalog Produk',
        showBack: true,
        backLink: '../pages/Home.html',
        showCart: true,
      });

      renderCatalog();
    }

    // CHECKOUT
    else if (document.getElementById('cart-items')) {
      console.log('[DEBUG] 💳 Halaman Checkout');

      setDynamicHeader({
        title: 'Detail Pembayaran',
        showBack: true,
      });
    }

    // PROFILE
    else if (document.getElementById('profile-container')) {
      console.log('[DEBUG] 👤 Halaman Profile');

      setDynamicHeader({
        title: 'Profil Saya',
        showBack: true,
      });
    }

    // ORDER SUCCESS
    else if (document.body.dataset.page === 'ordersuccess') {
      console.log('[DEBUG] 🎉 Halaman Order Success');

      setDynamicHeader({
        title: 'Pesanan Berhasil',
        showBack: false,
        showLogo: false,
        showCart: false,
      });
    }

    // DEFAULT PAGE
    else {
      console.log('[DEBUG] 📄 Halaman tidak dikenal → header default');
      setDynamicHeader();
    }

    // ============================================================
    // 3️⃣ FUNGSI LAIN (NAV ACTIVE, ANIMASI LOADER)
    // ============================================================

    setActiveNav();

    document.body.style.opacity = '1';
    document.body.classList.add('page-loaded');
  } catch (err) {
    console.error('[ERROR] ❌ Gagal memuat komponen penting:', err);

    // tetap tampil walaupun component gagal load
    document.body.style.opacity = '1';
  }

  console.log('[DEBUG] ✅ main.js selesai dijalankan');
});
