
import { useEffect } from 'react';

const PET_IMAGES = [
  '/images/pets/cat.png',
  '/images/pets/dog.png',
  '/images/pets/chicken.png',
  '/images/pets/rabbit.png',
  '/images/pets/hamster.png',
  '/images/pets/fox.png'
];

export default function ResourcePreloader() {
  useEffect(() => {
    // 使用 requestIdleCallback 在浏览器空闲时预加载，或者直接 setTimeout
    const preloadImages = () => {
      PET_IMAGES.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
        
        // 同时使用 Image 对象触发加载，双重保险
        const img = new Image();
        img.src = src;
      });
    };

    // 延迟一点点执行，不阻塞首屏关键资源
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => preloadImages());
    } else {
      setTimeout(preloadImages, 1000);
    }
  }, []);

  return null;
}
