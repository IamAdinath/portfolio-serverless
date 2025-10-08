// src/components/common/Header.tsx - Modern Portfolio Header
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt, faPen } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const publicNavLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Resume', path: '/resume' },
  { label: 'Blogs', path: '/blogs' },
];

const authNavLinks = [
  { label: 'Write', path: '/writer' },
];

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(window.matchMedia(query).matches);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Combine nav links based on auth status
  const navLinks = [
    ...publicNavLinks,
    ...(isAuthenticated ? authNavLinks : []),
    ...(isAuthenticated ? [] : [{ label: 'Login', path: '/auth' }]),
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-text">
            <span className="logo-initials">AG</span>
            <span className="logo-name">Adinath Gore</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div className="nav-links">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.path === '/writer' && <FontAwesomeIcon icon={faPen} />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Info (Desktop) */}
          {isAuthenticated && (
            <div className="user-section">
              <div className="user-info">
                <FontAwesomeIcon icon={faUser} className="user-icon" />
                <span className="username">{user?.username}</span>
              </div>
              <button onClick={logout} className="logout-btn" title="Logout">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                {link.path === '/writer' && <FontAwesomeIcon icon={faPen} />}
                {link.label}
              </button>
            );
          })}
          
          {isAuthenticated && (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <FontAwesomeIcon icon={faUser} />
                <span>{user?.username}</span>
              </div>
              <button onClick={handleLogout} className="mobile-logout-btn">
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;