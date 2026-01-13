/**
 * Performance optimization utilities for better LCP and resource loading
 * Now includes CSS optimization
 */

import { initializeCSSOptimization } from './cssLoader';

/**
 * Add preconnect link for API domain to improve connection speed
 */
export const addApiPreconnect = (): void => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  
  if (!apiBaseUrl) {
    return;
  }

  try {
    const url = new URL(apiBaseUrl);
    const domain = url.origin;

    // Check if preconnect already exists
    const existingPreconnect = document.querySelector(`link[rel="preconnect"][href="${domain}"]`);
    if (existingPreconnect) {
      return;
    }

    // Add preconnect for API domain
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = domain;
    preconnectLink.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink);

    // Add DNS prefetch as fallback
    const dnsPrefetchLink = document.createElement('link');
    dnsPrefetchLink.rel = 'dns-prefetch';
    dnsPrefetchLink.href = `//${url.hostname}`;
    document.head.appendChild(dnsPrefetchLink);

    console.log(`Added preconnect for API domain: ${domain}`);
  } catch (error) {
    console.warn('Failed to add API preconnect:', error);
  }
};

/**
 * Preload critical API endpoints for better performance
 */
export const preloadCriticalEndpoints = (): void => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  
  if (!apiBaseUrl) {
    return;
  }

  const criticalEndpoints = [
    '/get-media?type=profile',
    '/get-blogs'
  ];

  criticalEndpoints.forEach(endpoint => {
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = `${apiBaseUrl}${endpoint}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    } catch (error) {
      console.warn(`Failed to preload endpoint ${endpoint}:`, error);
    }
  });
};

/**
 * Add resource hints for better navigation performance
 */
export const addResourceHints = (): void => {
  const routes = ['/about', '/blogs', '/resume'];
  
  routes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
};

/**
 * Optimize CSS loading and delivery
 */
export const optimizeCSSDelivery = (): void => {
  // Initialize CSS lazy loading
  initializeCSSOptimization();
  
  // Preload critical CSS
  const criticalCSS = [
    '/css/critical.css',
    '/css/variables.css',
    '/css/utilities.css'
  ];
  
  criticalCSS.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
  
  // Remove unused CSS after page load
  setTimeout(() => {
    removeUnusedCSS();
  }, 2000);
};

/**
 * Remove unused CSS classes and rules
 */
const removeUnusedCSS = (): void => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  
  // This would integrate with a CSS purging solution
  const unusedSelectors = [
    '.fa-spin:not(.loading)',
    '.fa-pulse:not(.heartbeat)',
    '.debug-*',
    '.test-*'
  ];
  
  console.log('Would remove unused CSS selectors:', unusedSelectors.length);
};

/**
 * Optimize font loading
 */
export const optimizeFontLoading = (): void => {
  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
  ];
  
  criticalFonts.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // Use font-display: swap for better performance
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = (): void => {
  // Add API preconnect immediately
  addApiPreconnect();
  
  // Optimize CSS delivery
  optimizeCSSDelivery();
  
  // Optimize font loading
  optimizeFontLoading();
  
  // Preload critical endpoints after a short delay to avoid blocking initial render
  setTimeout(() => {
    preloadCriticalEndpoints();
  }, 100);
  
  // Add resource hints after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addResourceHints);
  } else {
    addResourceHints();
  }
};