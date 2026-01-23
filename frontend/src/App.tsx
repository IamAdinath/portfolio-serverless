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
import CriticalCSSLoader from './components/common/CriticalCSSLoader';
import PerformanceMonitor from './components/common/PerformanceMonitor';
import MobileLayoutOptimizer from './components/common/MobileLayoutOptimizer';
import ResponsiveSync from './components/common/ResponsiveSync';
import { ToastProvider } from './components/common/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import SecurityConfig from './components/common/SecurityConfig';

// Lazy load components with retry logic
const lazyWithRetry = (componentImport: () => Promise<any>) => 
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );
    
    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }
      throw error;
    }
  });

const HomePage = lazyWithRetry(() => import('./HomePage'));
const AboutPage = lazyWithRetry(() => import('./components/sections/AboutPage'));
const ResumePage = lazyWithRetry(() => import('./components/sections/ResumePage'));
const BlogListPage = lazyWithRetry(() => import('./components/sections/BlogListPage'));
const BlogDetailPage = lazyWithRetry(() => import('./components/sections/BlogDetailPage'));

// Admin components - only loaded when needed
const LoginPage = lazyWithRetry(() => import('./components/sections/LoginPage'));
const BlogEditorPage = lazyWithRetry(() => import('./components/sections/BlogEditorPage'));
const AdminDashboardPage = lazyWithRetry(() => import('./components/sections/AdminDashboardPage'));
const BlogStatsPage = lazyWithRetry(() => import('./components/sections/BlogStatsPage'));
const AnalyticsPage = lazyWithRetry(() => import('./components/sections/AnalyticsPage'));

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
    
    apiRetryManager.resetAll();
    
    // Initialize analytics tracking after Router is ready
    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === 'production') {
        analyticsTracker.enable();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <LCPOptimization />
      <CriticalCSSLoader />
      <PerformanceMonitor />
      <SecurityConfig />
      <MobileLayoutOptimizer />
      <ResponsiveSync />
      <AuthProvider>
        <ToastProvider> 
          <Router>
            <div className="app-container">
              <Header />
              <main className="main-content" role="main" id="main-content">
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
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;