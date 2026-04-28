import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (searchVal = '', platformVal = '', minVal = '', maxVal = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchVal) params.append('search', searchVal);
      if (platformVal) params.append('platform', platformVal);
      if (minVal) params.append('minPrice', minVal);
      if (maxVal) params.append('maxPrice', maxVal);

      const response = await api.get(`/listings?${params.toString()}`);
      setListings(response.data);
    } catch (err) {
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(search, platform, minPrice, maxPrice);
  };

  const handleReset = () => {
    setSearch('');
    setPlatform('');
    setMinPrice('');
    setMaxPrice('');
    fetchListings('', '', '', '');
  };

  if (loading) {
    return (
      <div className="marketplace-state">
        <div className="marketplace-state-card">
          <div className="marketplace-spinner" />
          <h2>Loading marketplace</h2>
          <p>Pulling in active listings, pricing, and platform filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace-page">
      <section className="marketplace-hero">
        <div className="marketplace-hero-bg" aria-hidden="true">
          <span>📷</span>
          <span>🎬</span>
          <span>📈</span>
          <span>💼</span>
          <span>▶️</span>
          <span>⭐</span>
        </div>
        <div className="container marketplace-hero-inner">
          <div className="marketplace-hero-copy">
            <span className="marketplace-kicker">Live Listings</span>
            <h1>Explore creator assets with real momentum</h1>
            <p>
              Browse social accounts by platform, valuation, and niche to find
              acquisition-ready listings that match your growth strategy.
            </p>

            <div className="marketplace-hero-stats">
              <div>
                <strong>{listings.length}</strong>
                <span>Active results</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Platforms</span>
              </div>
              <div>
                <strong>Fast</strong>
                <span>Offer workflow</span>
              </div>
            </div>
          </div>

          <div className="marketplace-filter-card">
            <div className="marketplace-filter-header">
              <div>
                <span className="marketplace-filter-badge">Smart Filters</span>
                <h2>Refine your search</h2>
              </div>
              <Link to="/create-listing" className="btn marketplace-create-btn">
                + Create Listing
              </Link>
            </div>

            <form onSubmit={handleSearch}>
              <div className="marketplace-filter-grid">
                <div className="form-group marketplace-form-group">
                  <label>Search</label>
                  <input
                    type="text"
                    placeholder="Username or category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="form-group marketplace-form-group">
                  <label>Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  >
                    <option value="">All Platforms</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>Twitter</option>
                  </select>
                </div>

                <div className="form-group marketplace-form-group">
                  <label>Min Price</label>
                  <input
                    type="number"
                    placeholder="500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>

                <div className="form-group marketplace-form-group">
                  <label>Max Price</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="marketplace-filter-actions">
                <button type="submit" className="btn marketplace-search-btn">
                  Search Listings
                </button>
                <button type="button" onClick={handleReset} className="btn marketplace-reset-btn">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="marketplace-results-section">
        <div className="container">
          <div className="marketplace-results-header">
            <div>
              <span className="marketplace-results-label">Marketplace Results</span>
              <h2>{listings.length} listings ready to review</h2>
            </div>
            <p>
              Compare audience size, engagement quality, category fit, and price
              before opening the full listing details.
            </p>
          </div>

          {error && (
            <div className="marketplace-error-banner">
              {error}
            </div>
          )}

          {listings.length === 0 ? (
            <div className="marketplace-empty-state">
              <div className="marketplace-empty-visual">🔎</div>
              <h3>No listings matched your filters</h3>
              <p>
                Try widening your budget, clearing the platform filter, or
                resetting the search to view more opportunities.
              </p>
              <button type="button" onClick={handleReset} className="btn marketplace-reset-btn">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="marketplace-grid">
              {listings.map((listing) => (
                <article key={listing.id} className="marketplace-card">
                  <div className="marketplace-card-top">
                    <span className="marketplace-platform-pill">{listing.platform}</span>
                    <span className="marketplace-category-tag">
                      {listing.category || 'General'}
                    </span>
                  </div>

                  <div className="marketplace-card-title-row">
                    <div>
                      <h3>{listing.username}</h3>
                      <p>by {listing.first_name} {listing.last_name}</p>
                    </div>
                    <div className="marketplace-price-chip">
                      <strong>${listing.asking_price}</strong>
                      <span>Asking</span>
                    </div>
                  </div>

                  <div className="marketplace-metric-grid">
                    <div className="marketplace-metric">
                      <span>Followers</span>
                      <strong>{listing.followers?.toLocaleString() || '0'}</strong>
                    </div>
                    <div className="marketplace-metric">
                      <span>Engagement</span>
                      <strong>{listing.engagement_rate || 0}%</strong>
                    </div>
                    <div className="marketplace-metric">
                      <span>Niche</span>
                      <strong>{listing.category || 'General'}</strong>
                    </div>
                  </div>

                  <div className="marketplace-card-footer">
                    <p>
                      Positioned for buyers looking to expand through audience,
                      brand, and category-aligned reach.
                    </p>
                    <Link to={`/listing/${listing.id}`} className="btn marketplace-details-btn">
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Marketplace;
