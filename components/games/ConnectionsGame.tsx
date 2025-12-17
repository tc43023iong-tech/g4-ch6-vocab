import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const ConnectionsGame: React.FC<Props> = ({ words, onComplete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<string[]>([]); // Array of group names
  const [mistakes, setMistakes] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<WordItem[]>([]);
  
  // Define Groups manually based on IDs in constants.tsx
  const GROUPS = [
    { name: "Table Utensils", ids: ['8', '9', '10', '11'], color: 'bg-yellow-200 border-yellow-400' },
    { name: "Daily Routine", ids: ['1', '2', '3', '4'], color: 'bg-green-200 border-green-400' },
    { name: "Health & Senses", ids: ['14', '15', '17', '23'], color: 'bg-pink-200 border-pink-400' },
    { name: "Science & Uni", ids: ['18', '20', '24', '25'], color: 'bg-blue-200 border-blue-400' }
  ];

  useEffect(() => {
    // Flatten and shuffle
    const allIds = GROUPS.flatMap(g => g.ids);
    const gameWords = words.filter(w => allIds.includes(w.id));
    setShuffledItems(gameWords.sort(() => 0.5 - Math.random()));
  }, []);

  const handleItemClick = (id: string) => {
    if (selectedIds.includes(id)) {
        setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
        if (selectedIds.length < 4) {
            setSelectedIds(prev => [...prev, id]);
        }
    }
  };

  const handleSubmit = () => {
      if (selectedIds.length !== 4) return;

      // Check if selected IDs match any group
      const match = GROUPS.find(g => {
          // Are all selected IDs in this group?
          return selectedIds.every(id => g.ids.includes(id));
      });

      if (match) {
          // Success
          setSolvedGroups(prev => [...prev, match.name]);
          setSelectedIds([]);
          
          if (solvedGroups.length + 1 === GROUPS.length) {
              setTimeout(onComplete, 2000);
          }
      } else {
          // Check "One away"
          // Logic: if 3 items belong to group A
          let oneAway = false;
          GROUPS.forEach(g => {
             const count = selectedIds.filter(id => g.ids.includes(id)).length;
             if (count === 3) oneAway = true;
          });

          setMistakes(prev => prev + 1);
          
          const grid = document.getElementById('grid-container');
          grid?.classList.add('animate-shake');
          setTimeout(() => grid?.classList.remove('animate-shake'), 500);

          if (oneAway) {
              // Optional toast: "One away!"
          }
      }
  };

  const handleDeselectAll = () => setSelectedIds([]);

  return (
    <div className="w-full h-full flex flex-col items-center max-w-4xl mx-auto p-4">
        <h2 className="text-3xl font-bold text-gray-700 mb-2">Word Links</h2>
        <p className="text-gray-500 mb-6">Group 4 related words!</p>

        {/* Grid */}
        <div id="grid-container" className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            
            {/* Render Solved Groups First (Full Width) */}
            {GROUPS.filter(g => solvedGroups.includes(g.name)).map(g => (
                <div key={g.name} className={`col-span-2 md:col-span-4 p-4 rounded-xl ${g.color} flex flex-col items-center justify-center shadow-md animate-pop-in`}>
                    <h3 className="font-black text-lg uppercase tracking-wider mb-1">{g.name}</h3>
                    <div className="text-sm opacity-80">
                        {words.filter(w => g.ids.includes(w.id)).map(w => w.en).join(', ')}
                    </div>
                </div>
            ))}

            {/* Render Remaining Items */}
            {shuffledItems
                .filter(item => {
                    // Only show if NOT part of a solved group
                    const groupName = GROUPS.find(g => g.ids.includes(item.id))?.name;
                    return !solvedGroups.includes(groupName || '');
                })
                .map(item => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={`
                                h-24 rounded-xl font-bold text-sm md:text-base flex flex-col items-center justify-center p-2 transition-all shadow-sm border-b-4
                                ${isSelected 
                                    ? 'bg-gray-600 text-white border-gray-800 scale-95' 
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }
                            `}
                        >
                            <span className="text-2xl mb-1">{item.emoji}</span>
                            <span className="leading-tight">{item.en}</span>
                        </button>
                    )
                })
            }
        </div>

        {/* Controls */}
        <div className="flex gap-4 items-center">
            <div className="text-gray-500 font-bold">Mistakes: {mistakes}</div>
            <button 
                onClick={handleDeselectAll}
                className="px-6 py-2 rounded-full border-2 border-gray-300 font-bold text-gray-500 hover:bg-gray-100"
            >
                Deselect
            </button>
            <button 
                onClick={handleSubmit}
                disabled={selectedIds.length !== 4}
                className={`
                    px-8 py-2 rounded-full font-bold text-white transition-all
                    ${selectedIds.length === 4 
                        ? 'bg-black hover:bg-gray-800 shadow-lg cursor-pointer' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }
                `}
            >
                Submit
            </button>
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

export default ConnectionsGame;