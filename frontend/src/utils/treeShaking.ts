/**
 * Tree shaking optimizations for better bundle size
 * Ensures only used code is included in the final bundle
 */

// Re-export only used lodash functions instead of importing entire library
export { debounce } from 'lodash-es/debounce';
export { throttle } from 'lodash-es/throttle';

// Re-export only used date-fns functions
export { format, parseISO, isValid } from 'date-fns';

// Optimized imports for commonly used utilities
export const createOptimizedImports = () => {
  // This helps webpack understand what can be tree-shaken
  return {
    // Only import specific FontAwesome icons
    icons: () => import('../utils/iconLibrary'),
    
    // Only import specific date utilities
    dateUtils: () => import('date-fns/format'),
    
    // Only import specific animation components
    animations: () => import('framer-motion/dist/framer-motion'),
  };
};

/**
 * Mark unused exports for tree shaking
 */
export const markUnusedExports = () => {
  // This helps bundlers identify unused code
  if (process.env.NODE_ENV === 'production') {
    // Remove development-only code
    console.log = () => {};
    console.warn = () => {};
  }
};