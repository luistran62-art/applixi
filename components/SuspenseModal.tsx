import React, { useEffect } from 'react';
import { playSound } from '../utils/audio';

interface Props {
  onFinish: () => void;
}

export const SuspenseModal: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    playSound('suspense');
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="animate-shake-hard origin-center">
             <div className="w-48 h-64 bg-tet-red rounded-lg shadow-2xl border-4 border-tet-gold flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10" 
                     style={{backgroundImage: 'radial-gradient(#FFD700 2px, transparent 2px)', backgroundSize: '10px 10px'}}>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-tet-gold flex items-center justify-center bg-tet-red z-10 mb-4">
                  <span className="font-tet text-tet-gold text-4xl font-bold">Tết</span>
                </div>
                <div className="text-tet-gold font-bold text-xl uppercase tracking-wider text-center z-10">
                  Mở Ngay...
                </div>
             </div>
        </div>
        <div className="mt-8 text-white text-2xl font-bold animate-pulse">Đang mở lì xì...</div>
      </div>
    </div>
  );
};