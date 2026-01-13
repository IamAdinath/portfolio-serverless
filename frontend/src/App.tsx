import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { apiRetryManager } from './utils/apiRetryManager';
import { analyticsTracker } from './utils/analytics';
import { initializePerformanceOptimizations } from './utils/performanceOptimizations';
import { initializeApiDebugging } from './utils/apiDebugger';
import { preloadLCPImage } from './utils/lcpOptimization';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LCPOptimization from './components/common/LCPOptimization';
import { ToastProvider } from './components/common/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import SecurityConfig from './components/common/SecurityConfig';

// Lazy load components to reduce initial bundle size
const Portfolio = lazy(() => import('./Portfolio'));
const AboutMe = lazy(() => import('./components/sections/AboutMe'));
const Resume = lazy(() => import('./components/sections/Resume'));
const BlogList = lazy(() => import('./components/sections/BlogList'));
const Blog = lazy(() => import('./components/sections/Blog'));

// Admin components - only loaded when needed
const AuthPage = lazy(() => import('./components/sections/AuthPage'));
const WriterPage = lazy(() => import('./components/sections/WriterPage'));
const AdminDashboard = lazy(() => import('./components/sections/AdminDashboard'));
const BlogStats = lazy(() => import('./components/sections/BlogStats'));
const WebAnalytics = lazy(() => import('./components/sections/WebAnalytics'));

// Loading component for Suspense fallback
const PageLoader: React.FC = () => (
  <div className="page-loader" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    fontSize: '1.1rem',
    color: '#666'
  }}>
    Loading...
  </div>
);

const App: React.FC = () => {
  // Reset API retry manager and initialize analytics on app load
  useEffect(() => {
    // Preload LCP image as early as possible for better performance
    preloadLCPImage();
    
    // Initialize performance optimizations first
    initializePerformanceOptimizations();
    
    // Initialize API debugging in development
    initializeApiDebugging();
    
    // Initialize bundle optimizations
    const initBundleOptimizations = async () => {
      const { initializeRoutePreloading, optimizeThirdPartyScripts } = await import('./utils/bundleOptimizations');
      initializeRoutePreloading();
      optimizeThirdPartyScripts();
    };
    
    apiRetryManager.resetAll();
    
    // Initialize bundle optimizations after initial render
    setTimeout(initBundleOptimizations, 100);
    
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
      <LCPOptimization />
      <SecurityConfig />
      <AuthProvider>
        <ToastProvider> 
          <Router>
          {/* Skip Navigation Link for Keyboard Users */}
          <a href="#main-content" className="skip-nav-link">
            Skip to main content
          </a>
          <Header />
          <main role="main" id="main-content">
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </main>
          <Footer />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;