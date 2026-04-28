import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="site-nav">
      <div className="site-nav-inner">
        <Link to="/" className="site-brand">
          <span className="site-brand-mark">
            <img src="/logo.svg" alt="FlipEarn" />
          </span>
          <span className="site-brand-copy">
            <strong>FlipEarn</strong>
            <small>Digital asset marketplace</small>
          </span>
        </Link>

        <div className="site-nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
          >
            Explore
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/create-listing"
                className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
              >
                Sell
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/transactions"
                className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
              >
                Offers
              </NavLink>
              {user.userType === 'admin' && (
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
                  >
                    Admin Dashboard
                  </NavLink>
                  <NavLink
                    to="/admin/disputes"
                    className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
                  >
                    Disputes
                  </NavLink>
                </>
              )}
            </>
          ) : null}
        </div>

        <div className="site-nav-actions">
          {user ? (
            <>
              <div className="site-user-chip">
                <span className="site-user-dot" />
                <span>{user.email}</span>
              </div>
              <button onClick={handleLogout} className="site-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
              >
                Login
              </NavLink>
              <Link to="/signup" className="site-signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;