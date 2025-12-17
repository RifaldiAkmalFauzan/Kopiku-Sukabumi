// 📁 src/js/detail.js
import { loadComponent, setDynamicHeader } from './core.js';
import { addToCart } from './cart.js';

const API_URL = 'http://localhost:3000/products';

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('../components/Header.html', 'header-container');
  await loadComponent('../components/Nav.html', 'nav-container');

  setDynamicHeader({
    title: 'Detail Produk',
    showBack: true,
    backLink: '../pages/ProductCatalog.html',
    showCart: true,
  });

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    renderError('ID produk tidak ditemukan');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Produk tidak ditemukan');

    const product = await res.json();
    renderProductDetail(product);
  } catch (err) {
    console.error(err);
    renderError('Produk tidak ditemukan');
  }
});

function renderError(msg) {
  document.getElementById('product-detail-container').innerHTML = `
    <p class="text-center text-red-600 py-10">${msg}</p>
  `;
}

function renderProductDetail(product) {
  const container = document.getElementById('product-detail-container');

  container.innerHTML = `
    <div class="bg-white rounded-2xl shadow-soft p-6 md:flex gap-10 items-center">
      
      <div class="md:w-1/2 flex justify-center">
        <img 
          src="${product.img}" 
          alt="${product.name}"
          class="rounded-xl max-h-80 object-cover"
        />
      </div>

      <div class="md:w-1/2 mt-6 md:mt-0">
        <h2 class="text-2xl font-bold text-dark mb-2">
          ${product.name}
        </h2>

        <p class="text-gray-700 mb-4">
          ${product.description}
        </p>

        <p class="text-primary font-semibold text-xl mb-2">
          Rp ${Number(product.price).toLocaleString('id-ID')}
        </p>

        <p class="text-gray-600 mb-4">
          Berat : ${product.weight}
        </p>

        <!-- QUANTITY (INI YANG SEMPAT HILANG) -->
        <div class="flex items-center gap-3 mb-6">
          <label class="font-medium">Jumlah:</label>
          <input 
            id="quantity"
            type="number"
            min="1"
            value="1"
            class="w-20 text-center border rounded-md py-1"
          />
        </div>

        <button
          id="add-to-cart"
          class="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-hover-primary transition"
        >
          Tambahkan ke Keranjang
        </button>
      </div>
    </div>
  `;

  document.getElementById('add-to-cart').addEventListener('click', () => {
    const qty = Math.max(1, parseInt(document.getElementById('quantity').value));

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
      },
      qty
    );

    alert('Produk ditambahkan ke keranjang');
  });
}
