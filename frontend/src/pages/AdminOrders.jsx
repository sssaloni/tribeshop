import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import api from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      if (response.data && response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve orders. Verify that the server and database are online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'badge badge-pending';
      case 'Processing': return 'badge badge-processing';
      case 'Shipped': return 'badge badge-shipped';
      case 'Completed': return 'badge badge-shipped'; // Reuse green style
      case 'Cancelled': return 'badge badge-cancelled';
      default: return 'badge';
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', paddingLeft: '1.2rem' }}>
          Navigation
        </h3>
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "admin-sidebar-link active" : "admin-sidebar-link"}>
          📈 Overview Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => isActive ? "admin-sidebar-link active" : "admin-sidebar-link"}>
          📦 Manage Products
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "admin-sidebar-link active" : "admin-sidebar-link"}>
          🧾 Customer Orders
        </NavLink>
        
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <Link to="/" className="admin-sidebar-link" style={{ color: 'var(--text-muted)' }}>
            ← Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Workspace Workspace Content */}
      <main className="admin-main">
        <h1 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>Customer Orders</h1>

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

        {loading ? (
          <div className="skeleton" style={{ height: '350px', borderRadius: 'var(--radius-md)' }}></div>
        ) : (
          !error && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer Details</th>
                    <th>Address</th>
                    <th>Ordered Items</th>
                    <th>Total Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        No orders recorded yet. Start sharing your catalog with clients!
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 700 }}>#{order.id}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(order.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.customer_email}</div>
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>
                          <div>{order.customer_address}</div>
                          <div>{order.customer_city}, {order.customer_zip}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                            {order.items && order.items.map((item, idx) => (
                              <div key={idx} style={{ color: 'var(--text-secondary)' }}>
                                • <strong>{item.product_name || 'Removed Product'}</strong> x {item.quantity}{' '}
                                <span style={{ fontSize: '0.75rem' }}>(${parseFloat(item.price_at_purchase).toFixed(2)})</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(order.status)}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default AdminOrders;
