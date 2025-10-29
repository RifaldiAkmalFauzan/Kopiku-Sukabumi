// 📁 src/js/detail.js
import { loadComponent, setDynamicHeader } from './core.js';
import { catalogProductsData } from './catalog.js';
import { addToCart } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DEBUG] Halaman Product Detail dimuat ✅');

  try {
    // 🔹 Muat komponen header & navbar
    await loadComponent('../components/Header.html', 'header-container');
    await loadComponent('../components/Nav.html', 'nav-container');

    // 🔹 Atur header: tombol back ke katalog + ikon keranjang
    setDynamicHeader({
      title: 'Detail Produk',
      showBack: true,
      backLink: '../pages/ProductCatalog.html',
      showCart: true,
    });
  } catch (err) {
    console.error('[ERROR] Gagal memuat Header/Nav:', err);
  }

  // ================================
  // 🔹 Ambil produk dari localStorage
  // ================================
  const productId = localStorage.getItem('selectedProductId');
  const product = catalogProductsData.find((p) => p.id == productId);

  if (!product) {
    document.getElementById('product-detail-container').innerHTML = `
      <p class="text-center text-red-600 py-10">❌ Produk tidak ditemukan.</p>
    `;
    return;
  }

  // ================================
  // 🔹 Render detail produk
  // ================================
  const detailHtml = `
    <div class="bg-white rounded-2xl shadow-soft p-6 max-w-full mx-auto md:flex gap-10 justify-center items-center">
      <div class="md:w-1/2 flex justify-center">
        <img src="/src/${product.img}" alt="${product.name}" class="rounded-lg max-h-80 object-cover" />
      </div>
      <div class="md:w-1/2 mt-4 md:mt-0">
        <h2 class="text-2xl font-bold text-dark mb-2">${product.name}</h2>
        <p class="text-gray-700 mb-4">${product.desc}</p>
        <p class="text-primary font-semibold text-xl mb-6">Rp ${product.price}</p>
        <p class="text-gray-700 mb-4">${product.weight}</p>

        
        <div class="flex items-center gap-3 mb-6">
          <label for="quantity" class="text-dark font-medium">Jumlah:</label>
          <input 
            id="quantity" 
            type="number" 
            min="1" 
            value="1"
            class="border border-gray-300 rounded-md px-3 py-1 w-20 text-center focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button 
          id="add-to-cart"
          class="w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-hover-primary transition"
        >
          Tambahkan ke Keranjang
        </button>
      </div>
    </div>
  `;

  document.getElementById('product-detail-container').innerHTML = detailHtml;

  // ================================
  // 🔹 Event: Tambah ke Keranjang
  // ================================
  const addBtn = document.getElementById('add-to-cart');
  addBtn.addEventListener('click', () => {
    const qty = Math.max(1, parseInt(document.getElementById('quantity').value) || 1);

    // 🧠 Pastikan harga jadi angka
    const cleanProduct = {
      id: product.id,
      name: product.name,
      img: product.img,
      desc: product.desc,
      price: parseInt(product.price.toString().replace(/\D/g, '')), // amanin harga "45.000"
    };

    addToCart(cleanProduct, qty);
    alert(`🛒 ${product.name} (${qty}x) berhasil ditambahkan ke keranjang!`);
  });

  console.log('[DEBUG] ✅ Product Detail selesai dirender');
});
