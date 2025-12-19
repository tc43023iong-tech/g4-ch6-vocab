import React, { useState, useEffect, useRef } from 'react';
import { WordItem } from '../../types';
import { CloudRain, Star } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

interface Drop {
  id: number;
  wordId: string;
  text: string;
  x: number;
  y: number;
  speed: number;
}

const RainDrops: React.FC<Props> = ({ words, onComplete }) => {
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const gameLoopRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const spawnInterval = 1200; // 稍微頻繁一點生成，保持畫面上有多個雨滴
  const idCounter = useRef<number>(0);

  useEffect(() => {
    setShuffledWords([...words].sort(() => 0.5 - Math.random()));
  }, [words]);

  useEffect(() => {
    if (shuffledWords.length > 0) {
        startGame();
    }
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [shuffledWords]);

  const startGame = () => {
    setScore(0);
    setIsFinished(false);
    setCurrentIndex(0);
    setDrops([]);
    gameLoopRef.current = requestAnimationFrame(update);
  };

  const spawnDrop = (timestamp: number) => {
    if (!shuffledWords[currentIndex]) return;

    // 提高正確答案出現的機率
    const isCorrect = Math.random() < 0.45 || drops.length < 3;
    let wordToSpawn: WordItem;

    if (isCorrect) {
        wordToSpawn = shuffledWords[currentIndex];
    } else {
        const distractors = words.filter(w => w.id !== shuffledWords[currentIndex].id);
        wordToSpawn = distractors[Math.floor(Math.random() * distractors.length)];
    }

    const newDrop: Drop = {
        id: idCounter.current++,
        wordId: wordToSpawn.id,
        text: wordToSpawn.en,
        x: 10 + Math.random() * 80, 
        y: -25,
        speed: 0.35 + Math.random() * 0.35 // 速度調慢 (之前是 0.5~1.0)
    };

    setDrops(prev => [...prev, newDrop]);
    lastSpawnTime.current = timestamp;
  };

  const update = (timestamp: number) => {
    if (isFinished) return;

    if (timestamp - lastSpawnTime.current > spawnInterval) {
        spawnDrop(timestamp);
    }

    setDrops(prev => {
        return prev.map(d => ({ ...d, y: d.y + d.speed }))
            .filter(d => d.y < 120); 
    });

    gameLoopRef.current = requestAnimationFrame(update);
  };

  const handleDropClick = (drop: Drop) => {
    if (isFinished) return;

    const target = shuffledWords[currentIndex];
    if (drop.wordId === target.id) {
        setScore(prev => prev + 10);
        // 答對時只移除被點擊的，或者也可以清空所有該正確單字
        setDrops(prev => prev.filter(d => d.id !== drop.id));
        
        const mascot = document.getElementById('mascot-politoed');
        mascot?.classList.add('animate-happy-jump');
        setTimeout(() => mascot?.classList.remove('animate-happy-jump'), 600);

        if (currentIndex < shuffledWords.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
            cancelAnimationFrame(gameLoopRef.current);
            setTimeout(onComplete, 1200);
        }
    } else {
        const el = document.getElementById(`drop-${drop.id}`);
        el?.classList.add('animate-wrong-shake');
        setTimeout(() => el?.classList.remove('animate-wrong-shake'), 400);
    }
  };

  const progress = (currentIndex / shuffledWords.length) * 100;

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#0a1b3d] font-fredoka select-none">
        
        {/* 背景裝飾 */}
        <div className="absolute inset-0 pointer-events-none z-0">
             {[...Array(30)].map((_, i) => (
                <div key={i} className="absolute bg-blue-300/10 w-[1px] h-20 rounded-full animate-rain-streak"
                    style={{ left: `${Math.random()*100}%`, top: `-${Math.random()*100}%`, animationDuration: `${0.8 + Math.random()}s`, animationDelay: `${Math.random()*3}s` }}
                />
             ))}
        </div>

        {/* 頂部 HUD */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-40">
            <div className="bg-white/10 backdrop-blur-lg px-6 py-2 rounded-full border border-white/20 flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <span className="text-white font-black text-xl tracking-widest">{currentIndex + 1} / {shuffledWords.length}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-8 py-2 rounded-full font-black text-2xl shadow-xl border-b-4 border-blue-600">
                SCORE: {score}
            </div>
        </div>

        {/* 題目面板 */}
        <div className="mt-24 mx-auto z-40 text-center px-4 w-full max-lg animate-pop-in">
            <div className="bg-[#1e2a4a]/85 backdrop-blur-xl px-12 py-8 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-4 border-blue-500/50 relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-blue-300 rotate-12">
                    <CloudRain className="w-12 h-12 text-white" />
                </div>
                <p className="text-blue-300 font-bold text-sm uppercase tracking-[0.3em] mb-3 mt-4">Translate this word:</p>
                <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] leading-tight">
                    {shuffledWords[currentIndex]?.ch}
                </h2>
                <div className="text-3xl mt-4 opacity-90 animate-bounce">{shuffledWords[currentIndex]?.emoji}</div>
            </div>
            {/* 進度條 */}
            <div className="mt-8 w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/10">
                <div className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 h-full transition-all duration-1000" style={{width: `${progress}%`}}></div>
            </div>
        </div>

        {/* 雨滴下落區 */}
        <div className="flex-1 relative z-10 w-full">
            {drops.map(drop => (
                <button
                    key={drop.id}
                    id={`drop-${drop.id}`}
                    onClick={() => handleDropClick(drop)}
                    className="absolute group transform -translate-x-1/2 cursor-pointer transition-opacity active:scale-95"
                    style={{ left: `${drop.x}%`, top: `${drop.y}%` }}
                >
                    <div className="relative w-28 h-32 md:w-40 md:h-48 flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-400/80 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] rounded-tr-none rotate-[45deg] border-2 border-white/30 shadow-[inset_0_10px_25px_rgba(255,255,255,0.4),0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-[4px] group-hover:bg-blue-300/90 transition-all group-hover:scale-105"></div>
                        <div className="absolute top-5 left-8 w-8 h-4 bg-white/40 rounded-full rotate-[45deg] blur-[1px]"></div>
                        
                        <span className="relative z-10 text-white font-black text-lg md:text-2xl text-center px-4 leading-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]">
                            {drop.text}
                        </span>
                    </div>
                </button>
            ))}
        </div>

        {/* 吉祥物 */}
        <div className="h-44 w-full relative z-20 shrink-0">
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <img 
                    id="mascot-politoed"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/186.png" 
                    className="w-36 h-36 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-float-slow" 
                    alt="Politoed" 
                />
                <div className="w-24 h-5 bg-black/40 rounded-full blur-lg -mt-3"></div>
            </div>
        </div>

        <style>{`
            @keyframes rain-streak {
                to { transform: translateY(115vh); }
            }
            .animate-rain-streak { animation: rain-streak linear infinite; }
            @keyframes happy-jump {
                0%, 100% { transform: scale(1) translateY(0); }
                30% { transform: scale(1.2, 0.8) translateY(10px); }
                60% { transform: scale(0.9, 1.2) translateY(-50px) rotate(10deg); }
            }
            .animate-happy-jump { animation: happy-jump 0.6s ease-out; }
            @keyframes wrong-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-8px) rotate(-3deg); }
                75% { transform: translateX(8px) rotate(3deg); }
            }
            .animate-wrong-shake { animation: wrong-shake 0.1s ease-in-out infinite; }
            @keyframes float-slow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .animate-float-slow { animation: float-slow 3s ease-in-out infinite; }
        `}</style>
    </div>
  );
};

export default RainDrops;