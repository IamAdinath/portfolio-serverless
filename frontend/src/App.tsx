import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { apiRetryManager } from './utils/apiRetryManager';
import { analyticsTracker } from './utils/analytics';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AboutMe from './components/sections/AboutMe';
import Portfolio from './Portfolio';
import Resume from './components/sections/Resume';  
import BlogList from './components/sections/BlogList';
import AuthPage from './components/sections/AuthPage';
import WriterPage from './components/sections/WriterPage';
import AdminDashboard from './components/sections/AdminDashboard';
import BlogStats from './components/sections/BlogStats';
import WebAnalytics from './components/sections/WebAnalytics';
import { ToastProvider } from './components/common/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import SecurityConfig from './components/common/SecurityConfig';
import Blog from './components/sections/Blog';

const App: React.FC = () => {
  // Reset API retry manager and initialize analytics on app load
  useEffect(() => {
    apiRetryManager.resetAll();
    
    // Initialize analytics tracking after Router is ready
    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === 'production') {
        analyticsTracker.enable();
      }
    }, 100);
    
    // Register service worker for PWA and performance
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ SW registered: ', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available, notify user
                    console.log('🔄 New content available, please refresh');
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.log('❌ SW registration failed: ', registrationError);
          });
      });
    }
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <SecurityConfig />
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
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/stats/:blogId" element={
              <ProtectedRoute>
                <BlogStats />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute>
                <WebAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/blog/:blogId" element={<Blog />} />
          </Routes>
          <Footer />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;