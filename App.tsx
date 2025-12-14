import React, { useState, useEffect } from 'react';
import { GameState, GameType } from './types';
import { WORD_LIST } from './constants';
import ReviewList from './components/ReviewList';
import TreeHouse from './components/TreeHouse';
import EmojiDetective from './components/games/EmojiDetective';
import MatchingGame from './components/games/MatchingGame';
import SpellingBee from './components/games/SpellingBee';
import FillInBlank from './components/games/FillInBlank';
import BubblePop from './components/games/BubblePop';
import { Trophy, Star, ArrowRight, Home } from 'lucide-react';

// Pokemon Configuration
const POKE_IMG_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

const GAME_CONFIG = {
  [GameType.DETECTIVE]: { 
    id: GameType.DETECTIVE, 
    name: 'Emoji Detective', 
    pokeId: 54, // Psyduck
    color: 'bg-rose-50', 
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    iconColor: 'bg-rose-200'
  },
  [GameType.MATCHING]: { 
    id: GameType.MATCHING, 
    name: 'Word Match', 
    pokeId: 133, // Eevee
    color: 'bg-purple-50', 
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    iconColor: 'bg-purple-200'
  },
  [GameType.SPELLING]: { 
    id: GameType.SPELLING, 
    name: 'Spelling Bee', 
    pokeId: 15, // Beedrill
    color: 'bg-yellow-50', 
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-600',
    iconColor: 'bg-yellow-200'
  },
  [GameType.FILL_BLANK]: { 
    id: GameType.FILL_BLANK, 
    name: 'Fill in Blank', 
    pokeId: 143, // Snorlax
    color: 'bg-green-50', 
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    iconColor: 'bg-green-200'
  },
  [GameType.BUBBLE]: { 
    id: GameType.BUBBLE, 
    name: 'Bubble Pop', 
    pokeId: 7, // Squirtle
    color: 'bg-cyan-50', 
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-600',
    iconColor: 'bg-cyan-200'
  },
};

