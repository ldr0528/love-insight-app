import { useEffect, useState } from 'react';
import { Sparkles, Heart, X } from 'lucide-react';
import DailyCheckIn from '@/components/DailyCheckIn';

export default function FortuneTube() {
  const [drawing, setDrawing] = useState(false);
  const [stickUp, setStickUp] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDraw = () => {
    if (drawing) return;
    setDrawing(true);
    setStickUp(true);
    setTimeout(() => setStickUp(false), 800);
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
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-pink-100 relative overflow-hidden">
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">每日灵犀签</div>
            <div className="text-xs text-gray-500">摇一摇或点击抽签，开启今日指引</div>
          </div>
        </div>
        <div className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full font-bold">灵犀萌新</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-44 h-52">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 shadow-xl" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-md opacity-40" />
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-28 bg-yellow-200 rounded-xl border-2 border-yellow-400 flex items-center justify-center font-bold text-yellow-800 transition-all ${stickUp ? '-translate-y-10 rotate-3' : ''}`}
          >
            签
          </div>
          <button
            onClick={handleDraw}
            className="absolute inset-0 rounded-2xl text-white font-bold flex items-center justify-center backdrop-blur-[1px] hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            点击抽取
          </button>
        </div>

        <button
          onClick={handleDraw}
          className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          抽取今日运势 <Sparkles className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">已连续打卡 <span className="font-bold text-pink-600">1</span> 天</div>

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
