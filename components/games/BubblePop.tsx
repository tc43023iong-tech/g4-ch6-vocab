import React, { useState, useEffect, useRef } from 'react';
import { WordItem } from '../../types';
import { Shell } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

interface Bubble {
  id: string; // word id
  word: string;
}

const BubblePop: React.FC<Props> = ({ words, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedId, setPoppedId] = useState<string | null>(null);
  const [collectedPokemon, setCollectedPokemon] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Water Type Pokemon IDs (Cute & Popular)
  const waterPokemonIds = [7, 54, 60, 86, 116, 129, 131, 134, 158, 183, 222, 258, 393, 363, 501];

  useEffect(() => {
    setupRound();
  }, [currentIndex]);

  // Auto-scroll to the right when a new pokemon is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
    }
  }, [collectedPokemon]);

  const setupRound = () => {
    const currentWord = words[currentIndex];
    const distractors = words
      .filter(w => w.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5); // 1 correct + 5 distractors = 6 total

    const roundWords = [currentWord, ...distractors].sort(() => 0.5 - Math.random());
    
    // No more random positions, just the data
    const newBubbles = roundWords.map((w) => ({
      id: w.id,
      word: w.en,
    }));
    
    setBubbles(newBubbles);
    setPoppedId(null);
  };

  const handleBubbleClick = (bubbleId: string, event: React.MouseEvent) => {
    if (poppedId) return;

    if (bubbleId === words[currentIndex].id) {
      // Correct
      setPoppedId(bubbleId);
      
      // Add a random pokemon to the collection
      const randomPoke = waterPokemonIds[Math.floor(Math.random() * waterPokemonIds.length)];
      setCollectedPokemon(prev => [...prev, randomPoke]);

      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1000);
    } else {
      // Incorrect interaction - optional shake or sound here
    }
  };

  const progress = (currentIndex / words.length) * 100;
  const currentWord = words[currentIndex];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-sky-300 to-blue-600">
       
       {/* Top UI */}
       <div className="w-full p-4 z-20 flex flex-col items-center shrink-0">
         <div className="w-full max-w-md bg-white/30 rounded-full h-3 mb-4 backdrop-blur-sm border border-white/40">
            <div className="bg-yellow-300 h-3 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(253,224,71,0.8)]" style={{ width: `${progress}%` }}></div>
         </div>
         <div className="bg-white/90 px-8 py-4 rounded-3xl shadow-xl backdrop-blur-md border-4 border-blue-200 animate-bounce-slow">
            <h2 className="text-3xl font-black text-blue-900 text-center tracking-wide">{currentWord.ch}</h2>
         </div>
       </div>

       {/* Fixed Grid Bubbles */}
       <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full overflow-y-auto">
         <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 max-w-4xl w-full mx-auto pb-4">
           {bubbles.map(b => (
             <div
               key={b.id + currentIndex}
               className="flex justify-center items-center"
             >
               <button
                 onClick={(e) => handleBubbleClick(b.id, e)}
                 className={`
                    group relative cursor-pointer w-28 h-28 md:w-36 md:h-36
                    transition-all duration-300 hover:scale-110 active:scale-95
                    flex items-center justify-center
                 `}
               >
                 {poppedId === b.id ? (
                   <div className="relative">
                       <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                       <div className="text-6xl animate-bounce relative z-10">✨</div>
                   </div>
                 ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200/40 to-blue-500/40 backdrop-blur-sm border-2 border-white/60 shadow-[inset_-10px_-10px_20px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-center p-2 transform hover:-translate-y-1">
                      {/* Bubble Shine */}
                      <div className="absolute top-[15%] left-[15%] w-[30%] h-[15%] bg-white/60 rounded-full rotate-45 filter blur-[2px]"></div>
                      <div className="absolute bottom-[15%] right-[15%] w-[10%] h-[10%] bg-white/40 rounded-full filter blur-[1px]"></div>
                      <span className="font-bold text-white text-lg md:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] break-words leading-tight select-none">
                        {b.word}
                      </span>
                    </div>
                 )}
               </button>
             </div>
           ))}
         </div>
       </div>

       {/* Bottom Collection Shelf (Sand Bank) */}
       <div className="h-28 bg-[#FFF8E1] border-t-4 border-[#FFECB3] relative shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] z-30">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFECB3] px-4 py-1 rounded-t-xl text-[#FF6F00] font-bold text-xs uppercase tracking-widest shadow-sm">
             My Collection
          </div>
          <div 
            ref={scrollRef}
            className="w-full h-full flex items-center px-4 gap-4 overflow-x-auto hide-scrollbar"
          >
             {/* Render collected items */}
             {collectedPokemon.map((pokeId, idx) => (
                <div key={idx} className="relative w-16 h-16 shrink-0 flex items-center justify-center animate-pop-in-bouncy group">
                    <Shell className="w-full h-full text-pink-200 fill-pink-50 drop-shadow-md group-hover:text-pink-300 transition-colors" />
                    <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`}
                        alt="Pokemon"
                        className="absolute w-14 h-14 -top-3 drop-shadow-lg transform group-hover:scale-110 transition-transform"
                    />
                </div>
             ))}

             {/* Empty Slot Hint */}
             <div className="relative w-16 h-16 shrink-0 flex items-center justify-center opacity-40">
                <Shell className="w-full h-full text-gray-400 dashed border-gray-400" />
                <div className="absolute text-gray-500 font-bold text-xl">?</div>
             </div>
             
             {/* Padding to right */}
             <div className="w-4 shrink-0"></div>
          </div>
       </div>

       <style>{`
         .hide-scrollbar::-webkit-scrollbar {
            display: none;
         }
         .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
         }
         @keyframes bounceSlow {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-5px); }
         }
         .animate-bounce-slow {
           animation: bounceSlow 3s ease-in-out infinite;
         }
         @keyframes popInBouncy {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
         }
         .animate-pop-in-bouncy {
             animation: popInBouncy 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
         }
       `}</style>
    </div>
  );
};

export default BubblePop;