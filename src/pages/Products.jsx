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
