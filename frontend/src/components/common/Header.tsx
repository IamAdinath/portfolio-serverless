// src/components/common/Header.tsx
import React from 'react';
import { Pane, IconButton, Text, Menu, Popover, TickIcon } from 'evergreen-ui';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Combine nav links based on auth status
  const navLinks = [
    ...publicNavLinks,
    ...(isAuthenticated ? authNavLinks : []),
    ...(isAuthenticated ? [] : [{ label: 'Login', path: '/auth' }]),
  ];

  const renderNavLinks = (isMenu: boolean = false) => {
    const links = navLinks.map((link) => {
      const isActive = location.pathname === link.path;

      if (isMenu) {
        return (
          <Menu.Item
            key={link.path}
            onSelect={() => navigate(link.path)}
            icon={isActive ? <TickIcon color="success" /> : undefined}
            style={{ fontWeight: isActive ? 600 : 400 }}
          >
            {link.label}
          </Menu.Item>
        );
      }

      return (
        <Link
          key={link.path}
          to={link.path}
          className={`nav-link ${isActive ? 'active' : ''}`}
        >
          {link.label}
        </Link>
      );
    });

    // Add logout option for authenticated users
    if (isAuthenticated && isMenu) {
      links.push(
        <Menu.Item
          key="logout"
          onSelect={() => logout()}
          intent="danger"
        >
          Logout ({user?.username})
        </Menu.Item>
      );
    }

    return links;
  };

  return (
    <Pane
      is="header"
      className="app-header"
      display="flex"
      paddingX={24}
      paddingY={16}
      background="white"
      borderBottom="1px solid #EAEAEA"
      alignItems="center"
      justifyContent="space-between"
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Text fontWeight={600} fontSize="18px" color="neutral">
          AG
        </Text>
      </Link>

      {isSmallScreen ? (
        <Popover
          position="bottom-right"
          content={
            <Menu>
              <Menu.Group>{renderNavLinks(true)}</Menu.Group>
            </Menu>
          }
        >

          <IconButton icon="menu" height={32} />
        </Popover>
      ) : (
        <Pane is="nav" display="flex" alignItems="center" gap="2rem">
          {renderNavLinks(false)}
          {isAuthenticated && (
            <Pane display="flex" alignItems="center" gap="1rem">
              <Text fontSize="14px" color="muted">
                {user?.username}
              </Text>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: '1px solid #ccc',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Logout
              </button>
            </Pane>
          )}
        </Pane>
      )}
    </Pane>
  );
};

export default Header;