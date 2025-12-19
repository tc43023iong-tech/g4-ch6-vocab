import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const MatchingGame: React.FC<Props> = ({ words, onComplete }) => {
  const [batchIndex, setBatchIndex] = useState(0);
  const [allBatches, setAllBatches] = useState<WordItem[][]>([]);
  const [shuffledLeft, setShuffledLeft] = useState<WordItem[]>([]);
  const [shuffledRight, setShuffledRight] = useState<WordItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());

  const BATCH_SIZE = 5;

  // 初始化：洗牌所有單詞並分組
  useEffect(() => {
    const shuffledPool = [...words].sort(() => 0.5 - Math.random());
    const batches = [];
    for (let i = 0; i < shuffledPool.length; i += BATCH_SIZE) {
      batches.push(shuffledPool.slice(i, i + BATCH_SIZE));
    }
    setAllBatches(batches);
  }, [words]);

  useEffect(() => {
    if (allBatches.length > 0) {
      if (batchIndex < allBatches.length) {
        const currentBatch = allBatches[batchIndex];
        setShuffledLeft([...currentBatch].sort(() => 0.5 - Math.random()));
        setShuffledRight([...currentBatch].sort(() => 0.5 - Math.random()));
        setMatchedIds(new Set());
        setSelectedLeft(null);
      } else {
        onComplete();
      }
    }
  }, [batchIndex, allBatches]);

  const handleLeftClick = (id: string) => {
    if (matchedIds.has(id)) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.has(id) || !selectedLeft) return;

    if (selectedLeft === id) {
      const newMatched = new Set(matchedIds);
      newMatched.add(id);
      setMatchedIds(newMatched);
      setSelectedLeft(null);

      if (newMatched.size === allBatches[batchIndex].length) {
        setTimeout(() => {
          setBatchIndex(prev => prev + 1);
        }, 1000);
      }
    } else {
        const card = document.getElementById(`right-${id}`);
        card?.classList.add('animate-shake-red');
        setTimeout(() => card?.classList.remove('animate-shake-red'), 500);
        setSelectedLeft(null);
    }
  };

  const progress = (batchIndex / allBatches.length) * 100;

  if (allBatches.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col justify-center max-w-6xl mx-auto p-4 font-fredoka">
      <div className="w-full bg-white/50 rounded-full h-5 mb-10 max-w-4xl mx-auto border-2 border-white shadow-inner">
        <div className="bg-gradient-to-r from-purple-400 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-md" style={{ width: `${progress}%` }}></div>
      </div>
      
      <h3 className="text-4xl font-black text-center text-purple-600 mb-12 flex items-center justify-center gap-4">
        🧩 MATCH THE PAIRS <span className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-xl">{batchIndex + 1}/{allBatches.length}</span>
      </h3>

      <div className="flex flex-col md:flex-row justify-between gap-10 max-w-5xl mx-auto w-full flex-1 items-stretch">
        <div className="flex-1 space-y-4 w-full">
          {shuffledLeft.map(word => (
            <button
              key={word.id}
              onClick={() => handleLeftClick(word.id)}
              className={`w-full p-6 rounded-[2rem] shadow-xl text-2xl font-black transition-all transform active:scale-95 border-b-8
                ${matchedIds.has(word.id) ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100'}
                ${selectedLeft === word.id 
                  ? 'bg-purple-500 text-white border-purple-800 scale-105 ring-8 ring-purple-100' 
                  : 'bg-white text-gray-700 border-gray-100 hover:bg-purple-50'}
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
              className={`w-full p-6 rounded-[2rem] shadow-xl text-2xl font-black transition-all transform active:scale-95 border-b-8
                ${matchedIds.has(word.id) ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100'}
                bg-white text-indigo-600 border-indigo-50 hover:border-indigo-200
              `}
            >
              {word.en.toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes shake-red {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); background-color: #fee2e2; }
          75% { transform: translateX(8px); }
        }
        .animate-shake-red { animation: shake-red 0.1s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default MatchingGame;