// 📁 src/js/adminController.js

const API_URL = 'http://localhost:3000/products';

const form = document.getElementById('product-form');
const table = document.getElementById('product-table');

const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const imgInput = document.getElementById('img');
const editIdInput = document.getElementById('edit-id');
const submitBtn = document.getElementById('submit-btn');

// =========================================================
// 1) READ → Ambil semua produk dari backend
// =========================================================
async function loadProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();
  renderTable(products);
}

function renderTable(products) {
  table.innerHTML = products
    .map(
      (p) => `
      <tr class="border-b">
        <td class="py-3 px-4">${p.name}</td>
        <td class="py-3 px-4">Rp ${Number(p.price).toLocaleString('id-ID')}</td>
        <td class="py-3 px-4">
          <img src="../src/${p.img}" class="w-16 rounded">
        </td>
        <td class="py-3 px-4 text-center">
          <button onclick="editProduct(${p.id})"
            class="bg-yellow-400 text-white px-3 py-1 rounded mr-2">
            Edit
          </button>

          <button onclick="deleteProduct(${p.id})"
            class="bg-red-500 text-white px-3 py-1 rounded">
            Hapus
          </button>
        </td>
      </tr>
    `
    )
    .join('');
}

// =========================================================
// 2) CREATE + UPDATE → Submit form
// =========================================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const productData = {
    name: nameInput.value,
    price: Number(priceInput.value),
    img: imgInput.value,
  };

  const editId = editIdInput.value;

  if (editId) {
    // UPDATE
    await fetch(`${API_URL}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    submitBtn.textContent = 'Tambah Produk';
  } else {
    // CREATE
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
  }

  // Reset form
  form.reset();
  editIdInput.value = '';

  loadProducts();
});

// =========================================================
// 3) UPDATE (ISI FORM)
// =========================================================
window.editProduct = async function (id) {
  const res = await fetch(`${API_URL}/${id}`);
  const product = await res.json();

  nameInput.value = product.name;
  priceInput.value = product.price;
  imgInput.value = product.img;
  editIdInput.value = product.id;

  submitBtn.textContent = 'Update Produk';
};

// =========================================================
// 4) DELETE
// =========================================================
window.deleteProduct = async function (id) {
  const confirmDel = confirm('Yakin hapus produk?');
  if (!confirmDel) return;

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

  loadProducts();
};

loadProducts();