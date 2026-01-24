import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout-content" role="main" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
