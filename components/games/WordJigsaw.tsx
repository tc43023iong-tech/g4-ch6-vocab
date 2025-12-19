import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { RotateCcw } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const WordJigsaw: React.FC<Props> = ({ words, onComplete }) => {
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetWord, setTargetWord] = useState<WordItem | null>(null);
  const [tiles, setTiles] = useState<{id: string, char: string, placed: boolean}[]>([]);
  const [slots, setSlots] = useState<(string | null)[]>([]); 
  const [status, setStatus] = useState<'playing' | 'success'>('playing');

  useEffect(() => {
    setShuffledWords([...words].sort(() => 0.5 - Math.random()));
  }, [words]);

  useEffect(() => {
    if (shuffledWords.length > 0) {
      startRound();
    }
  }, [currentIndex, shuffledWords]);

  const startRound = () => {
    const word = shuffledWords[currentIndex];
    setTargetWord(word);
    const chars = word.en.toLowerCase().replace(/ /g, '').split('');
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    chars.push(letters[Math.floor(Math.random()*26)]);
    chars.push(letters[Math.floor(Math.random()*26)]);
    const newTiles = chars.sort(() => 0.5 - Math.random()).map((char, idx) => ({ id: `tile-${idx}`, char, placed: false }));
    setTiles(newTiles);
    setSlots(Array(word.en.replace(/ /g, '').length).fill(null));
    setStatus('playing');
  };

  const handleTileClick = (tileId: string) => {
      const tileIndexInRack = tiles.findIndex(t => t.id === tileId);
      const currentTile = tiles[tileIndexInRack];
      if (!currentTile.placed) {
          const firstEmptyIndex = slots.indexOf(null);
          if (firstEmptyIndex !== -1) {
              const newSlots = [...slots]; newSlots[firstEmptyIndex] = tileId; setSlots(newSlots);
              const newTiles = [...tiles]; newTiles[tileIndexInRack].placed = true; setTiles(newTiles);
              checkWin(newSlots, newTiles);
          }
      }
  };

  const handleSlotClick = (index: number) => {
      const tileId = slots[index];
      if (tileId) {
          const newSlots = [...slots]; newSlots[index] = null; setSlots(newSlots);
          const newTiles = [...tiles]; const tIdx = newTiles.findIndex(t => t.id === tileId);
          if (tIdx !== -1) newTiles[tIdx].placed = false; setTiles(newTiles);
      }
  };

  const checkWin = (currentSlots: (string|null)[], currentTiles: typeof tiles) => {
      if (!targetWord || currentSlots.some(s => s === null)) return;
      const formedWord = currentSlots.map(tid => currentTiles.find(t => t.id === tid)?.char || '').join('');
      if (formedWord === targetWord.en.toLowerCase().replace(/ /g, '')) {
          setStatus('success');
          setTimeout(() => { if (currentIndex < shuffledWords.length - 1) setCurrentIndex(prev => prev + 1); else onComplete(); }, 1500);
      }
  };

  if (shuffledWords.length === 0) return null;

  const progress = (currentIndex / shuffledWords.length) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto p-4 font-fredoka overflow-y-auto">
        <div className="w-full bg-white/50 h-5 rounded-full mb-10 max-w-2xl border-2 border-white shadow-inner"><div className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full transition-all duration-700 shadow-md" style={{width: `${progress}%`}}></div></div>
        <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-b-[15px] border-orange-100 mb-16 text-center animate-float-slow">
                <div className="text-9xl mb-6 drop-shadow-xl">{targetWord?.emoji}</div>
                <div className="text-5xl text-gray-800 font-black tracking-tight">{targetWord?.ch}</div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-16 bg-orange-200 p-8 rounded-[2.5rem] shadow-inner min-h-[120px] items-center border-4 border-orange-300">
                {slots.map((tileId, idx) => {
                    const tile = tiles.find(t => t.id === tileId);
                    return (
                        <button key={idx} onClick={() => handleSlotClick(idx)}
                            className={`w-16 h-20 rounded-2xl flex items-center justify-center text-5xl font-black transition-all ${tile ? 'bg-orange-50 text-orange-800 shadow-xl border-b-8 border-orange-200 -mt-2' : 'bg-orange-300/50 text-transparent shadow-inner'} ${status === 'success' ? 'bg-green-100 text-green-700 border-green-300' : ''}`}
                        >{tile?.char}</button>
                    )
                })}
            </div>
            <div className="bg-[#5d4037] p-8 rounded-[3rem] w-full max-w-3xl shadow-2xl flex flex-wrap justify-center gap-5 min-h-[150px] border-b-[20px] border-[#3e2723]">
                {tiles.map((tile) => (
                    <button key={tile.id} onClick={() => handleTileClick(tile.id)} disabled={tile.placed}
                        className={`w-16 h-20 bg-[#f4dcb5] rounded-2xl shadow-xl border-b-8 border-[#c9a77a] text-4xl font-black text-[#5d4037] flex items-center justify-center transition-all hover:-translate-y-2 active:scale-95 active:translate-y-0 ${tile.placed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >{tile.char}<span className="text-[10px] absolute bottom-2 right-2 opacity-50">1</span></button>
                ))}
            </div>
            {status === 'success' && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-green-500 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-pop z-50">BRAVO!</div>}
        </div>
        <style>{`
            @keyframes pop { 0% { transform: translate(-50%, -50%) scale(0); } 80% { transform: translate(-50%, -50%) scale(1.3); } 100% { transform: translate(-50%, -50%) scale(1); } }
            .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
            .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        `}</style>
    </div>
  );
};

export default WordJigsaw;