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
        className="relative w-32 h-48 cursor-pointer"
        style={{
          transform: shaking ? 'rotate(3deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s ease-in-out',
        }}
      >
        <svg viewBox="0 0 140 200" className="absolute inset-0">
          <defs>
            <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#F4D089" />
              <stop offset="100%" stopColor="#D9AB62" />
            </linearGradient>
            <linearGradient id="lip" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFF2C4" />
              <stop offset="100%" stopColor="#EFD28B" />
            </linearGradient>
            <radialGradient id="shine" cx="50%" cy="10%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0.2" />
              <feBlend mode="multiply" in2="SourceGraphic" />
            </filter>
            <filter id="rough">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" />
              <feDisplacementMap in="SourceGraphic" scale="1" />
            </filter>
            <linearGradient id="band" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#B84A3C" />
              <stop offset="50%" stopColor="#E35C4D" />
              <stop offset="100%" stopColor="#B84A3C" />
            </linearGradient>
          </defs>
          <ellipse cx="70" cy="26" rx="38" ry="11" fill="url(#lip)" filter="url(#rough)" />
          <rect x="32" y="30" width="76" height="120" rx="18" fill="url(#wood)" filter="url(#grain)" />
          <rect x="34" y="72" width="72" height="12" rx="6" fill="url(#band)" opacity="0.9" />
          <rect x="34" y="132" width="72" height="10" rx="5" fill="#E6C07A" opacity="0.6" />
          <circle cx="70" cy="60" r="60" fill="url(#shine)" />
          <g transform={`translate(70,22)`}>
            {[...Array(9)].map((_, i) => {
              const angle = shaking ? (i - 3) * 2 : 0;
              return (
                <g key={i} transform={`translate(${(i - 4) * 8},-22) rotate(${angle})`}>
                  <rect x="-3" y="0" width="6" height="36" fill="#C48136" stroke="#8B5A24" strokeWidth="1" />
                  <polygon points="-3,0 0,-6 3,0" fill="#8B5A24" />
                </g>
              );
            })}
          </g>
          <text x="70" y="98" textAnchor="middle" fill="#6F4A1E" fontSize="20" fontWeight="800">签筒</text>
          <ellipse cx="70" cy="160" rx="34" ry="7" fill="#000" opacity="0.12" />
        </svg>
      </div>
      <button
        onClick={handleDraw}
        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
      >
        抽取今日运势 <Sparkles className="w-5 h-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <button
            aria-label="关闭"
            onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
            className="absolute right-6 top-6 md:right-8 md:top-8 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg border border-gray-200 text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl ring-1 ring-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="p-2 md:p-4">
              <DailyCheckIn />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
