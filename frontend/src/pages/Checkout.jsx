import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: '',
    customer_city: '',
    customer_zip: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const shippingCost = cartTotal >= 150 ? 0 : 9.99;
  const grandTotal = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="checkout-layout" style={{ textAlign: 'center', marginTop: '6rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>No items to check out</h2>
        <Link to="/products" className="btn btn-primary">Go to Shop</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.customer_name.trim()) tempErrors.customer_name = 'Name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customer_email.trim()) {
      tempErrors.customer_email = 'Email is required';
    } else if (!emailRegex.test(formData.customer_email)) {
      tempErrors.customer_email = 'Provide a valid email address';
    }

    if (!formData.customer_address.trim()) tempErrors.customer_address = 'Address is required';
    if (!formData.customer_city.trim()) tempErrors.customer_city = 'City is required';
    if (!formData.customer_zip.trim()) tempErrors.customer_zip = 'ZIP code is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Build items payload
    const orderItems = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const orderPayload = {
      ...formData,
      items: orderItems,
    };

    try {
      const response = await api.post('/orders', orderPayload);
      if (response.data && response.data.success) {
        const orderId = response.data.orderId;
        
        // Clear local cart
        clearCart();

        // Redirect to success screen with state details
        navigate(`/order-success?orderId=${orderId}`, {
          state: {
            orderId,
            customerName: formData.customer_name,
            totalAmount: grandTotal,
            email: formData.customer_email,
          },
        });
      }
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.message || 'Checkout request failed. Please check stock availability or try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-layout">
      <h1 className="section-title">Shipping & Billing Details</h1>

      {submitError && (
        <div className="alert-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{submitError}</span>
        </div>
      )}

      <div className="checkout-grid">
        {/* Billing / Shipping Form */}
        <form onSubmit={handleSubmit} className="form-card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>Delivery Address</h2>

          <div className="form-group">
            <label className="form-label" htmlFor="customer_name">Full Name</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="John Doe"
            />
            {errors.customer_name && <div className="invalid-feedback">{errors.customer_name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer_email">Email Address</label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="johndoe@example.com"
            />
            {errors.customer_email && <div className="invalid-feedback">{errors.customer_email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer_address">Street Address</label>
            <input
              type="text"
              id="customer_address"
              name="customer_address"
              value={formData.customer_address}
              onChange={handleInputChange}
              className="form-input"
              placeholder="123 Main St, Apt 4"
            />
            {errors.customer_address && <div className="invalid-feedback">{errors.customer_address}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="customer_city">City</label>
              <input
                type="text"
                id="customer_city"
                name="customer_city"
                value={formData.customer_city}
                onChange={handleInputChange}
                className="form-input"
                placeholder="New York"
              />
              {errors.customer_city && <div className="invalid-feedback">{errors.customer_city}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="customer_zip">ZIP / Postal Code</label>
              <input
                type="text"
                id="customer_zip"
                name="customer_zip"
                value={formData.customer_zip}
                onChange={handleInputChange}
                className="form-input"
                placeholder="10001"
              />
              {errors.customer_zip && <div className="invalid-feedback">{errors.customer_zip}</div>}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', marginTop: '1.5rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : `Pay $${grandTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Mini Order Summary */}
        <div className="summary-card" style={{ top: '100px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
            Your Items
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '250px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
          </div>

          <div className="summary-row summary-total" style={{ margin: '1rem 0 0', padding: '1rem 0 0' }}>
            <span>Total to pay</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
