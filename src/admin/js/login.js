document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const role = localStorage.getItem('role');
  const loginAt = localStorage.getItem('loginAt');

  if (isLoggedIn && role && loginAt) {
    const SESSION_LIMIT = 30 * 60 * 1000;

    if (Date.now() - loginAt < SESSION_LIMIT) {
      // 🔁 Redirect otomatis
      if (role === 'admin') {
        window.location.href = '../admin/Dashboard.html';
      } else {
        window.location.href = 'Home.html';
      }
    } else {
      // session expired
      localStorage.clear();
    }
  }
});

const API_URL = 'http://localhost:3000/users';

const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(API_URL);
    const users = await res.json();

    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
      errorMsg.classList.remove('hidden');
      return;
    }

    // ✅ simpan session
    localStorage.setItem('user', JSON.stringify(user));

    // redirect ke dashboard
    window.location.href = './dashboard.html';
  } catch (err) {
    console.error('Login error:', err);
  }
});

document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = './login.html';
});
