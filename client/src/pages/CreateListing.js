import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CreateListingForm from '../components/CreateListingForm';

function CreateListing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="create-listing-page">
      <section className="create-listing-hero">
        <div className="create-listing-hero-bg" aria-hidden="true">
          <span>📱</span>
          <span>📈</span>
          <span>💼</span>
          <span>🎬</span>
          <span>⭐</span>
          <span>💬</span>
        </div>
        <div className="container create-listing-hero-inner">
          <div className="create-listing-copy">
            <span className="create-listing-kicker">Seller Workspace</span>
            <h1>Create a listing buyers can trust at a glance</h1>
            <p>
              Share the platform, audience quality, pricing, and story behind
              your account so serious buyers can evaluate it quickly.
            </p>

            <div className="create-listing-points">
              <div>
                <strong>Clear metrics</strong>
                <span>Followers, engagement, and niche positioning</span>
              </div>
              <div>
                <strong>Better pricing</strong>
                <span>Set an ask and compare it against estimated value</span>
              </div>
              <div>
                <strong>Faster offers</strong>
                <span>Good descriptions reduce buyer hesitation</span>
              </div>
            </div>
          </div>

          <div className="create-listing-aside-card">
            <span className="create-listing-badge">Listing Checklist</span>
            <h2>Before you publish</h2>
            <ul className="create-listing-checklist">
              <li>Use the exact handle buyers will recognize immediately.</li>
              <li>Include honest audience and engagement data.</li>
              <li>Add a description that explains monetization or growth upside.</li>
              <li>Price the asset close to its current performance reality.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="create-listing-form-section">
        <div className="container">
          <CreateListingForm />
        </div>
      </section>
    </div>
  );
}

export default CreateListing;
