// Service Worker for HTTPS enforcement and security
const CACHE_NAME = 'portfolio-v1';
const HTTPS_REDIRECT_ENABLED = true;

// Install event
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Fetch event - Enforce HTTPS
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Force HTTPS for same-origin requests
  if (HTTPS_REDIRECT_ENABLED && 
      url.origin === self.location.origin && 
      url.protocol === 'http:') {
    
    const httpsUrl = request.url.replace('http:', 'https:');
    console.log('🔒 Redirecting to HTTPS:', httpsUrl);
    
    event.respondWith(
      Response.redirect(httpsUrl, 301)
    );
    return;
  }

  // Add security headers to responses
  event.respondWith(
    fetch(request)
      .then(response => {
        // Clone the response to modify headers
        const newResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });

        // Add security headers
        newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        newResponse.headers.set('X-Content-Type-Options', 'nosniff');
        newResponse.headers.set('X-Frame-Options', 'DENY');
        newResponse.headers.set('X-XSS-Protection', '1; mode=block');
        newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        return newResponse;
      })
      .catch(error => {
        console.error('🚨 Fetch error:', error);
        return new Response('Network error', { status: 503 });
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});