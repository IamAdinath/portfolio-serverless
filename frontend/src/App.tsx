import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AboutMe from './components/sections/AboutMe';
import Portfolio from './Portfolio';
import Resume from './components/sections/Resume';  
import BlogList from './components/sections/BlogList';
import AuthPage from './components/sections/AuthPage';
import WriterPage from './components/sections/WriterPage';
import { ToastProvider } from './components/common/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Blog from './components/sections/Blog';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider> 
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/about" element={<AboutMe />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/writer" element={
              <ProtectedRoute>
                <WriterPage />
              </ProtectedRoute>
            } />
            <Route path="/blog/:blogId" element={<Blog />} />
          </Routes>
          <Footer />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;