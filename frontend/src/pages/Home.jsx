import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-tag">New Season Arrival</div>
        <h1 className="hero-title">Elevate Your Everyday Gear</h1>
        <p className="hero-subtitle">
          Discover a curated ecosystem of premium products designed for the modern lifestyle. Fast shipping, secure transactions, and a seamless shopping experience.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/products" className="btn btn-primary">
            Browse Catalog
          </Link>
          <a href="#categories" className="btn btn-secondary">
            Explore Categories
          </a>
        </div>
      </header>

      {/* Categories Grid */}
      <section id="categories" className="catalog-layout">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-container">
          <div className="category-card" onClick={() => handleCategoryClick('Electronics')}>
            <div className="category-icon">⚡</div>
            <h3>Electronics</h3>
            <p>Smartwatches, acoustics, and power accessories.</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Apparel')}>
            <div className="category-icon">👕</div>
            <h3>Apparel</h3>
            <p>Modern fit organic cotton garments and footwear.</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Accessories')}>
            <div className="category-icon">🎒</div>
            <h3>Accessories</h3>
            <p>Backpacks, leather notebooks, and flasks.</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Home')}>
            <div className="category-icon">🛋️</div>
            <h3>Home</h3>
            <p>Minimalist lighting and office accessories.</p>
          </div>
        </div>

        {/* Featured Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(217,70,239,0.05) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          marginTop: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Join the Tribe Club</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
              Subscribe to unlock free premium express shipping, early catalog drops, and limited edition member releases.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Newsletter integration is coming soon!')}>
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
