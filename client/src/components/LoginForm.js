import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background" aria-hidden="true">
        <span>📷</span>
        <span>▶️</span>
        <span>𝕏</span>
        <span>📱</span>
        <span>🎬</span>
        <span>📊</span>
        <span>💬</span>
        <span>⭐</span>
      </div>

      <section className="auth-panel auth-panel-brand">
        <div className="auth-brand-wrap">
          <span className="auth-eyebrow">FlipEarn Marketplace</span>
          <h2>Welcome back to your trading desk</h2>
          <p>
            Sign in to manage listings, review incoming offers, and keep your
            creator asset business moving.
          </p>

          <div className="auth-metrics">
            <div className="auth-metric">
              <strong>24/7</strong>
              <span>Offer tracking</span>
            </div>
            <div className="auth-metric">
              <strong>Fast</strong>
              <span>Listing control</span>
            </div>
            <div className="auth-metric">
              <strong>Secure</strong>
              <span>Account access</span>
            </div>
          </div>

          <ul className="auth-feature-list">
            <li><span>01</span> Review your dashboard and active listings in one place.</li>
            <li><span>02</span> Respond to buyer offers and monitor transaction status.</li>
            <li><span>03</span> Grow reputation with verified activity and reviews.</li>
          </ul>
        </div>
      </section>

      <section className="auth-panel auth-panel-form">
        <div className="auth-card">
          <div className="auth-card-header">
            <span className="auth-badge">Member Login</span>
            <h1>Sign In</h1>
            <p>Access your FlipEarn account</p>
          </div>

          {error && (
            <div className="auth-alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-row">
              <label className="auth-checkbox">
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="#" className="auth-inline-link">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn auth-submit"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="auth-footer-text">
              Don't have an account? <Link to="/signup" className="auth-inline-link">Create one</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default LoginForm;
