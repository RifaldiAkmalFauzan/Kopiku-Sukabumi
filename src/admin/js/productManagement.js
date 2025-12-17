import { requireAdmin } from './auth.js';
requireAdmin();

const API_URL = 'http://localhost:3000/products';

// ELEMENT
const tableBody = document.getElementById('productTableBody');
const modal = document.getElementById('modalForm');
const modalTitle = document.getElementById('modalTitle');
const form = document.getElementById('productForm');
const btnAdd = document.getElementById('btnAdd');
const btnCancel = document.getElementById('btnCancel');

// INPUT
const idInput = document.getElementById('productId');
const nameInput = document.getElementById('productName');
const priceInput = document.getElementById('productPrice');
const stockInput = document.getElementById('productStock');
const imageInput = document.getElementById('productImage');
const weightInput = document.getElementById('productWeight');
const descInput = document.getElementById('productDescription');
const bestSellerInput = document.getElementById('productBestSeller');

/* =====================================================
   LOAD PRODUCTS
===================================================== */
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Gagal load produk');

    const products = await res.json();

    tableBody.innerHTML = products
      .map(
        (p, i) => `
        <tr>
          <td class="px-4 py-2">${p.id}</td>
          <td class="px-4 py-2">${p.name}</td>
          <td class="px-4 py-2">Rp ${p.price}</td>
          <td class="px-4 py-2">${p.stock ?? 0}</td>
          <td class="px-4 py-2">
            <img
              src="${p.img || '/src/user/assets/img/default.png'}"
              class="w-14 h-14 object-cover rounded"
              onerror="this.src='/src/user/assets/img/default.png'"
            />
          </td>
          <td class="px-4 py-2 flex gap-2">
        <button onclick="editProduct('${p.id}')" class="text-blue-600">✏️</button>
        <button onclick="deleteProduct('${p.id}')" class="text-red-600">🗑️</button>
          </td>
        </tr>
      `
      )
      .join('');
  } catch (err) {
    console.error('[LOAD PRODUCT ERROR]', err);
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-red-500 py-6">
          Gagal memuat data produk
        </td>
      </tr>
    `;
  }
}

/* =====================================================
   MODAL CONTROL
===================================================== */
function openModal(title) {
  modalTitle.textContent = title;
  modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeModal() {
  modal.classList.add('opacity-0', 'pointer-events-none');
  form.reset();
  idInput.value = '';
  bestSellerInput.checked = false;
}

/* =====================================================
   ADD PRODUCT
===================================================== */
btnAdd.addEventListener('click', () => {
  openModal('➕ Tambah Produk');
});

/* =====================================================
   CANCEL
===================================================== */
btnCancel.addEventListener('click', closeModal);

/* =====================================================
   SUBMIT (CREATE / UPDATE)
===================================================== */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: nameInput.value,
    price: Number(priceInput.value),
    weight: weightInput.value,
    stock: Number(stockInput.value),
    img: imageInput.value,
    description: descInput.value,
    isBestSeller: bestSellerInput.checked,
  };

  if (idInput.value) {
    await fetch(`${API_URL}/${idInput.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  closeModal();
  loadProducts();
});

/* =====================================================
   EDIT PRODUCT
===================================================== */
window.editProduct = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
      throw new Error(`Produk dengan ID ${id} tidak ditemukan`);
    }

    const p = await res.json();

    idInput.value = p.id;
    nameInput.value = p.name;
    priceInput.value = p.price;
    stockInput.value = p.stock ?? 0;
    imageInput.value = p.img ?? '';
    weightInput.value = p.weight || '';
    descInput.value = p.description || '';
    bestSellerInput.checked = p.isBestSeller || false;

    openModal('✏️ Edit Produk');
  } catch (err) {
    console.error('[EDIT PRODUCT ERROR]', err);
    alert(err.message);
  }
};

/* =====================================================
   DELETE PRODUCT
===================================================== */
window.deleteProduct = async (id) => {
  if (!confirm('Yakin ingin menghapus produk ini?')) return;

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadProducts();
};

// INIT
loadProducts();
