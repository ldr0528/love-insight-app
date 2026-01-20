
import React from 'react';

interface MBTICharacterProps {
  type: string;
  className?: string;
}

export default function MBTICharacter({ type, className = '' }: MBTICharacterProps) {
  const upperType = type.toUpperCase();
  // Assuming images are stored as ENFJ.jpg, ISTP.jpg etc. in public/images/
  const imagePath = `/images/${upperType}.jpg`;

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 rounded-xl ${className}`}
      style={{
        aspectRatio: '1/1',
      }}
    >
      <img
        src={imagePath}
        alt={`MBTI Character: ${upperType}`}
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        onError={(e) => {
          // Fallback if image fails
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=' + upperType;
        }}
      />
      
      {/* Optional: Add a subtle gradient overlay for better text contrast if needed later */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
    </div>
  );
}