const App: React.FC = () => {
  const [view, setView] = useState<GameState>('menu');
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [completedGames, setCompletedGames] = useState<GameType[]>([]);
  const [unlockedFurniture, setUnlockedFurniture] = useState(0);

  const handleGameComplete = () => {
    if (currentGame && !completedGames.includes(currentGame)) {
      setCompletedGames([...completedGames, currentGame]);
      setUnlockedFurniture(prev => prev + 2); // Reward
      setView('reward');
    } else {
        setView('menu');
    }
  };

  const startGame = (type: GameType) => {
    setCurrentGame(type);
    setView('playing');
  };

  const renderGame = () => {
    switch (currentGame) {
      case GameType.DETECTIVE:
        return <EmojiDetective words={WORD_LIST} onComplete={handleGameComplete} />;
      case GameType.MATCHING:
        return <MatchingGame words={WORD_LIST} onComplete={handleGameComplete} />;
      case GameType.SPELLING:
        return <SpellingBee words={WORD_LIST} onComplete={handleGameComplete} />;
      case GameType.FILL_BLANK:
        return <FillInBlank words={WORD_LIST} onComplete={handleGameComplete} />;
      case GameType.BUBBLE:
        return <BubblePop words={WORD_LIST} onComplete={handleGameComplete} />;
      default:
        return <div>Unknown Game</div>;
    }
  };

  if (view === 'review') {
    return (
        <div className="min-h-screen bg-[#f0f9ff]">
            <ReviewList words={WORD_LIST} onBack={() => setView('menu')} />
        </div>
    );
  }

  if (view === 'treehouse' || view === 'reward') {
    return (
      <div className="relative">
        <TreeHouse unlockedCount={unlockedFurniture} onBack={() => setView('menu')} />
        {view === 'reward' && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                 <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 animate-pop-in relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-4 bg-yellow-400"></div>
                     <img src={`${POKE_IMG_BASE}/25.png`} alt="Pikachu" className="w-24 h-24 mx-auto -mt-4 mb-2" />
                     <h2 className="text-3xl font-bold text-orange-500 mb-2">Awesome!</h2>
                     <p className="text-gray-600 mb-6">You unlocked 2 new items!</p>
                     <button 
                       onClick={() => setView('treehouse')} 
                       className="bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all"
                     >
                        Open Gifts
                     </button>
                 </div>
             </div>
        )}
      </div>
    );
  }

  if (view === 'playing') {
    const config = currentGame ? GAME_CONFIG[currentGame] : null;
    
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-hidden">
        {/* Game Header */}
        <div className="px-4 py-2 flex justify-between items-center bg-white shadow-sm z-10 shrink-0 border-b-4 border-slate-100">
          <button 
            onClick={() => setView('menu')} 
            className="flex items-center gap-2 text-slate-500 font-bold hover:bg-slate-100 px-3 py-1 rounded-full transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
          
          <div className="flex items-center gap-3">
             {config && (
                 <img 
                    src={`${POKE_IMG_BASE}/${config.pokeId}.png`} 
                    alt="Pokemon" 
                    className="w-12 h-12 -my-2 drop-shadow-md"
                 />
             )}
             <div className={`font-black text-xl md:text-2xl capitalize tracking-tight ${config?.textColor || 'text-blue-500'}`}>
                {config?.name || 'Game'}
             </div>
          </div>
          
          <div className="w-16"></div> {/* Spacer for balance */}
        </div>

        {/* Game Container */}
        <div className="flex-1 relative w-full h-full bg-slate-100 flex flex-col">
            {renderGame()}
        </div>
      </div>
    );
  }

  // Menu View
  return (
    <div className="min-h-screen bg-[#f0f9ff] pb-20 font-fredoka">
      
      {/* Top Navigation */}
      <div className="p-4 flex justify-end">
        <button 
          onClick={() => setView('treehouse')}
          className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold shadow-sm border-2 border-amber-200 hover:bg-amber-200 transition-colors"
        >
          <Trophy className="w-5 h-5" />
          <span>Treehouse</span>
        </button>
      </div>

      {/* Hero Section (Cover) */}
      <div className="flex flex-col items-center mb-8 px-4">
        <div className="relative z-10">
            <img 
                src={`${POKE_IMG_BASE}/25.png`} 
                alt="Pikachu" 
                className="w-48 h-48 md:w-60 md:h-60 object-contain drop-shadow-2xl animate-float-slow"
            />
            {/* Speech Bubble */}
            <div className="absolute -top-4 -right-8 md:-right-24 bg-white px-6 py-4 rounded-3xl rounded-bl-none shadow-xl border-4 border-yellow-400 max-w-[200px] animate-pop-in origin-bottom-left">
                <p className="font-bold text-gray-700 text-lg leading-tight">
                    一起學 <br/>
                    <span className="text-blue-500">g4 ch.6 vocab!</span>
                </p>
            </div>
        </div>
        
        {/* Title decorative background */}
        <div className="w-full h-8 bg-yellow-200/50 absolute top-40 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-4">
        
        {/* Review Button - Bulbasaur */}
        <button 
            onClick={() => setView('review')}
            className="w-full bg-white p-4 rounded-3xl shadow-lg border-b-8 border-emerald-100 flex items-center gap-4 hover:bg-emerald-50 transition-all active:scale-95 group relative overflow-hidden"
        >
            <div className="bg-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center shrink-0">
                <img src={`${POKE_IMG_BASE}/1.png`} className="w-16 h-16 group-hover:scale-110 transition-transform drop-shadow-md" alt="Bulbasaur"/>
            </div>
            <div className="text-left flex-1 z-10">
                <h3 className="text-xl font-black text-emerald-600">Word Review</h3>
                <p className="text-emerald-400 font-bold text-sm">Start here!</p>
            </div>
            <ArrowRight className="text-emerald-300" />
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/50 to-transparent"></div>
        </button>

        <div className="flex items-center justify-center my-6 gap-2">
            <div className="h-1 w-12 bg-blue-100 rounded-full"></div>
            <span className="text-blue-300 font-bold uppercase tracking-widest text-xs">Play Games</span>
            <div className="h-1 w-12 bg-blue-100 rounded-full"></div>
        </div>

        {/* Game Buttons */}
        {Object.values(GAME_CONFIG).map((game) => {
            const isDone = completedGames.includes(game.id as GameType);
            return (
                <button 
                    key={game.id}
                    onClick={() => startGame(game.id as GameType)}
                    className={`
                        w-full p-3 rounded-3xl shadow-md border-b-8 flex items-center gap-4 transition-transform active:scale-95 active:border-b-0 translate-y-0
                        ${game.color} ${game.borderColor}
                        bg-white
                    `}
                >
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${game.iconColor}`}>
                        <img 
                            src={`${POKE_IMG_BASE}/${game.pokeId}.png`} 
                            className="w-18 h-18 object-contain drop-shadow-sm transform hover:scale-110 transition-transform duration-300" 
                            alt={game.name}
                        />
                    </div>
                    
                    <div className="text-left flex-1">
                        <h3 className={`text-xl font-black ${game.textColor}`}>{game.name}</h3>
                        <div className="flex gap-1 mt-1 opacity-60">
                             <Star className={`w-4 h-4 ${game.textColor} fill-current`} />
                             <Star className={`w-4 h-4 ${game.textColor} fill-current`} />
                             <Star className={`w-4 h-4 ${game.textColor} fill-current`} />
                        </div>
                    </div>

                    {isDone ? (
                        <div className="bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                            <Trophy className="w-5 h-5" />
                        </div>
                    ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${game.iconColor} opacity-50`}>
                            <ArrowRight className={`w-5 h-5 ${game.textColor}`} />
                        </div>
                    )}
                </button>
            )
        })}
      </div>
      
      <style>{`
        @keyframes floatSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
            animation: floatSlow 3s ease-in-out infinite;
        }
        @keyframes popIn {
            0% { transform: scale(0) rotate(-10deg); opacity: 0; }
            80% { transform: scale(1.1) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-pop-in {
            animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .font-fredoka {
            font-family: 'Fredoka', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default App;