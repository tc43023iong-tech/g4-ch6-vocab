import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { Volume2, RefreshCw } from 'lucide-react';

interface Props {
  words: WordItem[];
  onComplete: () => void;
}

const EchoValley: React.FC<Props> = ({ words, onComplete }) => {
  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<WordItem[]>([]);
  const [userSequence, setUserSequence] = useState<WordItem[]>([]);
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'result'>('memorize');
  const [options, setOptions] = useState<WordItem[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Total 5 rounds
  const TOTAL_ROUNDS = 5;

  useEffect(() => {
    startRound();
  }, [round]);

  const startRound = () => {
    setPhase('memorize');
    setUserSequence([]);
    setFeedback(null);
    
    // Difficulty increases: start with 2, max 4
    const sequenceLength = Math.min(2 + Math.floor(round / 2), 4);
    
    const newSequence = [];
    for(let i=0; i<sequenceLength; i++) {
        newSequence.push(words[Math.floor(Math.random() * words.length)]);
    }
    setSequence(newSequence);
    
    // Options are the sequence shuffled + maybe 1 distractor if we want hard mode, 
    // but for 4th grade, just shuffling the sequence items is enough challenge for ordering.
    // Let's add 1 distractor to make it tricky.
    const distractor = words.filter(w => !newSequence.includes(w))[0];
    const opts = [...newSequence, distractor].sort(() => 0.5 - Math.random());
    setOptions(opts);

    // Auto switch to recall after 3-5 seconds based on length
    setTimeout(() => {
        setPhase('recall');
    }, 2000 + (sequenceLength * 1000));
  };

  const handleOptionClick = (item: WordItem) => {
    if (phase !== 'recall') return;

    const newStep = [...userSequence, item];
    setUserSequence(newStep);

    // Speak
    const utterance = new SpeechSynthesisUtterance(item.en);
    window.speechSynthesis.speak(utterance);

    // Check validity immediately? Or wait? 
    // Immediate check is better for instant feedback
    const currentIndex = newStep.length - 1;
    if (item.id !== sequence[currentIndex].id) {
        // Wrong step
        setFeedback('wrong');
        setPhase('result');
        setTimeout(() => {
            // Retry same round
            startRound(); 
        }, 1500);
    } else {
        // Correct step
        if (newStep.length === sequence.length) {
            setFeedback('correct');
            setPhase('result');
            setTimeout(() => {
                if (round < TOTAL_ROUNDS - 1) {
                    setRound(r => r + 1);
                } else {
                    onComplete();
                }
            }, 1500);
        }
    }
  };

  const progress = (round / TOTAL_ROUNDS) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center max-w-4xl mx-auto p-4">
       {/* Progress */}
       <div className="w-full bg-gray-200 rounded-full h-4 mb-6 max-w-2xl">
         <div className="bg-teal-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
       </div>

       <div className="flex-1 w-full flex flex-col items-center justify-center">
            
            {phase === 'memorize' && (
                <div className="animate-float text-center">
                    <h2 className="text-2xl font-bold text-teal-600 mb-8">Remember the Order!</h2>
                    <div className="flex gap-4 md:gap-8 justify-center">
                        {sequence.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center animate-pop-in" style={{animationDelay: `${idx * 0.3}s`}}>
                                <div className="text-6xl md:text-8xl bg-white p-4 rounded-3xl shadow-lg border-b-8 border-teal-100 mb-2">
                                    {item.emoji}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(phase === 'recall' || phase === 'result') && (
                <div className="w-full max-w-3xl flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Tap in order!</h2>
                    
                    {/* Empty Slots to fill */}
                    <div className="flex gap-4 mb-12 h-24 items-center justify-center">
                        {sequence.map((_, idx) => {
                            const filled = userSequence[idx];
                            return (
                                <div key={idx} className={`
                                    w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-dashed flex items-center justify-center text-4xl
                                    ${filled ? 'border-solid border-teal-400 bg-white shadow-md' : 'border-gray-300 bg-gray-50'}
                                    ${feedback === 'wrong' && idx === userSequence.length-1 ? 'border-red-500 bg-red-50' : ''}
                                    ${feedback === 'correct' ? 'border-green-500 bg-green-50' : ''}
                                `}>
                                    {filled ? filled.emoji : <span className="text-gray-300 text-xl font-bold">{idx+1}</span>}
                                </div>
                            )
                        })}
                    </div>

                    {/* Options */}
                    {phase === 'recall' && (
                        <div className="flex flex-wrap justify-center gap-4">
                            {options.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleOptionClick(opt)}
                                    className="px-6 py-4 bg-white rounded-xl shadow-lg border-b-4 border-teal-200 text-lg font-bold text-teal-800 hover:bg-teal-50 hover:scale-105 transition-all active:scale-95"
                                >
                                    {opt.en}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {phase === 'result' && (
                        <div className={`text-3xl font-black ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'} animate-bounce`}>
                            {feedback === 'correct' ? 'Great Memory!' : 'Oops! Try Again'}
                        </div>
                    )}
                </div>
            )}
       </div>
    </div>
  );
};

export default EchoValley;