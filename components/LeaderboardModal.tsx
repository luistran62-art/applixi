import React, { useEffect, useState } from 'react';
import { X, Trophy, Medal } from 'lucide-react';
import { getLeaderboard } from '../utils/storage';
import { LeaderboardEntry } from '../types';

interface Props {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<Props> = ({ onClose }) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setScores(getLeaderboard());
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-tet-cream w-full max-w-md rounded-2xl shadow-2xl border-4 border-tet-gold overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="bg-tet-red p-4 flex justify-between items-center text-tet-gold border-b-2 border-tet-gold">
          <h2 className="font-tet text-3xl flex items-center gap-2">
            <Trophy className="text-yellow-400 fill-current" /> Bảng Vàng
          </h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 bg-white/50">
          {scores.length === 0 ? (
            <div className="text-center py-8 text-gray-500 italic">Chưa có ai ghi danh. Hãy là người đầu tiên!</div>
          ) : (
            <div className="space-y-2">
              {scores.map((entry, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${idx < 3 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        idx === 0 ? 'bg-yellow-500 text-white' : 
                        idx === 1 ? 'bg-gray-400 text-white' : 
                        idx === 2 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                        {idx + 1}
                    </div>
                    <div>
                        <div className="font-bold text-tet-darkRed">{entry.name}</div>
                        <div className="text-xs text-gray-500">{entry.date}</div>
                    </div>
                  </div>
                  <div className="font-black text-xl text-tet-red">{entry.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};