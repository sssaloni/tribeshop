import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import api from '../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means "Add Product" mode

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Electronics',
    stock_quantity: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      if (response.data && response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve product list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: 'Electronics',
      stock_quantity: ''
    });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
      category: product.category,
      stock_quantity: product.stock_quantity.toString()
    });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = 'Price must be a positive number';
    }
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (formData.stock_quantity === '' || isNaN(Number(formData.stock_quantity)) || Number(formData.stock_quantity) < 0) {
      errors.stock_quantity = 'Stock quantity must be a non-negative integer';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity, 10)
    };

    try {
      if (editingProduct) {
        // Edit Mode
        const response = await api.put(`/products/${editingProduct.id}`, payload);
        if (response.data && response.data.success) {
          setIsModalOpen(false);
          fetchProducts();
          alert('Product updated successfully!');
        }
      } else {
        // Add Mode
        const response = await api.post('/products', payload);
        if (response.data && response.data.success) {
          setIsModalOpen(false);
          fetchProducts();
          alert('Product added successfully!');
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error processing product write request');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.delete(`/products/${productId}`);
      if (response.data && response.data.success) {
        fetchProducts();
        alert('Product deleted successfully');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete product');
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

      {/* Main Content Workspace */}
      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem' }}>Manage Products</h1>
          <button onClick={openAddModal} className="btn btn-primary">
            + Add New Product
          </button>
        </div>

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
          <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }}></div>
        ) : (
          !error && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>In Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        No products inside database. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img src={item.image_url} alt={item.name} className="admin-table-thumbnail" />
                        </td>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td>{item.category}</td>
                        <td style={{ fontWeight: 700 }}>${parseFloat(item.price).toFixed(2)}</td>
                        <td style={{
                          color: item.stock_quantity === 0 ? 'var(--danger)' : item.stock_quantity <= 5 ? 'var(--warning)' : 'var(--success)',
                          fontWeight: 700
                        }}>
                          {item.stock_quantity}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => openEditModal(item)}
                              className="btn btn-secondary"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="btn btn-danger"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                            >
                              Delete
                            </button>
                          </div>
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

      {/* Modal Form Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingProduct ? 'Edit Product details' : 'Add New Product'}</h2>
              <span className="modal-close" onClick={() => setIsModalOpen(false)}>×</span>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Premium Sports Watch"
                />
                {validationErrors.name && <div className="invalid-feedback">{validationErrors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Detailed description of the product capabilities..."
                  rows="3"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="99.99"
                  />
                  {validationErrors.price && <div className="invalid-feedback">{validationErrors.price}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="stock_quantity">Stock Count</label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="20"
                  />
                  {validationErrors.stock_quantity && <div className="invalid-feedback">{validationErrors.stock_quantity}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home">Home</option>
                </select>
                {validationErrors.category && <div className="invalid-feedback">{validationErrors.category}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label" htmlFor="image_url">Product Image URL</label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
