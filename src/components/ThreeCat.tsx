import React, { useState } from 'react';

export default function ThreeCat({ message }: { message?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center -mt-8 -mb-12 h-96 w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Custom Cute SVG Cat */}
      <svg 
        viewBox="0 0 200 200" 
        className={`w-48 h-48 md:w-64 md:h-64 transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
      >
        {/* Tail */}
        <path d="M140 150 Q 170 140 170 110 Q 170 80 150 90" stroke="#9E9E9E" strokeWidth="12" fill="none" strokeLinecap="round" className="animate-pulse" />
        
        {/* Body */}
        <ellipse cx="100" cy="140" rx="60" ry="45" fill="#E0E0E0" />
        <ellipse cx="100" cy="140" rx="35" ry="30" fill="#F5F5F5" /> {/* Belly */}

        {/* Ears */}
        <path d="M65 70 L 45 30 L 85 50 Z" fill="#E0E0E0" stroke="#E0E0E0" strokeWidth="5" strokeLinejoin="round" />
        <path d="M135 70 L 155 30 L 115 50 Z" fill="#E0E0E0" stroke="#E0E0E0" strokeWidth="5" strokeLinejoin="round" />
        <path d="M65 70 L 52 45 L 75 58 Z" fill="#FFAB91" /> {/* Inner Ear L */}
        <path d="M135 70 L 148 45 L 125 58 Z" fill="#FFAB91" /> {/* Inner Ear R */}

        {/* Head */}
        <circle cx="100" cy="85" r="50" fill="#E0E0E0" />
        
        {/* Eyes */}
        <circle cx="80" cy="80" r="6" fill="#333" />
        <circle cx="120" cy="80" r="6" fill="#333" />
        <circle cx="82" cy="78" r="2" fill="white" />
        <circle cx="122" cy="78" r="2" fill="white" />

        {/* Cheeks */}
        <circle cx="70" cy="95" r="6" fill="#FFAB91" opacity="0.6" />
        <circle cx="130" cy="95" r="6" fill="#FFAB91" opacity="0.6" />

        {/* Nose & Mouth */}
        <path d="M96 90 L 104 90 L 100 96 Z" fill="#FFAB91" />
        <path d="M100 96 Q 90 105 85 98" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M100 96 Q 110 105 115 98" stroke="#333" strokeWidth="2" fill="none" />

        {/* Paws */}
        <ellipse cx="70" cy="170" rx="12" ry="8" fill="#F5F5F5" />
        <ellipse cx="130" cy="170" rx="12" ry="8" fill="#F5F5F5" />
      </svg>
      
      {/* Chat Bubble */}
      <div className="absolute top-10 md:top-12 md:right-[55%] z-50 pointer-events-none w-max max-w-[200px] sm:max-w-[300px] md:max-w-[350px]">
        <div className="bg-white/95 backdrop-blur-sm px-4 py-3 md:px-6 md:py-5 rounded-2xl rounded-br-none shadow-xl border border-orange-100 relative animate-in zoom-in duration-300 origin-bottom-right flex items-center min-h-[50px] md:min-h-[60px]">
          <div className="text-amber-900/90 text-xs md:text-sm font-medium leading-relaxed text-left break-words whitespace-pre-wrap w-full">
            {message}
          </div>
          <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/95"></div>
        </div>
      </div>
    </div>
  );
}
