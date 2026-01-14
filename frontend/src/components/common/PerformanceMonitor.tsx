import { useEffect } from 'react';

/**
 * Performance Monitor Component
 * Tracks Core Web Vitals and other performance metrics
 */
const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Web Vitals monitoring
    const observeWebVitals = () => {
      // LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'largest-contentful-paint') {
                console.log('🎯 LCP:', Math.round(entry.startTime), 'ms');
                // You can send this to analytics
                if (window.gtag) {
                  window.gtag('event', 'web_vitals', {
                    name: 'LCP',
                    value: Math.round(entry.startTime),
                    event_category: 'Performance'
                  });
                }
              }
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // FCP (First Contentful Paint)
          const fcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === 'first-contentful-paint') {
                console.log('🎨 FCP:', Math.round(entry.startTime), 'ms');
                if (window.gtag) {
                  window.gtag('event', 'web_vitals', {
                    name: 'FCP',
                    value: Math.round(entry.startTime),
                    event_category: 'Performance'
                  });
                }
              }
            }
          });
          fcpObserver.observe({ entryTypes: ['paint'] });

          // CLS (Cumulative Layout Shift)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // Type assertion for layout-shift entries
              const layoutShift = entry as any;
              if (!layoutShift.hadRecentInput) {
                clsValue += layoutShift.value;
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // Report CLS on page unload
          window.addEventListener('beforeunload', () => {
            console.log('📐 CLS:', clsValue.toFixed(4));
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'CLS',
                value: Math.round(clsValue * 1000),
                event_category: 'Performance'
              });
            }
          });

        } catch (error) {
          console.warn('Performance monitoring error:', error);
        }
      }

      // FID (First Input Delay) - using polyfill approach
      let fidReported = false;
      const reportFID = (value: number) => {
        if (!fidReported) {
          console.log('⚡ FID:', Math.round(value), 'ms');
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'FID',
              value: Math.round(value),
              event_category: 'Performance'
            });
          }
          fidReported = true;
        }
      };

      // Simple FID measurement
      const measureFID = () => {
        let startTime = 0;
        const handleInput = (event: Event) => {
          if (startTime === 0) {
            startTime = performance.now();
            requestAnimationFrame(() => {
              const delay = performance.now() - startTime;
              reportFID(delay);
              // Remove listeners after first measurement
              ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
                document.removeEventListener(type, handleInput, true);
              });
            });
          }
        };

        ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
          document.addEventListener(type, handleInput, true);
        });
      };

      measureFID();
    };

    // Start monitoring after a short delay
    const timer = setTimeout(observeWebVitals, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default PerformanceMonitor;