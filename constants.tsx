import { WordItem, Furniture } from './types';
import { 
  Sofa, Lamp, Armchair, Bed, Tv, Cookie, 
  Gamepad, Flower2, Music, BookOpen, Clock, 
  Gift, Sun, Palette, Telescope
} from 'lucide-react';
import React from 'react';

export const WORD_LIST: WordItem[] = [
  // Phrases (Chapter 6)
  { id: '1', en: 'comb my hair', ch: '梳頭髮', ipa: '/kəʊm maɪ heə/', category: 'phrase', emoji: '💇', sentenceClue: 'I ___ every morning before school.' },
  { id: '2', en: 'get dressed', ch: '穿衣服', ipa: '/ɡet drest/', category: 'phrase', emoji: '👕', sentenceClue: 'Hurry up and ___ so we can go!' },
  { id: '3', en: 'do up my buttons', ch: '扣上鈕扣', ipa: '/duː ʌp maɪ ˈbʌtns/', category: 'phrase', emoji: '🧥', sentenceClue: 'Can you help me ___ on my coat?' },
  { id: '4', en: 'tie my shoelaces', ch: '綁鞋帶', ipa: '/taɪ maɪ ˈʃuːleɪsəz/', category: 'phrase', emoji: '👟', sentenceClue: 'Be careful not to trip, please ___.' },
  { id: '5', en: 'pack my school bag', ch: '執拾書包', ipa: '/pæk maɪ skuːl bæɡ/', category: 'phrase', emoji: '🎒', sentenceClue: 'I need to ___ with my books and pencil case.' },
  { id: '6', en: 'carry my school bag', ch: '拿書包', ipa: '/kæri maɪ skuːl bæɡ/', category: 'phrase', emoji: '🏋️', sentenceClue: 'It is heavy when I ___.' },
  { id: '7', en: 'climb the stairs', ch: '上樓梯', ipa: '/klaɪm ðə steəz/', category: 'phrase', emoji: '🧗', sentenceClue: 'The lift is broken, we must ___.' },
  { id: '8', en: 'use a fork', ch: '使用餐叉', ipa: '/juːz ə fɔːk/', category: 'phrase', emoji: '🍴', sentenceClue: 'We ___ to eat pasta.' },
  { id: '9', en: 'use a spoon', ch: '使用匙羹', ipa: '/juːz ə spuːn/', category: 'phrase', emoji: '🥄', sentenceClue: 'You need to ___ to eat soup.' },
  { id: '10', en: 'use chopsticks', ch: '使用筷子', ipa: '/juːz ˈtʃɒp-stɪks/', category: 'phrase', emoji: '🥢', sentenceClue: 'It can be tricky to ___ at first.' },
  { id: '11', en: 'cut food with a knife', ch: '用刀切食物', ipa: '/kʌt fuːd wɪð ə naɪf/', category: 'phrase', emoji: '🔪', sentenceClue: 'Be careful when you ___.' },
  { id: '12', en: 'pour drinks', ch: '倒飲料', ipa: '/pɔː drɪŋks/', category: 'phrase', emoji: '🥤', sentenceClue: 'Please help me ___ for the guests.' },
  
  // Vocabulary
  { id: '13', en: 'amazing', ch: '了不起的', category: 'vocab', emoji: '✨', sentenceClue: 'The magic show was absolutely ___!' },
  { id: '14', en: 'blind', ch: '盲的', category: 'vocab', emoji: '👨‍🦯', sentenceClue: 'A guide dog helps a ___ person walk safely.' },
  { id: '15', en: 'deaf', ch: '聾的', category: 'vocab', emoji: '🧏', sentenceClue: 'He uses sign language because he is ___.' },
  { id: '16', en: 'childhood', ch: '童年', category: 'vocab', emoji: '👶', sentenceClue: 'She had a very happy ___ playing in the park.' },
  { id: '17', en: 'illness', ch: '疾病', category: 'vocab', emoji: '🤒', sentenceClue: 'Rest and medicine will help cure your ___.' },
  { id: '18', en: 'scientist', ch: '科學家', category: 'vocab', emoji: '👩‍🔬', sentenceClue: 'The ___ is doing an experiment in the lab.' },
  { id: '19', en: 'languages', ch: '語言', category: 'vocab', emoji: '🗣️', sentenceClue: 'English and Chinese are important ___.' },
  { id: '20', en: 'university', ch: '大學', category: 'vocab', emoji: '🎓', sentenceClue: 'My sister studies biology at the ___.' },
  { id: '21', en: 'serious', ch: '嚴重的', category: 'vocab', emoji: '😐', sentenceClue: 'This is a ___ problem, we must fix it.' },
  { id: '22', en: 'wheelchair', ch: '輪椅', category: 'vocab', emoji: '🦼', sentenceClue: 'Grandpa uses a ___ to move around easily.' },
  { id: '23', en: 'brain', ch: '腦', category: 'vocab', emoji: '🧠', sentenceClue: 'Your ___ controls your body and thoughts.' },
  { id: '24', en: 'research', ch: '研究', category: 'vocab', emoji: '🔎', sentenceClue: 'They did a lot of ___ to find the cure.' },
  { id: '25', en: 'universe', ch: '宇宙', category: 'vocab', emoji: '🌌', sentenceClue: 'There are billions of stars in the ___.' },
];

export const FURNITURE_LIST: Furniture[] = [
  { id: 'f1', name: 'Cozy Sofa', icon: <Sofa className="w-8 h-8 text-pink-500" /> },
  { id: 'f2', name: 'Reading Lamp', icon: <Lamp className="w-8 h-8 text-yellow-500" /> },
  { id: 'f3', name: 'Soft Bed', icon: <Bed className="w-8 h-8 text-blue-400" /> },
  { id: 'f4', name: 'Big TV', icon: <Tv className="w-8 h-8 text-gray-700" /> },
  { id: 'f5', name: 'Snack Jar', icon: <Cookie className="w-8 h-8 text-amber-600" /> },
  { id: 'f6', name: 'Game Console', icon: <Gamepad className="w-8 h-8 text-purple-500" /> },
  { id: 'f7', name: 'Potted Plant', icon: <Flower2 className="w-8 h-8 text-green-500" /> },
  { id: 'f8', name: 'Music Player', icon: <Music className="w-8 h-8 text-red-500" /> },
  { id: 'f9', name: 'Bookshelf', icon: <BookOpen className="w-8 h-8 text-orange-700" /> },
  { id: 'f10', name: 'Wall Clock', icon: <Clock className="w-8 h-8 text-indigo-600" /> },
  { id: 'f11', name: 'Toy Chest', icon: <Gift className="w-8 h-8 text-pink-600" /> },
  { id: 'f12', name: 'Balcony Chair', icon: <Armchair className="w-8 h-8 text-emerald-600" /> },
  { id: 'f13', name: 'Sunlight Window', icon: <Sun className="w-8 h-8 text-yellow-400" /> },
  { id: 'f14', name: 'Art Station', icon: <Palette className="w-8 h-8 text-rose-500" /> },
  { id: 'f15', name: 'Telescope', icon: <Telescope className="w-8 h-8 text-slate-800" /> },
];
