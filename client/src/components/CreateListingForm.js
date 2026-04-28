import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function CreateListingForm() {
  const [formData, setFormData] = useState({
    platform: 'Instagram',
    username: '',
    followers: '',
    engagementRate: '',
    category: '',
    askingPrice: '',
    description: '',
    estimatedValue: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const listingPreview = {
    platform: formData.platform || 'Instagram',
    username: formData.username || '@yourusername',
    followers: formData.followers || '0',
    engagementRate: formData.engagementRate || '0',
    category: formData.category || 'General',
    askingPrice: formData.askingPrice || '0',
    estimatedValue: formData.estimatedValue || '0',
    description:
      formData.description ||
      'Describe the audience, content style, monetization history, and why this asset is valuable.',
  };

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
      await api.post('/listings', {
        ...formData,
        followers: parseInt(formData.followers),
        engagementRate: parseFloat(formData.engagementRate),
        askingPrice: parseFloat(formData.askingPrice),
        estimatedValue: parseFloat(formData.estimatedValue),
      }, {
        headers: { 'x-user-id': user.id }
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-layout">
      <form onSubmit={handleSubmit} className="create-listing-form-card">
        <div className="create-listing-form-header">
          <div>
            <span className="create-listing-badge">Listing Details</span>
            <h2>Build your seller profile</h2>
            <p>Fill in the details below so buyers can evaluate the opportunity with confidence.</p>
          </div>
        </div>

        {error && <div className="create-listing-alert">{error}</div>}

        <div className="create-listing-section">
          <div className="create-listing-section-title">
            <h3>Account Basics</h3>
            <p>Start with the platform and handle buyers will search for.</p>
          </div>

          <div className="create-listing-grid">
            <div className="form-group">
              <label>Platform *</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
              >
                <option>Instagram</option>
                <option>TikTok</option>
                <option>YouTube</option>
                <option>Twitter</option>
              </select>
            </div>

            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                placeholder="@yourusername"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="create-listing-section">
          <div className="create-listing-section-title">
            <h3>Performance Metrics</h3>
            <p>These numbers help buyers understand audience scale and quality.</p>
          </div>

          <div className="create-listing-grid create-listing-grid-3">
            <div className="form-group">
              <label>Followers</label>
              <input
                type="number"
                name="followers"
                placeholder="e.g. 50000"
                value={formData.followers}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Engagement Rate (%)</label>
              <input
                type="number"
                name="engagementRate"
                placeholder="e.g. 4.2"
                value={formData.engagementRate}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Luxury Lifestyle"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="create-listing-section">
          <div className="create-listing-section-title">
            <h3>Pricing Strategy</h3>
            <p>Set your target price and give buyers context for how you value the asset.</p>
          </div>

          <div className="create-listing-grid">
            <div className="form-group">
              <label>Asking Price (USD) *</label>
              <input
                type="number"
                name="askingPrice"
                placeholder="e.g. 5000"
                value={formData.askingPrice}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Estimated Value (USD)</label>
              <input
                type="number"
                name="estimatedValue"
                placeholder="e.g. 6000"
                value={formData.estimatedValue}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="create-listing-section">
          <div className="create-listing-section-title">
            <h3>Seller Notes</h3>
            <p>Tell the story behind the asset, its audience, and its future upside.</p>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe your audience, monetization history, brand fit, content style, and growth potential..."
              value={formData.description}
              onChange={handleChange}
              className="create-listing-textarea"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn create-listing-submit-btn">
          {loading ? 'Creating Listing...' : 'Publish Listing'}
        </button>
      </form>

      <aside className="create-listing-preview-card">
        <div className="create-listing-preview-header">
          <span className="create-listing-badge">Live Preview</span>
          <h3>Your listing snapshot</h3>
          <p>This is the kind of summary a buyer will scan first.</p>
        </div>

        <div className="create-listing-preview-top">
          <span className="create-listing-platform-pill">{listingPreview.platform}</span>
          <span className="create-listing-category-pill">{listingPreview.category}</span>
        </div>

        <h4>{listingPreview.username}</h4>

        <div className="create-listing-preview-price">
          <strong>${listingPreview.askingPrice}</strong>
          <span>Asking price</span>
        </div>

        <div className="create-listing-preview-metrics">
          <div>
            <span>Followers</span>
            <strong>{listingPreview.followers}</strong>
          </div>
          <div>
            <span>Engagement</span>
            <strong>{listingPreview.engagementRate}%</strong>
          </div>
          <div>
            <span>Estimated Value</span>
            <strong>${listingPreview.estimatedValue}</strong>
          </div>
        </div>

        <p className="create-listing-preview-description">
          {listingPreview.description}
        </p>
      </aside>
    </div>
  );
}

export default CreateListingForm;
