// src/components/common/Header.tsx
import React from 'react';
import { Pane, IconButton, Text, Menu, Popover, TickIcon } from 'evergreen-ui';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Resume', path: '/resume' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Login', path: '/auth' },
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

  const renderNavLinks = (isMenu: boolean = false) => {
    return navLinks.map((link) => {
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
        </Pane>
      )}
    </Pane>
  );
};

export default Header;