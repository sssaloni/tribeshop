import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    ordersCount: 0,
    productsCount: 0,
    lowStockCount: 0,
    lowStockItems: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders')
        ]);

        const products = productsRes.data.products || [];
        const orders = ordersRes.data.orders || [];

        // Compute sales
        const totalSales = orders.reduce((acc, order) => {
          // Exclude cancelled orders if desired, but sum all for general stats
          if (order.status !== 'Cancelled') {
            return acc + parseFloat(order.total_amount);
          }
          return acc;
        }, 0);

        // Filter low stock
        const lowStockItems = products.filter(p => p.stock_quantity <= 5);

        setMetrics({
          totalSales,
          ordersCount: orders.length,
          productsCount: products.length,
          lowStockCount: lowStockItems.length,
          lowStockItems
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard statistics. Verify that the backend is connected.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

      {/* Main Workspace Dashboard Content */}
      <main className="admin-main">
        <h1 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>Overview Dashboard</h1>

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
          <div>
            <div className="admin-metrics-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="metric-card">
                  <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                  <div className="skeleton skeleton-title" style={{ width: '70%', marginTop: '1rem' }}></div>
                </div>
              ))}
            </div>
            <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: 'var(--radius-md)' }}></div>
          </div>
        ) : (
          !error && (
            <>
              {/* Metrics Grid */}
              <div className="admin-metrics-grid">
                <div className="metric-card">
                  <span className="metric-label">Total Revenue</span>
                  <span className="metric-val" style={{ color: 'var(--success)' }}>
                    ${metrics.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="metric-card">
                  <span className="metric-label">Total Orders</span>
                  <span className="metric-val">{metrics.ordersCount}</span>
                </div>

                <div className="metric-card">
                  <span className="metric-label">Total Products</span>
                  <span className="metric-val">{metrics.productsCount}</span>
                </div>

                <div className="metric-card">
                  <span className="metric-label">Low Stock Warnings</span>
                  <span className="metric-val" style={{ color: metrics.lowStockCount > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
                    {metrics.lowStockCount}
                  </span>
                </div>
              </div>

              {/* Low Stock Warn Warnings Table */}
              <div style={{ marginTop: '1rem' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Inventory Status Warnings</h2>
                
                {metrics.lowStockItems.length === 0 ? (
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    ✓ All products have healthy inventory levels (above 5 units).
                  </div>
                ) : (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Thumbnail</th>
                          <th>Product Name</th>
                          <th>Category</th>
                          <th>Current Stock</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.lowStockItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <img src={item.image_url} alt={item.name} className="admin-table-thumbnail" />
                            </td>
                            <td style={{ fontWeight: 600 }}>{item.name}</td>
                            <td>{item.category}</td>
                            <td style={{ color: item.stock_quantity === 0 ? 'var(--danger)' : 'var(--warning)', fontWeight: 700 }}>
                              {item.stock_quantity === 0 ? 'Out of Stock (0)' : `Low Stock (${item.stock_quantity})`}
                            </td>
                            <td>
                              <Link to="/admin/products" className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
                                Restock Item
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
