import { productsData } from './bestSeller.js';
import { catalogProductsData } from './catalog.js';
import { getCart } from './cart.js';

//  Fungsi Loader Komponen Statis (Header, Nav, dsb.)
export const loadComponent = async (url, targetId) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status HTTP: ${res.status}`);
    const data = await res.text();
    document.getElementById(targetId).innerHTML = data;
    return true;
  } catch (err) {
    console.error(`Gagal memuat komponen ${targetId}:`, err);
    return false;
  }
};

//  Render Katalog Produk (ProductCatalog.html)
export const renderCatalog = () => {
  const productContainer = document.getElementById('product-catalog-grid');
  if (!productContainer) return;

  fetch('../components/ProductCatalogCard.html')
    .then((res) => res.text())
    .then((templateHtml) => {
      let htmlAll = '';
      catalogProductsData.forEach((p) => {
        const imgSrc = `/src/${p.img}`;
        htmlAll += templateHtml
          .replace(/\[\[PRODUCT_ID\]\]/g, p.id)
          .replace(/\[\[PRODUCT_NAME\]\]/g, p.name)
          .replace('[[PRODUCT_PRICE]]', p.price)
          .replace('[[PRODUCT_IMG_SRC]]', imgSrc);
      });

      productContainer.innerHTML = htmlAll;

      // Event tombol lihat detail
      document.querySelectorAll('.btn-detail').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          localStorage.setItem('selectedProductId', id);
          window.location.href = './ProductDetail.html';
        });
      });
    })
    .catch((err) => console.error('Gagal merender katalog:', err));
};

// Render Produk untuk Home
export const renderProducts = () => {
  const productContainer = document.getElementById('product-list');
  if (!productContainer) return;

  fetch('../components/ProductCard.html')
    .then((res) => res.text())
    .then((templateHtml) => {
      let htmlAll = '';
      productsData.forEach((p) => {
        const imgSrc = `/src/${p.img}`;
        htmlAll += templateHtml
          .replace('[[PRODUCT_NAME]]', p.name)
          .replace('[[PRODUCT_DESC]]', p.desc)
          .replace('[[PRODUCT_BUTTON]]', p.btn_text)
          .replace('[[PRODUCT_IMG_SRC]]', imgSrc);
      });

      productContainer.innerHTML = htmlAll;
    })
    .catch((err) => console.error('Gagal merender produk home:', err));
};

// Fungsi Update Badge Jumlah Keranjang
export const updateCartBadge = () => {
  const badge = document.getElementById('cart-count');
  if (!badge) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  badge.textContent = totalItems;

  if (totalItems > 0) {
    badge.classList.remove('hidden');
    badge.classList.add('flex');
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
  }
};

// Fungsi Inisialisasi Navbar (panggil di main.js)
export const initNavbar = () => {
  const links = document.querySelectorAll('nav a');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      links.forEach((l) => l.classList.remove('text-primary'));
      link.classList.add('text-primary');
    });
  });
};

// Fungsi Header Dinamis (versi final & fleksibel)
export function setDynamicHeader({
  title = 'Kopiku Sukabumi',
  showBack = false,
  backLink = '../pages/Home.html',
  showCart = true,
} = {}) {
  const titleEl = document.getElementById('page-title');
  const leftEl = document.getElementById('header-left');
  const rightEl = document.getElementById('header-right');

  if (!titleEl || !leftEl || !rightEl) return;

  // 🧭 Judul tengah
  titleEl.textContent = title;

  // 🔙 Sisi kiri: tombol back atau logo
  if (showBack) {
    leftEl.innerHTML = `
      <a href="${backLink}" class="flex items-center text-dark hover:text-primary transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </a>
    `;
  } else {
    leftEl.innerHTML = `
      <a href="../pages/Home.html" class="flex items-center gap-2">
        <img src="../assets/icons/Logo.svg" alt="Logo" class="w-8 h-8" />
      </a>
    `;
  }

  // 🛒 Sisi kanan: ikon keranjang (optional)
  if (showCart) {
    rightEl.innerHTML = `
      <a href="../pages/Checkout.html" class="hover:text-primary transition relative">
        <img src="../assets/icons/Button-Cart.svg" alt="Cart" class="w-6 h-6" />
        <span id="cart-count"
          class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full 
                 w-4 h-4 items-center justify-center hidden">0</span>
      </a>
    `;
    updateCartBadge(); // ✅ langsung update badge begitu header tampil
  } else {
    rightEl.innerHTML = '';
  }
}

// === Navbar Aktif ===
export const setActiveNav = () => {
  const currentPage = window.location.pathname.toLowerCase();
  const navMap = {
    home: 'nav-home',
    productcatalog: 'nav-catalog',
    checkout: 'nav-cart',
    profile: 'nav-profile',
  };

  document.querySelectorAll('nav a').forEach((link) => {
    link.classList.remove('text-primary');
    link.classList.add('text-secondardark');
  });

  Object.entries(navMap).forEach(([key, id]) => {
    if (currentPage.includes(key)) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('text-dark');
        el.classList.add('text-primary');
      }
    }
  });
};

// Simpan halaman terakhir sebelum ke Checkout
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href*="Checkout.html"]');
  if (link) {
    localStorage.setItem('lastPage', window.location.pathname);
  }
});
