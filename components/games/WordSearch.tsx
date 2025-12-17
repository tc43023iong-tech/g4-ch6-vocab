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
  const [grid, setGrid] = useState<string[][]>([]);
  const [targetWords, setTargetWords] = useState<WordItem[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  
  // Selection state for click-click interaction
  const [selectionStart, setSelectionStart] = useState<{row: number, col: number} | null>(null);

  // Split words into batches
  const batches = [];
  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    batches.push(words.slice(i, i + BATCH_SIZE));
  }

  useEffect(() => {
    if (batchIndex < batches.length) {
      initGame(batches[batchIndex]);
    } else {
      onComplete();
    }
  }, [batchIndex]);

  useEffect(() => {
    if (targetWords.length > 0 && foundWords.length === targetWords.length) {
      setTimeout(() => {
        setBatchIndex(prev => prev + 1);
      }, 1500);
    }
  }, [foundWords, targetWords]);

  const initGame = (currentBatch: WordItem[]) => {
    setTargetWords(currentBatch);
    setFoundWords([]);
    setSelectionStart(null);
    
    // Create Empty Grid
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    
    // Place Words
    currentBatch.forEach(wordItem => {
      // LOWERCASE logic
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

    // Fill empty spots with lowercase letters
    const letters = "abcdefghijklmnopqrstuvwxyz";
    for(let r=0; r<GRID_SIZE; r++) {
      for(let c=0; c<GRID_SIZE; c++) {
        if(newGrid[r][c] === '') {
          newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    setGrid(newGrid);
  };

  const canPlace = (grid: string[][], word: string, row: number, col: number, dir: string) => {
    if (dir === 'H') {
      if (col + word.length > GRID_SIZE) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
      }
    } else {
      if (row + word.length > GRID_SIZE) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
      }
    }
    return true;
  };

  const place = (grid: string[][], word: string, row: number, col: number, dir: string) => {
    for (let i = 0; i < word.length; i++) {
      if (dir === 'H') grid[row][col + i] = word[i];
      else grid[row + i][col] = word[i];
    }
  };

  // Interaction Handlers (Click start, then Click end)
  const handleCellClick = (r: number, c: number) => {
      if (!selectionStart) {
          // First click
          setSelectionStart({ row: r, col: c });
      } else {
          // Second click
          checkSelection(selectionStart, { row: r, col: c });
          setSelectionStart(null);
      }
  };

  const checkSelection = (start: {row: number, col: number}, end: {row: number, col: number}) => {
    // Construct word from selection
    // Determine direction and letters
    const dr = end.row - start.row;
    const dc = end.col - start.col;
    let selectedWord = '';

    // We only support Horizontal and Vertical in this generator
    if (dr === 0) {
        // Horizontal
        const step = dc > 0 ? 1 : -1;
        for (let i = 0; i <= Math.abs(dc); i++) {
            selectedWord += grid[start.row][start.col + (i * step)];
        }
    } else if (dc === 0) {
        // Vertical
        const step = dr > 0 ? 1 : -1;
        for (let i = 0; i <= Math.abs(dr); i++) {
            selectedWord += grid[start.row + (i * step)][start.col];
        }
    } else {
        // Diagonal or invalid line (not supported by generator currently)
        return;
    }
    
    // Check match
    const match = targetWords.find(w => {
       const cleanEn = w.en.toLowerCase().replace(/[^a-z]/g, '');
       // Check forward or reverse selection
       return (cleanEn === selectedWord || cleanEn === selectedWord.split('').reverse().join('')) && !foundWords.includes(w.id);
    });

    if (match) {
      setFoundWords([...foundWords, match.id]);
    }
  };

  const isSelected = (r: number, c: number) => {
    // Only highlight the start cell
    return selectionStart && selectionStart.row === r && selectionStart.col === c;
  };

  if (batchIndex >= batches.length) return <div className="text-center p-10 font-bold text-2xl text-green-600">All Words Found!</div>;

  return (
    <div className="flex flex-col items-center w-full h-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between w-full mb-4 items-center">
          <h3 className="text-2xl font-bold text-indigo-600">Word Search</h3>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">
              Round {batchIndex + 1}/{batches.length}
          </span>
      </div>

      <div className="mb-2 text-indigo-400 text-sm font-bold">
         Click the <span className="underline">first</span> letter, then click the <span className="underline">last</span> letter!
      </div>
      
      {/* Grid */}
      <div 
        className="bg-white p-4 rounded-xl shadow-lg border-4 border-indigo-200 select-none touch-none"
      >
        <div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
            {grid.map((row, r) => (
                row.map((letter, c) => (
                    <button
                        key={`${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        className={`
                            w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-lg md:text-xl rounded-full cursor-pointer transition-colors
                            ${isSelected(r, c) ? 'bg-indigo-500 text-white scale-110 ring-4 ring-indigo-200' : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'}
                        `}
                    >
                        {letter}
                    </button>
                ))
            ))}
        </div>
      </div>

      {/* Word List */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
         {targetWords.map(w => {
             const found = foundWords.includes(w.id);
             return (
                 <div 
                    key={w.id} 
                    className={`
                        p-3 rounded-xl border-2 flex items-center justify-between transition-all
                        ${found ? 'bg-green-100 border-green-400 opacity-50' : 'bg-white border-indigo-100 shadow-sm'}
                    `}
                 >
                     <span className={`font-bold lowercase ${found ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                         {w.en}
                     </span>
                     {found && <span className="text-xl">✅</span>}
                 </div>
             )
         })}
      </div>
    </div>
  );
};

export default WordSearch;