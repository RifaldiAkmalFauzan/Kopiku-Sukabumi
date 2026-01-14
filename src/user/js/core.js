import { getCatalogProducts, getBestSellerProducts } from './catalog.js';
import { getCart } from './cart.js';

/* =========================================================
   HELPER: Get Product Image dengan validasi
========================================================= */
export function getProductImage(imgPath, productName) {
  console.log('[DEBUG] 🖼️ Processing image for:', productName);
  console.log('[DEBUG] 🖼️ Original path:', imgPath);

  // Jika path kosong atau null
  if (!imgPath || imgPath.trim() === '' || imgPath === 'null') {
    console.log('[WARN] 🖼️ Empty image path, using default');
    return getDefaultImage(productName);
  }

  // Normalize path
  let finalPath = imgPath.trim();

  // Hapus double slashes
  finalPath = finalPath.replace(/\/\//g, '/');

  // Pastikan dimulai dengan slash
  if (!finalPath.startsWith('/')) {
    finalPath = '/' + finalPath;
  }

  console.log('[DEBUG] 🖼️ Final normalized path:', finalPath);
  return finalPath;
}

// Helper function untuk default images
function getDefaultImage(productName) {
  const name = productName.toLowerCase();
  const defaultMap = {
    arabica: '/src/assets/img/arabica.png',
    robusta: '/src/assets/img/robusta.png',
    liberica: '/src/assets/img/liberica-powder.png',
    excelsa: '/src/assets/img/premium-1.png',
    drip: '/src/assets/img/drip-bag.png',
    powder: '/src/assets/img/robusta-powder.png',
    beans: '/src/assets/img/arabika-beans.png',
    kapal: '/src/assets/img/robusta.png',
    blend: '/src/assets/img/arabica-1.png',
    premium: '/src/assets/img/premium.png',
    single: '/src/assets/img/arabica.png',
    origin: '/src/assets/img/arabica.png',
    coffee: '/src/assets/img/coffee-1.png',
    ground: '/src/assets/img/robusta-powder.png',
    black: '/src/assets/img/robusta-1.png',
    home: '/src/assets/img/home-page.jpg',
    spesial: '/src/assets/img/premium-1.png',
  };

  for (const [keyword, path] of Object.entries(defaultMap)) {
    if (name.includes(keyword)) {
      console.log(`[DEBUG] 🖼️ Using ${keyword} image for: ${productName}`);
      return path;
    }
  }

  // Default fallback
  return '/src/assets/img/arabica.png';
}

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
  if (!grid) {
    console.log('[DEBUG] Catalog grid not found');
    return;
  }

  console.log('[DEBUG] 🛍️ Rendering catalog...');

  // Show loading
  grid.innerHTML = `
    <div class="col-span-full text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="text-gray-500 mt-2">Memuat produk...</p>
    </div>
  `;

  try {
    const products = await getCatalogProducts();
    console.log(`[DEBUG] 📊 Catalog products loaded: ${products.length}`);

    if (!products || products.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-8">
          <p class="text-gray-500">Belum ada produk tersedia</p>
          <button onclick="window.location.reload()" 
                  class="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
            Muat Ulang
          </button>
        </div>
      `;
      return;
    }

    // Clear loading
    grid.innerHTML = '';

    products.forEach((product) => {
      const card = document.createElement('div');
      card.className = 'mb-4';

      const defaultImage = getDefaultImage(product.name);
      const productImage = getProductImage(product.img, product.name);

      card.innerHTML = `
        <div class="relative rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-shadow">
          <img 
            src="${productImage}" 
            alt="${product.name}"
            class="w-full h-48 object-cover"
            onerror="this.onerror=null; this.src='${defaultImage}';"
          />
          
          ${
            product.isBestSeller === 1
              ? `
            <div class="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              ⭐ Best Seller
            </div>
          `
              : ''
          }

          <div class="p-4">
            <h3 class="font-semibold text-lg text-dark mb-1">
              ${product.name}
            </h3>
            <p class="text-gray-600 text-sm mb-2 line-clamp-2">
              ${product.description || 'Produk kopi berkualitas tinggi'}
            </p>
            <div class="flex justify-between items-center">
              <p class="text-primary font-bold">
                Rp ${Number(product.price).toLocaleString('id-ID')}
              </p>
              ${
                product.weight
                  ? `
                <span class="text-xs text-gray-500">
                  ${product.weight}
                </span>
              `
                  : ''
              }
            </div>
            
            <button
              class="mt-3 w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-semibold transition"
              onclick="location.href='ProductDetail.html?id=${product.id}'"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    console.log('[DEBUG] ✅ Catalog rendered successfully');
  } catch (err) {
    console.error('[ERROR] ❌ Gagal render catalog:', err);
    grid.innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-red-500">Gagal memuat produk</p>
        <button onclick="renderCatalog()" 
                class="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
          Coba Lagi
        </button>
      </div>
    `;
  }
}

/* =========================================================
   Render PRODUK HOME (Best Seller)
========================================================= */
export const renderProducts = async () => {
  const container = document.getElementById('product-list');
  if (!container) {
    console.log('[DEBUG] product-list container not found');
    return;
  }

  console.log('[DEBUG] ⭐ Rendering featured products...');

  // Show loading
  container.innerHTML = `
    <div class="text-center py-4">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <p class="text-gray-500 text-sm mt-1">Memuat produk unggulan...</p>
    </div>
  `;

  try {
    const bestSellers = await getBestSellerProducts();
    console.log(`[DEBUG] ⭐ Best sellers found: ${bestSellers.length}`);

    if (!bestSellers || bestSellers.length === 0) {
      container.innerHTML = `
        <p class="text-gray-500 text-center py-4">
          Belum ada produk unggulan tersedia ☕
        </p>
      `;
      return;
    }

    container.innerHTML = bestSellers
      .map((product) => {
        const defaultImage = getDefaultImage(product.name);
        const productImage = getProductImage(product.img, product.name);

        return `
        <div class="flex items-center gap-4 bg-[#FFF6EE] rounded-xl p-4 shadow-soft mb-4">
          
          <!-- TEXT -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-bold text-dark text-lg leading-tight">
                ${product.name}
              </h3>
              ${
                product.isBestSeller === 1
                  ? `
                <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  ⭐ Best Seller
                </span>
              `
                  : ''
              }
            </div>
            
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">
              ${product.description || 'Produk kopi berkualitas tinggi'}
            </p>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-primary font-bold">
                  Rp ${Number(product.price).toLocaleString('id-ID')}
                </p>
                ${
                  product.weight
                    ? `
                  <small class="text-gray-500 text-xs">${product.weight}</small>
                `
                    : ''
                }
              </div>
              
              <a
                href="./ProductDetail.html?id=${product.id}"
                class="bg-primary hover:bg-primary-dark text-white text-sm font-semibold 
                       px-4 py-2 rounded-lg transition"
              >
                Beli Sekarang
              </a>
            </div>
          </div>

          <!-- IMAGE -->
          <img
            src="${productImage}"
            alt="${product.name}"
            class="w-24 h-24 object-cover rounded-lg"
            onerror="this.onerror=null; this.src='${defaultImage}';"
          />
        </div>
      `;
      })
      .join('');

    console.log('[DEBUG] ✅ Featured products rendered');
  } catch (err) {
    console.error('[ERROR] ❌ Gagal render produk unggulan:', err);
    container.innerHTML = `
      <div class="text-center py-4">
        <p class="text-red-500">Gagal memuat produk unggulan</p>
        <button onclick="renderProducts()" 
                class="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm">
          Coba Lagi
        </button>
      </div>
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
  badge.style.display = total > 0 ? 'flex' : 'none';
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

  if (!titleEl || !leftEl || !rightEl) {
    console.warn('[WARN] Header elements not found');
    return;
  }

  titleEl.textContent = title;

  leftEl.innerHTML = showBack
    ? `<a href="${backLink}" class="text-dark hover:text-primary transition p-2 block">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
         </svg>
       </a>`
    : `<a href="../pages/Home.html" class="p-2 block">
         <img src="../assets/icons/Logo.svg" class="w-8 h-8" alt="Logo">
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
    const element = document.getElementById(id);
    if (element) {
      if (current.includes(key)) {
        element.classList.add('text-primary', 'font-semibold');
        element.classList.remove('text-gray-500');
      } else {
        element.classList.remove('text-primary', 'font-semibold');
        element.classList.add('text-gray-500');
      }
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

/* =========================================================
   Test Gambar di Console
========================================================= */
export function testAllImages() {
  console.log('[TEST] 🧪 Testing image loading...');

  const testImages = [
    '/src/assets/img/arabica.png',
    '/src/assets/img/robusta.png',
    '/src/assets/img/premium.png',
    '/src/assets/img/premium-1.png',
    '/src/assets/img/home-page.jpg',
    '/src/assets/img/robusta-powder.jpg',
    '/src/assets/img/drip-bag.jpg',
    '/src/assets/img/liberica-powder.jpg',
    '/src/assets/img/robusta-1.png',
  ];

  testImages.forEach((url) => {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ ${url} - Loaded (${img.width}x${img.height})`);
    };
    img.onerror = () => {
      console.log(`❌ ${url} - Failed to load`);
    };
    img.src = url;
  });
}

