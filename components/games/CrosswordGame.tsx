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
  cleanWord: string; // no spaces, lowercase
  number: number;
}

const GRID_SIZE = 11; // 11x11 grid

const CrosswordGame: React.FC<Props> = ({ words, onComplete }) => {
  const [round, setRound] = useState(0);
  const [grid, setGrid] = useState<(string | null)[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [userInputs, setUserInputs] = useState<{[key: string]: string}>({});
  const [isRoundComplete, setIsRoundComplete] = useState(false);

  useEffect(() => {
    generateLevel();
  }, [round]);

  const generateLevel = () => {
    // Basic algorithm to place 3-5 random words
    let newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    let placements: PlacedWord[] = [];
    let attempts = 0;
    
    // Shuffle words
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const usedIds = new Set<string>();

    // 1. Place first word in middle horizontally
    const w1 = shuffled[0];
    usedIds.add(w1.id);
    const clean1 = w1.en.toLowerCase().replace(/[^a-z]/g, '');
    const startRow = Math.floor(GRID_SIZE / 2);
    const startCol = Math.floor((GRID_SIZE - clean1.length) / 2);

    placeOnGrid(newGrid, clean1, startRow, startCol, 'across');
    placements.push({
        wordItem: w1,
        direction: 'across',
        row: startRow,
        col: startCol,
        cleanWord: clean1,
        number: 1
    });

    // 2. Try to add more words intersecting existing ones
    let wordIdx = 1;
    let wordCount = 1;

    while (wordIdx < shuffled.length && wordCount < 5 && attempts < 50) {
        const candidate = shuffled[wordIdx];
        const cleanCand = candidate.en.toLowerCase().replace(/[^a-z]/g, '');
        let placed = false;

        // Try to intersect with any currently placed word
        for (const p of placements) {
            if (placed) break;
            
            // Find common letters
            for (let i = 0; i < p.cleanWord.length; i++) {
                if (placed) break;
                const charOnGrid = p.cleanWord[i];
                const gridR = p.direction === 'across' ? p.row : p.row + i;
                const gridC = p.direction === 'across' ? p.col + i : p.col;

                // Check where this char exists in candidate
                for (let j = 0; j < cleanCand.length; j++) {
                    if (cleanCand[j] === charOnGrid) {
                        // Potential intersection
                        // If P is ACROSS, candidate must be DOWN
                        const newDir = p.direction === 'across' ? 'down' : 'across';
                        const newR = newDir === 'down' ? gridR - j : gridR;
                        const newC = newDir === 'across' ? gridC - j : gridC;

                        if (canPlace(newGrid, cleanCand, newR, newC, newDir)) {
                            placeOnGrid(newGrid, cleanCand, newR, newC, newDir);
                            placements.push({
                                wordItem: candidate,
                                direction: newDir,
                                row: newR,
                                col: newC,
                                cleanWord: cleanCand,
                                number: placements.length + 1
                            });
                            placed = true;
                            usedIds.add(candidate.id);
                            wordCount++;
                            break;
                        }
                    }
                }
            }
        }
        wordIdx++;
        attempts++;
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
          // Check boundaries and neighbors
          for(let i=0; i<word.length; i++) {
              const cell = grid[row][col+i];
              if (cell !== null && cell !== word[i]) return false;
              // Check top/bottom neighbors if this is a new placement (not intersection)
              // This is a simplified check
          }
      } else {
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
      const char = val.slice(-1).toLowerCase(); // Take last char, lowercase
      if (!/[a-z]/.test(char) && char !== '') return;
      
      setUserInputs(prev => ({
          ...prev,
          [`${r}-${c}`]: char
      }));
  };

  const checkAnswers = () => {
      let allCorrect = true;
      placedWords.forEach(w => {
          for(let i=0; i<w.cleanWord.length; i++) {
              const r = w.direction === 'across' ? w.row : w.row + i;
              const c = w.direction === 'across' ? w.col + i : w.col;
              const userChar = userInputs[`${r}-${c}`];
              if (userChar !== w.cleanWord[i]) allCorrect = false;
          }
      });

      if (allCorrect) {
          setIsRoundComplete(true);
          setTimeout(() => {
              if (round < 4) setRound(prev => prev + 1);
              else onComplete();
          }, 2000);
      } else {
          // Visual shake feedback?
          const el = document.getElementById('crossword-grid');
          el?.classList.add('animate-shake');
          setTimeout(() => el?.classList.remove('animate-shake'), 500);
      }
  };

  const progress = (round / 5) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center max-w-4xl mx-auto p-4 bg-lime-50">
        <div className="w-full bg-white/50 h-2 rounded-full mb-4">
            <div className="bg-lime-500 h-2 rounded-full transition-all" style={{width: `${progress}%`}}></div>
        </div>

        <h2 className="text-2xl font-bold text-lime-700 mb-4 flex items-center gap-2">
            ✏️ Crossword Puzzle
            {isRoundComplete && <span className="text-green-500 text-sm animate-bounce">Good Job!</span>}
        </h2>

        {/* Grid Container */}
        <div id="crossword-grid" className="bg-white p-4 rounded-xl shadow-lg border-4 border-lime-200 overflow-x-auto max-w-full">
            <div 
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
                {grid.map((rowArr, r) => (
                    rowArr.map((cell, c) => {
                        // Check if this cell is part of any word
                        const isActive = cell !== null;
                        // Find if any word starts here to show number
                        const wordStarts = placedWords.filter(w => w.row === r && w.col === c);
                        const startNum = wordStarts.length > 0 ? wordStarts[0].number : null;
                        
                        const inputKey = `${r}-${c}`;
                        const userVal = userInputs[inputKey] || '';
                        
                        if (!isActive) {
                            return <div key={inputKey} className="w-7 h-7 md:w-9 md:h-9 bg-transparent"></div>
                        }

                        return (
                            <div key={inputKey} className="relative w-7 h-7 md:w-9 md:h-9">
                                {startNum && (
                                    <span className="absolute top-0 left-0.5 text-[8px] md:text-[10px] font-bold text-gray-500 leading-none z-10 pointer-events-none">
                                        {startNum}
                                    </span>
                                )}
                                <input
                                    type="text"
                                    maxLength={1}
                                    value={userVal}
                                    onChange={(e) => handleInputChange(r, c, e.target.value)}
                                    className={`
                                        w-full h-full text-center border-2 rounded-md text-lg md:text-xl font-bold uppercase focus:outline-none focus:border-lime-500 focus:bg-lime-50
                                        ${isRoundComplete ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-gray-300 text-gray-700'}
                                    `}
                                />
                            </div>
                        )
                    })
                ))}
            </div>
        </div>

        {/* Clues */}
        <div className="mt-6 w-full grid grid-cols-2 gap-4 md:gap-8 max-w-2xl">
            <div className="bg-white p-4 rounded-xl border-l-4 border-lime-400 shadow-sm">
                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-2">Across</h3>
                <ul className="space-y-2">
                    {placedWords.filter(w => w.direction === 'across').map(w => (
                        <li key={w.number} className="text-sm md:text-base flex items-start gap-2">
                            <span className="font-bold text-lime-600">{w.number}.</span>
                            <span>{w.wordItem.emoji} {w.wordItem.ch}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-teal-400 shadow-sm">
                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-2">Down</h3>
                <ul className="space-y-2">
                    {placedWords.filter(w => w.direction === 'down').map(w => (
                        <li key={w.number} className="text-sm md:text-base flex items-start gap-2">
                            <span className="font-bold text-teal-600">{w.number}.</span>
                            <span>{w.wordItem.emoji} {w.wordItem.ch}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <button 
            onClick={checkAnswers}
            className="mt-6 bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2"
        >
            Check Answers <Check className="w-5 h-5"/>
        </button>

        <style>{`
            .animate-shake {
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                40%, 60% { transform: translate3d(4px, 0, 0); }
            }
        `}</style>
    </div>
  );
};

export default CrosswordGame;