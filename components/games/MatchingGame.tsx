import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const MatchingGame: React.FC<Props> = ({ words, onComplete }) => {
  const [batchIndex, setBatchIndex] = useState(0);
  const [shuffledLeft, setShuffledLeft] = useState<WordItem[]>([]);
  const [shuffledRight, setShuffledRight] = useState<WordItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());

  // Split words into chunks of 5
  const BATCH_SIZE = 5;
  const batches = [];
  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    batches.push(words.slice(i, i + BATCH_SIZE));
  }

  useEffect(() => {
    if (batchIndex < batches.length) {
      const currentBatch = batches[batchIndex];
      setShuffledLeft([...currentBatch].sort(() => 0.5 - Math.random()));
      setShuffledRight([...currentBatch].sort(() => 0.5 - Math.random()));
      setMatchedIds(new Set());
      setSelectedLeft(null);
    } else {
      onComplete();
    }
  }, [batchIndex]);

  const handleLeftClick = (id: string) => {
    if (matchedIds.has(id)) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.has(id) || !selectedLeft) return;

    if (selectedLeft === id) {
      // Match!
      const newMatched = new Set(matchedIds);
      newMatched.add(id);
      setMatchedIds(newMatched);
      setSelectedLeft(null);

      // Check if batch complete
      if (newMatched.size === batches[batchIndex].length) {
        setTimeout(() => {
          setBatchIndex(prev => prev + 1);
        }, 1000);
      }
    } else {
        // Wrong
        const card = document.getElementById(`right-${id}`);
        card?.classList.add('animate-shake');
        setTimeout(() => card?.classList.remove('animate-shake'), 500);
        setSelectedLeft(null);
    }
  };

  const progress = (batchIndex / batches.length) * 100;

  if (batchIndex >= batches.length) return <div>Done!</div>;

  return (
    <div className="w-full h-full flex flex-col justify-center max-w-6xl mx-auto p-4">
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6 max-w-4xl mx-auto">
        <div className="bg-purple-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
      
      <h3 className="text-2xl font-bold text-center text-purple-600 mb-8">
        🧩 Match the Pairs ({batchIndex + 1}/{batches.length})
      </h3>

      <div className="flex flex-col md:flex-row justify-between gap-8 max-w-6xl mx-auto w-full flex-1 items-center">
        <div className="flex-1 space-y-4 w-full">
          {shuffledLeft.map(word => (
            <button
              key={word.id}
              onClick={() => handleLeftClick(word.id)}
              className={`w-full p-4 rounded-xl shadow-md text-lg font-bold transition-all
                ${matchedIds.has(word.id) ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                ${selectedLeft === word.id 
                  ? 'bg-purple-500 text-white scale-105 ring-4 ring-purple-200' 
                  : 'bg-white text-gray-700 hover:bg-purple-50'}
              `}
            >
              {word.ch}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4 w-full">
          {shuffledRight.map(word => (
            <button
              id={`right-${word.id}`}
              key={word.id}
              onClick={() => handleRightClick(word.id)}
              className={`w-full p-4 rounded-xl shadow-md text-lg font-bold transition-all
                ${matchedIds.has(word.id) ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-300
              `}
            >
              {word.en}
            </button>
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default MatchingGame;