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
import WordSearch from './components/games/WordSearch';
import HiddenTreasure from './components/games/HiddenTreasure';
import CrosswordGame from './components/games/CrosswordGame';
import WordJigsaw from './components/games/WordJigsaw';
import RainDrops from './components/games/RainDrops';
import { Trophy, Star, ArrowRight, Home } from 'lucide-react';

// Pokemon Configuration
export const POKE_IMG_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export const GAME_CONFIG = {
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
  [GameType.WORD_SEARCH]: { 
    id: GameType.WORD_SEARCH, 
    name: 'Word Search', 
    pokeId: 201, // Unown
    color: 'bg-indigo-50', 
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-600',
    iconColor: 'bg-indigo-200'
  },
  [GameType.HIDDEN_TREASURE]: { 
    id: GameType.HIDDEN_TREASURE, 
    name: 'Hidden Treasure', 
    pokeId: 63, // Abra
    color: 'bg-amber-50', 
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    iconColor: 'bg-amber-200'
  },
  [GameType.CROSSWORD]: { 
    id: GameType.CROSSWORD, 
    name: 'Crossword Puzzle', 
    pokeId: 235, // Smeargle
    color: 'bg-lime-50', 
    borderColor: 'border-lime-200',
    textColor: 'text-lime-600',
    iconColor: 'bg-lime-200'
  },
  [GameType.JIGSAW]: { 
    id: GameType.JIGSAW, 
    name: 'Word Builder', 
    pokeId: 137, // Porygon
    color: 'bg-orange-50', 
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
    iconColor: 'bg-orange-200'
  },
  [GameType.RAIN_DROPS]: { 
    id: GameType.RAIN_DROPS, 
    name: 'Rain Drops', 
    pokeId: 186, // Politoed
    color: 'bg-blue-50', 
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    iconColor: 'bg-blue-200'
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
      setUnlockedFurniture(prev => Math.min(prev + 2, 15)); 
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
      case GameType.WORD_SEARCH:
        return <WordSearch words={WORD_LIST} onComplete={handleGameComplete} />;
      case GameType.HIDDEN_TREASURE:
        return <HiddenTreasure words={WORD_LIST} onComplete={handleGameComplete} />;
      case GameType.CROSSWORD:
        return <CrosswordGame words={WORD_LIST} onComplete={handleGameComplete} />;
      case GameType.JIGSAW:
        return <WordJigsaw words={WORD_LIST} onComplete={handleGameComplete} />;
      case GameType.RAIN_DROPS:
        return <RainDrops words={WORD_LIST} onComplete={handleGameComplete} />;
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
    // 獲取當前已收集寶可夢的 ID
    const collectedPokeIds = completedGames.map(type => GAME_CONFIG[type].pokeId);

    return (
      <div className="relative overflow-hidden">
        <TreeHouse 
          unlockedCount={unlockedFurniture} 
          onBack={() => setView('menu')} 
          collectedPokeIds={collectedPokeIds}
        />
        {view === 'reward' && (
             <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                 <div className="bg-white p-8 rounded-[3rem] shadow-2xl text-center max-w-sm w-full animate-pop-in relative overflow-hidden border-8 border-yellow-200">
                     <div className="absolute top-0 left-0 w-full h-4 bg-yellow-400"></div>
                     <img src={`${POKE_IMG_BASE}/25.png`} alt="Pikachu" className="w-24 h-24 mx-auto -mt-4 mb-2 drop-shadow-lg" />
                     <h2 className="text-4xl font-black text-orange-500 mb-2">Wonderful!</h2>
                     <p className="text-gray-600 font-bold mb-6 text-lg">You unlocked new items and a Pokemon friend!</p>
                     <button 
                       onClick={() => setView('treehouse')} 
                       className="w-full bg-blue-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all text-xl"
                     >
                        Enter Treehouse 🌳
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
      <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-hidden font-fredoka">
        {/* Game Header */}
        <div className="px-4 py-2 flex justify-between items-center bg-white shadow-sm z-10 shrink-0 border-b-4 border-slate-100">
          <button 
            onClick={() => setView('menu')} 
            className="flex items-center gap-2 text-slate-500 font-bold hover:bg-slate-100 px-4 py-2 rounded-full transition-colors border-2 border-transparent hover:border-slate-200"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Menu</span>
          </button>
          
          <div className="flex items-center gap-3">
             {config && (
                 <img 
                    src={`${POKE_IMG_BASE}/${config.pokeId}.png`} 
                    alt="Pokemon" 
                    className="w-14 h-14 -my-3 drop-shadow-md animate-float-slow"
                 />
             )}
             <div className={`font-black text-xl md:text-3xl capitalize tracking-tight ${config?.textColor || 'text-blue-500'}`}>
                {config?.name || 'Game'}
             </div>
          </div>
          
          <div className="w-20"></div>
        </div>

        <div className="flex-1 relative w-full h-full bg-slate-100 flex flex-col">
            {renderGame()}
        </div>
      </div>
    );
  }

  // Menu View
  return (
    <div className="min-h-screen bg-[#f0f9ff] pb-20 font-fredoka selection:bg-yellow-200">
      <div className="p-4 flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border-2 border-blue-100">
           <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
           <span className="font-bold text-blue-600">{completedGames.length} / 10 Games</span>
        </div>
        <button 
          onClick={() => setView('treehouse')}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-3 rounded-full font-black shadow-lg transform hover:scale-105 active:scale-95 transition-all border-b-4 border-orange-600"
        >
          <Trophy className="w-6 h-6" />
          <span>My Treehouse</span>
        </button>
      </div>

      <div className="flex flex-col items-center mb-12 px-4">
        <div className="relative z-10">
            <img 
                src={`${POKE_IMG_BASE}/25.png`} 
                alt="Pikachu" 
                className="w-52 h-52 md:w-64 md:h-64 object-contain drop-shadow-2xl animate-float-slow"
            />
            <div className="absolute -top-4 -right-12 md:-right-28 bg-white px-8 py-5 rounded-[2.5rem] rounded-bl-none shadow-2xl border-4 border-yellow-400 max-w-[240px] animate-pop-in origin-bottom-left">
                <p className="font-black text-gray-700 text-xl md:text-2xl leading-tight text-center">
                    Let's learn <br/>
                    <span className="text-blue-500 underline decoration-yellow-400 decoration-4">Ch.6 vocab!</span>
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        <div className="mb-8">
            <button 
                onClick={() => setView('review')}
                className="w-full bg-white p-5 rounded-[2rem] shadow-xl border-b-8 border-emerald-100 flex items-center gap-5 hover:bg-emerald-50 transition-all active:scale-95 group relative overflow-hidden"
            >
                <div className="bg-emerald-100 w-24 h-24 rounded-[1.5rem] flex items-center justify-center shrink-0">
                    <img src={`${POKE_IMG_BASE}/1.png`} className="w-20 h-20 group-hover:scale-110 transition-transform drop-shadow-md" alt="Bulbasaur"/>
                </div>
                <div className="text-left flex-1 z-10">
                    <h3 className="text-2xl font-black text-emerald-600">Review List</h3>
                    <p className="text-emerald-400 font-bold text-base">Study 25 Words First!</p>
                </div>
                <ArrowRight className="text-emerald-300 w-8 h-8" />
            </button>
        </div>

        <div className="flex items-center justify-center my-8 gap-3">
            <div className="h-1.5 w-16 bg-blue-100 rounded-full"></div>
            <span className="text-blue-300 font-black uppercase tracking-[0.2em] text-sm">Game Library</span>
            <div className="h-1.5 w-16 bg-blue-100 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 gap-5">
            {Object.values(GAME_CONFIG).map((game) => {
                const isDone = completedGames.includes(game.id as GameType);
                return (
                    <button 
                        key={game.id}
                        onClick={() => startGame(game.id as GameType)}
                        className={`
                            relative w-full p-4 rounded-[2rem] shadow-xl border-b-8 flex flex-col items-center gap-3 transition-all active:scale-95 active:border-b-0 translate-y-0 text-center
                            ${game.color} ${game.borderColor}
                            bg-white h-full group
                        `}
                    >
                        <div className={`w-20 h-20 rounded-[1.2rem] flex items-center justify-center shrink-0 ${game.iconColor}`}>
                            <img 
                                src={`${POKE_IMG_BASE}/${game.pokeId}.png`} 
                                className="w-16 h-16 object-contain drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300" 
                                alt={game.name}
                            />
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center">
                            <h3 className={`text-base font-black ${game.textColor} leading-tight`}>{game.name}</h3>
                            <div className="flex gap-0.5 mt-1.5 opacity-60">
                                <Star className={`w-3.5 h-3.5 ${game.textColor} fill-current`} />
                                <Star className={`w-3.5 h-3.5 ${game.textColor} fill-current`} />
                            </div>
                        </div>

                        {isDone && (
                            <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                                <Trophy className="w-4 h-4 fill-white" />
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default App;