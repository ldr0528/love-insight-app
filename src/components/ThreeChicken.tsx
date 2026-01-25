import React, { useState } from 'react';

export default function ThreeChicken({ message }: { message?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center -mt-8 -mb-12 h-96 w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Custom Cute SVG Chicken */}
      <svg 
        viewBox="0 0 200 200" 
        className={`w-48 h-48 md:w-64 md:h-64 transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
      >
        {/* Legs */}
        <line x1="85" y1="160" x2="85" y2="180" stroke="#FF9800" strokeWidth="4" />
        <line x1="115" y1="160" x2="115" y2="180" stroke="#FF9800" strokeWidth="4" />
        <path d="M85 180 L 75 185 M 85 180 L 85 188 M 85 180 L 95 185" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" />
        <path d="M115 180 L 105 185 M 115 180 L 115 188 M 115 180 L 125 185" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" />

        {/* Body */}
        <circle cx="100" cy="110" r="60" fill="#FFF59D" />
        <path d="M40 110 Q 30 110 35 130 Q 50 140 60 130" fill="#FDD835" /> {/* Wing L */}
        <path d="M160 110 Q 170 110 165 130 Q 150 140 140 130" fill="#FDD835" /> {/* Wing R */}
        
        {/* Belly */}
        <ellipse cx="100" cy="140" rx="35" ry="25" fill="#FFF9C4" />

        {/* Comb (Top) */}
        <path d="M85 60 Q 90 45 100 60 Q 110 45 115 60" fill="#FF5252" stroke="#FF5252" strokeWidth="5" strokeLinejoin="round" />

        {/* Eyes */}
        <circle cx="80" cy="100" r="5" fill="#333" />
        <circle cx="120" cy="100" r="5" fill="#333" />
        <circle cx="82" cy="98" r="2" fill="white" />
        <circle cx="122" cy="98" r="2" fill="white" />

        {/* Cheeks */}
        <circle cx="65" cy="115" r="8" fill="#FFAB91" opacity="0.5" />
        <circle cx="135" cy="115" r="8" fill="#FFAB91" opacity="0.5" />

        {/* Beak */}
        <path d="M92 108 L 108 108 L 100 118 Z" fill="#FF9800" stroke="#F57C00" strokeWidth="1" strokeLinejoin="round" />
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