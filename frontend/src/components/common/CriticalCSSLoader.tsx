import { useEffect } from 'react';

/**
 * Critical CSS Loader Component
 * Handles non-critical CSS loading after initial render
 */
const CriticalCSSLoader: React.FC = () => {
  useEffect(() => {
    // Load non-critical CSS after initial render
    const loadNonCriticalCSS = () => {
      // Create a function to load CSS asynchronously
      const loadCSS = (href: string) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print'; // Load as print first to avoid blocking
        link.onload = () => {
          link.media = 'all'; // Switch to all media once loaded
        };
        document.head.appendChild(link);
      };

      // Load FontAwesome icons (if not already loaded)
      if (!document.querySelector('link[href*="fontawesome"]')) {
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
      }
    };

    // Load non-critical resources after a short delay
    const timer = setTimeout(loadNonCriticalCSS, 100);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};

export default CriticalCSSLoader;