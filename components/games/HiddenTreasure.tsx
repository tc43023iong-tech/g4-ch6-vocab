import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const HiddenTreasure: React.FC<Props> = ({ words, onComplete }) => {
  const [round, setRound] = useState(0);
  const [currentSet, setCurrentSet] = useState<WordItem[]>([]);
  const [missingItem, setMissingItem] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [phase, setPhase] = useState<'memorize' | 'hiding' | 'guess' | 'result'>('memorize');
  const [timeLeft, setTimeLeft] = useState(5);

  const TOTAL_ROUNDS = 5;

  useEffect(() => {
    startRound();
  }, [round]);

  useEffect(() => {
    if (phase === 'memorize') {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setPhase('hiding');
            setTimeout(() => {
                setPhase('guess');
            }, 1000);
        }
    }
  }, [timeLeft, phase]);

  const startRound = () => {
    setPhase('memorize');
    setTimeLeft(5); // 5 seconds to memorize
    
    // Pick 3 items
    const setSize = 3;
    const items = [...words].sort(() => 0.5 - Math.random()).slice(0, setSize);
    setCurrentSet(items);
    
    // Decide who goes missing
    const missing = items[Math.floor(Math.random() * items.length)];
    setMissingItem(missing);
    
    // Options: The missing item + 2 distractors (from outside the set)
    const distractors = words
        .filter(w => !items.includes(w))
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
    
    setOptions([missing, ...distractors].sort(() => 0.5 - Math.random()));
  };

  const handleGuess = (guessId: string) => {
    if (phase !== 'guess' || !missingItem) return;

    if (guessId === missingItem.id) {
        setPhase('result');
        setTimeout(() => {
            if (round < TOTAL_ROUNDS - 1) {
                setRound(prev => prev + 1);
            } else {
                onComplete();
            }
        }, 1500);
    } else {
        // Shake animation logic typically goes here
        const el = document.getElementById(`opt-${guessId}`);
        el?.classList.add('bg-red-100', 'border-red-400');
        setTimeout(() => el?.classList.remove('bg-red-100', 'border-red-400'), 500);
    }
  };

  const progress = (round / TOTAL_ROUNDS) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center max-w-4xl mx-auto p-4">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6 max-w-2xl">
            <div className="bg-amber-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        {phase === 'memorize' && (
            <div className="flex flex-col items-center w-full">
                <div className="mb-8 bg-amber-100 text-amber-800 px-6 py-2 rounded-full font-bold text-xl flex items-center gap-2">
                    <Eye className="w-6 h-6"/> Memorize these! ({timeLeft}s)
                </div>
                
                <div className="grid grid-cols-3 gap-4 md:gap-8">
                    {currentSet.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-3xl shadow-xl border-b-8 border-amber-200 flex flex-col items-center w-24 md:w-32 animate-pop-in">
                            <div className="text-5xl md:text-6xl mb-2">{item.emoji}</div>
                            <div className="text-xs md:text-sm font-bold text-gray-500 text-center">{item.en}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {phase === 'hiding' && (
            <div className="flex-1 flex items-center justify-center">
                 <div className="text-8xl animate-bounce">💨</div>
            </div>
        )}

        {(phase === 'guess' || phase === 'result') && (
            <div className="flex flex-col items-center w-full">
                 <div className="mb-8 bg-purple-100 text-purple-800 px-6 py-2 rounded-full font-bold text-xl flex items-center gap-2">
                    <HelpCircle className="w-6 h-6"/> Who is missing?
                </div>

                {/* Display the remaining ones */}
                <div className="flex gap-4 mb-12 opacity-50 grayscale">
                     {currentSet.filter(i => i.id !== missingItem?.id).map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl border-2 border-gray-200">
                             <div className="text-4xl">{item.emoji}</div>
                        </div>
                     ))}
                     <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-400 flex items-center justify-center w-20">
                         <span className="text-2xl font-bold text-gray-300">?</span>
                     </div>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                    {options.map(opt => (
                        <button
                            id={`opt-${opt.id}`}
                            key={opt.id}
                            onClick={() => handleGuess(opt.id)}
                            className={`
                                p-4 rounded-2xl bg-white shadow-lg border-b-4 border-amber-200 transition-transform active:scale-95 hover:bg-amber-50
                                flex flex-col items-center gap-2
                                ${phase === 'result' && opt.id === missingItem?.id ? 'bg-green-100 border-green-400 scale-110' : ''}
                            `}
                        >
                            <div className="text-4xl md:text-5xl">{opt.emoji}</div>
                            <div className="font-bold text-gray-700">{opt.en}</div>
                        </button>
                    ))}
                </div>
                
                {phase === 'result' && (
                    <div className="mt-8 text-4xl font-bold text-green-500 animate-bounce">
                        Found it!
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default HiddenTreasure;