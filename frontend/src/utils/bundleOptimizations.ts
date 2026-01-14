/**
 * Bundle optimization utilities
 * Helps reduce JavaScript bundle size through various techniques
 */

/**
 * Lazy load heavy libraries only when needed
 */
export const lazyLoadLibraries = {
  // Dynamic library loader - only loads if library exists
  loadLibrary: async (libraryName: string) => {
    try {
      // Use dynamic import with string interpolation to avoid TypeScript errors
      const module = await import(/* webpackIgnore: true */ libraryName);
      return module;
    } catch (error) {
      console.warn(`Library ${libraryName} not available:`, error);
      return null;
    }
  }
};

/**
 * Preload critical resources based on route
 */
export const preloadByRoute = {
  '/admin': async () => {
    try {
      return await import('../components/sections/AdminDashboardPage');
    } catch (error) {
      console.warn('Failed to preload AdminDashboardPage:', error);
      return null;
    }
  },
  
  '/writer': async () => {
    try {
      return await import('../components/sections/BlogEditorPage');
    } catch (error) {
      console.warn('Failed to preload BlogEditorPage:', error);
      return null;
    }
  },
  
  '/blogs': async () => {
    try {
      return await import('../components/sections/BlogListPage');
    } catch (error) {
      console.warn('Failed to preload BlogListPage:', error);
      return null;
    }
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
      setTimeout(() => preloader().catch(console.error), 1000);
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
  console.log('Style optimization would remove:', unusedFAClasses);
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