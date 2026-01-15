/**
 * LCP (Largest Contentful Paint) Optimization Utilities
 * Helps improve Core Web Vitals by optimizing the loading of LCP elements
 */

import logoAsset from '../assets/logo.png';

/**
 * Preload the LCP image as early as possible
 * Disabled to avoid preload warnings - using CSS-based logo instead
 */
export const preloadLCPImage = (): void => {
  // Disabled - using CSS-based InitialsLogo component instead of image
  // No image preloading needed
  return;
};

/**
 * Optimize image loading for LCP
 * Returns optimized image attributes for the LCP image
 */
export const getLCPImageAttributes = () => ({
  loading: 'eager' as const,
  fetchPriority: 'high',
  decoding: 'sync' as const,
});

/**
 * Check if the current page is likely to have the logo as LCP
 * This can be used to conditionally apply optimizations
 */
export const isLogoLikelyLCP = (): boolean => {
  // Logo is LCP on the home page
  return window.location.pathname === '/' || window.location.pathname === '';
};