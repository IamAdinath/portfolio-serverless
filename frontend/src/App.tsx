// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer'
import AboutMe from './components/sections/AboutMe';
import Portfolio from './Portfolio';
// import Contact from './Contact';
// import Resume from './Resume';


const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <Header onMenuClick={handleMenuClick}/>
      <Routes>
      <Route path="/" element={<Portfolio />} />
        <Route path="/about" element={<AboutMe />} />
        {/* <Route path="/contact" element={<Contact />} />
        <Route path="/resume" element={<Resume />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
