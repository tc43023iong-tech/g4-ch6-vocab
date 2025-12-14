import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { RotateCcw, Volume2 } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const SpellingBee: React.FC<Props> = ({ words, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<{char: string, id: number}[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{char: string, id: number}[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    loadWord();
  }, [currentIndex]);

  const loadWord = () => {
    const currentWord = words[currentIndex];
    // Requirement: All lowercase
    const text = currentWord.en.toLowerCase();
    
    // Filter out spaces for the letter bank, we only scramble actual letters
    // We create a unique ID for every letter instance to handle duplicates (e.g. two 'e's)
    let charIdCounter = 0;
    const chars = text.split('')
      .filter(c => c !== ' ')
      .map((char) => ({ char, id: charIdCounter++ }));
    
    // Shuffle
    const shuffled = [...chars].sort(() => 0.5 - Math.random());
    setScrambledLetters(shuffled);
    setSelectedLetters([]);
    setIsSuccess(false);
  };

  const handleLetterClick = (item: {char: string, id: number}) => {
    if (isSuccess) return;
    
    // Move from bank to selection
    // Ensure we don't duplicate selections (though UI disables clicked buttons)
    if (!selectedLetters.find(l => l.id === item.id)) {
        const newSelected = [...selectedLetters, item];
        setSelectedLetters(newSelected);
        checkWin(newSelected);
    }
  };

  const handleSelectedClick = (item: {char: string, id: number}) => {
    if (isSuccess) return;
    // Remove from selection (put back to bank visually)
    setSelectedLetters(selectedLetters.filter(l => l.id !== item.id));
  };

  const checkWin = (currentSelection: {char: string, id: number}[]) => {
    // Join selected letters
    const attempt = currentSelection.map(l => l.char).join('');
    // Compare against target word with spaces removed
    const target = words[currentIndex].en.toLowerCase().replace(/ /g, '');
    
    if (attempt === target) {
      setIsSuccess(true);
      
      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1500);
    }
  };

  const progress = (currentIndex / words.length) * 100;
  const currentWord = words[currentIndex];
  // Target string including spaces for rendering the slots
  const targetString = currentWord.en.toLowerCase();

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.en);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // Helper to render the answer area with automatic spaces
  const renderAnswerSlots = () => {
    let letterIndex = 0; // Tracks which selected letter we are displaying
    
    return (
      <div className="flex flex-wrap justify-center items-end gap-2 mb-8 min-h-[60px]">
        {targetString.split('').map((char, idx) => {
          if (char === ' ') {
            // Render Automatic Finger Space
            return (
              <div key={`space-${idx}`} className="w-6 md:w-8 h-12 md:h-14 flex items-center justify-center">
                 <div className="w-full h-1 bg-gray-300 rounded-full"></div> 
              </div>
            );
          }

          // It's a letter slot
          const selectedItem = selectedLetters[letterIndex];
          const isFilled = selectedItem !== undefined;
          
          if (isFilled) {
            letterIndex++; // Move to next selected letter for the next slot
            return (
              <button
                key={selectedItem.id}
                onClick={() => handleSelectedClick(selectedItem)}
                className="w-10 h-12 md:w-12 md:h-14 bg-yellow-400 text-white text-xl md:text-2xl font-bold rounded-lg shadow-md hover:bg-red-400 transition-colors flex items-center justify-center animate-pop"
              >
                {selectedItem.char}
              </button>
            );
          } else {
            // Empty slot placeholder
            return (
               <div key={`empty-${idx}`} className="w-10 h-12 md:w-12 md:h-14 bg-gray-100 border-b-4 border-gray-300 rounded-lg"></div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-6xl mx-auto p-4">
       <div className="w-full bg-gray-200 rounded-full h-4 mb-6 max-w-3xl">
        <div className="bg-yellow-400 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-2xl mb-8 text-center border-b-8 border-yellow-200 relative">
        <button onClick={speak} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-yellow-100">
           <Volume2 className="text-gray-600" />
        </button>
        <div className="text-6xl mb-2">{currentWord.emoji}</div>
        <div className="text-xl text-gray-500 font-bold">{currentWord.ch}</div>
      </div>

      {/* Answer Area with Automatic Spaces */}
      {renderAnswerSlots()}

      {/* Letter Bank */}
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
        {scrambledLetters.map((item) => {
            const isUsed = selectedLetters.find(l => l.id === item.id);
            return (
                <button
                    key={item.id}
                    onClick={() => handleLetterClick(item)}
                    disabled={!!isUsed}
                    className={`
                        w-12 h-12 bg-white border-2 border-gray-200 text-gray-700 text-xl font-bold rounded-full shadow-sm transition-all
                        ${isUsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100 hover:bg-blue-50 hover:border-blue-300'}
                    `}
                >
                    {item.char}
                </button>
            )
        })}
      </div>
      
      <div className="mt-8 text-gray-400 text-sm">
        <RotateCcw className="inline w-4 h-4 mr-1"/> Tap a selected letter to undo
      </div>

      <style>{`
        @keyframes pop {
            0% { transform: scale(0.5); }
            100% { transform: scale(1); }
        }
        .animate-pop {
            animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default SpellingBee;