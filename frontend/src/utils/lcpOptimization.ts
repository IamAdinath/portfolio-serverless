/**
 * LCP (Largest Contentful Paint) Optimization Utilities
 * Helps improve Core Web Vitals by optimizing the loading of LCP elements
 */

import logoAsset from '../assets/logo.png';

/**
 * Preload the LCP image as early as possible
 * This should be called before React renders to ensure maximum benefit
 */
export const preloadLCPImage = (): void => {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') return;

  // Check if the preload link already exists
  const existingPreload = document.querySelector(`link[href="${logoAsset}"]`);
  if (existingPreload) return;

  // Create and append preload link
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = logoAsset;
  link.setAttribute('fetchpriority', 'high');
  
  // Insert at the beginning of head for highest priority
  document.head.insertBefore(link, document.head.firstChild);
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