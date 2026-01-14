import { useEffect } from 'react';

/**
 * Responsive Sync Component
 * Ensures consistent desktop/mobile rendering and performance
 */
const ResponsiveSync: React.FC = () => {
  useEffect(() => {
    // Detect device capabilities
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const isDesktop = window.innerWidth > 1024;
    const isHighDPI = window.devicePixelRatio > 1;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Add device classes to body
    document.body.classList.add('responsive-sync-active');
    
    if (isMobile) {
      document.body.classList.add('device-mobile');
    } else if (isTablet) {
      document.body.classList.add('device-tablet');
    } else if (isDesktop) {
      document.body.classList.add('device-desktop');
    }

    if (isHighDPI) {
      document.body.classList.add('high-dpi');
    }

    if (prefersReducedMotion) {
      document.body.classList.add('reduced-motion');
    }

    // Inject responsive sync styles
    const style = document.createElement('style');
    style.textContent = `
      /* Responsive Sync Active Styles */
      .responsive-sync-active {
        /* Ensure consistent font rendering */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      
      /* Device-specific optimizations */
      .device-mobile {
        /* Optimize for touch */
        touch-action: manipulation;
        /* Prevent zoom on input focus */
        -webkit-text-size-adjust: 100%;
      }
      
      .device-mobile * {
        /* Ensure minimum touch targets */
        min-height: 44px;
        min-width: 44px;
      }
      
      .device-mobile button,
      .device-mobile a,
      .device-mobile input,
      .device-mobile select,
      .device-mobile textarea {
        /* Ensure touch targets */
        min-height: 44px;
        min-width: 44px;
      }
      
      .device-desktop {
        /* Optimize for mouse interaction */
        cursor: default;
      }
      
      .high-dpi {
        /* Optimize for high DPI displays */
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
      
      .reduced-motion * {
        /* Respect reduced motion preference */
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      /* Unified spacing system */
      .responsive-sync-active .portfolio-hero-content,
      .responsive-sync-active .portfolio-section-header,
      .responsive-sync-active .portfolio-skill-card,
      .responsive-sync-active .portfolio-blog-card,
      .responsive-sync-active .portfolio-testimonial-card,
      .responsive-sync-active .portfolio-nav-card {
        /* Consistent padding across all devices */
        padding: clamp(1.5rem, 4vw, 2.5rem);
      }
      
      /* Unified typography scale */
      .responsive-sync-active h1 {
        font-size: clamp(2rem, 6vw, 3.5rem) !important;
        line-height: 1.1 !important;
      }
      
      .responsive-sync-active h2 {
        font-size: clamp(1.25rem, 3vw, 1.5rem) !important;
        line-height: 1.2 !important;
      }
      
      .responsive-sync-active h3 {
        font-size: clamp(1.125rem, 2.5vw, 1.8rem) !important;
        line-height: 1.3 !important;
      }
      
      /* Unified button sizing */
      .responsive-sync-active .portfolio-btn,
      .responsive-sync-active .portfolio-social-link,
      .responsive-sync-active .portfolio-nav-link {
        min-height: 44px !important;
        padding: clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem) !important;
      }
      
      /* Unified icon sizing */
      .responsive-sync-active .portfolio-social-link {
        width: clamp(44px, 10vw, 60px) !important;
        height: clamp(44px, 10vw, 60px) !important;
        font-size: clamp(1.25rem, 3vw, 1.5rem) !important;
      }
      
      /* Unified profile sizing */
      .responsive-sync-active .portfolio-profile-image {
        width: clamp(150px, 30vw, 250px) !important;
        height: clamp(150px, 30vw, 250px) !important;
      }
      
      .responsive-sync-active .portfolio-profile-card {
        width: clamp(200px, 35vw, 290px) !important;
        height: clamp(200px, 35vw, 290px) !important;
      }
      
      /* Unified grid gaps */
      .responsive-sync-active .portfolio-skills-grid,
      .responsive-sync-active .portfolio-blog-grid,
      .responsive-sync-active .portfolio-testimonials-grid,
      .responsive-sync-active .portfolio-nav-grid {
        gap: clamp(1.5rem, 4vw, 2rem) !important;
      }
      
      /* Performance optimizations */
      .responsive-sync-active * {
        /* Optimize animations */
        will-change: auto;
      }
      
      .responsive-sync-active *:hover,
      .responsive-sync-active *:focus,
      .responsive-sync-active *:active {
        /* Only animate on interaction */
        will-change: transform, opacity;
      }
      
      /* Layout stability */
      .responsive-sync-active .modern-header {
        height: clamp(60px, 10vw, 70px) !important;
        min-height: 60px !important;
      }
      
      .responsive-sync-active .header-container {
        height: clamp(60px, 10vw, 70px) !important;
      }
      
      /* Consistent focus states */
      .responsive-sync-active *:focus {
        outline: 2px solid rgba(0, 229, 255, 0.5) !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);

    // Handle viewport changes
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      const newIsTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const newIsDesktop = window.innerWidth > 1024;

      // Update device classes
      document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
      
      if (newIsMobile) {
        document.body.classList.add('device-mobile');
      } else if (newIsTablet) {
        document.body.classList.add('device-tablet');
      } else if (newIsDesktop) {
        document.body.classList.add('device-desktop');
      }
    };

    // Throttled resize handler
    let resizeTimeout: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', throttledResize);

    // Cleanup
    return () => {
      document.body.classList.remove(
        'responsive-sync-active',
        'device-mobile',
        'device-tablet', 
        'device-desktop',
        'high-dpi',
        'reduced-motion'
      );
      document.head.removeChild(style);
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ResponsiveSync;