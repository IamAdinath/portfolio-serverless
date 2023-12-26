// Header.tsx
import React, { useEffect, useState } from 'react';
import { Pane, IconButton, Text, Menu, Popover, Image } from 'evergreen-ui';

import logo from '../../assets/apple-touch-icon.png'; // Update the path based on your project structure

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

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

  return (
    <Pane
      display="flex"
      padding={16}
      background="darkTint"
      boxShadow="0 0 4px rgba(0, 0, 0, 0.1)"
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Regular Menu for Larger Screens */}
      {isSmallScreen ? (
        <Popover
          position="bottom-left"
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item>Home</Menu.Item>
                <Menu.Item>About</Menu.Item>
                <Menu.Item>Services</Menu.Item>
                <Menu.Item>Contact</Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <IconButton icon="menu" onClick={onMenuClick} />
        </Popover>
      ) : (
        <Pane display="flex" alignItems="center">
          <Text size={500} marginRight={16}>
            Home
          </Text>
          <Text size={500} marginRight={16}>
            About
          </Text>
          <Text size={500} marginRight={16}>
            Services
          </Text>
          <Text size={500}>Contact</Text>
        </Pane>
      )}

      {/* Use the imported logo */}
      <Image src={logo} alt="Logo" width={60} height={60} />
    </Pane>
  );
};

export default Header;
