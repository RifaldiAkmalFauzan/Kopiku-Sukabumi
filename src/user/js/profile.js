// 📁 src/js/profile.js
import { requireUser } from './auth.js';
requireUser(); // ⛔ STOP DI SINI JIKA BELUM LOGIN

import { loadComponent, setDynamicHeader, setActiveNav } from './core.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DEBUG] Halaman Profil dimuat ✅');

  // 🔹 Muat komponen header dan nav
  await loadComponent('../components/Header.html', 'header-container');
  await loadComponent('../components/Nav.html', 'nav-container');

  // 🔹 Atur header
  setDynamicHeader({
    title: 'Profil Saya',
    showBack: false,
    showCart: false,
  });

  setActiveNav();

  // 🔒 LOGOUT FINAL (BEST PRACTICE)
  const logoutBtn = document.getElementById('btn-logout');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const confirmLogout = confirm('Yakin ingin keluar dari akun?');

      if (!confirmLogout) return;

      // 🔥 Hapus seluruh session
      localStorage.clear();

      // 🔁 Redirect tanpa bisa back
      window.location.replace('/');
    });
  }
});
