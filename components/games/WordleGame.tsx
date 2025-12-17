import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { Delete, Check } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const WordleGame: React.FC<Props> = ({ words, onComplete }) => {
  const [round, setRound] = useState(0);
  const [targetWord, setTargetWord] = useState<WordItem | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Filter usable words (single words, 3-8 letters)
  const playableWords = words.filter(w => !w.en.includes(' ') && w.en.length >= 3 && w.en.length <= 8);
  const MAX_ATTEMPTS = 6;

  useEffect(() => {
    startRound();
  }, [round]);

  const startRound = () => {
    // Pick random word
    const word = playableWords[Math.floor(Math.random() * playableWords.length)];
    setTargetWord(word);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
  };

  const handleKeyClick = (key: string) => {
    if (gameStatus !== 'playing' || !targetWord) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== targetWord.en.length) return; // Must fill line
      
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess.toLowerCase() === targetWord.en.toLowerCase()) {
        setGameStatus('won');
        setTimeout(() => {
           if (round < 4) setRound(r => r + 1); // Play 5 rounds
           else onComplete();
        }, 2000);
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameStatus('lost');
        setTimeout(startRound, 2500); // Retry new word
      }
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else {
      if (currentGuess.length < targetWord.en.length) {
        setCurrentGuess(prev => prev + key);
      }
    }
  };

  if (!targetWord) return <div>Loading...</div>;

  const wordLength = targetWord.en.length;

  // Helper to get letter status
  const getLetterStatus = (letter: string, index: number, guess: string) => {
    const target = targetWord.en.toLowerCase();
    const l = letter.toLowerCase();
    
    if (target[index] === l) return 'bg-green-500 text-white border-green-600';
    if (target.includes(l)) return 'bg-yellow-400 text-white border-yellow-500';
    return 'bg-gray-400 text-white border-gray-500';
  };

  // Keyboard generation
  const keyboard = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['ENTER', 'z','x','c','v','b','n','m', 'BACK']
  ];

  const getKeyboardKeyColor = (key: string) => {
      // Logic to color keyboard keys based on previous guesses
      let status = 'bg-white text-gray-700';
      const k = key.toLowerCase();
      
      // Prioritize Green > Yellow > Gray
      let isGreen = false;
      let isYellow = false;
      let isGray = false;

      guesses.forEach(guess => {
          for(let i=0; i<guess.length; i++) {
              if (guess[i].toLowerCase() === k) {
                  if (targetWord.en.toLowerCase()[i] === k) isGreen = true;
                  else if (targetWord.en.toLowerCase().includes(k)) isYellow = true;
                  else isGray = true;
              }
          }
      });

      if (isGreen) return 'bg-green-500 text-white';
      if (isYellow) return 'bg-yellow-400 text-white';
      if (isGray) return 'bg-gray-300 text-gray-500';
      return 'bg-white text-gray-700 hover:bg-gray-100';
  };

  const progress = (round / 5) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center max-w-md mx-auto p-4">
      {/* HUD */}
      <div className="w-full mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-pink-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between items-center bg-pink-100 px-4 py-2 rounded-xl">
             <span className="text-pink-600 font-bold text-sm">Target: {wordLength} Letters</span>
             <span className="text-2xl">{targetWord.emoji}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center gap-2 mb-4">
        {[...Array(MAX_ATTEMPTS)].map((_, rowIndex) => {
          const isCurrentRow = rowIndex === guesses.length;
          const guess = guesses[rowIndex];
          
          return (
            <div key={rowIndex} className="flex gap-1 md:gap-2">
              {[...Array(wordLength)].map((_, colIndex) => {
                 let char = '';
                 let style = 'bg-white border-2 border-gray-200 text-gray-700';
                 
                 if (isCurrentRow) {
                     char = currentGuess[colIndex] || '';
                     if (char) style = 'bg-white border-2 border-gray-400 text-gray-800 animate-pop';
                 } else if (guess) {
                     char = guess[colIndex];
                     style = getLetterStatus(char, colIndex, guess);
                 }

                 return (
                     <div key={colIndex} className={`
                        w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-xl rounded-md uppercase
                        ${style}
                     `}>
                         {char}
                     </div>
                 )
              })}
            </div>
          )
        })}
      </div>

      {/* Message */}
      {gameStatus === 'won' && <div className="text-2xl font-bold text-green-500 animate-bounce mb-2">Awesome!</div>}
      {gameStatus === 'lost' && <div className="text-lg font-bold text-red-500 mb-2">Word: {targetWord.en}</div>}

      {/* Keyboard */}
      <div className="w-full grid gap-2">
         {keyboard.map((row, rIdx) => (
             <div key={rIdx} className="flex justify-center gap-1">
                 {row.map(key => {
                     const isSpecial = key.length > 1;
                     return (
                        <button
                            key={key}
                            onClick={() => handleKeyClick(key)}
                            className={`
                                h-12 rounded-lg font-bold shadow-sm transition-all active:scale-95
                                ${isSpecial ? 'px-3 md:px-4 bg-gray-200 text-gray-700 text-xs' : `w-8 md:w-10 ${getKeyboardKeyColor(key)}`}
                            `}
                        >
                            {key === 'BACK' ? <Delete className="w-5 h-5 mx-auto"/> : key === 'ENTER' ? 'ENTER' : key.toUpperCase()}
                        </button>
                     )
                 })}
             </div>
         ))}
      </div>
      
      <style>{`
          @keyframes pop {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop { animation: pop 0.1s ease-out; }
      `}</style>
    </div>
  );
};

export default WordleGame;