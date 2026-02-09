import React, { useState, useEffect } from 'react';
import { EnvelopeContent, ContentType, MathQuestion, MoneyReward } from '../types';
import { playSound } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';
import { CheckCircle, XCircle, Coins } from 'lucide-react';

interface Props {
  content: EnvelopeContent | null;
  onClose: (pointsEarned: number, description: string) => void;
}

export const ResultModal: React.FC<Props> = ({ content, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (content?.type === ContentType.MONEY_REWARD) {
      playSound('win');
      fireConfetti();
    } else if (content?.type === ContentType.MATH_QUESTION) {
      playSound('open');
    }
  }, [content]);

  if (!content) return null;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    
    const question = content.data as MathQuestion;
    const correct = index === question.correctAnswerIndex;
    
    setSelectedOption(index);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playSound('win');
      fireConfetti();
    } else {
      playSound('wrong');
    }
  };

  const handleContinue = () => {
    if (content.type === ContentType.MATH_QUESTION) {
      const q = content.data as MathQuestion;
      const points = isCorrect ? q.points : 0;
      const desc = isCorrect 
        ? `Trả lời đúng: "${q.question}"` 
        : `Trả lời sai: "${q.question}"`;
      onClose(points, desc);
    } else {
      const r = content.data as MoneyReward;
      onClose(r.amount, `Lì xì: ${r.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-pop">
      <div className="bg-tet-cream w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-4 border-tet-gold">
        
        {/* Header */}
        <div className="bg-tet-red p-4 text-center border-b-4 border-tet-gold">
          <h2 className="font-tet text-3xl text-tet-gold drop-shadow-md">
            {content.type === ContentType.MATH_QUESTION ? 'Thử Thách Trí Tuệ' : 'Chúc Mừng Năm Mới'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {content.type === ContentType.MONEY_REWARD ? (
            <div className="text-center py-4">
              <Coins className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
              <p className="text-2xl font-bold text-tet-darkRed mb-2">{(content.data as MoneyReward).message}</p>
              <p className="text-5xl font-extrabold text-tet-red drop-shadow-sm">
                +{(content.data as MoneyReward).amount} <span className="text-2xl">điểm</span>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl border-2 border-red-100 shadow-inner">
                <p className="text-xl font-bold text-center text-gray-800">
                  {(content.data as MathQuestion).question}
                </p>
                <div className="text-center mt-2 text-sm text-red-500 font-semibold">
                  (Trả lời đúng nhận {(content.data as MathQuestion).points} điểm)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(content.data as MathQuestion).options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showResult}
                    className={`
                      p-3 rounded-lg font-bold text-lg transition-all duration-200 border-2
                      ${showResult 
                        ? idx === (content.data as MathQuestion).correctAnswerIndex
                          ? 'bg-green-500 text-white border-green-600'
                          : idx === selectedOption
                            ? 'bg-red-500 text-white border-red-600'
                            : 'bg-gray-100 text-gray-400 border-gray-200'
                        : 'bg-white hover:bg-yellow-50 text-gray-700 border-yellow-200 hover:border-yellow-400 active:scale-95'
                      }
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={`text-center p-3 rounded-lg font-bold flex items-center justify-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isCorrect ? <CheckCircle size={24}/> : <XCircle size={24}/>}
                  {isCorrect ? 'Tuyệt vời! Bạn đã trả lời đúng.' : 'Tiếc quá! Bạn chọn sai rồi.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-center">
          {(content.type === ContentType.MONEY_REWARD || showResult) && (
            <button
              onClick={handleContinue}
              className="bg-tet-red hover:bg-tet-darkRed text-tet-gold font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 text-lg"
            >
              {content.type === ContentType.MATH_QUESTION && !isCorrect ? 'Đóng' : 'Nhận Lì Xì'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};