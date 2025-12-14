import React from 'react';
import { WordItem } from '../types';
import { Volume2, ArrowLeft } from 'lucide-react';

interface ReviewListProps {
  words: WordItem[];
  onBack: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ words, onBack }) => {
  const phrases = words.filter(w => w.category === 'phrase');
  const vocab = words.filter(w => w.category === 'vocab');

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const WordCard: React.FC<{ item: WordItem }> = ({ item }) => (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:scale-105 transition-transform duration-200 border-2 border-transparent hover:border-yellow-400 cursor-pointer"
         onClick={() => speak(item.en)}>
      <div className="text-4xl mb-2">{item.emoji}</div>
      <div className="font-bold text-lg text-blue-600 text-center leading-tight">{item.en}</div>
      {item.ipa && <div className="text-gray-400 text-xs mt-1 font-mono">{item.ipa}</div>}
      <div className="text-gray-600 font-medium mt-1">{item.ch}</div>
      <Volume2 className="w-4 h-4 text-green-400 mt-2" />
    </div>
  );

  return (
    <div className="p-4 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#f0f9ff]/90 backdrop-blur-sm p-4 z-10 rounded-xl">
        <button onClick={onBack} className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <ArrowLeft className="text-gray-600" />
        </button>
        <h2 className="text-3xl font-bold text-center text-teal-600">
          📚 Vocabulary Review
        </h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-orange-500 mb-4 bg-orange-100 inline-block px-4 py-1 rounded-full border-2 border-orange-300">
          Phrases: When I was little
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {phrases.map(item => <WordCard key={item.id} item={item} />)}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-purple-500 mb-4 bg-purple-100 inline-block px-4 py-1 rounded-full border-2 border-purple-300">
          Vocabulary Words
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {vocab.map(item => <WordCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;