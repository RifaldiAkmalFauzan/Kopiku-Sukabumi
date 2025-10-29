// 📁 src/js/OrderSuccess.js
import { loadComponent, setDynamicHeader } from './core.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DEBUG] ✅ Halaman Order Success dimuat');

  // ==================================================
  // 🔹 Muat Header & Nav
  // ==================================================
  try {
    await loadComponent('../components/Header.html', 'header-container');
    await loadComponent('../components/Nav.html', 'nav-container');

    // 🔸 Atur Header (tanpa ikon keranjang, tampil tombol back)
    setDynamicHeader({
      title: 'Pesanan Berhasil',
      showBack: false,
      backLink: '../pages/Checkout.html',
      showLogo: false,
      showCart: false,
    });
  } catch (err) {
    console.error('[ERROR] Gagal memuat Header/Nav:', err);
  }

  // ==================================================
  // 🔹 Ambil data order dari localStorage
  // ==================================================
  const orderData = JSON.parse(localStorage.getItem('orderData'));
  console.log('[DEBUG] orderData:', orderData);

  if (!orderData) {
    document.getElementById('order-success-container').innerHTML = `
      <p class="text-center text-gray-500 py-10">
        ❌ Tidak ada data pesanan ditemukan.
      </p>
    `;
    return;
  }

  // ==================================================
  // 🔹 Tampilkan data order ke halaman
  // ==================================================
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('order-id', orderData.id);
  setText('payment-date', `${orderData.tanggal} • ${orderData.waktu}`);
  setText('payment-method', orderData.metodePembayaran);
  setText('payment-status', orderData.statusPembayaran);
  setText('payment-email', orderData.email);
  setText('payment-total', `Rp ${Number(orderData.total || 0).toLocaleString('id-ID')}`);

  // ==================================================
  // 🔹 Tombol "Selesai" → simpan riwayat & kembali ke Home
  // ==================================================
  const btnFinish = document.getElementById('btn-finish');
  if (btnFinish) {
    btnFinish.addEventListener('click', () => {
      // 🗂️ Simpan ke riwayat pesanan sebelum dihapus
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.push(orderData);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      console.log('[DEBUG] 💾 Riwayat pesanan diperbarui:', orderHistory);

      // 🧹 Bersihkan data order & keranjang
      localStorage.removeItem('orderData');
      localStorage.removeItem('cart');
      console.log('[DEBUG] 🧹 Data order & cart dibersihkan.');

      // 🔁 Redirect ke halaman utama
      window.location.href = './Home.html';
    });
  }

  console.log('[DEBUG] ✅ OrderSuccess.js selesai dijalankan');
});
