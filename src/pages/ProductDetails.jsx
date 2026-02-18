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
