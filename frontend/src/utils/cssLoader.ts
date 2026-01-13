/**
 * CSS lazy loading utilities
 * Load component-specific CSS only when needed
 */

interface CSSModule {
  href: string;
  loaded: boolean;
  loading: Promise<void> | null;
}

// CSS module registry
const cssModules: Record<string, CSSModule> = {};

/**
 * Lazy load CSS for specific components
 */
export const loadCSS = async (moduleName: string, href: string): Promise<void> => {
  // Check if already loaded or loading
  if (cssModules[moduleName]?.loaded) {
    return;
  }

  if (cssModules[moduleName]?.loading) {
    return cssModules[moduleName].loading!;
  }

  // Create loading promise
  const loadingPromise = new Promise<void>((resolve, reject) => {
    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) {
      cssModules[moduleName] = { href, loaded: true, loading: null };
      resolve();
      return;
    }

    // Create new link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    
    link.onload = () => {
      cssModules[moduleName] = { href, loaded: true, loading: null };
      resolve();
    };
    
    link.onerror = () => {
      delete cssModules[moduleName];
      reject(new Error(`Failed to load CSS: ${href}`));
    };

    // Add to document head
    document.head.appendChild(link);
  });

  // Register loading promise
  cssModules[moduleName] = { href, loaded: false, loading: loadingPromise };

  return loadingPromise;
};

/**
 * Preload CSS for better performance
 */
export const preloadCSS = (href: string): void => {
  // Check if already preloaded
  const existingPreload = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existingPreload) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  
  // Convert to stylesheet after load
  link.onload = () => {
    link.rel = 'stylesheet';
  };

  document.head.appendChild(link);
};

/**
 * Component-specific CSS loaders
 */
export const componentCSS = {
  // Admin components - only load when needed
  adminDashboard: () => loadCSS('adminDashboard', '/css/admin-dashboard.css'),
  writerPage: () => loadCSS('writerPage', '/css/writer-page.css'),
  blogStats: () => loadCSS('blogStats', '/css/blog-stats.css'),
  webAnalytics: () => loadCSS('webAnalytics', '/css/web-analytics.css'),
  
  // Blog components
  blogList: () => loadCSS('blogList', '/css/blog-list.css'),
  blogPost: () => loadCSS('blogPost', '/css/blog-post.css'),
  
  // Auth components
  authPage: () => loadCSS('authPage', '/css/auth-page.css'),
};

/**
 * Route-based CSS loading
 */
export const loadRouteCSS = async (route: string): Promise<void> => {
  const routeMap: Record<string, () => Promise<void>> = {
    '/admin': componentCSS.adminDashboard,
    '/writer': componentCSS.writerPage,
    '/admin/stats': componentCSS.blogStats,
    '/admin/analytics': componentCSS.webAnalytics,
    '/blogs': componentCSS.blogList,
    '/blog': componentCSS.blogPost,
    '/auth': componentCSS.authPage,
  };

  const loader = routeMap[route];
  if (loader) {
    try {
      await loader();
    } catch (error) {
      console.warn(`Failed to load CSS for route ${route}:`, error);
    }
  }
};

/**
 * Initialize CSS optimization
 */
export const initializeCSSOptimization = (): void => {
  // Preload critical route CSS
  const criticalRoutes = ['/about', '/blogs'];
  criticalRoutes.forEach(route => {
    const cssPath = `/css${route}.css`;
    preloadCSS(cssPath);
  });

  // Listen for route changes
  if (typeof window !== 'undefined') {
    // Load CSS based on current route
    const currentPath = window.location.pathname;
    loadRouteCSS(currentPath).catch(console.error);

    // Preload CSS on hover for navigation links
    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.hostname === window.location.hostname) {
        const href = link.getAttribute('href');
        if (href) {
          loadRouteCSS(href).catch(console.error);
        }
      }
    });
  }
};

/**
 * Remove unused CSS modules
 */
export const cleanupCSS = (): void => {
  Object.entries(cssModules).forEach(([moduleName, module]) => {
    if (module.loaded) {
      const link = document.querySelector(`link[href="${module.href}"]`);
      if (link && !document.body.contains(link)) {
        // Module is loaded but not in use, could be removed
        console.log(`CSS module ${moduleName} could be cleaned up`);
      }
    }
  });
};