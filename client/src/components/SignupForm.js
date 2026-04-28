import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'both',
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
      const response = await api.post('/auth/signup', formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
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
        <span>💼</span>
        <span>📈</span>
        <span>🛡️</span>
      </div>

      <section className="auth-panel auth-panel-brand">
        <div className="auth-brand-wrap">
          <span className="auth-eyebrow">Start Selling Smarter</span>
          <h2>Join a marketplace built for digital asset deals</h2>
          <p>
            Create your FlipEarn account to buy channels, list assets, and grow
            in a marketplace designed around trust and momentum.
          </p>

          <div className="auth-metrics">
            <div className="auth-metric">
              <strong>Verified</strong>
              <span>Seller profiles</span>
            </div>
            <div className="auth-metric">
              <strong>Flexible</strong>
              <span>Buyer or seller roles</span>
            </div>
            <div className="auth-metric">
              <strong>Live</strong>
              <span>Offer management</span>
            </div>
          </div>

          <ul className="auth-feature-list">
            <li><span>01</span> Publish listings with pricing, followers, and engagement metrics.</li>
            <li><span>02</span> Receive and manage offers from interested buyers.</li>
            <li><span>03</span> Build social proof through completed deals and reviews.</li>
          </ul>
        </div>
      </section>

      <section className="auth-panel auth-panel-form">
        <div className="auth-card">
          <div className="auth-card-header">
            <span className="auth-badge">New Account</span>
            <h1>Create Account</h1>
            <p>Start your journey in digital asset trading</p>
          </div>

          {error && (
            <div className="auth-alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-grid">
              <div className="form-group auth-compact-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group auth-compact-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

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

            <div className="form-group">
              <label>I am a... *</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                <option value="buyer">Buyer Only</option>
                <option value="seller">Seller Only</option>
                <option value="both">Both Buyer & Seller</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn auth-submit"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-footer-text">
              Already have an account? <Link to="/login" className="auth-inline-link">Sign in</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default SignupForm;
