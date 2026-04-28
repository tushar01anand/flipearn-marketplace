import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-orbs" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <span className="home-kicker">Creator Asset Exchange</span>
            <h1>Buy and sell social media brands with confidence.</h1>
            <p>
              FlipEarn helps creators and digital investors trade audience-driven
              assets through transparent listings, cleaner discovery, and a
              workflow built around trust.
            </p>

            <div className="home-hero-actions">
              <Link to="/marketplace" className="btn home-primary-btn">
                Explore Marketplace
              </Link>
              <Link to="/signup" className="btn home-secondary-btn">
                Start Selling
              </Link>
            </div>

            <div className="home-proof-strip">
              <div>
                <strong>25K+</strong>
                <span>Listed assets</span>
              </div>
              <div>
                <strong>$1.2B+</strong>
                <span>Total volume</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>Verified sellers</span>
              </div>
            </div>
          </div>

          <div className="home-hero-panel">
            <div className="home-hero-card home-hero-card-main">
              <span className="home-card-label">Featured Listing</span>
              <h3>@urbanframes.media</h3>
              <p>Instagram lifestyle account with strong brand-fit and healthy engagement.</p>
              <div className="home-card-metrics">
                <div>
                  <strong>184K</strong>
                  <span>Followers</span>
                </div>
                <div>
                  <strong>4.9%</strong>
                  <span>Engagement</span>
                </div>
                <div>
                  <strong>$28K</strong>
                  <span>Ask Price</span>
                </div>
              </div>
            </div>

            <div className="home-hero-card home-hero-card-accent">
              <span className="home-card-label">Seller Toolkit</span>
              <h4>List, price, and respond faster</h4>
              <p>Stay on top of buyer interest with one place for listings, offers, and reputation-building.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="home-section-heading">
            <span className="home-section-badge">How It Works</span>
            <h2>Move from discovery to ownership without the usual friction</h2>
          </div>

          <div className="home-steps-grid">
            <article className="home-step-card">
              <span className="home-step-number">01</span>
              <h3>Explore</h3>
              <p>Browse listings by platform, category, audience size, and pricing goals.</p>
            </article>
            <article className="home-step-card">
              <span className="home-step-number">02</span>
              <h3>Evaluate</h3>
              <p>Compare engagement quality, seller credibility, and niche alignment before acting.</p>
            </article>
            <article className="home-step-card">
              <span className="home-step-number">03</span>
              <h3>Negotiate</h3>
              <p>Submit offers and manage transaction status through a streamlined dashboard flow.</p>
            </article>
            <article className="home-step-card">
              <span className="home-step-number">04</span>
              <h3>Transfer</h3>
              <p>Close deals with better visibility into the asset and the people behind it.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section home-highlight-section">
        <div className="container home-highlight-grid">
          <div className="home-highlight-copy">
            <span className="home-section-badge">Why FlipEarn</span>
            <h2>Built for digital entrepreneurs, not generic classifieds</h2>
            <p>
              The product combines marketplace search, seller identity, offer
              tracking, and asset-focused listing details into one flow that is
              much easier to understand than informal off-platform deals.
            </p>
          </div>

          <div className="home-feature-stack">
            <div className="home-feature-card">
              <strong>Verified-first mindset</strong>
              <p>Profiles, listing metadata, and admin review patterns support more informed decisions.</p>
            </div>
            <div className="home-feature-card">
              <strong>Investor-friendly browsing</strong>
              <p>Marketplace filters make it easier to spot platform and valuation opportunities quickly.</p>
            </div>
            <div className="home-feature-card">
              <strong>Simple offer workflow</strong>
              <p>Buyers and sellers can move from discovery to negotiation without switching tools.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="home-section-heading">
            <span className="home-section-badge">Social Proof</span>
            <h2>Trusted by creators and operators building online brands</h2>
          </div>

          <div className="home-testimonial-grid">
            <article className="home-testimonial-card">
              <span className="home-rating">★★★★★</span>
              <p>
                FlipEarn took the headache out of acquiring a 200K-follower TikTok brand. The workflow gave me clarity much earlier in the decision.
              </p>
              <strong>Marcus Chen</strong>
              <small>Serial Entrepreneur</small>
            </article>
            <article className="home-testimonial-card">
              <span className="home-rating">★★★★★</span>
              <p>
                Selling my travel channel felt personal, and the platform made the process feel structured instead of chaotic.
              </p>
              <strong>Sarah Jenkins</strong>
              <small>Content Creator</small>
            </article>
            <article className="home-testimonial-card">
              <span className="home-rating">★★★★★</span>
              <p>
                The listing details and transaction flow made it much easier to compare audience quality before committing capital.
              </p>
              <strong>David Rivera</strong>
              <small>Digital Investor</small>
            </article>
          </div>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="container home-cta-card">
          <div>
            <span className="home-section-badge home-section-badge-light">Get Started</span>
            <h2>Turn your audience into an asset, or find the next one to grow.</h2>
            <p>Join the marketplace and start browsing or listing today.</p>
          </div>
          <div className="home-cta-actions">
            <Link to="/signup" className="btn home-cta-primary">
              Create Account
            </Link>
            <Link to="/marketplace" className="btn home-cta-secondary">
              View Listings
            </Link>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container">
          <p>&copy; 2026 FlipEarn. Secure marketplace infrastructure for creator asset deals.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
