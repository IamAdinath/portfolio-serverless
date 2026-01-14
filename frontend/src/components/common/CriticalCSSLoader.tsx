import { useEffect } from 'react';

/**
 * Critical CSS Loader Component
 * Handles non-critical CSS loading after initial render
 */
const CriticalCSSLoader: React.FC = () => {
  useEffect(() => {
    // FontAwesome is already included via npm package (@fortawesome/react-fontawesome)
    // No need to load from CDN
    
    // Future: Add other non-critical CSS loading here if needed
    
  }, []);

  return null; // This component doesn't render anything
};

export default CriticalCSSLoader;