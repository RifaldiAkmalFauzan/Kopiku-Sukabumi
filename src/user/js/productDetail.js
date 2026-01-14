// 📁 src/js/productDetail.js
import { loadComponent, setDynamicHeader } from './core.js';
import { addToCart } from './cart.js';

const API_URL = '/products';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DETAIL] 🚀 Initializing product detail page');

  try {
    // Load components
    await loadComponent('../../components/Header.html', 'header-container');
    await loadComponent('../../components/Nav.html', 'nav-container');
    console.log('[DETAIL] ✅ Components loaded');

    setDynamicHeader({
      title: 'Detail Produk',
      showBack: true,
      backLink: '../pages/ProductCatalog.html',
      showCart: true,
    });

    // Get product ID
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    console.log('[DETAIL] 🔍 Product ID:', id);

    if (!id) {
      showError('ID produk tidak ditemukan');
      return;
    }

    // Hide loading after components loaded
    hideLoading();

    // Load product data
    await loadProduct(id);
  } catch (err) {
    console.error('[DETAIL] ❌ Initialization error:', err);
    showError('Gagal memuat halaman');
  }
});

// Helper functions
function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'none';
  }
}

function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'block';
  }
}

function showError(msg) {
  hideLoading();
  const container = document.getElementById('product-detail-container');
  if (container) {
    container.innerHTML = `
      <div class="text-center py-12">
        <div class="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 class="text-red-600 font-semibold mb-2">Terjadi Kesalahan</h3>
        <p class="text-gray-600 mb-6">${msg}</p>
        <button onclick="window.history.back()" 
                class="px-6 py-2 bg-primary text-white rounded-lg">
          Kembali
        </button>
      </div>
    `;
  }
}

async function loadProduct(id) {
  try {
    console.log(`[DETAIL] 📡 Fetching product ${id}...`);
    const res = await fetch(`${API_URL}/${id}`);

    console.log('[DETAIL] 📡 API Response status:', res.status);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Produk tidak ditemukan');
      }
      throw new Error(`HTTP ${res.status}: Gagal mengambil produk`);
    }

    const data = await res.json();
    console.log('[DETAIL] 📦 Raw API data:', data);

    // Handle API response format
    let product;
    if (data && typeof data === 'object') {
      if (data.data && typeof data.data === 'object') {
        // Format: {success: true, data: {...}}
        product = data.data;
      } else if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Format: {success: true, data: [{...}]}
        product = data.data[0];
      } else if (!Array.isArray(data)) {
        // Format langsung object
        product = data;
      } else if (data.length > 0) {
        // Format array
        product = data[0];
      }
    }

    if (!product) {
      throw new Error('Format data produk tidak valid');
    }

    console.log('[DETAIL] ✅ Product loaded:', product);
    console.log('[DETAIL] ✅ Product name:', product.name);
    console.log('[DETAIL] ✅ Product price:', product.price);
    console.log('[DETAIL] ✅ Product image:', product.img);

    renderProductDetail(product);
  } catch (err) {
    console.error('[DETAIL] ❌ Load product error:', err);
    showError(err.message || 'Gagal memuat produk');
  }
}

