// ✅ Event listener login dummy
document.addEventListener('click', function (event) {
  if (event.target.id === 'loginBtn') {
    const phoneInput = document.getElementById('phoneNumber');
    const passwordInput = document.getElementById('password');

    const phone = phoneInput ? phoneInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!phone || !password) {
      alert('⚠️ Harap isi nomor telepon dan kata sandi!');
      return;
    }

    // Dummy akun (contoh)
    const adminAccount = { phone: '08987654321', password: 'kopiku123' };
    const userAccount = { phone: '08123456789', password: 'kopiku123' };

    // Logika login sederhana
    if (phone === adminAccount.phone && password === adminAccount.password) {
      localStorage.setItem('userRole', 'admin');
      alert('✅ Login berhasil sebagai ADMIN!');
      window.location.href = '../admin/Dashboard.html';
    } else if (phone === userAccount.phone && password === userAccount.password) {
      localStorage.setItem('userRole', 'user');
      alert('✅ Login berhasil sebagai USER!');
      window.location.href = 'Home.html';
    } else {
      alert('❌ Nomor telepon atau kata sandi salah!');
    }
  }
});
