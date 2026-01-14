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
const HomePage = lazy(() => import('./HomePage'));
const AboutPage = lazy(() => import('./components/sections/AboutPage'));
const ResumePage = lazy(() => import('./components/sections/ResumePage'));
const BlogListPage = lazy(() => import('./components/sections/BlogListPage'));
const BlogDetailPage = lazy(() => import('./components/sections/BlogDetailPage'));

// Admin components - only loaded when needed
const LoginPage = lazy(() => import('./components/sections/LoginPage'));
const BlogEditorPage = lazy(() => import('./components/sections/BlogEditorPage'));
const AdminDashboardPage = lazy(() => import('./components/sections/AdminDashboardPage'));
const BlogStatsPage = lazy(() => import('./components/sections/BlogStatsPage'));
const AnalyticsPage = lazy(() => import('./components/sections/AnalyticsPage'));

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
          <Header />
          <main role="main" id="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blogs" element={<BlogListPage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/auth" element={<LoginPage />} />
                <Route path="/writer" element={
                  <ProtectedRoute>
                    <BlogEditorPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/stats/:blogId" element={
                  <ProtectedRoute>
                    <BlogStatsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } />
                <Route path="/blog/:blogId" element={<BlogDetailPage />} />
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