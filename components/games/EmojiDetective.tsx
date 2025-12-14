import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { Check, X } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const EmojiDetective: React.FC<Props> = ({ words, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Shuffle logic
  useEffect(() => {
    generateQuestion();
  }, [currentIndex]);

  const generateQuestion = () => {
    const currentWord = words[currentIndex];
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
    if (selectedId) return; // Prevent double click
    
    setSelectedId(id);
    const correct = id === words[currentIndex].id;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
        // Allow retry after delay or just stay there? Let's stay until correct for kids
        setTimeout(() => {
            setSelectedId(null);
            setIsCorrect(null);
        }, 1000);
    }
  };

  const progress = ((currentIndex) / words.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-6xl mx-auto p-4">
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6 max-w-2xl">
        <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 flex flex-col items-center w-full max-w-2xl border-b-8 border-blue-200">
        <h3 className="text-xl text-gray-500 font-bold mb-2">🕵️ Emoji Detective</h3>
        <div className="text-8xl mb-4 animate-bounce">{words[currentIndex].emoji}</div>
        <div className="text-xl text-gray-400 font-medium">What is this?</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`
              p-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-md
              ${selectedId === option.id 
                ? (isCorrect && option.id === words[currentIndex].id ? 'bg-green-400 text-white' : 'bg-red-400 text-white')
                : 'bg-white text-gray-700 hover:bg-yellow-50'}
            `}
          >
            <div className="flex items-center justify-between">
              <span>{option.en}</span>
              {selectedId === option.id && (
                 isCorrect && option.id === words[currentIndex].id ? <Check /> : <X />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiDetective;