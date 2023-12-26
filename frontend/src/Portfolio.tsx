// Portfolio.tsx
import React from 'react';
import { Pane } from 'evergreen-ui';
import Header from './components/common/Header';
import AboutMe from './components/sections/AboutMe';
import Footer from './components/common/Footer';

const Portfolio: React.FC = () => {
  const handleMenuClick = () => {
    // Add your menu click implementation here
    console.log('Menu clicked!');
  };

  return (
    <Pane paddingX={20} paddingY={20}> {/* Adjust the padding values accordingly */}
      <Header onMenuClick={handleMenuClick} />
      <Pane marginTop={20} marginBottom={40}>
        <AboutMe />
      </Pane>
      {/* <Projects /> */}
      <Footer />
    </Pane>
  );
};

export default Portfolio;
