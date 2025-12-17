import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { RotateCcw } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const WordJigsaw: React.FC<Props> = ({ words, onComplete }) => {
  const [round, setRound] = useState(0);
  const [targetWord, setTargetWord] = useState<WordItem | null>(null);
  const [tiles, setTiles] = useState<{id: string, char: string, placed: boolean}[]>([]);
  const [slots, setSlots] = useState<(string | null)[]>([]); // Array of tile IDs or null
  const [status, setStatus] = useState<'playing' | 'success'>('playing');

  useEffect(() => {
    startRound();
  }, [round]);

  const startRound = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setTargetWord(word);
    
    // Create tiles from word + 2 random distractors
    const chars = word.en.replace(/ /g, '').split('');
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    chars.push(letters[Math.floor(Math.random()*26)]);
    chars.push(letters[Math.floor(Math.random()*26)]);
    
    const newTiles = chars.sort(() => 0.5 - Math.random()).map((char, idx) => ({
        id: `tile-${idx}`,
        char,
        placed: false
    }));
    
    setTiles(newTiles);
    setSlots(Array(word.en.replace(/ /g, '').length).fill(null));
    setStatus('playing');
  };

  const handleTileClick = (tileId: string) => {
      // If tile is in rack, move to first empty slot
      // If tile is in slot, return to rack
      
      const tileIndexInRack = tiles.findIndex(t => t.id === tileId);
      const currentTile = tiles[tileIndexInRack];

      if (!currentTile.placed) {
          // Move to Slot
          const firstEmptyIndex = slots.indexOf(null);
          if (firstEmptyIndex !== -1) {
              const newSlots = [...slots];
              newSlots[firstEmptyIndex] = tileId;
              setSlots(newSlots);
              
              const newTiles = [...tiles];
              newTiles[tileIndexInRack].placed = true;
              setTiles(newTiles);

              checkWin(newSlots, newTiles);
          }
      }
  };

  const handleSlotClick = (index: number) => {
      const tileId = slots[index];
      if (tileId) {
          // Return to rack
          const newSlots = [...slots];
          newSlots[index] = null;
          setSlots(newSlots);

          const newTiles = [...tiles];
          const tIdx = newTiles.findIndex(t => t.id === tileId);
          if (tIdx !== -1) newTiles[tIdx].placed = false;
          setTiles(newTiles);
      }
  };

  const checkWin = (currentSlots: (string|null)[], currentTiles: typeof tiles) => {
      if (!targetWord) return;
      if (currentSlots.some(s => s === null)) return;

      const formedWord = currentSlots.map(tid => {
          return currentTiles.find(t => t.id === tid)?.char || '';
      }).join('');

      if (formedWord.toLowerCase() === targetWord.en.replace(/ /g, '').toLowerCase()) {
          setStatus('success');
          setTimeout(() => {
              if (round < 4) setRound(r => r + 1);
              else onComplete();
          }, 1500);
      }
  };

  if (!targetWord) return <div>Loading...</div>;

  const progress = (round / 5) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center max-w-4xl mx-auto p-4 bg-orange-50">
        
        <div className="w-full bg-white/50 h-2 rounded-full mb-8">
             <div className="bg-orange-500 h-2 rounded-full transition-all" style={{width: `${progress}%`}}></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
            
            {/* Clue Area */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-orange-200 mb-12 text-center animate-float-slow">
                <div className="text-6xl mb-2">{targetWord.emoji}</div>
                <div className="text-2xl text-gray-500 font-bold">{targetWord.ch}</div>
            </div>

            {/* Board Slots */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 bg-orange-200 p-4 rounded-xl shadow-inner min-h-[80px] items-center">
                {slots.map((tileId, idx) => {
                    const tile = tiles.find(t => t.id === tileId);
                    return (
                        <button
                            key={idx}
                            onClick={() => handleSlotClick(idx)}
                            className={`
                                w-12 h-14 rounded-md flex items-center justify-center text-2xl font-bold transition-all
                                ${tile 
                                    ? 'bg-orange-100 text-orange-800 shadow-md border-b-4 border-orange-300 -mt-1' 
                                    : 'bg-orange-300/50 text-transparent shadow-inner'
                                }
                                ${status === 'success' ? 'bg-green-100 text-green-700 border-green-300' : ''}
                            `}
                        >
                            {tile?.char}
                        </button>
                    )
                })}
            </div>

            {/* Tile Rack */}
            <div className="bg-orange-800 p-4 rounded-xl w-full max-w-2xl shadow-xl flex flex-wrap justify-center gap-3 min-h-[100px]">
                {tiles.map((tile) => (
                    <button
                        key={tile.id}
                        onClick={() => handleTileClick(tile.id)}
                        disabled={tile.placed}
                        className={`
                            w-12 h-14 bg-[#f4dcb5] rounded-md shadow-md border-b-4 border-[#c9a77a]
                            text-2xl font-black text-[#5d4037] flex items-center justify-center
                            transition-all hover:-translate-y-1 active:scale-95 active:translate-y-0
                            ${tile.placed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                        `}
                    >
                        {tile.char}
                        <span className="text-[8px] absolute bottom-1 right-1 opacity-50">1</span>
                    </button>
                ))}
            </div>

            {status === 'success' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-black text-green-500 drop-shadow-lg animate-pop">
                    Good!
                </div>
            )}
        </div>
        
        <style>{`
            @keyframes pop {
                0% { transform: translate(-50%, -50%) scale(0); }
                80% { transform: translate(-50%, -50%) scale(1.2); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
            .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        `}</style>
    </div>
  );
};

export default WordJigsaw;