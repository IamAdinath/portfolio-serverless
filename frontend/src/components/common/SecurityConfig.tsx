import { useEffect } from 'react';

const SecurityConfig: React.FC = () => {
  useEffect(() => {
    // Force HTTPS redirect on client side (additional layer of security)
    if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
      window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
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

  }, []);

  return null; // This component doesn't render anything
};

export default SecurityConfig;