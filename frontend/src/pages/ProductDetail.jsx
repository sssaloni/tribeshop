import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data && response.data.success) {
          setProduct(response.data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (val) => {
    const newQty = parseInt(val, 10);
    if (isNaN(newQty) || newQty <= 0) return;
    if (newQty > product.stock_quantity) {
      alert(`Cannot select more than ${product.stock_quantity} items (maximum stock available).`);
      return;
    }
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`${quantity} x "${product.name}" added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="catalog-layout" style={{ marginTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem' }}>
          <div className="skeleton" style={{ height: '450px', borderRadius: 'var(--radius-lg)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
            <div className="skeleton skeleton-title" style={{ width: '80%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '20%', height: '2rem' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '95%', height: '4rem' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '50%', height: '3rem', marginTop: '1.5rem' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-layout" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <div className="alert-banner" style={{ display: 'inline-flex', width: 'auto' }}>
          <span>{error}</span>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/products" className="btn btn-secondary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  return (
    <div className="catalog-layout">
      {/* Breadcrumb */}
      <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <Link to="/" style={{ hover: 'color: var(--text-primary)' }}>Home</Link> /{' '}
        <Link to="/products" style={{ hover: 'color: var(--text-primary)' }}>Shop</Link> /{' '}
        <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Product Image */}
        <div className="product-detail-img-container">
          <img src={product.image_url} alt={product.name} className="product-detail-img" />
        </div>

        {/* Product Actions Info */}
        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>
          <h1 className="product-detail-title">{product.name}</h1>
          <div className="product-detail-price">${parseFloat(product.price).toFixed(2)}</div>
          <p className="product-detail-description">{product.description}</p>

          {/* Stock Availability */}
          <div className="stock-indicator">
            {isOutOfStock ? (
              <span className="stock-out" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="stock-dot"></span> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="stock-low" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="stock-dot"></span> Only {product.stock_quantity} left in stock - Order soon!
              </span>
            ) : (
              <span className="stock-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="stock-dot"></span> In Stock ({product.stock_quantity} available)
              </span>
            )}
          </div>

          {/* Add to Cart Actions */}
          {!isOutOfStock && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Quantity</span>
                <div className="quantity-controller" style={{ height: '46px' }}>
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="quantity-btn"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-value" style={{ fontSize: '1.1rem', minWidth: '40px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="quantity-btn"
                    disabled={quantity >= product.stock_quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ flexGrow: 1, height: '46px', marginTop: '1.4rem' }}
              >
                Add to Cart
              </button>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div>📦 Free shipping on orders over $150</div>
              <div>🔄 30-day easy returns policy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
