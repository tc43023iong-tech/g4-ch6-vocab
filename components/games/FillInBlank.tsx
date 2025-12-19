import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { Check, X } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const FillInBlank: React.FC<Props> = ({ words, onComplete }) => {
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
      .filter(w => w.category === currentWord.category)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    if (distractors.length < 3) {
        const others = words.filter(w => w.id !== currentWord.id && !distractors.includes(w))
        .slice(0, 3 - distractors.length);
        distractors.push(...others);
    }

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
      }, 1500);
    } else {
        setTimeout(() => {
            setSelectedId(null);
            setIsCorrect(null);
        }, 1200);
    }
  };

  if (shuffledWords.length === 0) return null;

  const currentWord = shuffledWords[currentIndex];
  const clueParts = (currentWord.sentenceClue || '___').split('___');
  const progress = (currentIndex / shuffledWords.length) * 100;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center max-w-6xl mx-auto p-4 font-fredoka">
      <div className="w-full bg-white/50 rounded-full h-5 mb-10 max-w-3xl border-2 border-white shadow-inner">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-md" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl p-12 mb-10 text-center border-b-[12px] border-green-100 max-w-4xl w-full">
        <div className="text-8xl mb-8 drop-shadow-lg animate-bounce">{currentWord.emoji}</div>
        <div className="text-4xl md:text-5xl font-black text-gray-800 leading-[1.4] tracking-tight">
           {clueParts[0]}
           <span className="inline-block min-w-[200px] border-b-[6px] border-dashed border-green-300 mx-4 text-blue-600 bg-blue-50 px-6 rounded-2xl">
             {isCorrect ? currentWord.en.toLowerCase() : '?'}
           </span>
           {clueParts[1]}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`
              p-8 rounded-[2.5rem] text-3xl font-black border-b-8 transition-all transform active:scale-95 shadow-xl
              ${selectedId === option.id 
                ? (option.id === currentWord.id 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-red-100 border-red-500 text-red-700 animate-shake-red')
                : 'bg-white border-gray-100 hover:border-green-300 hover:bg-green-50 text-gray-600'}
            `}
          >
            <div className="flex items-center justify-center gap-4">
                <span>{option.en.toLowerCase()}</span>
                {selectedId === option.id && (
                    option.id === currentWord.id ? <Check className="w-8 h-8"/> : <X className="w-8 h-8"/>
                )}
            </div>
          </button>
        ))}
      </div>
      <style>{`
        @keyframes shake-red {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake-red { animation: shake-red 0.1s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default FillInBlank;