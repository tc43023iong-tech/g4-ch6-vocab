import React, { useState, useEffect, useRef } from 'react';
import { WordItem } from '../../types';
import { Heart } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const ParkourRun: React.FC<Props> = ({ words, onComplete }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [characterState, setCharacterState] = useState<'run' | 'jump'>('run');
  
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<{id: string, text: string, isCorrect: boolean}[]>([]);
  
  const [obstaclePosition, setObstaclePosition] = useState(100); // % from left
  const gameLoopRef = useRef<number>(0);
  const speedRef = useRef(0.5); // Movement speed

  // Start Game
  useEffect(() => {
    startGame();
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setIsPlaying(true);
    setObstaclePosition(100);
    nextQuestion();
    gameLoop();
  };

  const nextQuestion = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(word);
    
    // Generate options (Translation pairs)
    const distractor = words.filter(w => w.id !== word.id)[Math.floor(Math.random() * (words.length - 1))];
    
    const opts = [
        { id: word.id, text: word.en, isCorrect: true },
        { id: distractor.id, text: distractor.en, isCorrect: false }
    ].sort(() => 0.5 - Math.random());
    
    setOptions(opts);
  };

  const gameLoop = () => {
    if (!isPlaying) return;

    setObstaclePosition(prev => {
        let next = prev - speedRef.current;
        
        // Reset if off screen (passed successfully without crashing? No, logic handles interaction)
        if (next < -20) {
           // Missed answering?
           next = 100;
           // If we loop without answering, maybe penalty? 
           // For simple kids game, let's just loop same question or new one if we want endless.
           // Let's force interaction: The obstacle stops or slows down? 
           // Let's reset obstacle and give new question if passed.
           nextQuestion();
        }
        return next;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const handleOptionClick = (isCorrect: boolean) => {
     if (characterState === 'jump') return; // Already jumping

     if (isCorrect) {
         // Jump!
         setCharacterState('jump');
         setScore(prev => prev + 10);
         
         // Visual Jump duration
         setTimeout(() => {
             setCharacterState('run');
         }, 800);

         // Reset obstacle visually 'passed'
         setTimeout(() => {
             setObstaclePosition(100);
             nextQuestion();
         }, 500);

         if (score > 80) { // Win condition
             setIsPlaying(false);
             onComplete();
         }

     } else {
         // Ouch
         setLives(prev => {
             const newLives = prev - 1;
             if (newLives <= 0) {
                 setIsPlaying(false);
                 // Simple reset for now
                 setTimeout(startGame, 1000);
             }
             return newLives;
         });
         
         // Shake effect or red flash
         const gameArea = document.getElementById('game-area');
         gameArea?.classList.add('animate-shake');
         setTimeout(() => gameArea?.classList.remove('animate-shake'), 500);
     }
  };

  if (!isPlaying && lives <= 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over</h2>
              <button onClick={startGame} className="bg-blue-500 text-white px-8 py-3 rounded-full text-xl font-bold">Try Again</button>
          </div>
      )
  }

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-sky-200">
        {/* Sky / HUD */}
        <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20">
            <div className="bg-white/80 px-4 py-2 rounded-full font-bold text-orange-600 text-xl shadow-sm border-2 border-orange-200">
                Score: {score}
            </div>
            <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                    <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
                ))}
            </div>
        </div>

        {/* Clouds */}
        <div className="absolute top-20 left-10 text-6xl opacity-60 animate-float-slow">☁️</div>
        <div className="absolute top-10 right-20 text-5xl opacity-40 animate-float-slow" style={{animationDelay: '1s'}}>☁️</div>

        {/* Game World */}
        <div id="game-area" className="flex-1 relative flex items-end pb-20 overflow-hidden">
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-20 bg-emerald-500 border-t-8 border-emerald-600"></div>

            {/* Character */}
            <div 
                className={`absolute left-10 bottom-24 transition-transform duration-500 ${characterState === 'jump' ? '-translate-y-32 rotate-12' : ''}`}
            >
                {/* Scorbunny Placeholder */}
                <img 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/813.png" 
                    className="w-24 h-24 drop-shadow-lg"
                    alt="Character"
                />
            </div>

            {/* Obstacle / Question Gate */}
            <div 
                className="absolute bottom-20 flex flex-col items-center justify-end"
                style={{ left: `${obstaclePosition}%`, transition: 'none' }}
            >
                {/* The Obstacle Graphic */}
                <div className="text-6xl mb-2">🪨</div>
                
                {/* The Question floating above */}
                <div className="absolute bottom-32 bg-white px-6 py-4 rounded-2xl shadow-xl border-4 border-purple-400 whitespace-nowrap z-10 text-center">
                    <span className="block text-sm text-gray-400 font-bold uppercase mb-1">Translate</span>
                    <span className="text-2xl font-black text-purple-700">{currentWord?.ch}</span>
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 pb-8 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] rounded-t-3xl border-t-4 border-blue-100">
            <h3 className="text-center text-gray-400 font-bold mb-3 uppercase text-sm tracking-wider">Choose the correct answer to Jump!</h3>
            <div className="flex gap-4 max-w-lg mx-auto">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleOptionClick(opt.isCorrect)}
                        className="flex-1 bg-gradient-to-b from-blue-400 to-blue-600 text-white py-4 rounded-2xl font-bold text-xl shadow-lg active:scale-95 active:bg-blue-700 transition-transform border-b-4 border-blue-800"
                    >
                        {opt.text}
                    </button>
                ))}
            </div>
        </div>

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

export default ParkourRun;