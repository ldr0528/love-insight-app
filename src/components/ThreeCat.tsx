import React, { useState } from 'react';

export default function ThreeCat({ message }: { message?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center -mt-8 -mb-12 h-96 w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        @keyframes tailMove {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes catBlink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        @keyframes catEar {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        .cat-tail {
          transform-origin: 80% 80%;
          animation: tailMove 4s ease-in-out infinite;
        }
        .cat-eye {
          transform-origin: center;
          animation: catBlink 5s infinite;
        }
        .cat-ear-l { transform-origin: bottom right; animation: catEar 4s ease-in-out infinite reverse; }
        .cat-ear-r { transform-origin: bottom left; animation: catEar 4s ease-in-out infinite; }
      `}</style>
      
      {/* Custom Cute SVG Cat - Rounder Style */}
      <svg 
        viewBox="0 0 200 200" 
        className={`w-48 h-48 md:w-64 md:h-64 transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
      >
        {/* Tail */}
        <path d="M140 140 Q 180 130 180 90 Q 170 80 160 90" stroke="#9E9E9E" strokeWidth="16" fill="none" strokeLinecap="round" className="cat-tail" />
        
        {/* Body - Round Bun Shape */}
        <ellipse cx="100" cy="145" rx="65" ry="50" fill="#E0E0E0" />
        <ellipse cx="100" cy="150" rx="40" ry="35" fill="#F5F5F5" /> {/* Belly */}

        {/* Back Paws */}
        <ellipse cx="50" cy="165" rx="12" ry="10" fill="#E0E0E0" />
        <ellipse cx="150" cy="165" rx="12" ry="10" fill="#E0E0E0" />

        {/* Ears - Rounder */}
        <path d="M55 75 Q 40 40 70 50 Z" fill="#E0E0E0" stroke="#E0E0E0" strokeWidth="6" strokeLinejoin="round" className="cat-ear-l" />
        <path d="M145 75 Q 160 40 130 50 Z" fill="#E0E0E0" stroke="#E0E0E0" strokeWidth="6" strokeLinejoin="round" className="cat-ear-r" />
        <path d="M58 72 Q 48 50 65 58 Z" fill="#FFAB91" className="cat-ear-l" /> 
        <path d="M142 72 Q 152 50 135 58 Z" fill="#FFAB91" className="cat-ear-r" />

        {/* Head - Round */}
        <circle cx="100" cy="90" r="55" fill="#E0E0E0" />
        
        {/* Eyes */}
        <g className="cat-eye">
          <circle cx="75" cy="85" r="7" fill="#333" />
          <circle cx="125" cy="85" r="7" fill="#333" />
          <circle cx="77" cy="83" r="2.5" fill="white" />
          <circle cx="127" cy="83" r="2.5" fill="white" />
        </g>

        {/* Cheeks */}
        <circle cx="65" cy="100" r="8" fill="#FFAB91" opacity="0.4" />
        <circle cx="135" cy="100" r="8" fill="#FFAB91" opacity="0.4" />

        {/* Nose & Mouth */}
        <path d="M96 95 L 104 95 L 100 102 Z" fill="#FFAB91" />
        <path d="M100 102 Q 90 110 85 102" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M100 102 Q 110 110 115 102" stroke="#333" strokeWidth="2" fill="none" />

        {/* Whiskers */}
        <path d="M55 95 L 35 90 M 55 100 L 35 100 M 55 105 L 35 110" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
        <path d="M145 95 L 165 90 M 145 100 L 165 100 M 145 105 L 165 110" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />

        {/* Front Paws */}
        <ellipse cx="85" cy="145" rx="14" ry="10" fill="#F5F5F5" />
        <ellipse cx="115" cy="145" rx="14" ry="10" fill="#F5F5F5" />
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
