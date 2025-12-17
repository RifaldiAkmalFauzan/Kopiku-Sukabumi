document.addEventListener('click', async (event) => {
  if (event.target.id !== 'loginBtn') return;

  const phone = document.getElementById('phoneNumber').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!phone || !password) {
    alert('⚠️ Harap isi nomor telepon dan kata sandi!');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/users?username=${phone}&password=${password}`);
    const users = await res.json();

    if (users.length === 0) {
      alert('❌ Nomor telepon atau kata sandi salah!');
      return;
    }

    const user = users[0];

    // ✅ SIMPAN SESSION FINAL
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', user.role);

    // ⏱️ Simpan waktu login (timestamp)
    localStorage.setItem('loginAt', Date.now());

    alert(`✅ Login berhasil sebagai ${user.role.toUpperCase()}`);

    if (user.role === 'admin') {
      window.location.href = '../../admin/Dashboard.html';
    } else {
      window.location.href = 'Home.html';
    }
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    alert('❌ Gagal terhubung ke server');
  }
});

// document.getElementById('loginForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const username = document.getElementById('username').value;
//   const password = document.getElementById('password').value;

//   const res = await fetch(`http://localhost:3000/users?username=${username}&password=${password}`);
//   const data = await res.json();

//   if (data.length > 0) {
//     localStorage.setItem('adminLogin', 'true');
//     window.location.href = 'ProductManagement.html';
//   } else {
//     document.getElementById('message').innerText = 'Invalid credentials!';
//   }
// });
