import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const FillInBlank: React.FC<Props> = ({ words, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    generateQuestion();
  }, [currentIndex]);

  const generateQuestion = () => {
    const currentWord = words[currentIndex];
    const distractors = words
      .filter(w => w.id !== currentWord.id)
      // Try to match category (phrase vs vocab) for better distractors
      .filter(w => w.category === currentWord.category)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Fallback if not enough matching category
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
        setTimeout(() => {
            setSelectedId(null);
            setIsCorrect(null);
        }, 1200);
    }
  };

  const currentWord = words[currentIndex];
  // Split the clue by '___' to render it nicely
  const clueParts = (currentWord.sentenceClue || '___').split('___');

  const progress = (currentIndex / words.length) * 100;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center max-w-6xl mx-auto p-4">
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6 max-w-2xl">
        <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center border-b-8 border-green-200 max-w-3xl w-full">
        <div className="text-4xl mb-4">{currentWord.emoji}</div>
        <div className="text-2xl font-bold text-gray-700 leading-relaxed">
           {clueParts[0]}
           <span className="inline-block min-w-[100px] border-b-4 border-dashed border-gray-400 mx-2 text-blue-600">
             {isCorrect ? currentWord.en : '?'}
           </span>
           {clueParts[1]}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`
              p-5 rounded-xl text-lg font-bold border-2 transition-all
              ${selectedId === option.id 
                ? (option.id === currentWord.id 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-red-100 border-red-500 text-red-700')
                : 'bg-white border-gray-100 hover:border-green-300 hover:shadow-md text-gray-600'}
            `}
          >
            {option.en}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FillInBlank;