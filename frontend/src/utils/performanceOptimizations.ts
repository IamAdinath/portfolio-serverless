/**
 * Performance optimization utilities for better LCP and resource loading
 */

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
 * Disabled to avoid preload warnings - endpoints are loaded on-demand
 */
export const preloadCriticalEndpoints = (): void => {
  // Disabled - causing preload warnings
  // API endpoints are now loaded on-demand when needed
  return;
};

/**
 * Add resource hints for better navigation performance
 * Disabled - React Router handles code splitting and lazy loading
 */
export const addResourceHints = (): void => {
  // Disabled - not needed with React Router lazy loading
  return;
};

/**
 * Optimize CSS loading and delivery
 * Disabled - CSS is bundled and optimized by build process
 */
export const optimizeCSSDelivery = (): void => {
  // Disabled - CSS optimization handled by build process
  return;
};

/**
 * Optimize font loading
 */
export const optimizeFontLoading = (): void => {
  // Font preloading disabled - fonts are loaded via Google Fonts CSS
  // which handles optimization automatically
  return;
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = (): void => {
  // Add API preconnect immediately
  addApiPreconnect();
};