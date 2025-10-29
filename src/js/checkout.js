// 📁 src/js/checkout.js
import { loadComponent, setDynamicHeader } from './core.js';
import { getCart, updateQuantity, removeFromCart, calculateFinalTotal } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('../components/Header.html', 'header-container');
  await loadComponent('../components/Nav.html', 'nav-container');
  const lastPage = localStorage.getItem('lastPage') || '../pages/Home.html';

  // 🔹 Atur Header tanpa logo, pakai tombol back dinamis
  setDynamicHeader({
    title: 'Pembayaran',
    showBack: true,
    backLink: lastPage,
    showCart: false,
  });

  renderCartItems();
  
});

// ===============================
// 🔹 Fungsi utama render keranjang
// ===============================
function renderCartItems() {
  const cart = getCart();
  const cartContainer = document.getElementById('cart-items');
  const summaryContainer = document.getElementById('order-summary');
  const totalContainer = document.getElementById('total-amount');

  if (!cartContainer || !summaryContainer || !totalContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML =
      '<p class="text-gray-500 text-center py-6">Keranjang belanja kamu kosong ☕</p>';
    summaryContainer.innerHTML = '';
    totalContainer.textContent = 'Rp 0';
    return;
  }

  // 🔸 Render daftar produk di keranjang
  cartContainer.innerHTML = cart
    .map(
      (item) => `
      <div class="flex gap-4 items-center bg-light rounded-lg p-3 mb-3 shadow">
        <img src="/src/${item.img}" alt="${item.name}" class="w-16 h-16 rounded-md object-cover" />
        <div class="flex-1">
          <p class="font-semibold">${item.name}</p>
          <p class="text-sm text-gray-500">Rp ${item.price.toLocaleString()}</p>
          <div class="flex items-center gap-3 mt-2">
            <button class="qty-btn minus-btn text-primary font-bold" data-id="${item.id}">−</button>
            <input class="qty-input w-12 text-center border rounded px-1" data-id="${
              item.id
            }" value="${item.quantity}" />
            <button class="qty-btn plus-btn text-primary font-bold" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="remove-btn text-red-500 text-sm font-semibold" data-id="${
          item.id
        }">Hapus</button>
      </div>`
    )
    .join('');

  // 🔸 Hitung total & ringkasan
  const { totalBelanja, ongkir, grandTotal } = calculateFinalTotal();

  summaryContainer.innerHTML = `
    ${cart
      .map(
        (item) => `
      <div class="flex justify-between mb-1">
        <span>${item.name} (${item.quantity}x)</span>
        <span>Rp ${(Number(item.price) * Number(item.quantity)).toLocaleString()}</span>
      </div>`
      )
      .join('')}
    <hr class="my-2 border-gray-300" />
    <div class="flex justify-between text-sm">
      <span>Total Belanja</span>
      <span>Rp ${totalBelanja.toLocaleString()}</span>
    </div>
    <div class="flex justify-between text-sm">
      <span>Ongkir</span>
      <span>Rp ${ongkir.toLocaleString()}</span>
    </div>
    <div class="flex justify-between font-semibold text-lg mt-2">
      <span>Grand Total</span>
      <span>Rp ${grandTotal.toLocaleString()}</span>
    </div>
  `;

  totalContainer.textContent = `Rp ${grandTotal.toLocaleString()}`;

  // ===============================
  // 🔹 Event Handlers
  // ===============================
  document.querySelectorAll('.plus-btn').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.dataset.id);
      const item = getCart().find((p) => p.id === id);
      if (!item) return;
      updateQuantity(id, item.quantity + 1);
      renderCartItems();
    })
  );

  document.querySelectorAll('.minus-btn').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.dataset.id);
      const item = getCart().find((p) => p.id === id);
      if (!item) return;
      updateQuantity(id, item.quantity - 1);
      renderCartItems();
    })
  );

  document.querySelectorAll('.qty-input').forEach((input) =>
    input.addEventListener('change', (e) => {
      const id = Number(e.currentTarget.dataset.id);
      updateQuantity(id, Number(e.currentTarget.value) || 0);
      renderCartItems();
    })
  );

  document.querySelectorAll('.remove-btn').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      removeFromCart(Number(e.currentTarget.dataset.id));
      renderCartItems();
    })
  );

  // ✅ Tombol Buat Pesanan (fix + validasi qty)
  const checkoutButton = document.getElementById('btn-checkout');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      const cart = getCart();

      // ❌ Validasi keranjang kosong atau qty 0
      if (cart.length === 0 || cart.some((item) => item.quantity <= 0)) {
        alert('Jumlah produk tidak boleh 0 atau keranjang kosong!');
        return;
      }

      const { totalBelanja, ongkir, grandTotal } = calculateFinalTotal();

      const orderData = {
        id: `INV-${Date.now()}`,
        tanggal: new Date().toLocaleDateString('id-ID'),
        waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        metodePembayaran: 'Bank Transfer (BCA)',
        statusPembayaran: 'Berhasil',
        email: 'Patrick@kopiku.com',
        total: grandTotal,
      };

      localStorage.setItem('orderData', JSON.stringify(orderData));
      console.log('[DEBUG] ✅ orderData disimpan:', orderData);

      window.location.href = './OrderSuccess.html';
    });
  }
}
