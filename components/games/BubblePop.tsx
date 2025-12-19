import React, { useState, useEffect, useRef } from 'react';
import { WordItem } from '../../types';
import { Shell } from 'lucide-react';

const POKE_IMG_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

interface Bubble {
  id: string; 
  word: string;
}

const BubblePop: React.FC<Props> = ({ words, onComplete }) => {
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedId, setPoppedId] = useState<string | null>(null);
  const [collectedPokemon, setCollectedPokemon] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const waterPokemonIds = [7, 8, 9, 54, 55, 60, 61, 62, 72, 73, 79, 80, 86, 87, 90, 91, 98, 99, 116, 117, 118, 119, 120, 121, 129, 130, 131, 134, 158, 159, 160, 170, 171, 183, 184, 194, 195, 222, 223, 224];

  useEffect(() => {
    setShuffledWords([...words].sort(() => 0.5 - Math.random()));
  }, [words]);

  useEffect(() => {
    if (shuffledWords.length > 0) {
      setupRound();
    }
  }, [currentIndex, shuffledWords]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
    }
  }, [collectedPokemon]);

  const setupRound = () => {
    const currentWord = shuffledWords[currentIndex];
    const distractors = words
      .filter(w => w.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const roundWords = [currentWord, ...distractors].sort(() => 0.5 - Math.random());
    setBubbles(roundWords.map(w => ({ id: w.id, word: w.en.toLowerCase() })));
    setPoppedId(null);
  };

  const handleBubbleClick = (bubbleId: string) => {
    if (poppedId) return;
    if (bubbleId === shuffledWords[currentIndex].id) {
      setPoppedId(bubbleId);
      const available = waterPokemonIds.filter(id => !collectedPokemon.includes(id));
      const nextPoke = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : waterPokemonIds[0];
      setCollectedPokemon(prev => [...prev, nextPoke]);

      setTimeout(() => {
        if (currentIndex < shuffledWords.length - 1) setCurrentIndex(prev => prev + 1);
        else onComplete();
      }, 1000);
    } else {
        const el = document.getElementById(`bubble-${bubbleId}`);
        el?.classList.add('animate-shake-red');
        setTimeout(() => el?.classList.remove('animate-shake-red'), 400);
    }
  };

  if (shuffledWords.length === 0) return null;

  const progress = (currentIndex / shuffledWords.length) * 100;

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-800 font-fredoka">
       <div className="absolute inset-0 pointer-events-none z-0">
            {[...Array(30)].map((_, i) => (
                <div key={i} className="absolute bg-white/30 rounded-full blur-[1px] animate-float-bubble"
                    style={{
                        width: `${10 + Math.random() * 60}px`,
                        height: `${10 + Math.random() * 60}px`,
                        left: `${Math.random() * 100}%`,
                        bottom: '-10%',
                        animationDuration: `${5 + Math.random() * 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                ><div className="absolute top-1 left-1 w-[30%] h-[30%] bg-white/50 rounded-full"></div></div>
            ))}
       </div>

       <div className="w-full p-6 z-20 flex flex-col items-center shrink-0">
         <div className="w-full max-w-2xl bg-white/20 rounded-full h-4 mb-8 backdrop-blur-md border border-white/30 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-yellow-300 to-amber-500 h-full transition-all duration-700 shadow-xl" style={{ width: `${progress}%` }}></div>
         </div>
         <div className="bg-white/95 px-16 py-6 rounded-[4rem] shadow-2xl backdrop-blur-xl border-4 border-blue-200 animate-float-slow">
            <h2 className="text-6xl font-black text-blue-900 text-center tracking-tight">{shuffledWords[currentIndex]?.ch}</h2>
         </div>
       </div>

       <div className="flex-1 flex items-center justify-center p-8 relative z-10 w-full overflow-y-auto">
         <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20 max-w-6xl w-full mx-auto">
           {bubbles.map(b => (
             <div key={b.id + currentIndex} className="flex justify-center items-center">
               <button id={`bubble-${b.id}`} onClick={() => handleBubbleClick(b.id)}
                 className="group relative w-40 h-40 md:w-56 md:h-56 transition-all duration-300 hover:scale-110 active:scale-90"
               >
                 {poppedId === b.id ? (
                   <div className="relative flex items-center justify-center h-full"><div className="absolute inset-0 bg-white rounded-full animate-ping opacity-60"></div><span className="text-9xl animate-pop">🫧</span></div>
                 ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-white/40 to-blue-300/40 backdrop-blur-md border-[6px] border-white/90 shadow-[inset_-15px_-15px_30px_rgba(255,255,255,0.4),0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-center p-6 text-center">
                      <div className="absolute top-[15%] left-[15%] w-[30%] h-[15%] bg-white/60 rounded-full rotate-45 blur-[1px]"></div>
                      <span className="font-black text-white text-2xl md:text-3xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] leading-tight select-none">
                        {b.word}
                      </span>
                    </div>
                 )}
               </button>
             </div>
           ))}
         </div>
       </div>

       <div className="h-40 bg-white/90 backdrop-blur-2xl border-t-[8px] border-blue-200 relative shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] z-30 flex items-center">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-500 px-10 py-3 rounded-t-[2.5rem] text-white font-black text-xl uppercase tracking-[0.2em] shadow-2xl border-b-0 border-x-4 border-t-4 border-white">
             🐚 OCEAN FRIENDS
          </div>
          <div ref={scrollRef} className="w-full h-full flex items-center px-12 gap-8 overflow-x-auto hide-scrollbar">
             {collectedPokemon.map((pokeId, idx) => (
                <div key={idx} className="relative w-24 h-24 shrink-0 flex items-center justify-center animate-pop-in-bouncy group">
                    <img src={`${POKE_IMG_BASE}/${pokeId}.png`} alt="Pokemon" className="absolute w-20 h-20 -top-6 drop-shadow-2xl transform group-hover:scale-125 transition-transform z-10" />
                    <div className="w-20 h-20 bg-blue-100 rounded-full border-4 border-white shadow-inner flex items-center justify-center"><Shell className="w-12 h-12 text-blue-300 fill-blue-50" /></div>
                </div>
             ))}
             <div className="w-20 shrink-0"></div>
          </div>
       </div>

       <style>{`
         @keyframes float-bubble { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.7; } 50% { transform: translateY(-50vh) translateX(40px) rotate(15deg); } 100% { transform: translateY(-120vh) translateX(-40px) rotate(-15deg); opacity: 0; } }
         .animate-float-bubble { animation: float-bubble linear infinite; }
         .hide-scrollbar::-webkit-scrollbar { display: none; }
         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
         .animate-float-slow { animation: float-slow 3s ease-in-out infinite; }
         @keyframes shake-red { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
         .animate-shake-red { animation: shake-red 0.1s ease-in-out infinite; }
       `}</style>
    </div>
  );
};

export default BubblePop;