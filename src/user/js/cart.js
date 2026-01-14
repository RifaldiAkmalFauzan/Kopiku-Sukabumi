// 📁 src/js/cart.js
// ==================================================
// CART MANAGEMENT — FINAL FIXED VERSION
// ==================================================

const CART_KEY = 'cart';

/* =========================================
   FUNGSI UTILITAS: Membersihkan format harga
========================================= */
const cleanPrice = (priceInput) => {
  try {
    if (priceInput === null || priceInput === undefined || priceInput === '') {
      return 0;
    }

    const priceStr = String(priceInput).trim();

    // 1. Jika sudah angka valid, langsung return
    if (!isNaN(priceStr) && priceStr !== '') {
      const num = Number(priceStr);
      return isFinite(num) ? num : 0;
    }

    // 2. Hapus semua karakter non-digit kecuali titik dan koma
    let cleaned = priceStr.replace(/[^\d.,]/g, '');

    // 3. Hapus semua titik yang berfungsi sebagai pemisah ribuan
    //    (titik diikuti oleh tepat 3 digit, lalu digit lagi atau akhir string)
    cleaned = cleaned.replace(/\.(\d{3})(?=\d|$)/g, '$1');

    // 4. Tangani format desimal Indonesia (koma) vs internasional (titik)
    const hasComma = cleaned.includes(',');
    const hasDot = cleaned.includes('.');

    if (hasComma && !hasDot) {
      // Format Indonesia: 50.000,00 atau 50000,00
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (hasDot && !hasComma) {
      // Format internasional: 50,000.00 atau 50000.00
      cleaned = cleaned.replace(/,/g, '');
    } else if (hasComma && hasDot) {
      // Format campuran: tentukan mana desimal
      const lastComma = cleaned.lastIndexOf(',');
      const lastDot = cleaned.lastIndexOf('.');
      if (lastComma > lastDot) {
        // Koma adalah desimal: 1.500,00
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        // Titik adalah desimal: 1,500.00
        cleaned = cleaned.replace(/,/g, '');
      }
    }

    // 5. Konversi ke number dan pastikan valid
    const result = Number(cleaned);
    return isFinite(result) ? result : 0;
  } catch (error) {
    console.error('[CART] Error cleaning price:', priceInput, error);
    return 0;
  }
};

/* =========================================
   Ambil cart dari localStorage
========================================= */
export const getCart = () => {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    // Pastikan semua tipe data benar
    return cart.map((item) => ({
      ...item,
      id: String(item.id),
      price: cleanPrice(item.price), // Pastikan harga sudah bersih
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));
  } catch (error) {
    console.error('[CART] Error getting cart:', error);
    return [];
  }
};

/* =========================================
   Simpan cart ke localStorage
========================================= */
export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('[CART] Error saving cart:', error);
  }
};

/* =========================================
   Tambah produk ke cart (FIXED)
========================================= */
export const addToCart = (product, quantity = 1) => {
  if (!product || !product.id) {
    console.warn('[CART] Produk tidak valid');
    return false;
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === String(product.id));

  // Bersihkan harga dari berbagai format
  const finalPrice = cleanPrice(product.price);

  if (finalPrice <= 0) {
    console.warn('[CART] Harga tidak valid:', product.price);
    return false;
  }

  if (existingItem) {
    // Update quantity produk yang sudah ada
    existingItem.quantity += Number(quantity) || 1;
  } else {
    // Tambah produk baru
    cart.push({
      id: String(product.id),
      name: String(product.name || 'Produk'),
      price: finalPrice,
      img: String(product.img || ''),
      quantity: Math.max(1, Number(quantity) || 1),
    });
  }

  saveCart(cart);
  console.log(`[CART] Added: ${product.name} | Price: ${finalPrice} | Qty: ${quantity}`);
  return true;
};

/* =========================================
   Update jumlah produk
========================================= */
export const updateQuantity = (id, newQuantity) => {
  const cart = getCart();
  const numericQty = Math.max(1, Math.floor(Number(newQuantity) || 1));

  const updatedCart = cart.map((item) => {
    if (item.id === String(id)) {
      return {
        ...item,
        quantity: numericQty,
      };
    }
    return item;
  });

  saveCart(updatedCart);
  return numericQty;
};

/* =========================================
   Hapus produk dari cart
========================================= */
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== String(id));
  saveCart(cart);
  return cart.length;
};

/* =========================================
   Hitung total belanja + ongkir
========================================= */
export const calculateFinalTotal = () => {
  const cart = getCart();

  // Pastikan semua harga sudah number sebelum kalkulasi
  const totalBelanja = cart.reduce((sum, item) => {
    const price = cleanPrice(item.price);
    const quantity = Number(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  // Contoh logika ongkir: gratis jika belanja > 100k
  const ongkir = totalBelanja > 100000 ? 0 : 10000;
  const grandTotal = totalBelanja + ongkir;

  return {
    totalBelanja,
    ongkir,
    grandTotal,
  };
};

/* =========================================
   Format harga untuk display (id-ID)
========================================= */
export const formatRupiah = (amount) => {
  const num = cleanPrice(amount);
  return `Rp ${num.toLocaleString('id-ID')}`;
};

/* =========================================
   Get total quantity items in cart
========================================= */
export const getTotalItems = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
};

/* =========================================
   Kosongkan keranjang (checkout success)
========================================= */
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  return true;
};

/* =========================================
   Debug: Lihat isi cart
========================================= */
export const debugCart = () => {
  const cart = getCart();
  console.log('[CART DEBUG] Current cart:', cart);
  console.log('[CART DEBUG] Total items:', getTotalItems());
  console.log('[CART DEBUG] Final total:', calculateFinalTotal());
  return cart;
};
