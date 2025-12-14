import React from 'react';
import { Furniture } from '../types';
import { FURNITURE_LIST } from '../constants';
import { Home, ArrowLeft } from 'lucide-react';

interface TreeHouseProps {
  unlockedCount: number;
  onBack: () => void;
}

const TreeHouse: React.FC<TreeHouseProps> = ({ unlockedCount, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-yellow-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="bg-white/80 px-6 py-2 rounded-full shadow-md">
             <span className="text-2xl font-bold text-green-700">My Treehouse 🌳</span>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="relative bg-[#8B4513] rounded-3xl p-8 border-8 border-[#5D2906] shadow-2xl mx-auto max-w-2xl min-h-[500px]">
          {/* Roof decoration */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[100px] border-b-green-700 z-0"></div>
          
          <div className="grid grid-cols-3 gap-6 relative z-10">
            {FURNITURE_LIST.map((item, index) => {
              const isUnlocked = index < unlockedCount;
              return (
                <div 
                  key={item.id} 
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-500
                    ${isUnlocked 
                      ? 'bg-amber-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border-4 border-amber-300 scale-100' 
                      : 'bg-black/20 border-4 border-dashed border-white/20 opacity-50 grayscale scale-90'
                    }`}
                >
                  {isUnlocked ? (
                    <>
                      <div className="animate-bounce-slow">{item.icon}</div>
                      <span className="text-xs font-bold text-amber-800 mt-2 text-center leading-none">{item.name}</span>
                    </>
                  ) : (
                    <span className="text-4xl">🔒</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-8 text-center">
           <p className="text-green-800 font-bold text-xl bg-white/60 inline-block px-6 py-2 rounded-full">
             Furniture Collected: {unlockedCount} / {FURNITURE_LIST.length}
           </p>
        </div>
      </div>
    </div>
  );
};

export default TreeHouse;