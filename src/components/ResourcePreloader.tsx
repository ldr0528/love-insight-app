
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
    // 串行加载图片，避免瞬间占用所有网络连接
    const preloadSequentially = async () => {
      for (const src of PET_IMAGES) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          // 无论成功失败，都继续下一个，且至少间隔一小段时间
          img.onload = () => setTimeout(resolve, 200); 
          img.onerror = () => resolve();
        });
      }
    };

    // 延迟执行，避开首屏关键请求和用户的初始操作（如登录）
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => preloadSequentially());
      } else {
        preloadSequentially();
      }
    }, 5000); // 增加到5秒延迟

    return () => clearTimeout(timer);
  }, []);

  return null;
}