/* =========================================================
   Debug Helper
========================================================= */
export function debugAPI() {
  console.log('[DEBUG] 🐛 Testing API...');
  fetch('/products')
    .then((res) => res.json())
    .then((data) => {
      console.log('[DEBUG] 📦 API Response:', data);
      console.log('[DEBUG] 📊 Data type:', Array.isArray(data) ? 'Array' : typeof data);

      if (Array.isArray(data)) {
        console.log(`[DEBUG] 📊 Product count: ${data.length}`);
        if (data.length > 0) {
          console.log('[DEBUG] 📝 Sample product:', data[0]);
          console.log('[DEBUG] 🖼️ Image path:', data[0].img);
        }
      } else if (data && typeof data === 'object') {
        console.log('[DEBUG] 🔍 Object keys:', Object.keys(data));
      }
    })
    .catch((err) => console.error('[DEBUG] ❌ API Error:', err));
}

/* =========================================================
   Inisialisasi Debug di Development
========================================================= */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('[INIT] 🚀 Development mode activated');
      console.log('[INIT] 📍 Current URL:', window.location.href);

      // Test images after 2 seconds
      setTimeout(testAllImages, 2000);

      // Test API after 3 seconds
      setTimeout(debugAPI, 3000);
    }, 1000);
  });
}

/* =========================================================
   Export untuk testing
========================================================= */
// Untuk testing di browser console
window.CoreUtils = {
  getProductImage,
  getDefaultImage,
  testAllImages,
  debugAPI,
  renderProducts,
  renderCatalog,
};
