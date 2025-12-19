import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const GRID_SIZE = 10;
const BATCH_SIZE = 6;

const WordSearch: React.FC<Props> = ({ words, onComplete }) => {
  const [batchIndex, setBatchIndex] = useState(0);
  const [allBatches, setAllBatches] = useState<WordItem[][]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [targetWords, setTargetWords] = useState<WordItem[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectionStart, setSelectionStart] = useState<{row: number, col: number} | null>(null);
  const [hoverPos, setHoverPos] = useState<{row: number, col: number} | null>(null);

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
        initGame(allBatches[batchIndex]);
      } else {
        onComplete();
      }
    }
  }, [batchIndex, allBatches]);

  useEffect(() => {
    if (targetWords.length > 0 && foundWords.length === targetWords.length) {
      setTimeout(() => setBatchIndex(prev => prev + 1), 1500);
    }
  }, [foundWords, targetWords]);

  const initGame = (currentBatch: WordItem[]) => {
    setTargetWords(currentBatch);
    setFoundWords([]);
    setSelectionStart(null);
    setHoverPos(null);
    
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    
    currentBatch.forEach(wordItem => {
      const word = wordItem.en.toLowerCase().replace(/[^a-z]/g, '');
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const direction = Math.random() > 0.5 ? 'H' : 'V';
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        if (canPlace(newGrid, word, row, col, direction)) {
          place(newGrid, word, row, col, direction);
          placed = true;
        }
        attempts++;
      }
    });

    const letters = "abcdefghijklmnopqrstuvwxyz";
    for(let r=0; r<GRID_SIZE; r++) {
      for(let c=0; c<GRID_SIZE; c++) {
        if(newGrid[r][c] === '') newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
    setGrid(newGrid);
  };

  const canPlace = (grid: string[][], word: string, row: number, col: number, dir: string) => {
    if (dir === 'H') {
      if (col + word.length > GRID_SIZE) return false;
      for (let i = 0; i < word.length; i++) if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
    } else {
      if (row + word.length > GRID_SIZE) return false;
      for (let i = 0; i < word.length; i++) if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
    }
    return true;
  };

  const place = (grid: string[][], word: string, row: number, col: number, dir: string) => {
    for (let i = 0; i < word.length; i++) {
      if (dir === 'H') grid[row][col + i] = word[i];
      else grid[row + i][col] = word[i];
    }
  };

  const handleCellClick = (r: number, c: number) => {
      if (!selectionStart) { setSelectionStart({ row: r, col: c }); setHoverPos({ row: r, col: c }); }
      else { checkSelection(selectionStart, { row: r, col: c }); setSelectionStart(null); setHoverPos(null); }
  };

  const checkSelection = (start: {row: number, col: number}, end: {row: number, col: number}) => {
    const dr = end.row - start.row;
    const dc = end.col - start.col;
    let selectedWord = '';
    if (dr === 0) { const step = dc > 0 ? 1 : -1; for (let i = 0; i <= Math.abs(dc); i++) selectedWord += grid[start.row][start.col + (i * step)]; }
    else if (dc === 0) { const step = dr > 0 ? 1 : -1; for (let i = 0; i <= Math.abs(dr); i++) selectedWord += grid[start.row + (i * step)][start.col]; }
    else return;
    
    const match = targetWords.find(w => {
       const cleanEn = w.en.toLowerCase().replace(/[^a-z]/g, '');
       return (cleanEn === selectedWord || cleanEn === selectedWord.split('').reverse().join('')) && !foundWords.includes(w.id);
    });
    if (match) setFoundWords([...foundWords, match.id]);
  };

  const isPreviewPath = (r: number, c: number) => {
      if (!selectionStart || !hoverPos) return false;
      if (selectionStart.row === r && selectionStart.col === c) return false;
      const start = selectionStart; const end = hoverPos;
      if (start.row === end.row) { if (r !== start.row) return false; const min = Math.min(start.col, end.col); const max = Math.max(start.col, end.col); return c >= min && c <= max; }
      else if (start.col === end.col) { if (c !== start.col) return false; const min = Math.min(start.row, end.row); const max = Math.max(start.row, end.row); return r >= min && r <= max; }
      return false;
  };

  if (allBatches.length === 0) return null;

  return (
    <div className="flex flex-col items-center w-full h-full max-w-5xl mx-auto p-4 font-fredoka overflow-y-auto">
      <div className="flex justify-between w-full mb-6 items-center bg-white/60 p-6 rounded-[2rem] shadow-xl border-2 border-white">
          <h3 className="text-4xl font-black text-indigo-600">WORD SEARCH</h3>
          <span className="bg-indigo-500 text-white px-8 py-2 rounded-full text-2xl font-black shadow-lg">
              ROUND {batchIndex + 1}/{allBatches.length}
          </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-10">
         {targetWords.map(w => {
             const found = foundWords.includes(w.id);
             return (
                 <div key={w.id} className={`p-5 rounded-[2rem] border-4 flex items-center justify-between transition-all shadow-xl ${found ? 'bg-green-100 border-green-400 opacity-60' : 'bg-white border-indigo-100'}`}>
                     <span className={`font-black text-xl lowercase ${found ? 'text-green-700 line-through' : 'text-gray-800'}`}>{w.en}</span>
                     {found && <span className="text-3xl">⭐</span>}
                 </div>
             )
         })}
      </div>

      <div className="bg-white p-8 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-b-[15px] border-indigo-100 select-none">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
            {grid.map((row, r) => row.map((letter, c) => {
                const active = selectionStart?.row === r && selectionStart?.col === c;
                const preview = isPreviewPath(r, c);
                return (
                    <button key={`${r}-${c}`} onClick={() => handleCellClick(r, c)} onMouseEnter={() => setHoverPos({row: r, col: c})}
                        className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-black text-2xl md:text-3xl rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white scale-110 shadow-xl z-10' : ''} ${preview ? 'bg-indigo-200 text-indigo-800 scale-105' : ''} ${!active && !preview ? 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100' : ''}`}
                    >{letter}</button>
                )
            }))}
        </div>
      </div>
    </div>
  );
};

export default WordSearch;