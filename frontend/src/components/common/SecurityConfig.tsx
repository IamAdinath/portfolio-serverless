import { useEffect } from 'react';

const SecurityConfig: React.FC = () => {
  useEffect(() => {
    // Force HTTPS redirect on client side (additional layer of security)
    if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
      window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
    }

    // Add security headers via meta tags (backup for server-side headers)
    // Note: Some headers like X-Frame-Options and frame-ancestors can only be set via HTTP headers
    const addSecurityMeta = () => {
      // Strict Transport Security (HSTS)
      const hsts = document.createElement('meta');
      hsts.httpEquiv = 'Strict-Transport-Security';
      hsts.content = 'max-age=31536000; includeSubDomains; preload';
      document.head.appendChild(hsts);

      // Content Security Policy (without frame-ancestors which must be HTTP header only)
      const csp = document.createElement('meta');
      csp.httpEquiv = 'Content-Security-Policy';
      csp.content = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com;
        font-src 'self' https://fonts.gstatic.com data:;
        img-src 'self' data: https:;
        connect-src 'self' https:;
        base-uri 'self';
        form-action 'self';
      `.replace(/\s+/g, ' ').trim();
      document.head.appendChild(csp);

      // Referrer Policy
      const referrer = document.createElement('meta');
      referrer.name = 'referrer';
      referrer.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrer);

      // Permissions Policy
      const permissions = document.createElement('meta');
      permissions.httpEquiv = 'Permissions-Policy';
      permissions.content = 'geolocation=(), microphone=(), camera=(), payment=(), usb=()';
      document.head.appendChild(permissions);
    };

    // Only add meta tags if not already present (avoid duplicates)
    if (!document.querySelector('meta[http-equiv="Strict-Transport-Security"]')) {
      addSecurityMeta();
    }

    // Monitor for mixed content warnings
    if (process.env.NODE_ENV === 'production') {
      const originalConsoleWarn = console.warn;
      console.warn = (...args) => {
        const message = args.join(' ');
        if (message.includes('Mixed Content') || message.includes('insecure')) {
          console.error('🔒 Security Warning: Mixed content detected!', ...args);
        }
        originalConsoleWarn.apply(console, args);
      };
    }

    // Service Worker for HTTPS enforcement
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(error => {
        console.log('SW registration failed: ', error);
      });
    }

  }, []);

  return null; // This component doesn't render anything
};

export default SecurityConfig;