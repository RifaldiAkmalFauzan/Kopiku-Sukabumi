import { getCatalogProducts } from './catalog.js';
import { getCart } from './cart.js';
import { productsData } from './bestSeller.js';

/* =========================================================
   Loader Komponen (Header, Nav, dll)
========================================================= */
export const loadComponent = async (url, targetId) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    document.getElementById(targetId).innerHTML = html;
    return true;
  } catch (err) {
    console.error(`❌ Gagal load ${targetId}:`, err);
    return false;
  }
};

/* =========================================================
   Render KATALOG PRODUK (Catalog Page)
========================================================= */
export async function renderCatalog() {
  const grid = document.getElementById('product-catalog-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const products = await getCatalogProducts();
  if (!products.length) {
    grid.innerHTML = `<p class="text-center text-gray-500">Produk belum tersedia</p>`;
    return;
  }

  products.forEach((product) => {
    const card = document.createElement('div');

    card.innerHTML = `
      <div class="relative rounded-xl overflow-hidden shadow-soft">
        <img 
          src="${product.img}" 
          alt="${product.name}"
          class="w-full h-48 object-cover"
        />

        <div class="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
          <h3 class="text-white font-semibold text-lg">
            ${product.name}
          </h3>
          <p class="text-white mb-3">
            Rp ${Number(product.price).toLocaleString('id-ID')}
          </p>

          <button
            class="bg-primary text-white py-2 rounded-lg font-semibold"
            onclick="location.href='ProductDetail.html?id=${product.id}'"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================================================
   Render PRODUK HOME (Best Seller)
========================================================= */
export const renderProducts = async () => {
  const container = document.getElementById('product-list');
  if (!container) return;

  try {
    const products = await getCatalogProducts();
    const bestSellers = products.filter(p => p.isBestSeller === true);

    if (bestSellers.length === 0) {
      container.innerHTML = `
        <p class="text-gray-500 text-center">
          Belum ada produk unggulan ☕
        </p>
      `;
      return;
    }

    container.innerHTML = bestSellers
      .map(
        (product) => `
        <div class="flex items-center gap-4 bg-[#FFF6EE] rounded-xl p-4 shadow-soft">
          
          <!-- TEXT -->
          <div class="flex-1">
            <h3 class="font-bold text-dark text-lg leading-tight">
              ${product.name}
            </h3>
            <p class="text-sm text-gray-600 mt-1 mb-3 line-clamp-2">
              ${product.description}
            </p>

            <a
              href="./ProductDetail.html?id=${product.id}"
              class="inline-block bg-primary text-white text-sm font-semibold 
                     px-4 py-2 rounded-lg hover:bg-hover-primary transition"
            >
              Beli Sekarang
            </a>
          </div>

          <!-- IMAGE -->
          <img
            src="${product.img}"
            alt="${product.name}"
            class="w-24 h-24 object-cover rounded-lg"
            onerror="this.src='/src/assets/img/default.png'"
          />
        </div>
      `
      )
      .join('');
  } catch (err) {
    console.error('❌ Gagal render produk unggulan:', err);
    container.innerHTML = `
      <p class="text-red-500 text-center">
        Gagal memuat produk unggulan
      </p>
    `;
  }
};

/* =========================================================
   Cart Badge
========================================================= */
export const updateCartBadge = () => {
  const badge = document.getElementById('cart-count');
  if (!badge) return;

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  badge.textContent = total;

  if (total > 0) {
    badge.classList.remove('hidden');
    badge.classList.add('flex');
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
  }
};

/* =========================================================
   Header Dinamis
========================================================= */
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

  titleEl.textContent = title;

  leftEl.innerHTML = showBack
    ? `<a href="${backLink}" class="text-dark hover:text-primary">⬅</a>`
    : `<a href="../pages/Home.html">
         <img src="../../assets/icons/Logo.svg" class="w-8">
       </a>`;

  if (showCart) {
    rightEl.innerHTML = `
      <a href="../pages/Checkout.html" class="relative">
        <img src="../../assets/icons/Button-Cart.svg" class="w-6" />
        <span id="cart-count"
          class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full 
                 w-4 h-4 hidden items-center justify-center">0</span>
      </a>
    `;
    updateCartBadge();
  } else {
    rightEl.innerHTML = '';
  }
}

/* =========================================================
   Navbar Aktif
========================================================= */
export const setActiveNav = () => {
  const current = window.location.pathname.toLowerCase();
  const map = {
    home: 'nav-home',
    productcatalog: 'nav-catalog',
    checkout: 'nav-cart',
    profile: 'nav-profile',
  };

  Object.entries(map).forEach(([key, id]) => {
    if (current.includes(key)) {
      document.getElementById(id)?.classList.add('text-primary');
    }
  });
};

/* =========================================================
   Simpan halaman sebelum checkout
========================================================= */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href*="Checkout.html"]');
  if (link) {
    localStorage.setItem('lastPage', window.location.pathname);
  }
});
