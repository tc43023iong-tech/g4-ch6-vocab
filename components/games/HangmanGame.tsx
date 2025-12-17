import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const HangmanGame: React.FC<Props> = ({ words, onComplete }) => {
  const [round, setRound] = useState(0);
  const [targetWord, setTargetWord] = useState<WordItem | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const MAX_MISTAKES = 6;

  useEffect(() => {
    startRound();
  }, [round]);

  const startRound = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setTargetWord(word);
    setGuessedLetters([]);
    setMistakes(0);
    setStatus('playing');
  };

  const handleLetterClick = (letter: string) => {
    if (status !== 'playing' || !targetWord || guessedLetters.includes(letter)) return;

    const newGuesses = [...guessedLetters, letter];
    setGuessedLetters(newGuesses);

    // Check if letter in word
    const lowerWord = targetWord.en.toLowerCase();
    if (!lowerWord.includes(letter)) {
       const newMistakes = mistakes + 1;
       setMistakes(newMistakes);
       if (newMistakes >= MAX_MISTAKES) {
           setStatus('lost');
           setTimeout(startRound, 2500);
       }
    } else {
        // Check win
        const isWin = lowerWord.split('').every(char => {
            if (!/[a-z]/.test(char)) return true; // spaces/punctuation always "found"
            return newGuesses.includes(char);
        });
        
        if (isWin) {
            setStatus('won');
            setTimeout(() => {
                if (round < 4) setRound(r => r + 1);
                else onComplete();
            }, 1500);
        }
    }
  };

  if (!targetWord) return <div>Loading...</div>;

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // Balloon visual logic
  // We start with 6 balloons, pop one for each mistake
  const balloonsRemaining = MAX_MISTAKES - mistakes;

  return (
    <div className="w-full h-full flex flex-col items-center max-w-4xl mx-auto p-4 bg-sky-100">
        
        {/* Progress */}
        <div className="w-full max-w-md bg-white/50 h-2 rounded-full mb-4">
             <div className="bg-sky-500 h-2 rounded-full transition-all" style={{width: `${(round/5)*100}%`}}></div>
        </div>

        {/* Game Area */}
        <div className="flex-1 w-full flex flex-col justify-between items-center">
            
            {/* Visuals: Character holding balloons */}
            <div className="relative h-48 w-full flex justify-center items-end mb-4">
                 {/* Character */}
                 <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/425.png" 
                      className="w-24 h-24 z-10" alt="Drifloon" />
                 
                 {/* Balloons */}
                 <div className="absolute top-0 flex justify-center gap-2 w-64 h-32">
                     {[...Array(MAX_MISTAKES)].map((_, i) => {
                         const isPopped = i >= balloonsRemaining;
                         return (
                             <div key={i} className={`
                                 w-10 h-12 rounded-full transition-all duration-300 relative
                                 ${isPopped ? 'scale-0 opacity-0' : 'scale-100 opacity-90 animate-float'}
                             `}
                             style={{
                                 backgroundColor: ['#FF5252', '#FFEB3B', '#448AFF', '#69F0AE', '#E040FB', '#FF9800'][i],
                                 animationDelay: `${i * 0.5}s`,
                                 transformOrigin: 'bottom center'
                             }}>
                                 {/* String */}
                                 <div className="absolute top-full left-1/2 w-0.5 h-16 bg-gray-400 opacity-50 origin-top transform -rotate-12"></div>
                             </div>
                         )
                     })}
                 </div>
                 
                 {status === 'lost' && <div className="absolute top-0 text-4xl font-bold text-red-500 animate-ping">POP!</div>}
            </div>

            {/* Word Display */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-b-8 border-sky-200 mb-8 w-full max-w-2xl text-center">
                <div className="text-2xl text-gray-400 font-bold mb-2">{targetWord.ch}</div>
                <div className="flex flex-wrap justify-center gap-2">
                    {targetWord.en.split('').map((char, idx) => {
                        const isSpace = char === ' ';
                        const isGuessed = guessedLetters.includes(char.toLowerCase());
                        const isLost = status === 'lost';
                        
                        if (isSpace) return <div key={idx} className="w-6"></div>;

                        return (
                            <div key={idx} className={`
                                w-8 h-10 md:w-10 md:h-12 border-b-4 flex items-center justify-center text-2xl font-bold
                                ${isGuessed ? 'border-sky-500 text-sky-700' : 'border-gray-300 text-transparent'}
                                ${isLost && !isGuessed ? 'text-red-400' : ''}
                            `}>
                                {isGuessed || isLost ? char : '_'}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Keyboard */}
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                {alphabet.map(letter => {
                    const isUsed = guessedLetters.includes(letter);
                    return (
                        <button
                            key={letter}
                            onClick={() => handleLetterClick(letter)}
                            disabled={isUsed || status !== 'playing'}
                            className={`
                                w-10 h-10 md:w-12 md:h-12 rounded-lg text-lg font-bold shadow-sm transition-all
                                ${isUsed 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-sky-600 hover:bg-sky-50 hover:scale-110 active:scale-95 border-b-2 border-sky-100'
                                }
                            `}
                        >
                            {letter}
                        </button>
                    )
                })}
            </div>
        </div>

        <style>{`
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(-5deg); }
                50% { transform: translateY(-5px) rotate(5deg); }
            }
            .animate-float { animation: float 3s ease-in-out infinite; }
        `}</style>
    </div>
  );
};

export default HangmanGame;