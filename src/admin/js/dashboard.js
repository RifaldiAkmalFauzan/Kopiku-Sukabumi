import { loadComponent, updateCartBadge } from '../../js/core.js';
import { incomeData } from './chartData.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[ADMIN] Dashboard dimuat');

  // 🔹 Muat Header & Sidebar
  await loadComponent('./components/AdminHeader.html', 'header-container');
  await loadComponent('./components/AdminSidebar.html', 'sidebar-container');

  console.log('[ADMIN] Header & Sidebar berhasil dimuat');

  // 🔹 Aktifkan toggle menu setelah komponen termuat
  initSidebarToggle();

  // 🔹 Update cart badge (kalau ada)
  updateCartBadge();

  // 🔹 Render statistik
  renderStats();

  // 🔹 Muat dan render chart
  await loadComponent('./components/AdminChart.html', 'chart-container');
  renderChart();
});

// =============================
// 🔹 FUNGSI: Sidebar Toggle
// =============================
function initSidebarToggle() {
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar-container');

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    sidebar.classList.toggle('md:block'); // contoh agar tetap muncul di layar besar
  });

  console.log('[ADMIN] Sidebar toggle aktif ✅');
}

// =============================
// 🔹 FUNGSI: Statistik
// =============================
function renderStats() {
  const stats = [
    { icon: 'shopping-cart.svg', title: 'Total Penjualan', value: '15.000 pcs' },
    { icon: 'calendar.svg', title: 'Total Orderan', value: '9.000' },
    { icon: 'dollar.svg', title: 'Total Pendapatan', value: 'Rp 950.000.000' },
    { icon: 'credit-card.svg', title: 'Penjualan /Bln', value: 'Rp 100.000.000' },
  ];

  fetch('./components/AdminStatsCard.html')
    .then((res) => res.text())
    .then((template) => {
      let html = '';
      stats.forEach((s) => {
        html += template
          .replace('[[ICON_SRC]]', s.icon)
          .replace('[[TITLE]]', s.title)
          .replace('[[VALUE]]', s.value);
      });
      document.getElementById('stats-container').innerHTML = html;
    })
    .catch((err) => console.error('Gagal render stats:', err));
}

// =============================
// 🔹 FUNGSI: Chart
// =============================
function renderChart() {
  const ctx = document.getElementById('incomeChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: incomeData,
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
    },
  });
}
