// Header.tsx
import React, { useEffect, useState } from 'react';
import { Pane, IconButton, Text, Menu, Popover } from 'evergreen-ui';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLinkClick = (path: string) => {
    navigate(path);
    onMenuClick(); // Close the menu after navigating
  };

  return (
    <Pane
      display="flex"
      padding={16}
      background="darkTint"
      boxShadow="0 0 4px rgba(0, 0, 0, 0.1)"
      alignItems="center"
      justifyContent="center"
    >
      {/* Regular Menu for Larger Screens */}
      {isSmallScreen ? (
        <Popover
          position="bottom-left"
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item onClick={() => handleLinkClick('/') }>Home</Menu.Item>
                <Menu.Item onClick={() => handleLinkClick('/about') }>About</Menu.Item>
                <Menu.Item onClick={() => handleLinkClick('/resume')}>Resume</Menu.Item>
                <Menu.Item onClick={() => handleLinkClick('/blogs')}>Blogs</Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <IconButton icon="menu" onClick={onMenuClick} />
        </Popover>
      ) : (
        <Pane display="flex" alignItems="center">
          <Link to="/">
            <Text size={500} marginRight={16}>Home</Text>
          </Link>
          <Link to="/about">
            <Text size={500} marginRight={16}>About</Text>
          </Link>
          <Link to="/resume">
            <Text size={500} marginRight={16}>Resume</Text>
          </Link>
          <Link to="/blogs">
            <Text size={500} marginRight={16}>Blogs</Text>
          </Link>
        </Pane>
      )}
    </Pane>
  );
};

export default Header;
