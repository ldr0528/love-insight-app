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
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-4 bg-yellow-100 rounded-full border border-yellow-300" />
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-16 h-28 bg-gradient-to-b from-amber-200 to-yellow-300 border-2 border-amber-400 rounded-b-xl shadow-inner" />
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1 justify-center ${stickUp ? '-translate-y-1' : ''}`}>
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-8 bg-amber-500 rounded-t-sm border border-amber-700"
              style={{
                transform: shaking ? `rotate(${(i - 3) * 2}deg)` : 'rotate(0deg)',
                transition: 'transform 0.15s ease',
              }}
            />
          ))}
        </div>
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
