import React, { useState } from 'react';

export default function ThreeDog({ message }: { message?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center -mt-8 -mb-12 h-96 w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        @keyframes dogWag {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-15deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes dogBlink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        @keyframes dogEarLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }
        @keyframes dogEarRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        .dog-tail {
          transform-origin: 20% 90%;
          animation: dogWag 2s ease-in-out infinite;
        }
        .dog-eye {
          transform-origin: center;
          animation: dogBlink 4s infinite;
        }
        .dog-ear-l { transform-origin: top right; animation: dogEarLeft 3s ease-in-out infinite; }
        .dog-ear-r { transform-origin: top left; animation: dogEarRight 3s ease-in-out infinite; }
      `}</style>
      
      {/* Custom Cute SVG Dog - Shiba Inu Style */}
      <svg 
        viewBox="0 0 200 200" 
        className={`w-48 h-48 md:w-64 md:h-64 transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
      >
        {/* Tail */}
        <path d="M140 130 Q 160 110 160 80 Q 150 70 140 90" stroke="#E6CFA1" strokeWidth="14" fill="none" strokeLinecap="round" className="dog-tail" />

        {/* Back Legs */}
        <ellipse cx="70" cy="165" rx="15" ry="12" fill="#D4B483" />
        <ellipse cx="130" cy="165" rx="15" ry="12" fill="#D4B483" />

        {/* Body - Rounder */}
        <rect x="55" y="90" width="90" height="85" rx="40" fill="#E6CFA1" />
        <path d="M75 120 Q 100 170 125 120" fill="#F5F5DC" opacity="0.8" /> {/* Belly */}

        {/* Head */}
        <circle cx="100" cy="85" r="55" fill="#E6CFA1" />
        
        {/* Cheeks/Face Mask */}
        <path d="M60 90 Q 100 120 140 90 Q 140 110 100 125 Q 60 110 60 90" fill="#F5F5DC" />

        {/* Ears - Triangular & Soft */}
        <path d="M65 55 L 50 25 Q 65 20 80 45 Z" fill="#D4B483" stroke="#D4B483" strokeWidth="5" strokeLinejoin="round" className="dog-ear-l" />
        <path d="M135 55 L 150 25 Q 135 20 120 45 Z" fill="#D4B483" stroke="#D4B483" strokeWidth="5" strokeLinejoin="round" className="dog-ear-r" />
        
        {/* Inner Ears */}
        <path d="M68 52 L 58 35 L 75 48 Z" fill="#F5F5DC" className="dog-ear-l" />
        <path d="M132 52 L 142 35 L 125 48 Z" fill="#F5F5DC" className="dog-ear-r" />

        {/* Eyes */}
        <g className="dog-eye">
          <circle cx="80" cy="85" r="7" fill="#3E2723" />
          <circle cx="120" cy="85" r="7" fill="#3E2723" />
          <circle cx="82" cy="83" r="2.5" fill="white" />
          <circle cx="122" cy="83" r="2.5" fill="white" />
          {/* Eyebrows */}
          <ellipse cx="80" cy="72" rx="4" ry="3" fill="#F5F5DC" />
          <ellipse cx="120" cy="72" rx="4" ry="3" fill="#F5F5DC" />
        </g>

        {/* Snout */}
        <ellipse cx="100" cy="100" rx="14" ry="10" fill="#3E2723" />
        <path d="M92 96 Q 96 98 94 100" fill="rgba(255,255,255,0.3)" /> {/* Nose shine */}

        {/* Mouth */}
        <path d="M100 110 L 100 115" stroke="#3E2723" strokeWidth="2" />
        <path d="M94 115 Q 100 122 106 115" stroke="#3E2723" strokeWidth="2" fill="none" />

        {/* Front Paws */}
        <ellipse cx="85" cy="165" rx="12" ry="10" fill="#F5F5DC" />
        <ellipse cx="115" cy="165" rx="12" ry="10" fill="#F5F5DC" />
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