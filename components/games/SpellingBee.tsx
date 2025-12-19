import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { RotateCcw, Volume2 } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const SpellingBee: React.FC<Props> = ({ words, onComplete }) => {
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<{char: string, id: number}[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{char: string, id: number}[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setShuffledWords([...words].sort(() => 0.5 - Math.random()));
  }, [words]);

  useEffect(() => {
    if (shuffledWords.length > 0) {
      loadWord();
    }
  }, [currentIndex, shuffledWords]);

  const loadWord = () => {
    const currentWord = shuffledWords[currentIndex];
    const text = currentWord.en.toLowerCase();
    
    let charIdCounter = 0;
    const chars = text.split('')
      .filter(c => c !== ' ')
      .map((char) => ({ char, id: charIdCounter++ }));
    
    const shuffled = [...chars].sort(() => 0.5 - Math.random());
    setScrambledLetters(shuffled);
    setSelectedLetters([]);
    setIsSuccess(false);
  };

  const handleLetterClick = (item: {char: string, id: number}) => {
    if (isSuccess) return;
    if (!selectedLetters.find(l => l.id === item.id)) {
        const newSelected = [...selectedLetters, item];
        setSelectedLetters(newSelected);
        checkWin(newSelected);
    }
  };

  const handleSelectedClick = (item: {char: string, id: number}) => {
    if (isSuccess) return;
    setSelectedLetters(selectedLetters.filter(l => l.id !== item.id));
  };

  const checkWin = (currentSelection: {char: string, id: number}[]) => {
    const attempt = currentSelection.map(l => l.char).join('');
    const target = shuffledWords[currentIndex].en.toLowerCase().replace(/ /g, '');
    
    if (attempt === target) {
      setIsSuccess(true);
      setTimeout(() => {
        if (currentIndex < shuffledWords.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1500);
    }
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(shuffledWords[currentIndex].en);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (shuffledWords.length === 0) return null;

  const currentWord = shuffledWords[currentIndex];
  const targetString = currentWord.en.toLowerCase();
  const progress = (currentIndex / shuffledWords.length) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-6xl mx-auto p-4 font-fredoka overflow-y-auto">
      <div className="w-full bg-white/50 rounded-full h-5 mb-8 max-w-3xl border-2 border-white shadow-inner">
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500 shadow-md" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-2xl mb-12 text-center border-b-[12px] border-yellow-100 relative animate-float-slow">
        <button onClick={speak} className="absolute top-6 right-6 p-4 bg-yellow-50 rounded-full hover:bg-yellow-100 transition-colors shadow-sm">
           <Volume2 className="text-yellow-600 w-8 h-8" />
        </button>
        <div className="text-[10rem] mb-4 drop-shadow-xl">{currentWord.emoji}</div>
        <div className="text-5xl text-gray-800 font-black tracking-tight">{currentWord.ch}</div>
      </div>

      <div className="flex flex-wrap justify-center items-end gap-3 mb-12 min-h-[80px]">
        {(() => {
            let letterIndex = 0;
            return targetString.split('').map((char, idx) => {
              if (char === ' ') {
                return <div key={`space-${idx}`} className="w-8 h-12 flex items-center justify-center mx-2"><div className="w-full h-2 bg-gray-200 rounded-full"></div></div>;
              }
              const selectedItem = selectedLetters[letterIndex];
              const isFilled = selectedItem !== undefined;
              if (isFilled) {
                letterIndex++;
                return (
                  <button key={selectedItem.id} onClick={() => handleSelectedClick(selectedItem)}
                    className="w-14 h-16 bg-yellow-400 text-white text-4xl font-black rounded-2xl shadow-lg hover:bg-red-400 transition-all flex items-center justify-center animate-pop"
                  >
                    {selectedItem.char}
                  </button>
                );
              } else {
                return <div key={`empty-${idx}`} className="w-14 h-16 bg-gray-50 border-b-[6px] border-gray-200 rounded-2xl"></div>;
              }
            });
        })()}
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mb-10">
        {scrambledLetters.map((item) => {
            const isUsed = selectedLetters.find(l => l.id === item.id);
            return (
                <button
                    key={item.id}
                    onClick={() => handleLetterClick(item)}
                    disabled={!!isUsed}
                    className={`
                        w-16 h-16 bg-white border-2 border-gray-100 text-gray-700 text-3xl font-black rounded-[1.5rem] shadow-xl transition-all active:scale-90
                        ${isUsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100 hover:bg-blue-50 hover:border-blue-300'}
                    `}
                >
                    {item.char}
                </button>
            )
        })}
      </div>
      
      <div className="flex items-center gap-2 text-gray-400 font-bold bg-white/50 px-6 py-2 rounded-full">
        <RotateCcw className="w-5 h-5"/> Tap a letter to undo!
      </div>

      <style>{`
        @keyframes pop {
            0% { transform: scale(0.5); }
            100% { transform: scale(1); }
        }
        .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default SpellingBee;