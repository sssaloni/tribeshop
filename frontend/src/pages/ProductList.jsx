import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '/products';
        if (activeCategory !== 'All') {
          endpoint = `/products?category=${encodeURIComponent(activeCategory)}`;
        }
        const response = await api.get(endpoint);
        if (response.data && response.data.success) {
          setProducts(response.data.products);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error connecting to the server. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="catalog-layout">
      <h1 className="section-title">Explore Catalog</h1>

      {/* Filter Tabs */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {['All', 'Electronics', 'Apparel', 'Accessories', 'Home'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{products.length}</strong> items
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeletal State */}
      {loading ? (
        <div className="product-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="product-card">
              <div className="skeleton skeleton-card"></div>
              <div className="product-card-info">
                <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '40%', marginTop: '1rem' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        !error && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <h3>No products found</h3>
            <p style={{ marginTop: '0.5rem' }}>We couldn't find any items matching the category "{activeCategory}".</p>
          </div>
        )
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => {
            const isOutOfStock = product.stock_quantity === 0;
            return (
              <article key={product.id} className="product-card">
                <Link to={`/products/${product.id}`} className="product-card-img-wrapper">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy"
                  />
                  <span className="product-card-badge">{product.category}</span>
                </Link>

                <div className="product-card-info">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="product-card-title">{product.name}</h3>
                  </Link>
                  <p className="product-card-desc">{product.description}</p>
                  
                  <div className="product-card-footer">
                    <span className="product-card-price">${parseFloat(product.price).toFixed(2)}</span>
                    {isOutOfStock ? (
                      <span style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600 }}>
                        Sold Out
                      </span>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
