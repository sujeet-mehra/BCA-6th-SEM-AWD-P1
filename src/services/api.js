const API_BASE_URL = 'https://dummyjson.com';

export const cleanProductData = (product) => {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    stock: product.stock,
    brand: product.brand,
    category: product.category,
    thumbnail: product.thumbnail,
    images: product.images,
  };
};

export const fetchProducts = async (limit = 30) => {
  const response = await fetch(`${API_BASE_URL}/products?limit=${limit}`);
  const data = await response.json();
  return {
    products: data.products.map(cleanProductData),
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  };
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  const product = await response.json();
  return cleanProductData(product);
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  return response.json();
};

export const fetchProductsByCategory = async (category) => {
  const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
  const data = await response.json();
  return data.products.map(cleanProductData);
};

export const searchProducts = async (query) => {
  const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return {
    products: data.products.map(cleanProductData),
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  };
};
