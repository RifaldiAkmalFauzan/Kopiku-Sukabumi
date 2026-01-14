const API_URL = '/products'; // Gunakan relative path

export async function getCatalogProducts() {
  try {
    console.log('[DEBUG] 📡 Fetching products from:', API_URL);
    const res = await fetch(API_URL);
    
    if (!res.ok) {
      console.error('[ERROR] API response not OK:', res.status);
      throw new Error(`HTTP ${res.status}: Gagal ambil produk`);
    }
    
    const data = await res.json();
    console.log('[DEBUG] 📦 Raw API response:', data);
    
    // Handle different response formats
    let products;
    if (Array.isArray(data)) {
      products = data;
    } else if (data && Array.isArray(data.data)) {
      products = data.data;
    } else if (data && data.success && Array.isArray(data)) {
      products = data;
    } else {
      console.error('[ERROR] Unknown response format:', data);
      products = [];
    }
    
    // Konversi isBestSeller ke number jika boolean
    products = products.map(product => ({
      ...product,
      isBestSeller: product.isBestSeller === true || product.isBestSeller === 1 ? 1 : 0
    }));
    
    console.log(`[DEBUG] ✅ Loaded ${products.length} products`);
    return products;
    
  } catch (err) {
    console.error('[ERROR] ❌ getCatalogProducts failed:', err);
    return []; // Return empty array instead of throwing
  }
}

export async function getBestSellerProducts() {
  const products = await getCatalogProducts();
  return products.filter(p => p.isBestSeller === 1);
}

export async function getProductById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Produk tidak ditemukan');
      }
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    // Handle different response formats
    let product;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.data && typeof data.data === 'object') {
        product = data.data;
      } else {
        product = data;
      }
    } else {
      product = data[0] || null;
    }
    
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }
    
    // Konversi isBestSeller
    product.isBestSeller = product.isBestSeller === true || product.isBestSeller === 1 ? 1 : 0;
    
    return product;
    
  } catch (err) {
    console.error('[ERROR] ❌ getProductById failed:', err);
    throw err;
  }
}