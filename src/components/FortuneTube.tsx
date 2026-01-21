import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import DailyCheckIn from '@/components/DailyCheckIn';

export default function FortuneTube() {
  const [drawing, setDrawing] = useState(false);
  const [stickUp, setStickUp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleDraw = () => {
    if (drawing) return;
    setDrawing(true);
    setShaking(true);
    setStickUp(true);
    setTimeout(() => setStickUp(false), 800);
    setTimeout(() => setShaking(false), 600);
    setTimeout(() => {
      setDrawing(false);
      setShowModal(true);
    }, 1000);
  };

  useEffect(() => {
    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.sqrt(
        Math.pow(acc.x || 0, 2) + Math.pow(acc.y || 0, 2) + Math.pow(acc.z || 0, 2)
      );
      if (magnitude > 18) {
        handleDraw();
      }
    };
    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        aria-label="签筒"
        onClick={handleDraw}
        className="relative w-28 h-40 cursor-pointer"
        style={{
          transform: shaking ? 'rotate(3deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s ease-in-out',
        }}
      >
        <svg viewBox="0 0 120 180" className="absolute inset-0">
          <defs>
            <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#F5D48A" />
              <stop offset="100%" stop-color="#E3B768" />
            </linearGradient>
            <linearGradient id="lip" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#FFF2C4" />
              <stop offset="100%" stop-color="#EFD28B" />
            </linearGradient>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0.2" />
              <feBlend mode="multiply" in2="SourceGraphic" />
            </filter>
            <filter id="rough">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" />
              <feDisplacementMap in="SourceGraphic" scale="1" />
            </filter>
          </defs>
          <ellipse cx="60" cy="22" rx="34" ry="10" fill="url(#lip)" filter="url(#rough)" />
          <rect x="26" y="24" width="68" height="110" rx="16" fill="url(#wood)" filter="url(#grain)" />
          <g transform={`translate(60,18)`}>
            {[...Array(7)].map((_, i) => {
              const angle = shaking ? (i - 3) * 2 : 0;
              return (
                <g key={i} transform={`translate(${(i - 3) * 8},-18) rotate(${angle})`}>
                  <rect x="-3" y="0" width="6" height="30" fill="#D18A3A" stroke="#8C5A26" strokeWidth="1" />
                  <polygon points="-3,0 0,-6 3,0" fill="#8C5A26" />
                </g>
              );
            })}
          </g>
          <text x="60" y="80" text-anchor="middle" fill="#7A4E1F" font-size="18" font-weight="700">签筒</text>
          <ellipse cx="60" cy="142" rx="30" ry="6" fill="#000" opacity="0.12" />
        </svg>
      </div>
      <button
        onClick={handleDraw}
        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
      >
        抽取今日运势 <Sparkles className="w-5 h-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-2 md:p-4">
              <DailyCheckIn />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
