// Enhanced Service Worker for Portfolio Website
// Version 2.0.0 - SEO and Performance Optimized

const CACHE_NAME = 'adinath-portfolio-v2';
const HTTPS_REDIRECT_ENABLED = true;

// Resources to cache for offline functionality
const urlsToCache = [
  '/',
  '/about',
  '/resume',
  '/blogs',
  '/contact',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/sitemap.xml',
  '/robots.txt'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching critical resources');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Critical resources cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - Enhanced with caching strategy and security
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

  // Cache-first strategy for static assets
  if (request.destination === 'image' || 
      request.destination === 'font' || 
      request.destination === 'style' ||
      request.destination === 'script') {
    
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request).then(response => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseClone));
            }
            return response;
          });
        })
    );
    return;
  }

  // Network-first strategy for HTML pages with offline fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        // Clone the response to modify headers
        const newResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: new Headers(response.headers)
        });

        // Add comprehensive security headers
        newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        newResponse.headers.set('X-Content-Type-Options', 'nosniff');
        newResponse.headers.set('X-Frame-Options', 'DENY');
        newResponse.headers.set('X-XSS-Protection', '1; mode=block');
        newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        newResponse.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        newResponse.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        
        // Cache successful HTML responses
        if (response.status === 200 && request.destination === 'document') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
        }

        return newResponse;
      })
      .catch(error => {
        console.error('🚨 Fetch error:', error);
        
        // Try to serve from cache for navigation requests
        if (request.destination === 'document') {
          return caches.match(request)
            .then(response => {
              if (response) {
                return response;
              }
              // Fallback to cached homepage
              return caches.match('/');
            });
        }
        
        return new Response('Network error', { 
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Handle offline contact form submissions
      handleOfflineContactForm()
    );
  }
});

// Push notifications for updates
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Portfolio updated with new content!',
    icon: '/favicon-32x32.png',
    badge: '/favicon-16x16.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'portfolio-update'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Updates',
        icon: '/favicon-16x16.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon-16x16.png'
      }
    ],
    tag: 'portfolio-update',
    renotify: true,
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Adinath Gore Portfolio', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('💬 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Helper function for offline contact form handling
async function handleOfflineContactForm() {
  try {
    // Retrieve stored form data from IndexedDB
    const formData = await getStoredFormData();
    
    if (formData) {
      // Attempt to submit the form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // Clear stored data on successful submission
        await clearStoredFormData();
        console.log('✅ Offline form submitted successfully');
      }
    }
  } catch (error) {
    console.error('❌ Failed to submit offline form:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getStoredFormData() {
  // Implementation would use IndexedDB to retrieve stored form data
  return null;
}

async function clearStoredFormData() {
  // Implementation would clear stored form data from IndexedDB
  return true;
}