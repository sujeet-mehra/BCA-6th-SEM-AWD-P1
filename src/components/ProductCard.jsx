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
