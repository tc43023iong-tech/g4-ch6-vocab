import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { Volume2, Music, Check, X } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const ListeningChallenge: React.FC<Props> = ({ words, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    generateQuestion();
  }, [currentIndex]);

  const generateQuestion = () => {
    const currentWord = words[currentIndex];
    const distractors = words
      .filter(w => w.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const allOptions = [currentWord, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedId(null);
    setIsCorrect(null);
    
    // Auto play sound after short delay
    setTimeout(() => playSound(currentWord.en), 500);
  };

  const playSound = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (id: string) => {
    if (selectedId) return;
    
    setSelectedId(id);
    const correct = id === words[currentIndex].id;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
        setTimeout(() => {
            setSelectedId(null);
            setIsCorrect(null);
        }, 1200);
    }
  };

  const progress = (currentIndex / words.length) * 100;
  const currentWord = words[currentIndex];

  return (
    <div className="w-full h-full flex flex-col items-center max-w-4xl mx-auto p-4">
      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-8 max-w-2xl mt-4">
        <div className="bg-pink-400 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Audio Button */}
      <div className="flex-1 flex flex-col items-center justify-center w-full mb-8">
          <div className="relative">
            {/* Pulse effect */}
            {isPlaying && (
                <>
                <div className="absolute inset-0 bg-pink-300 rounded-full animate-ping opacity-50"></div>
                <div className="absolute -inset-4 bg-pink-200 rounded-full animate-pulse opacity-30"></div>
                </>
            )}
            
            <button 
                onClick={() => playSound(currentWord.en)}
                className="w-40 h-40 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full shadow-[0_10px_30px_rgba(244,114,182,0.5)] flex items-center justify-center transform active:scale-95 transition-all relative z-10 border-4 border-white"
            >
                {isPlaying ? (
                    <Volume2 className="w-20 h-20 text-white animate-bounce" />
                ) : (
                    <Music className="w-20 h-20 text-white" />
                )}
            </button>
          </div>
          
          <p className="mt-8 text-xl text-gray-500 font-bold bg-white px-6 py-2 rounded-full shadow-sm">
             Tap to listen
          </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-8">
        {options.map(option => {
           const isSelected = selectedId === option.id;
           const statusClass = isSelected 
             ? (isCorrect && option.id === currentWord.id ? 'bg-green-500 border-green-600 text-white' : 'bg-red-500 border-red-600 text-white')
             : 'bg-white border-gray-200 text-gray-700 hover:bg-pink-50 hover:border-pink-200';

           return (
            <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                p-6 rounded-2xl text-xl font-bold border-b-4 transition-all shadow-md flex items-center justify-between group
                ${statusClass}
                `}
            >
                <span className="group-hover:scale-105 transition-transform">{option.ch}</span>
                {isSelected && (
                    <div className="bg-white/20 p-1 rounded-full">
                        {isCorrect && option.id === currentWord.id ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                    </div>
                )}
            </button>
           )
        })}
      </div>
    </div>
  );
};

export default ListeningChallenge;