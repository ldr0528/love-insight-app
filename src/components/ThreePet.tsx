import React, { memo } from 'react';

interface ThreePetProps {
  imageSrc: string;
  altText: string;
  message?: React.ReactNode;
}

const ThreePet: React.FC<ThreePetProps> = memo(({ imageSrc, altText, message }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[300px]">
       <style>{`
         @keyframes pet-float {
           0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
           50% { transform: translateY(-12px) rotate(2deg) scale(1.02); }
         }
         .animate-pet-float {
           animation: pet-float 3.5s ease-in-out infinite;
         }
       `}</style>
       {/* Bubble for message */}
       <div className={`mb-6 transition-all duration-500 transform ${message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {message && (
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl rounded-bl-none border border-orange-100 shadow-lg max-w-xs md:max-w-md mx-auto relative">
            <p className="text-gray-800 text-center font-medium text-lg leading-relaxed">{message}</p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b border-r border-orange-100 transform rotate-45"></div>
            </div>
        )}
       </div>

      {/* Pet Image */}
      <div className="relative w-56 h-56 md:w-72 md:h-72 transition-transform hover:scale-105 duration-300 cursor-pointer animate-pet-float">
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-contain drop-shadow-2xl will-change-transform"
          loading="eager"
          decoding="async"
        />
        
        {/* Simple shadow effect */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-6 bg-black/5 blur-xl rounded-full" />
      </div>
    </div>
  );
});

export default ThreePet;
