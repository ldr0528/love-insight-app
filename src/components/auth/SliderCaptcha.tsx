import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface SliderCaptchaProps {
  onVerify: (success: boolean) => void;
  onClose?: () => void;
}

export default function SliderCaptcha({ onVerify, onClose }: SliderCaptchaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [targetPosition, setTargetPosition] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const containerRef = useRef<HTMLDivElement>(null);

  // Randomize target position on mount or reset
  const resetPuzzle = () => {
    // Random position between 20% and 80%
    const newTarget = Math.floor(Math.random() * 60) + 20;
    setTargetPosition(newTarget);
    setSliderPosition(0);
    setStatus('idle');
  };

  useEffect(() => {
    resetPuzzle();
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (status === 'success') return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let clientX;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const relativeX = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
    
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Check if position is close to target (within 5% tolerance)
    const difference = Math.abs(sliderPosition - targetPosition);
    if (difference < 5) {
      setStatus('success');
      setTimeout(() => {
        onVerify(true);
      }, 500);
    } else {
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setSliderPosition(0);
      }, 500);
    }
  };

  // Listen for global mouse up to handle dragging outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, sliderPosition, targetPosition]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl w-[320px] select-none border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 font-medium">安全验证</h3>
        <div className="flex gap-2">
          <button 
            onClick={resetPuzzle}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="刷新验证"
          >
            <RefreshCw size={18} />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-4 group">
        {/* Background Image - Using a gradient for simplicity/reliability */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        
        {/* Decorative elements to make the puzzle visible */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 50% 50%, white 2px, transparent 2px)', 
               backgroundSize: '20px 20px' 
             }} 
        />
        
        {/* Target Hole */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 rounded-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] backdrop-blur-sm border border-white/20"
          style={{ left: `calc(${targetPosition}% - 24px)` }}
        >
          {/* Puzzle shape simulation */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/30 rounded-full" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-black/30 rounded-full" />
        </div>

        {/* Draggable Piece */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-12 h-12 z-10 shadow-lg cursor-grab active:cursor-grabbing hover:brightness-110 transition-transform"
          style={{ 
            left: `calc(${sliderPosition}% - 24px)`,
            // Clip the background from the same gradient but shifted
            backgroundColor: '#818cf8', // Fallback color
            backgroundImage: 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
          }}
        >
           {/* Inner content to match background but masked - simplified for CSS-only approach */}
           <div className="w-full h-full relative overflow-hidden rounded-md border border-white/50">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
                   style={{ 
                     width: '320px', // Match container width
                     height: '160px', // Match container height
                     transform: `translate(calc(-${sliderPosition / 100 * 320}px + 24px), -50%)`, // Counter-move background
                     marginTop: '24px' // Center vertically relative to piece
                   }} 
              />
               {/* Puzzle shape positive */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-400 rounded-full border border-white/50" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border border-white/50" />
           </div>
        </div>
        
        {/* Status Overlay */}
        {status === 'success' && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center text-white font-bold backdrop-blur-[1px] transition-all">
            <div className="bg-green-500 p-2 rounded-full shadow-lg">
              <Check size={24} />
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center text-white font-bold backdrop-blur-[1px] transition-all">
            <div className="bg-red-500 p-2 rounded-full shadow-lg">
              <X size={24} />
            </div>
          </div>
        )}
      </div>

      {/* Slider Track */}
      <div 
        ref={containerRef}
        className="relative w-full h-10 bg-gray-100 rounded-full cursor-pointer shadow-inner"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 pointer-events-none">
          {status === 'idle' && '向右拖动滑块填充拼图'}
          {status === 'success' && <span className="text-green-600 font-medium">验证通过</span>}
          {status === 'error' && <span className="text-red-500 font-medium">验证失败，请重试</span>}
        </div>
        
        {/* Progress Bar */}
        <div 
          className={`absolute left-0 top-0 h-full rounded-full transition-colors ${
            status === 'success' ? 'bg-green-100' : status === 'error' ? 'bg-red-100' : 'bg-pink-100'
          }`}
          style={{ width: `${sliderPosition}%` }}
        />

        {/* Slider Handle */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border transition-colors cursor-grab active:cursor-grabbing z-20 hover:scale-105 active:scale-95 ${
            status === 'success' ? 'border-green-500 text-green-500' : 
            status === 'error' ? 'border-red-500 text-red-500' : 
            'border-pink-200 text-pink-500'
          }`}
          style={{ left: `calc(${sliderPosition}% - 24px)` }}
        >
          {status === 'success' ? <Check size={20} /> : 
           status === 'error' ? <X size={20} /> : 
           <div className="flex gap-[2px]">
             <div className="w-1 h-4 bg-current rounded-full opacity-40" />
             <div className="w-1 h-4 bg-current rounded-full opacity-60" />
             <div className="w-1 h-4 bg-current rounded-full opacity-80" />
           </div>}
        </div>
      </div>
    </div>
  );
}
