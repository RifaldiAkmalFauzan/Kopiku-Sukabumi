const API_URL = 'http://localhost:3000/products';

/**
 * Ambil semua produk
 */
export async function getCatalogProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (err) {
    console.error('❌ Gagal mengambil produk:', err);
    return [];
  }
}

/**
 * Ambil produk unggulan (Best Seller)
 */
export async function getBestSellerProducts() {
  const products = await getCatalogProducts();
  return products.filter((p) => p.isBestSeller === true);
}
