// ✅ src/js/cart.js

// Ambil cart dari localStorage
export const getCart = () => {
  return JSON.parse(localStorage.getItem('cart')) || [];
};

// Simpan cart ke localStorage
export const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Tambah item ke keranjang
export const addToCart = (product, quantity = 1) => {
  let cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  // Pastikan harga bersih dan dalam format number
  const cleanPrice = parseInt(String(product.price).replace(/\D/g, '') || '0');

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, price: cleanPrice, quantity });
  }

  saveCart(cart);
};

// Hapus item dari keranjang
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};

// Update jumlah item
export const updateQuantity = (id, newQty) => {
  let cart = getCart();
  const item = cart.find((p) => p.id === id);
  if (item) {
    item.quantity = Math.max(1, newQty);
  }
  saveCart(cart);
};

// ✅ Hitung total harga dan ongkir
export const calculateFinalTotal = () => {
  const cart = getCart();
  const totalBelanja = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const ongkir = 10000; // Rp 10.000
  const grandTotal = totalBelanja + ongkir;

  return { totalBelanja, ongkir, grandTotal };
};

// ✅ Kosongkan keranjang (dipakai saat checkout selesai)
export const clearCart = () => {
  localStorage.removeItem('cart');
};
