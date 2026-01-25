import React, { useState } from 'react';

export default function ThreeDog({ message }: { message?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center -mt-8 -mb-12 h-96 w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Custom Cute SVG Dog */}
      <svg 
        viewBox="0 0 200 200" 
        className={`w-48 h-48 md:w-64 md:h-64 transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
      >
        {/* Tail (Wagging) */}
        <path d="M130 140 Q 160 130 160 100" stroke="#D7CCC8" strokeWidth="12" fill="none" strokeLinecap="round" className="animate-bounce" style={{ transformOrigin: 'center' }} />

        {/* Body */}
        <rect x="50" y="100" width="100" height="80" rx="40" fill="#E6CFA1" />
        <ellipse cx="100" cy="140" rx="30" ry="25" fill="#F5F5DC" /> {/* Belly */}

        {/* Ears (Floppy) */}
        <path d="M55 70 Q 20 80 30 120 Q 45 130 60 90" fill="#D4B483" />
        <path d="M145 70 Q 180 80 170 120 Q 155 130 140 90" fill="#D4B483" />

        {/* Head */}
        <rect x="55" y="50" width="90" height="80" rx="35" fill="#E6CFA1" />
        
        {/* Eyes (One with patch) */}
        <circle cx="130" cy="80" r="18" fill="#D4B483" opacity="0.5" /> {/* Patch */}
        <circle cx="80" cy="85" r="7" fill="#3E2723" />
        <circle cx="120" cy="85" r="7" fill="#3E2723" />
        <circle cx="82" cy="83" r="2" fill="white" />
        <circle cx="122" cy="83" r="2" fill="white" />

        {/* Snout */}
        <ellipse cx="100" cy="105" rx="22" ry="16" fill="#F5F5DC" />
        <path d="M90 100 Q 100 100 110 100 Q 100 120 90 100" fill="#3E2723" transform="translate(0, -5)" /> {/* Nose */}
        
        {/* Mouth/Tongue */}
        <path d="M100 110 L 100 115" stroke="#3E2723" strokeWidth="2" />
        <path d="M95 115 Q 100 120 105 115" stroke="#3E2723" strokeWidth="2" fill="none" />
        <path d="M98 116 Q 100 125 102 116" fill="#FF8A80" /> {/* Tongue */}

        {/* Paws */}
        <circle cx="70" cy="175" r="14" fill="#E6CFA1" />
        <circle cx="130" cy="175" r="14" fill="#E6CFA1" />
        <circle cx="70" cy="172" r="10" fill="#F5F5DC" />
        <circle cx="130" cy="172" r="10" fill="#F5F5DC" />
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