function renderProductDetail(product) {
  const container = document.getElementById('product-detail-container');

  if (!container) {
    console.error('[DETAIL] ❌ Container #product-detail-container not found!');
    return;
  }

  console.log('[DETAIL] 🎯 Rendering product to container...');

  // Fix image path
  let imageSrc = product.img || '/src/assets/img/arabica.png';
  if (imageSrc && !imageSrc.startsWith('http')) {
    if (imageSrc.includes('assets/img') && !imageSrc.includes('src/assets/img')) {
      imageSrc = imageSrc.replace('assets/img', 'src/assets/img');
    }
    if (!imageSrc.startsWith('/')) {
      imageSrc = '/' + imageSrc;
    }
  }

  // Create HTML
  const html = `
    <div class="bg-white rounded-2xl shadow-soft p-6 md:flex gap-5 items-start justify-between">
      
      <!-- Product Image -->
      <div class="md:w-1/2 flex justify-center md:mb-0">
        <img 
          src="${imageSrc}" 
          alt="${product.name}"
          class="rounded-xl w-full max-w-md h-auto max-h-96 object-contain"
          onerror="this.onerror=null; this.src='/src/assets/img/arabica.png';"
        />
      </div>

      <!-- Product Info -->
      <div class="md:w-1/2">
        <h2 class="text-2xl font-bold text-dark mb-3">
          ${product.name}
        </h2>

        <p class="text-gray-700 mb-5 leading-relaxed">
          ${product.description || 'Deskripsi tidak tersedia'}
        </p>

        <div class="my-4">
          <p class="text-primary font-semibold text-2xl mb-2">
            Rp ${Number(product.price).toLocaleString('id-ID')}
          </p>
          
          ${
            product.weight
              ? `
            <p class="text-gray-600 mb-1">
              <span class="font-medium">Berat:</span> ${product.weight}
            </p>
          `
              : ''
          }
          
          ${
            product.stock !== undefined
              ? `
            <p class="text-gray-600">
              <span class="font-medium">Stok:</span> ${product.stock} unit
            </p>
          `
              : ''
          }
        </div>

        <!-- Quantity Selector -->
        <div class="flex items-center gap-3 mb-8">
          <label class="font-medium text-gray-700">Jumlah:</label>
          <div class="flex items-center border rounded-lg overflow-hidden">
            <button id="quantity-minus" 
                    class="w-10 h-10 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
            <input 
              id="quantity"
              type="number"
              min="1"
              max="99"
              value="1"
              class="w-16 text-center border-x py-2 focus:outline-none focus:border-primary"
            />
            <button id="quantity-plus" 
                    class="w-10 h-10 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Total Price -->
        <div class="mb-8">
          <div class="flex justify-between items-center py-3 border-t border-b border-gray-200">
            <span class="text-gray-700 font-medium">Total Harga:</span>
            <span id="total-price" class="text-2xl font-bold text-primary">
              Rp ${Number(product.price).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <button
          id="add-to-cart-btn"
          class="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-hover-primary transition duration-300 shadow-md"
        >
          <div class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Tambahkan ke Keranjang
          </div>
        </button>
      </div>
    </div>
  `;

  // Insert HTML
  container.innerHTML = html;
  console.log('[DETAIL] ✅ HTML inserted into container');

  // Setup event listeners
  setupEventListeners(product);
}

function setupEventListeners(product) {
  console.log('[DETAIL] ⚙️ Setting up event listeners...');

  // Quantity controls
  const quantityInput = document.getElementById('quantity');
  const minusBtn = document.getElementById('quantity-minus');
  const plusBtn = document.getElementById('quantity-plus');
  const totalPrice = document.getElementById('total-price');
  const addToCartBtn = document.getElementById('add-to-cart-btn');

  if (!quantityInput || !minusBtn || !plusBtn || !totalPrice || !addToCartBtn) {
    console.error('[DETAIL] ❌ Some elements not found!');
    return;
  }

  let quantity = parseInt(quantityInput.value) || 1;

  function updateTotal() {
    const total = product.price * quantity;
    totalPrice.textContent = `Rp ${Number(total).toLocaleString('id-ID')}`;
  }

  // Minus button
  minusBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityInput.value = quantity;
      updateTotal();
    }
  });

  // Plus button
  plusBtn.addEventListener('click', () => {
    if (quantity < 99) {
      quantity++;
      quantityInput.value = quantity;
      updateTotal();
    }
  });

  // Input change
  quantityInput.addEventListener('change', (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      quantity = value;
      updateTotal();
    } else {
      e.target.value = quantity;
    }
  });

  // Add to cart
  addToCartBtn.addEventListener('click', () => {
    const qty = Math.max(1, parseInt(quantityInput.value) || 1);

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        weight: product.weight,
      },
      qty
    );

    alert(`✅ ${qty} ${product.name} telah ditambahkan ke keranjang!`);

    // Update cart badge
    updateCartBadge();
  });

  console.log('[DETAIL] ✅ Event listeners setup complete');
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');

  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Test function
window.testProductDetail = function (id) {
  console.log('Testing product detail for ID:', id);
  loadProduct(id);
};
