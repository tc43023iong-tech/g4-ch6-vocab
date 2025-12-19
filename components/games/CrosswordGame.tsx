import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { Check } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

interface PlacedWord {
  wordItem: WordItem;
  direction: 'across' | 'down';
  row: number;
  col: number;
  cleanWord: string; 
  number: number;
}

const GRID_SIZE = 11; 

const CrosswordGame: React.FC<Props> = ({ words, onComplete }) => {
  const [round, setRound] = useState(0);
  const [allBatches, setAllBatches] = useState<WordItem[][]>([]);
  const [grid, setGrid] = useState<(string | null)[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [userInputs, setUserInputs] = useState<{[key: string]: string}>({});
  const [isRoundComplete, setIsRoundComplete] = useState(false);

  // 初始化：將 25 個單詞打亂並分成 5 組，每組 5 個
  useEffect(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const batches = [];
    for (let i = 0; i < shuffled.length; i += 5) {
        batches.push(shuffled.slice(i, i + 5));
    }
    setAllBatches(batches);
  }, [words]);

  useEffect(() => {
    if (allBatches.length > 0) {
        generateLevel(allBatches[round]);
    }
  }, [round, allBatches]);

  const generateLevel = (currentBatch: WordItem[]) => {
    let newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    let placements: PlacedWord[] = [];
    
    // 第一個單詞放在中間
    const w1 = currentBatch[0];
    const clean1 = w1.en.toLowerCase().replace(/[^a-z]/g, '');
    const startRow = Math.floor(GRID_SIZE / 2);
    const startCol = Math.max(0, Math.floor((GRID_SIZE - clean1.length) / 2));

    placeOnGrid(newGrid, clean1, startRow, startCol, 'across');
    placements.push({ wordItem: w1, direction: 'across', row: startRow, col: startCol, cleanWord: clean1, number: 1 });

    // 嘗試放置剩下的單詞
    for (let idx = 1; idx < currentBatch.length; idx++) {
        const candidate = currentBatch[idx];
        const cleanCand = candidate.en.toLowerCase().replace(/[^a-z]/g, '');
        let placed = false;
        let attempts = 0;

        // 尋找與已放置單詞的交點
        for (const p of placements) {
            if (placed) break;
            for (let i = 0; i < p.cleanWord.length; i++) {
                if (placed) break;
                const charOnGrid = p.cleanWord[i];
                const gridR = p.direction === 'across' ? p.row : p.row + i;
                const gridC = p.direction === 'across' ? p.col + i : p.col;

                for (let j = 0; j < cleanCand.length; j++) {
                    if (cleanCand[j] === charOnGrid) {
                        const newDir = p.direction === 'across' ? 'down' : 'across';
                        const newR = newDir === 'down' ? gridR - j : gridR;
                        const newC = newDir === 'across' ? gridC - j : gridC;
                        if (canPlace(newGrid, cleanCand, newR, newC, newDir)) {
                            placeOnGrid(newGrid, cleanCand, newR, newC, newDir);
                            placements.push({ wordItem: candidate, direction: newDir, row: newR, col: newC, cleanWord: cleanCand, number: placements.length + 1 });
                            placed = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    setGrid(newGrid);
    setPlacedWords(placements);
    setUserInputs({});
    setIsRoundComplete(false);
  };

  const canPlace = (grid: any[][], word: string, row: number, col: number, dir: 'across' | 'down') => {
      if (row < 0 || col < 0) return false;
      if (dir === 'across') { 
          if (col + word.length > GRID_SIZE) return false; 
          for(let i=0; i<word.length; i++) { 
              const cell = grid[row][col+i]; 
              if (cell !== null && cell !== word[i]) return false; 
          } 
      }
      else { 
          if (row + word.length > GRID_SIZE) return false; 
          for(let i=0; i<word.length; i++) { 
              const cell = grid[row+i][col]; 
              if (cell !== null && cell !== word[i]) return false; 
          } 
      }
      return true;
  };

  const placeOnGrid = (grid: any[][], word: string, row: number, col: number, dir: 'across' | 'down') => {
      for(let i=0; i<word.length; i++) { 
          if (dir === 'across') grid[row][col+i] = word[i]; 
          else grid[row+i][col] = word[i]; 
      }
  };

  const handleInputChange = (r: number, c: number, val: string) => {
      if (isRoundComplete) return;
      const char = val.slice(-1).toLowerCase();
      if (!/[a-z]/.test(char) && char !== '') return;
      setUserInputs(prev => ({ ...prev, [`${r}-${c}`]: char }));
  };

  const checkAnswers = () => {
      let allCorrect = true;
      placedWords.forEach(w => {
          for(let i=0; i<w.cleanWord.length; i++) {
              const r = w.direction === 'across' ? w.row : w.row + i;
              const c = w.direction === 'across' ? w.col + i : w.col;
              if (userInputs[`${r}-${c}`] !== w.cleanWord[i]) allCorrect = false;
          }
      });
      if (allCorrect) {
          setIsRoundComplete(true);
          setTimeout(() => { 
              if (round < allBatches.length - 1) setRound(prev => prev + 1); 
              else onComplete(); 
          }, 2000);
      } else {
          document.getElementById('crossword-grid')?.classList.add('animate-shake-red');
          setTimeout(() => document.getElementById('crossword-grid')?.classList.remove('animate-shake-red'), 500);
      }
  };

  const progress = (round / 5) * 100;

  if (allBatches.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto p-4 font-fredoka overflow-y-auto pb-12">
        <div className="w-full bg-white/50 h-5 rounded-full mb-8 max-w-2xl border-2 border-white shadow-inner">
            <div className="bg-gradient-to-r from-lime-400 to-green-500 h-full rounded-full transition-all duration-700 shadow-md" style={{width: `${progress}%`}}></div>
        </div>
        <h2 className="text-4xl font-black text-lime-700 mb-8 flex items-center gap-4">✏️ CROSSWORD PUZZLE {isRoundComplete && <span className="text-green-500 animate-bounce text-2xl">EXCELLENT!</span>}</h2>
        <div id="crossword-grid" className="bg-white p-8 rounded-[3rem] shadow-2xl border-b-[15px] border-lime-100 mb-10 overflow-x-auto max-w-full">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
                {grid.map((rowArr, r) => rowArr.map((cell, c) => {
                    const isActive = cell !== null;
                    const wordStarts = placedWords.filter(w => w.row === r && w.col === c);
                    const startNum = wordStarts.length > 0 ? wordStarts[0].number : null;
                    const userVal = userInputs[`${r}-${c}`] || '';
                    if (!isActive) return <div key={`${r}-${c}`} className="w-10 h-10 md:w-14 md:h-14 bg-transparent"></div>
                    return (
                        <div key={`${r}-${c}`} className="relative w-10 h-10 md:w-14 md:h-14">
                            {startNum && <span className="absolute top-1 left-2 text-[10px] md:text-xs font-black text-gray-400 leading-none z-10">{startNum}</span>}
                            <input type="text" maxLength={1} value={userVal} onChange={(e) => handleInputChange(r, c, e.target.value)}
                                className={`w-full h-full text-center border-4 rounded-xl text-2xl md:text-3xl font-black focus:outline-none focus:border-lime-500 ${isRoundComplete ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-gray-100 text-gray-700'}`}
                            />
                        </div>
                    )
                }))}
            </div>
        </div>
        <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            <div className="bg-white p-6 rounded-[2rem] border-l-[12px] border-lime-400 shadow-xl">
                <h3 className="font-black text-gray-400 text-sm uppercase tracking-widest mb-4">Across</h3>
                <ul className="space-y-3">{placedWords.filter(w => w.direction === 'across').map(w => <li key={w.number} className="text-xl font-bold flex items-start gap-3"><span className="text-lime-600 font-black">{w.number}.</span><span>{w.wordItem.emoji} {w.wordItem.ch}</span></li>)}</ul>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border-l-[12px] border-teal-400 shadow-xl">
                <h3 className="font-black text-gray-400 text-sm uppercase tracking-widest mb-4">Down</h3>
                <ul className="space-y-3">{placedWords.filter(w => w.direction === 'down').map(w => <li key={w.number} className="text-xl font-bold flex items-start gap-3"><span className="text-teal-600 font-black">{w.number}.</span><span>{w.wordItem.emoji} {w.wordItem.ch}</span></li>)}</ul>
            </div>
        </div>
        <button onClick={checkAnswers} className="mt-12 bg-lime-500 hover:bg-lime-600 text-white font-black py-6 px-16 rounded-[2.5rem] shadow-2xl transition-transform active:scale-95 flex items-center gap-4 text-3xl">CHECK ANSWERS</button>
        <style>{`
          @keyframes shake-red { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
          .animate-shake-red { animation: shake-red 0.1s ease-in-out infinite; }
        `}</style>
    </div>
  );
};

export default CrosswordGame;