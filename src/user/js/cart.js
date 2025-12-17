// 📁 src/js/cart.js
// ==================================================
// CART MANAGEMENT — FINAL STABLE VERSION
// ==================================================

const CART_KEY = 'cart';

/* =========================================
   Ambil cart dari localStorage
========================================= */
export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

/* =========================================
   Simpan cart ke localStorage
========================================= */
export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

/* =========================================
   Tambah produk ke cart
========================================= */
export const addToCart = (product, quantity = 1) => {
  if (!product || !product.id) return;

  let cart = getCart();

  const existingItem = cart.find((item) => item.id === product.id);

  // 🔒 Pastikan harga numerik
  const cleanPrice = Number(
    String(product.price).replace(/[^\d]/g, '')
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: String(product.id), // ⛔ WAJIB STRING
      name: product.name,
      price: cleanPrice,
      img: product.img,
      quantity,
    });
  }

  saveCart(cart);
};

/* =========================================
   Update jumlah produk
========================================= */
export const updateQuantity = (id, newQuantity) => {
  let cart = getCart();

  cart = cart.map((item) => {
    if (item.id === String(id)) {
      return {
        ...item,
        quantity: Math.max(1, Number(newQuantity)),
      };
    }
    return item;
  });

  saveCart(cart);
};

/* =========================================
   Hapus produk dari cart
========================================= */
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== String(id));
  saveCart(cart);
};

/* =========================================
   Hitung total belanja + ongkir
========================================= */
export const calculateFinalTotal = () => {
  const cart = getCart();

  const totalBelanja = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const ongkir = cart.length > 0 ? 10000 : 0;

  return {
    totalBelanja,
    ongkir,
    grandTotal: totalBelanja + ongkir,
  };
};

/* =========================================
   Kosongkan keranjang (checkout success)
========================================= */
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
