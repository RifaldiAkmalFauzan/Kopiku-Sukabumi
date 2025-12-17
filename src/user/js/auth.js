const SESSION_LIMIT = 30 * 60 * 1000; // 30 menit

export function requireUser() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const role = localStorage.getItem('role');
  const loginAt = localStorage.getItem('loginAt');

  if (!isLoggedIn || role !== 'user' || !loginAt) {
    forceLogout();
    return;
  }

  if (Date.now() - loginAt > SESSION_LIMIT) {
    alert('Sesi login telah berakhir');
    forceLogout();
  }
}

function forceLogout() {
  localStorage.clear();
  window.location.replace('../../../index.html');
}
