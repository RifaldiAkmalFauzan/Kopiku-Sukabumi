document.addEventListener('click', async (event) => {
  if (event.target.id !== 'loginBtn') return;

  const phone = document.getElementById('phoneNumber').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!phone || !password) {
    alert('⚠️ Harap isi nomor telepon dan kata sandi!');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: phone,
        password: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert('❌ Nomor telepon atau kata sandi salah!');
      return;
    }

    const user = data.user;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', user.role);
    localStorage.setItem('loginAt', Date.now());

    alert(`✅ Login berhasil sebagai ${user.role.toUpperCase()}`);

    if (user.role === 'admin') {
  window.location.href = '/admin/Dashboard.html';
} else {
  window.location.href = '/pages/Home.html';
}

  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    alert('❌ Gagal terhubung ke server');
  }
});