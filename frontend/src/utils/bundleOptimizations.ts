/**
 * Bundle optimization utilities
 * Helps reduce JavaScript bundle size through various techniques
 */

/**
 * Lazy load heavy libraries only when needed
 */
export const lazyLoadLibraries = {
  // Lazy load Framer Motion for animations
  framerMotion: () => import('framer-motion'),
  
  // Lazy load Evergreen UI components
  evergreenUI: () => import('evergreen-ui'),
  
  // Lazy load chart libraries if used
  chartjs: () => import('chart.js'),
  
  // Lazy load date utilities
  dateFns: () => import('date-fns'),
};

/**
 * Preload critical resources based on route
 */
export const preloadByRoute = {
  '/admin': () => {
    // Preload admin-specific libraries
    return Promise.all([
      lazyLoadLibraries.evergreenUI(),
      import('../components/sections/AdminDashboard'),
    ]);
  },
  
  '/writer': () => {
    // Preload editor-specific libraries
    return Promise.all([
      import('../components/common/LazyTipTapEditor'),
      import('../utils/syntaxHighlighting'),
    ]);
  },
  
  '/blogs': () => {
    // Preload blog-specific components
    return import('../components/sections/BlogList');
  },
};

/**
 * Initialize route-based preloading
 */
export const initializeRoutePreloading = (): void => {
  // Listen for route changes and preload accordingly
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    
    // Preload based on current route
    const preloader = preloadByRoute[currentPath as keyof typeof preloadByRoute];
    if (preloader) {
      // Delay preloading to not block initial render
      setTimeout(preloader, 1000);
    }
    
    // Preload on hover for navigation links
    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.hostname === window.location.hostname) {
        const href = link.getAttribute('href');
        const preloader = preloadByRoute[href as keyof typeof preloadByRoute];
        
        if (preloader) {
          preloader().catch(console.error);
        }
      }
    });
  }
};

/**
 * Remove unused CSS and optimize styles
 */
export const optimizeStyles = (): void => {
  // Remove unused FontAwesome styles
  const unusedFAClasses = [
    'fa-spin',
    'fa-pulse',
    'fa-border',
    'fa-pull-left',
    'fa-pull-right',
  ];
  
  // This would be handled by PurgeCSS in production
  if (process.env.NODE_ENV === 'development') {
    console.log('Style optimization would remove:', unusedFAClasses);
  }
};

/**
 * Optimize third-party scripts loading
 */
export const optimizeThirdPartyScripts = (): void => {
  // Defer non-critical scripts
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && (src.includes('analytics') || src.includes('tracking'))) {
      script.setAttribute('defer', '');
    }
  });
};