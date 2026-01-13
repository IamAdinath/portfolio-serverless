import { useState, useEffect } from 'react';
import { GetProfileImage } from '../components/common/userAPI';

interface UseProfileImagePreloadReturn {
  imageUrl: string | null;
  isLoading: boolean;
  error: boolean;
}

// Global cache to avoid multiple API calls
let globalImageCache: {
  url: string | null;
  promise: Promise<string> | null;
  error: boolean;
} = {
  url: null,
  promise: null,
  error: false
};

/**
 * Hook to preload profile image and make it immediately available
 * Uses global caching to avoid multiple API calls across components
 */
export const useProfileImagePreload = (): UseProfileImagePreloadReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(globalImageCache.url);
  const [isLoading, setIsLoading] = useState(!globalImageCache.url && !globalImageCache.error);
  const [error, setError] = useState(globalImageCache.error);

  useEffect(() => {
    // If we already have the image URL, return it immediately
    if (globalImageCache.url) {
      setImageUrl(globalImageCache.url);
      setIsLoading(false);
      setError(false);
      return;
    }

    // If we already have an error, return it immediately
    if (globalImageCache.error) {
      setError(true);
      setIsLoading(false);
      return;
    }

    // If there's already a promise in flight, wait for it
    if (globalImageCache.promise) {
      globalImageCache.promise
        .then((url) => {
          globalImageCache.url = url;
          setImageUrl(url);
          setError(false);
        })
        .catch(() => {
          globalImageCache.error = true;
          setError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
      return;
    }

    // Start fetching the image
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        const url = await GetProfileImage();
        
        // Cache the result globally
        globalImageCache.url = url;
        globalImageCache.promise = null;
        
        setImageUrl(url);
        setError(false);
        
        // Preload the actual image for faster rendering
        if (url) {
          const img = new Image();
          img.src = url;
          // Add to browser cache
          img.onload = () => {
            console.log('Profile image preloaded successfully');
          };
        }
      } catch (err) {
        console.error('Failed to preload profile image:', err);
        globalImageCache.error = true;
        globalImageCache.promise = null;
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Create and cache the promise
    globalImageCache.promise = GetProfileImage();
    fetchImage();
  }, []);

  return { imageUrl, isLoading, error };
};

/**
 * Function to preload profile image early in the app lifecycle
 * Call this in App.tsx or index.tsx for best performance
 */
export const preloadProfileImage = async (): Promise<void> => {
  if (globalImageCache.url || globalImageCache.promise) {
    return; // Already loaded or loading
  }

  try {
    globalImageCache.promise = GetProfileImage();
    const url = await globalImageCache.promise;
    globalImageCache.url = url;
    globalImageCache.promise = null;

    // Preload the actual image
    if (url) {
      const img = new Image();
      img.src = url;
    }
  } catch (error) {
    console.error('Failed to preload profile image:', error);
    globalImageCache.error = true;
    globalImageCache.promise = null;
  }
};