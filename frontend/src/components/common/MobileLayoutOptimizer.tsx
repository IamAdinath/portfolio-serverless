import { useEffect } from 'react';

/**
 * Mobile Layout Optimizer Component
 * Prevents layout shifts on mobile devices by optimizing animations and layout
 */
const MobileLayoutOptimizer: React.FC = () => {
  useEffect(() => {
    // Detect mobile devices
    const isMobile = window.innerWidth <= 768;
    const isVerySmall = window.innerWidth <= 480;
    
    if (isMobile) {
      // Add mobile optimization class to body
      document.body.classList.add('mobile-optimized');
      
      if (isVerySmall) {
        document.body.classList.add('very-small-screen');
      }
      
      // Disable complex animations on mobile to prevent layout shifts
      const style = document.createElement('style');
      style.textContent = `
        .mobile-optimized .modern-header::before {
          animation-duration: 6s !important;
          will-change: transform !important;
        }
        
        .mobile-optimized .modern-footer::before {
          animation: none !important;
        }
        
        .mobile-optimized .footer-brand,
        .mobile-optimized .footer-links,
        .mobile-optimized .footer-contact {
          animation: none !important;
          transform: none !important;
        }
        
        .very-small-screen .modern-header::before {
          display: none !important;
        }
        
        .very-small-screen .modern-footer::before {
          display: none !important;
        }
        
        /* Ensure fixed dimensions for layout stability */
        .mobile-optimized .header-container {
          min-height: 60px !important;
          max-height: 60px !important;
        }
        
        .mobile-optimized .brand-logo,
        .mobile-optimized .footer-brand-logo {
          width: 36px !important;
          height: 36px !important;
          flex-shrink: 0 !important;
        }
        
        .mobile-optimized .social-icon {
          width: 36px !important;
          height: 36px !important;
          flex-shrink: 0 !important;
        }
        
        /* Prevent text reflow issues */
        .mobile-optimized h1 {
          font-size: 1.8rem !important;
          line-height: 1.2 !important;
        }
        
        /* Optimize footer layout */
        .mobile-optimized .footer-main {
          display: block !important;
          gap: 20px !important;
        }
        
        .mobile-optimized .footer-brand,
        .mobile-optimized .footer-links,
        .mobile-optimized .footer-contact {
          margin-bottom: 25px !important;
        }
      `;
      document.head.appendChild(style);
      
      // Cleanup function
      return () => {
        document.body.classList.remove('mobile-optimized', 'very-small-screen');
        document.head.removeChild(style);
      };
    }
    
    // Handle resize events
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      
      if (newIsMobile !== isMobile) {
        // Reload the component logic if mobile state changes
        window.location.reload();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return null; // This component doesn't render anything
};

export default MobileLayoutOptimizer;