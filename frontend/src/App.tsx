// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AboutMe from './components/sections/AboutMe';
import Portfolio from './Portfolio';
import BlogList from './components/sections/BlogList';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <Header onMenuClick={handleMenuClick} />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/blogs" element={<BlogList />} /> {/* Renders BlogList with suggested blogs footer */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
