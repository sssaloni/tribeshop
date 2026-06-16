import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  const shippingCost = cartTotal >= 150 || cartTotal === 0 ? 0 : 9.99;
  const grandTotal = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="cart-layout" style={{ textAlign: 'center', marginTop: '6rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon" style={{ fontSize: '4rem' }}>🛒</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
            Looks like you haven't added any premium gear to your cart yet. Visit our shop to browse our latest arrivals.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <h1 className="section-title">Your Shopping Cart</h1>

      <div className="cart-grid">
        {/* Cart Items List */}
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image_url} alt={item.name} className="cart-item-img" />
              
              <div className="cart-item-details">
                <Link to={`/products/${item.id}`}>
                  <h3 className="cart-item-name">{item.name}</h3>
                </Link>
                <div className="cart-item-price">${parseFloat(item.price).toFixed(2)}</div>
                
                <div className="cart-item-actions">
                  <div className="quantity-controller">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock_quantity)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock_quantity)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1rem' }}>
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div style={{ marginTop: '1rem' }}>
            <Link to="/products" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="summary-card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            Order Summary
          </h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>

          {shippingCost > 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', marginBottom: '1.5rem', textAlign: 'right' }}>
              Add <strong>${(150 - cartTotal).toFixed(2)}</strong> more for FREE shipping!
            </div>
          )}

          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
            Proceed to Checkout
          </Link>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔒 Secure checkout powered by Stripe or similar.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
