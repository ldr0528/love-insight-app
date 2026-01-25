import React, { useState } from 'react';

export default function ThreeChicken({ message }: { message?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center -mt-8 -mb-12 h-96 w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        @keyframes chickenBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes wingFlap {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes chickenBlink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        .chicken-body {
          animation: chickenBob 2s ease-in-out infinite;
        }
        .chicken-wing-l { transform-origin: 40px 110px; animation: wingFlap 0.5s ease-in-out infinite alternate; }
        .chicken-wing-r { transform-origin: 160px 110px; animation: wingFlap 0.5s ease-in-out infinite alternate-reverse; }
        .chicken-eye {
          transform-origin: center;
          animation: chickenBlink 3s infinite;
        }
      `}</style>
      
      {/* Custom Cute SVG Chicken - Rounder Style */}
      <svg 
        viewBox="0 0 200 200" 
        className={`w-48 h-48 md:w-64 md:h-64 transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
      >
        <g className="chicken-body">
          {/* Legs */}
          <line x1="85" y1="165" x2="85" y2="185" stroke="#FF9800" strokeWidth="4" />
          <line x1="115" y1="165" x2="115" y2="185" stroke="#FF9800" strokeWidth="4" />
          <path d="M85 185 L 75 190 M 85 185 L 85 193 M 85 185 L 95 190" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" />
          <path d="M115 185 L 105 190 M 115 185 L 115 193 M 115 185 L 125 190" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" />

          {/* Comb (Top) - Rounded */}
          <path d="M85 65 Q 90 50 100 65 Q 110 50 115 65" fill="#FF5252" stroke="#FF5252" strokeWidth="8" strokeLinejoin="round" />

          {/* Body - Perfect Egg Shape */}
          <path d="M100 40 Q 170 40 170 115 Q 170 175 100 175 Q 30 175 30 115 Q 30 40 100 40" fill="#FFF59D" />
          
          {/* Wings */}
          <path d="M35 110 Q 20 120 30 140 Q 50 150 60 130" fill="#FBC02D" className="chicken-wing-l" /> 
          <path d="M165 110 Q 180 120 170 140 Q 150 150 140 130" fill="#FBC02D" className="chicken-wing-r" /> 
          
          {/* Belly Blush */}
          <ellipse cx="100" cy="145" rx="40" ry="25" fill="#FFF9C4" opacity="0.8" />

          {/* Eyes */}
          <g className="chicken-eye">
            <circle cx="75" cy="100" r="6" fill="#333" />
            <circle cx="125" cy="100" r="6" fill="#333" />
            <circle cx="77" cy="98" r="2.5" fill="white" />
            <circle cx="127" cy="98" r="2.5" fill="white" />
          </g>

          {/* Cheeks */}
          <circle cx="60" cy="115" r="9" fill="#FFAB91" opacity="0.6" />
          <circle cx="140" cy="115" r="9" fill="#FFAB91" opacity="0.6" />

          {/* Beak */}
          <path d="M92 110 Q 100 120 108 110 L 100 105 Z" fill="#FF9800" stroke="#F57C00" strokeWidth="1" strokeLinejoin="round" />
        </g>
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