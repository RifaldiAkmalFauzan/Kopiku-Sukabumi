// 📁 src/js/profile.js
import { loadComponent, setDynamicHeader, setActiveNav } from './core.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DEBUG] Halaman Profil dimuat ✅');

  // 🔹 Muat komponen header dan nav
  await loadComponent('../components/Header.html', 'header-container');
  await loadComponent('../components/Nav.html', 'nav-container');

  // 🔹 Atur header (tanpa tombol back, tampilkan logo & ikon keranjang)
  setDynamicHeader({
    title: 'Profil Saya',
    showBack: false,
    showCart: false,
  });

  setActiveNav();

  // 🔹 Tombol logout dummy
  const logoutBtn = document.getElementById('btn-logout');
  logoutBtn.addEventListener('click', () => {
    alert('🚪 Logout berhasil (dummy)');
    window.location.href = './index.html';
  });
});
