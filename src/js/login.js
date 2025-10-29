// Event listener untuk login dummy
document.addEventListener('click', function (event) {
  if (event.target.id === 'loginBtn') {
    alert('Login berhasil (dummy)! Mengarahkan ke halaman Home...');
    window.location.href = 'Home.html'; // nanti diganti setelah home page jadi
  }
});
