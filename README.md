# React Product Store - Step by Step Tutorial

This tutorial will guide you through building a React application that fetches and displays products from an API.

## Project Overview

We will build:
- A **Products Page** that displays all products in a grid with search functionality
- A **Product Details Page** that shows detailed information about a single product
- **API Service** to fetch and clean data from [DummyJSON API](https://dummyjson.com)

---

## Step 1: Project Setup

### 1.1 Create a new React project with Vite

```bash
npm create vite@latest react-project -- --template react
cd react-project
npm install
```

### 1.2 Install React Router

React Router enables navigation between pages:

```bash
npm install react-router-dom
```

---

## Step 2: Create Project Structure

Organize your files into folders:

```
src/
  components/      # Reusable UI components
    ProductCard.jsx
  pages/           # Page components
    Products.jsx
    ProductDetails.jsx
  services/        # API calls
    api.js
  App.jsx
  App.css
  main.jsx
```

Create the folders:

```bash
mkdir src/components src/pages src/services
```

---

## Step 3: Create API Service

**File: `src/services/api.js`**

This file handles all API calls and data cleaning.

```javascript
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
```

### Why clean the data?

The API returns many fields we don't need (like `tags`, `sku`, `weight`, etc.). Cleaning data:
- Reduces memory usage
- Makes debugging easier
- Improves performance

---

## Step 4: Create ProductCard Component

**File: `src/components/ProductCard.jsx`**

A reusable card for displaying product preview.

```javascript
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <div className="product-card-content">
        <h3>{product.title}</h3>
        <p className="brand">{product.brand}</p>
        <p className="price">${product.price}</p>
        <div className="rating">
          <span>{product.rating}</span>
          <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
```

### Key Concepts:
- **Props**: `{ product }` receives data from parent
- **Link**: Navigates to details page without page reload
- **Template Literals**: `` `/product/${product.id}` `` creates dynamic URLs

---

## Step 5: Create Products Page (Basic)

**File: `src/pages/Products.jsx`**

Displays all products in a grid layout.

```javascript
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data.products);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-page">
      <h1>Products</h1>
      <p className="product-count">Showing {products.length} products</p>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
```

### Key Concepts:
- **useState**: Manages state for products, loading, and error
- **useEffect**: Runs fetch when component mounts (`[]` dependency)
- **Async/Await**: Clean way to handle promises
- **Conditional Rendering**: Shows loading/error states

---

## Step 6: Create Product Details Page

**File: `src/pages/ProductDetails.jsx`**

Shows detailed view of a single product with image gallery.

```javascript
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-details">
      <Link to="/" className="back-link">
        Back to Products
      </Link>
      
      <div className="product-details-content">
        <div className="product-images">
          <img
            src={product.images[selectedImage]}
            alt={product.title}
            className="main-image"
          />
          <div className="image-thumbnails">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <span className="category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="brand">by {product.brand}</p>
          
          <div className="price-section">
            <span className="price">${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className="discount">-{product.discountPercentage}% off</span>
            )}
          </div>

          <div className="rating-stock">
            <div className="rating">
              <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
              <span>{product.rating}</span>
            </div>
            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="description">{product.description}</p>

          <button className="add-to-cart" disabled={product.stock === 0}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
```

### Key Concepts:
- **useParams**: Extracts `:id` from the URL `/product/:id`
- **Image Gallery**: `selectedImage` state changes displayed image
- **Dynamic Classes**: `` `thumbnail ${selectedImage === index ? 'active' : ''}` ``
- **Conditional Rendering**: Show discount only if > 0, stock status based on quantity

---

## Step 7: Setup Routing in App.jsx

**File: `src/App.jsx`**

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <a href="/" className="logo">
            Product Store
          </a>
          <nav>
            <a href="/">Products</a>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### Key Concepts:
- **BrowserRouter**: Wraps app to enable routing
- **Routes**: Container for route definitions
- **Route**: Maps URL path to component
- **:id**: Dynamic parameter in URL

---

## Step 8: Add CSS Styling

**File: `src/App.css`**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.app {
  min-height: 100vh;
}

.header {
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.header nav a {
  color: #666;
  text-decoration: none;
  margin-left: 1.5rem;
}

.header nav a:hover {
  color: #333;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.products-page h1 {
  margin-bottom: 0.5rem;
}

.product-count {
  color: #666;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card-content {
  padding: 1rem;
}

.product-card-content h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card-content .brand {
  color: #888;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.product-card-content .price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2ecc71;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.stars {
  color: #f1c40f;
}

.product-details {
  padding: 1rem 0;
}

.back-link {
  display: inline-block;
  color: #3498db;
  text-decoration: none;
  margin-bottom: 1.5rem;
}

.back-link:hover {
  text-decoration: underline;
}

.product-details-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

@media (max-width: 768px) {
  .product-details-content {
    grid-template-columns: 1fr;
  }
}

.product-images .main-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-thumbnails {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  opacity: 0.7;
  transition: all 0.2s;
}

.thumbnail:hover {
  opacity: 1;
}

.thumbnail.active {
  border-color: #3498db;
  opacity: 1;
}

.product-info .category {
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #3498db;
  font-weight: bold;
  letter-spacing: 1px;
}

.product-info h1 {
  font-size: 1.75rem;
  margin: 0.5rem 0;
}

.product-info .brand {
  color: #888;
  margin-bottom: 1rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.price-section .price {
  font-size: 2rem;
  font-weight: bold;
  color: #2ecc71;
}

.discount {
  background: #e74c3c;
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.rating-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.in-stock {
  color: #2ecc71;
  font-weight: bold;
}

.out-of-stock {
  color: #e74c3c;
  font-weight: bold;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.add-to-cart {
  width: 100%;
  padding: 1rem;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.add-to-cart:hover:not(:disabled) {
  background: #2980b9;
}

.add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

---

## Step 9: Run the Application

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

At this point, you have a working product store with:
- Products listing page
- Product details page with image gallery
- Navigation between pages

---

## Step 10: Add Search Functionality

Now let's add search using the DummyJSON Search API. Search triggers on Enter key or Search button click.

### 10.1 Update Products.jsx

Replace the entire `src/pages/Products.jsx` with this updated version:

```javascript
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts, searchProducts } from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load all products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data.products);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Search products when searchQuery changes
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setIsSearching(false);
        return;
      }

      try {
        setLoading(true);
        const data = await searchProducts(searchQuery);
        setProducts(data.products);
        setIsSearching(true);
      } catch (err) {
        setError('Failed to search products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(inputValue.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = async () => {
    setInputValue('');
    setSearchQuery('');
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data.products);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="products-page">
      <h1>Products</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products by title, brand, or category..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
        {isSearching && (
          <button onClick={handleClear} className="clear-search">
            Clear
          </button>
        )}
      </div>
      <p className="product-count">
        {isSearching ? `Found ${products.length} products` : `Showing ${products.length} products`}
      </p>
      {products.length === 0 ? (
        <div className="no-results">
          No products found for "{searchQuery}"
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
```

### 10.2 Add Search CSS

Add these styles to `src/App.css` after the `.products-page h1` styles:

```css
.search-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3498db;
}

.search-input::placeholder {
  color: #aaa;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #2980b9;
}

.clear-search {
  padding: 0.75rem 1.5rem;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-search:hover {
  background: #c0392b;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #888;
  font-size: 1.1rem;
}
```

### Key Concepts:

- **API Search**: Uses `GET /products/search?q=query` endpoint
- **Two State Variables**: `inputValue` tracks typing, `searchQuery` triggers API call
- **useEffect for Search**: Separate useEffect runs when `searchQuery` changes
- **encodeURIComponent**: Safely encodes special characters in search query
- **isSearching State**: Tracks whether we're in search mode to show correct UI
- **handleKeyDown**: Detects Enter key press to trigger search
- **Optimized Search**: Only makes API call on Enter or button click, not every keystroke

---

## Project Summary

### Final Project Structure

```
src/
  components/
    ProductCard.jsx
  pages/
    Products.jsx
    ProductDetails.jsx
  services/
    api.js
  App.jsx
  App.css
  main.jsx
```

### Data Flow

```
User Action (type search / click product)
    ↓
API Call (fetchProducts / searchProducts / fetchProductById)
    ↓
api.js (fetch + clean data)
    ↓
useState (store products/error/loading)
    ↓
Components (receive data via props)
    ↓
UI (render)
```

### What You Learned

1. **Fetching Data**: Using `fetch()` with async/await
2. **State Management**: `useState` for data, loading, error states
3. **Side Effects**: `useEffect` for API calls on mount and search
4. **Routing**: React Router for navigation between pages
5. **Data Cleaning**: Removing unused fields from API response
6. **Component Props**: Passing data to child components
7. **URL Parameters**: `useParams` for dynamic routes
8. **API Search**: Using search endpoint with optimized trigger on Enter/button click

---

## Next Steps

Try these challenges to practice:

1. **Add Categories**: Add dropdown to filter by product category using `fetchCategories()` and `fetchProductsByCategory()`
2. **Add Pagination**: Load more products with "Load More" button
3. **Add Cart**: Store selected products in state with quantity
4. **Add Favorites**: Save products to localStorage
5. **Add Sorting**: Sort by price, rating, or name

---

## API Reference

| Endpoint | Description |
|----------|-------------|
| `GET /products` | Get all products |
| `GET /products/:id` | Get single product |
| `GET /products/search?q=query` | Search products by query |
| `GET /products/categories` | Get all categories |
| `GET /products/category/:category` | Get products by category |

Full documentation: https://dummyjson.com/docs/products
