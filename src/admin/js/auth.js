// 📁 src/admin/js/auth.js

const SESSION_LIMIT = 30 * 60 * 1000;

export function requireAdmin() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const role = localStorage.getItem('role');
  const loginAt = localStorage.getItem('loginAt');

  if (!isLoggedIn || role !== 'admin' || !loginAt) {
    forceLogout('⛔ Akses admin ditolak');
    return;
  }

  if (Date.now() - Number(loginAt) > SESSION_LIMIT) {
    forceLogout('⏰ Sesi admin telah berakhir');
  }
}

export function forceLogout(message = 'Anda telah logout') {
  alert(message);

  // 🔥 bersihkan session
  localStorage.clear();

  // ⛔ cegah back ke dashboard
  window.location.replace('../../../index.html');
}

export function confirmAdminLogout() {
  const confirmLogout = confirm(
    '⚠️ Konfirmasi Logout Admin\n\n' +
    'Anda akan keluar dari Dashboard Admin.\n' +
    'Semua akses administrasi akan dihentikan.\n\n' +
    'Lanjutkan logout?'
  );

  if (!confirmLogout) return;

  forceLogout('🚪 Logout admin berhasil');
}
