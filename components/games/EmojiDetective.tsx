import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { Check, X } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const EmojiDetective: React.FC<Props> = ({ words, onComplete }) => {
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // 初始化時打亂所有單詞
  useEffect(() => {
    setShuffledWords([...words].sort(() => 0.5 - Math.random()));
  }, [words]);

  useEffect(() => {
    if (shuffledWords.length > 0) {
      generateQuestion();
    }
  }, [currentIndex, shuffledWords]);

  const generateQuestion = () => {
    const currentWord = shuffledWords[currentIndex];
    const distractors = words
      .filter(w => w.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const allOptions = [currentWord, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedId(null);
    setIsCorrect(null);
  };

  const handleSelect = (id: string) => {
    if (selectedId) return;
    
    setSelectedId(id);
    const correct = id === shuffledWords[currentIndex].id;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (currentIndex < shuffledWords.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1200);
    } else {
        setTimeout(() => {
            setSelectedId(null);
            setIsCorrect(null);
        }, 1000);
    }
  };

  const progress = (currentIndex / shuffledWords.length) * 100;

  if (shuffledWords.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-6xl mx-auto p-4 font-fredoka">
      <div className="w-full bg-white/50 rounded-full h-4 mb-8 max-w-2xl border-2 border-white shadow-inner">
        <div className="bg-gradient-to-r from-rose-400 to-pink-500 h-full rounded-full transition-all duration-500 shadow-md" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl mb-10 flex flex-col items-center w-full max-w-2xl border-b-[12px] border-rose-100 transform hover:rotate-1 transition-transform">
        <h3 className="text-2xl text-rose-400 font-black mb-4 flex items-center gap-2">🕵️ EMOJI DETECTIVE</h3>
        <div className="text-9xl mb-6 animate-bounce drop-shadow-lg">{shuffledWords[currentIndex].emoji}</div>
        
        <div className="text-5xl font-black text-gray-800 mb-4 tracking-tight">
            {shuffledWords[currentIndex].ch}
        </div>
        <div className="text-xl text-gray-400 font-bold italic">Find the matching word!</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-4xl">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`
              p-8 rounded-[2.5rem] text-3xl font-black transition-all transform active:scale-90 shadow-xl border-b-8
              ${selectedId === option.id 
                ? (isCorrect && option.id === shuffledWords[currentIndex].id ? 'bg-green-400 text-white border-green-600' : 'bg-red-400 text-white border-red-600 animate-shake-red')
                : 'bg-white text-gray-700 border-gray-100 hover:bg-rose-50 hover:border-rose-200'}
            `}
          >
            <div className="flex items-center justify-center gap-4">
              <span>{option.en.toLowerCase()}</span>
              {selectedId === option.id && (
                 isCorrect && option.id === shuffledWords[currentIndex].id ? <Check className="w-8 h-8"/> : <X className="w-8 h-8"/>
              )}
            </div>
          </button>
        ))}
      </div>
      <style>{`
        @keyframes shake-red {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake-red { animation: shake-red 0.1s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default EmojiDetective;