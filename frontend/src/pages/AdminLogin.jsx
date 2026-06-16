import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/admin/login', { username, password });
      if (response.data && response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
        
        // Force refresh or trigger navigation
        navigate('/admin/dashboard');
        window.location.reload(); // Reload to refresh navbar admin status
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Login failed. Please verify credentials and ensure the server is online.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-layout" style={{ maxWidth: '480px', marginTop: '6rem' }}>
      <form onSubmit={handleLogin} className="form-card" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>▲</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>TribeShop Admin Area</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Enter credential details to access system dashboard
          </p>
        </div>

        {error && (
          <div className="alert-banner" style={{ padding: '0.8rem 1.2rem', fontSize: '0.85rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            placeholder="admin"
            autoComplete="username"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', height: '46px' }}
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Default setup credentials:<br />
            Username: <code style={{ color: 'var(--text-secondary)' }}>admin</code> | Password: <code style={{ color: 'var(--text-secondary)' }}>adminpassword123</code>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
