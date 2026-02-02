
import { useEffect } from 'react';

const PET_IMAGES = [
  '/images/pets/cat.png',
  '/images/pets/dog.png',
  '/images/pets/chicken.png',
  '/images/pets/rabbit.png',
  '/images/pets/hamster.png',
  '/images/pets/fox.png'
];

/**
 * A polite preloader that downloads large pet images sequentially
 * to avoid network congestion, starting only after the app is idle.
 */
export function usePetPreloader() {
  useEffect(() => {
    const preloadImages = async () => {
      // Initial delay to let critical resources load and login to complete
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Sequential loading
      for (const src of PET_IMAGES) {
        // Check if already cached (optional optimization, browser handles it usually)
        // We just create an Image object to trigger download
        try {
          await new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            // Short timeout to move to next image if this one stalls, 
            // but we want to give it time to cache.
            // Actually, we should just fire and wait a bit, or wait for onload.
            // Let's wait for onload but with a max timeout of 10s per image
            const timer = setTimeout(resolve, 10000);
            
            img.onload = () => {
              clearTimeout(timer);
              // Small delay between images to be nice to the network
              setTimeout(resolve, 500); 
            };
            
            img.onerror = () => {
              clearTimeout(timer);
              resolve(null);
            };
          });
        } catch (e) {
          // Ignore errors
        }
      }
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => preloadImages());
    } else {
      setTimeout(preloadImages, 2000);
    }
  }, []);
}
