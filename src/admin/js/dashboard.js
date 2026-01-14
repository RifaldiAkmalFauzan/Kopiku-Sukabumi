import { requireAdmin, confirmAdminLogout } from './auth.js';
import { loadComponent } from '/user/js/core.js';  // path absolut
import { incomeData } from './chartData.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 🔐 CEK ADMIN SETELAH DOM SIAP
  requireAdmin();

  console.log('[ADMIN] Dashboard dimuat');

  // Load Header & Sidebar
  await loadComponent('/admin/components/AdminHeader.html', 'header-container');
  await loadComponent('/admin/components/AdminSidebar.html', 'sidebar-container');

  // Logout button
  const logoutBtn = document.getElementById('btnLogout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', confirmAdminLogout);
  }

  // Init toggle sidebar
  initSidebarToggle();

  // Render stats & chart
  renderStats();
  renderChart();

  console.log('[ADMIN] Dashboard siap ✅');
});

// Sidebar toggle
function initSidebarToggle() {
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('#sidebar-container aside'); // pilih aside di dalam container

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
  });
}

// Stats dummy
function renderStats() {
  document.getElementById('stats-container').innerHTML = `
    <div class="bg-white rounded-xl p-4 shadow">
      <p class="text-sm text-gray-500">Total Produk</p>
      <p class="text-2xl font-semibold">24</p>
    </div>

    <div class="bg-white rounded-xl p-4 shadow">
      <p class="text-sm text-gray-500">Total Order</p>
      <p class="text-2xl font-semibold">120</p>
    </div>

    <div class="bg-white rounded-xl p-4 shadow">
      <p class="text-sm text-gray-500">Pendapatan</p>
      <p class="text-2xl font-semibold">Rp 3.200.000</p>
    </div>

    <div class="bg-white rounded-xl p-4 shadow">
      <p class="text-sm text-gray-500">Admin Aktif</p>
      <p class="text-2xl font-semibold">1</p>
    </div>
  `;
}

// Chart
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
        y: { beginAtZero: true },
      },
    },
  });
}
