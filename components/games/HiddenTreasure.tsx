import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { Eye, HelpCircle, Star, Timer } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const HiddenTreasure: React.FC<Props> = ({ words, onComplete }) => {
  const [round, setRound] = useState(0);
  const [allRoundsWords, setAllRoundsWords] = useState<WordItem[][]>([]);
  const [currentSet, setCurrentSet] = useState<WordItem[]>([]);
  const [missingItem, setMissingItem] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [phase, setPhase] = useState<'memorize' | 'hiding' | 'guess' | 'result'>('memorize');
  const [timeLeft, setTimeLeft] = useState(10); 

  // 初始化：洗牌所有單詞並分成 10, 10, 5
  useEffect(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setAllRoundsWords([
        shuffled.slice(0, 10),
        shuffled.slice(10, 20),
        shuffled.slice(20, 25)
    ]);
  }, [words]);

  useEffect(() => {
    if (allRoundsWords.length > 0) {
      startRound();
    }
  }, [round, allRoundsWords]);

  useEffect(() => {
    if (phase === 'memorize') {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setPhase('hiding');
            setTimeout(() => setPhase('guess'), 1000);
        }
    }
  }, [timeLeft, phase]);

  const startRound = () => {
    setPhase('memorize');
    setTimeLeft(10); 
    
    const items = allRoundsWords[round];
    setCurrentSet(items);
    
    const missing = items[Math.floor(Math.random() * items.length)];
    setMissingItem(missing);
    
    const distractors = words
        .filter(w => !items.find(item => item.id === w.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 9);
    
    setOptions([missing, ...distractors].sort(() => 0.5 - Math.random()));
  };

  const handleGuess = (guessId: string) => {
    if (phase !== 'guess' || !missingItem) return;

    if (guessId === missingItem.id) {
        setPhase('result');
        setTimeout(() => {
            if (round < allRoundsWords.length - 1) {
                setRound(prev => prev + 1);
            } else {
                onComplete();
            }
        }, 1800);
    } else {
        const el = document.getElementById(`opt-${guessId}`);
        el?.classList.add('animate-shake-red');
        setTimeout(() => el?.classList.remove('animate-shake-red'), 500);
    }
  };

  const progress = (round / 3) * 100;

  if (allRoundsWords.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col items-center max-w-6xl mx-auto p-4 font-fredoka overflow-y-auto pb-10">
        <div className="w-full bg-white/50 rounded-full h-5 mb-10 max-w-2xl border-2 border-white shadow-inner shrink-0">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700 shadow-md" style={{ width: `${progress}%` }}></div>
        </div>

        {phase === 'memorize' && (
            <div className="flex flex-col items-center w-full animate-fadeIn">
                <div className="mb-10 bg-white/95 px-12 py-8 rounded-[4rem] shadow-2xl border-4 border-amber-400 flex items-center gap-10 animate-bounce-subtle">
                    <div className="relative">
                        <Eye className="w-20 h-20 text-amber-500"/>
                        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-sm font-black w-10 h-10 rounded-full flex items-center justify-center animate-ping">!</div>
                    </div>
                    <div className="text-left">
                        <p className="text-amber-900 font-black text-5xl tracking-tight uppercase">MEMORIZE THESE!</p>
                        <div className="flex items-center gap-3 text-orange-600 font-black text-3xl mt-2">
                            <Timer className="w-8 h-8" />
                            <span>{timeLeft}s remaining...</span>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 w-full">
                    {currentSet.map((item, idx) => (
                        <div key={item.id} className="bg-white p-8 rounded-[3.5rem] shadow-2xl border-b-[15px] border-amber-100 flex flex-col items-center transform hover:scale-105 transition-all relative group min-h-[220px] justify-center">
                            <div className="absolute top-4 left-8 w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-xl font-black text-amber-800 shadow-sm">{idx + 1}</div>
                            <div className="text-[7rem] mb-4 drop-shadow-lg group-hover:animate-wiggle">{item.emoji}</div>
                            {/* 單詞字體特大化 */}
                            <div className="text-3xl md:text-4xl font-black text-gray-900 text-center leading-none tracking-tight">
                                {item.en.toLowerCase()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {phase === 'hiding' && (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
                 <div className="text-[18rem] animate-spin-slow drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]">✨</div>
                 <h2 className="text-amber-600 font-black text-7xl mt-12 animate-pulse italic tracking-widest uppercase">Hiding...</h2>
            </div>
        )}

        {(phase === 'guess' || phase === 'result') && (
            <div className="flex flex-col items-center w-full animate-fadeIn">
                 <div className="mb-10 bg-purple-100 px-16 py-10 rounded-[5rem] shadow-2xl border-4 border-purple-300 flex items-center gap-10">
                    <HelpCircle className="w-20 h-20 text-purple-600 animate-pulse"/> 
                    <span className="text-6xl font-black text-purple-900 italic tracking-tighter uppercase">ONE PIECE IS GONE!</span>
                </div>

                {/* 提示區：保留所有單詞文字提示 */}
                <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[4rem] border-4 border-dashed border-purple-300 mb-16 grid grid-cols-2 sm:grid-cols-5 gap-6 w-full shadow-inner">
                     {currentSet.map(item => {
                        const isMissing = item.id === missingItem?.id;
                        return (
                            <div key={item.id} className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] transition-all duration-1000 border-4 ${isMissing ? 'bg-white border-purple-400 border-dashed animate-pulse min-h-[140px]' : 'bg-white/60 opacity-40 grayscale border-transparent'}`}>
                                 {isMissing ? (
                                     <>
                                        <span className="text-7xl font-black text-purple-400 mb-2">?</span>
                                        {/* 保留消失單詞的文字提示 */}
                                        <div className="text-lg font-black text-purple-400 text-center uppercase tracking-tight">{item.en.toLowerCase()}</div>
                                     </>
                                 ) : (
                                     <>
                                        <div className="text-5xl mb-2">{item.emoji}</div>
                                        <div className="text-lg font-black text-gray-800 text-center uppercase tracking-tight">{item.en.toLowerCase()}</div>
                                     </>
                                 )}
                            </div>
                        );
                     })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 w-full">
                    {options.map(opt => (
                        <button id={`opt-${opt.id}`} key={opt.id} disabled={phase === 'result'} onClick={() => handleGuess(opt.id)}
                            className={`p-8 rounded-[3.5rem] bg-white shadow-2xl border-b-[15px] border-amber-100 transition-all active:scale-90 hover:bg-amber-50 group relative flex flex-col items-center gap-5 min-h-[220px] justify-center ${phase === 'result' && opt.id === missingItem?.id ? 'ring-[15px] ring-green-400 border-green-500 scale-110 z-20 shadow-green-200' : ''} ${phase === 'result' && opt.id !== missingItem?.id ? 'opacity-30 grayscale' : ''}`}
                        >
                            <div className="text-8xl group-hover:scale-110 transition-transform drop-shadow-md">{opt.emoji}</div>
                            <div className="font-black text-gray-900 text-3xl text-center leading-tight">
                                {opt.en.toLowerCase()}
                            </div>
                            {phase === 'result' && opt.id === missingItem?.id && (
                                <div className="absolute -top-10 -right-10 bg-yellow-400 p-6 rounded-full shadow-2xl border-[6px] border-white animate-bounce"><Star className="w-16 h-16 text-white fill-white" /></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        )}

        <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
            @keyframes spin-slow { from { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.2); } to { transform: rotate(360deg) scale(1); } }
            .animate-spin-slow { animation: spin-slow 2.5s ease-in-out infinite; }
            @keyframes shake-red { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-15px); background-color: #fee2e2; } 75% { transform: translateX(15px); } }
            .animate-shake-red { animation: shake-red 0.1s ease-in-out infinite; }
            @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
            .group-hover\\:animate-wiggle:hover { animation: wiggle 0.4s ease-in-out infinite; }
            @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
            .animate-bounce-subtle { animation: bounce-subtle 4s ease-in-out infinite; }
        `}</style>
    </div>
  );
};

export default HiddenTreasure;