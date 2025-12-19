import React, { useState, useEffect } from 'react';
import { FURNITURE_LIST } from '../constants';
import { ArrowLeft } from 'lucide-react';

const POKE_IMG_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

interface TreeHouseProps {
  unlockedCount: number;
  onBack: () => void;
  collectedPokeIds: number[];
}

const WalkingPokemon: React.FC<{ pokeId: number }> = ({ pokeId }) => {
  const [pos, setPos] = useState({ x: 20 + Math.random() * 60, y: 40 + Math.random() * 40 });
  const [facingLeft, setFacingLeft] = useState(Math.random() > 0.5);

  useEffect(() => {
    const move = () => {
      const nextX = 15 + Math.random() * 70;
      const nextY = 40 + Math.random() * 45;
      
      setFacingLeft(nextX < pos.x);
      
      // 平滑移動時間
      const duration = 3000 + Math.random() * 3000;
      
      setTimeout(() => {
        setPos({ x: nextX, y: nextY });
      }, 500); // 停頓後開始走
    };

    const interval = setInterval(move, 6000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [pos]);

  return (
    <div 
      className="absolute transition-all ease-in-out duration-[4000ms] pointer-events-none z-20"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -100%) ${facingLeft ? 'scaleX(-1)' : 'scaleX(1)'}` }}
    >
      <img 
        src={`${POKE_IMG_BASE}/${pokeId}.png`} 
        alt="Pokemon" 
        className="w-16 h-16 md:w-24 md:h-24 drop-shadow-2xl animate-bob"
      />
      <div className="w-12 h-3 bg-black/10 rounded-full blur-sm mx-auto -mt-2"></div>
    </div>
  );
};

const TreeHouse: React.FC<TreeHouseProps> = ({ unlockedCount, onBack, collectedPokeIds }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-green-100 flex flex-col font-fredoka overflow-hidden">
      {/* 頂部裝飾 */}
      <div className="p-4 flex justify-between items-center z-50">
        <button 
          onClick={onBack}
          className="bg-white/90 p-4 rounded-full shadow-xl hover:bg-yellow-50 transition-all border-b-4 border-slate-300 active:translate-y-1 active:border-b-0"
        >
          <ArrowLeft className="w-8 h-8 text-slate-700" />
        </button>
        <div className="bg-white/95 px-10 py-3 rounded-full shadow-2xl border-4 border-yellow-400">
           <span className="text-2xl md:text-3xl font-black text-amber-700 tracking-wider">🌳 MY POKÉMON ROOM</span>
        </div>
        <div className="w-16"></div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        {/* 樹屋主體 */}
        <div className="relative w-full max-w-5xl aspect-[4/3] max-h-[75vh] bg-[#8B5E3C] rounded-[4rem] border-[14px] border-[#5D4037] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
            
            {/* 木牆紋理 */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(0,0,0,0.2) 40px)' }}></div>
            
            {/* 地板 */}
            <div className="absolute bottom-0 w-full h-[40%] bg-[#6D4C41] border-t-8 border-[#3E2723]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 58px, rgba(0,0,0,0.2) 60px)' }}></div>
            </div>

            {/* 窗戶看風景 */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-56 h-40 md:w-72 md:h-52 bg-sky-200 border-[10px] border-white/90 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
                 <div className="w-full h-full bg-gradient-to-b from-sky-400 to-green-300 relative">
                      <div className="absolute top-4 left-6 text-5xl">☀️</div>
                      <div className="absolute bottom-0 w-full h-8 bg-green-500/40"></div>
                 </div>
                 <div className="absolute inset-0 border-t-8 border-l-8 border-white/20"></div>
            </div>

            {/* 走路中的寶可夢 */}
            {collectedPokeIds.map((id, idx) => (
                <WalkingPokemon key={`${id}-${idx}`} pokeId={id} />
            ))}

            {/* 家具佈置 */}
            <div className="absolute inset-0 pointer-events-none z-10">
                 {FURNITURE_LIST.map((item, index) => {
                     const isUnlocked = index < unlockedCount;
                     if (!isUnlocked) return null;

                     const roomPositions = [
                         { bottom: '35%', left: '8%' },   // Sofa
                         { bottom: '45%', left: '15%' },  // Lamp
                         { bottom: '35%', right: '8%' },  // Bed
                         { bottom: '42%', left: '42%' },  // TV
                         { top: '30%', left: '18%' },     // Shelf
                         { bottom: '32%', right: '40%' }, // Console
                         { top: '45%', right: '12%' },    // Plant
                         { bottom: '50%', left: '6%' },   // Music
                         { top: '22%', left: '72%' },     // Books
                         { top: '15%', left: '12%' },     // Clock
                         { bottom: '35%', right: '22%' }, // Chest
                         { bottom: '55%', right: '5%' },  // Chair
                         { top: '8%', right: '35%' },     // Sunlight
                         { bottom: '45%', left: '28%' },  // Art
                         { top: '48%', left: '18%' },     // Telescope
                     ];

                     const pos = roomPositions[index] || { bottom: '30%', left: '50%' };

                     return (
                         <div 
                             key={item.id} 
                             className="absolute transition-all duration-1000 animate-pop-in drop-shadow-xl"
                             style={{ ...pos }}
                         >
                             <div className="bg-white/15 p-5 rounded-[2.5rem] backdrop-blur-sm border-2 border-white/30">
                                 <div className="scale-150 md:scale-[2]">{item.icon}</div>
                             </div>
                         </div>
                     );
                 })}
            </div>
            
            {unlockedCount === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                    <div className="bg-white/90 px-10 py-5 rounded-[3rem] border-4 border-dashed border-amber-300 animate-pulse">
                        <p className="text-amber-800 font-black text-2xl text-center">
                            Play games to earn <br/> Pokemon & Furniture! 🎁
                        </p>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="p-8 text-center bg-white/50 backdrop-blur-xl border-t-4 border-white">
         <div className="inline-flex items-center gap-4 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-2xl border-b-8 border-green-800 transform -translate-y-4">
           <span className="text-white font-black text-2xl">🏆 COLLECTION: {unlockedCount} / {FURNITURE_LIST.length}</span>
         </div>
      </div>

      <style>{`
        @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
        }
        .animate-bob {
            animation: bob 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TreeHouse;