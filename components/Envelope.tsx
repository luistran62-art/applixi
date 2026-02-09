import React from 'react';
import { Envelope as EnvelopeType } from '../types';

interface Props {
  data: EnvelopeType;
  onClick: (id: number) => void;
  disabled: boolean;
}

export const EnvelopeItem: React.FC<Props> = ({ data, onClick, disabled }) => {
  
  // Background gradient based on variant
  const bgGradient = data.variant === 0 
    ? 'bg-gradient-to-br from-red-500 to-red-700'
    : data.variant === 1
    ? 'bg-gradient-to-br from-red-600 to-red-800'
    : 'bg-gradient-to-br from-red-500 to-orange-700';

  return (
    <div 
        className="absolute flex flex-col items-center group z-10"
        style={{ 
            left: `${data.x}%`,
            top: `${data.y}%`,
            transform: `scale(${data.scale}) rotate(${data.rotation}deg)`,
            zIndex: data.isOpen ? 0 : 10,
            transition: 'top 0.5s ease-in-out'
        }}
    >
      {/* String hanging from tree */}
      <div 
        className="w-0.5 bg-yellow-600 mb-[-2px] origin-bottom animate-swing"
        style={{ 
            height: '15px',
            animationDelay: `${data.delay}s`,
            animationDuration: `${3 + data.delay}s`
        }}
      ></div>
      
      {/* Envelope Body */}
      <button
        onClick={() => !disabled && !data.isOpen && onClick(data.id)}
        disabled={disabled || data.isOpen}
        style={{ 
            animationDelay: `${data.delay}s`,
            animationDuration: `${3 + data.delay}s`
        }}
        className={`
          relative w-14 h-20 sm:w-16 sm:h-24
          transform origin-top animate-swing
          transition-all duration-300
          ${data.isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'hover:scale-110 opacity-100'}
          ${disabled && !data.isOpen ? 'opacity-70 grayscale cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className={`w-full h-full ${bgGradient} rounded-md shadow-lg border border-yellow-400 flex flex-col items-center justify-center p-1 relative overflow-hidden`}>
          {/* Decorative pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30" 
               style={{backgroundImage: 'radial-gradient(#FFD700 1.5px, transparent 1.5px)', backgroundSize: '8px 8px'}}>
          </div>
          
          {/* Center Character/Icon */}
          <div className="w-10 h-10 rounded-full border-2 border-yellow-300 flex items-center justify-center bg-red-800 z-10 mb-1 shadow-inner">
            <span className="font-tet text-yellow-300 text-lg font-bold leading-none mt-1">
                {data.decoration}
            </span>
          </div>
          
          {/* Decorative Text Bottom */}
          <div className="text-yellow-200 font-bold text-[8px] uppercase tracking-wider text-center z-10 leading-tight opacity-80">
             Vạn Sự<br/>Như Ý
          </div>

          {/* Bottom flap decoration */}
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-500 rotate-45 z-0 opacity-20 border border-yellow-200"></div>
        </div>
      </button>
    </div>
  );
};