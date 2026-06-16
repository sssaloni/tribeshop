import React from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const orderId = searchParams.get('orderId') || location.state?.orderId || 'TS-92381';
  const customerName = location.state?.customerName || 'Customer';
  const totalAmount = location.state?.totalAmount;
  const email = location.state?.email || 'your email';

  return (
    <div className="catalog-layout">
      <div className="success-card">
        <div className="success-icon-wrapper">✓</div>
        
        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-desc">
          Thank you for shopping at TribeShop, <strong>{customerName}</strong>. Your payment was processed successfully.
        </p>

        <div className="success-details">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Order ID:</span>
            <strong style={{ color: 'var(--text-primary)' }}>#{orderId}</strong>
          </div>
          
          {totalAmount !== undefined && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Paid:</span>
              <strong style={{ color: 'var(--text-primary)' }}>${parseFloat(totalAmount).toFixed(2)}</strong>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Receipt Sent To:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem', lineHeight: '1.5' }}>
          We will send you a shipping confirmation email with a tracking number as soon as your premium items are dispatched from our warehouse (usually within 24 hours).
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link to="/" className="btn btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
