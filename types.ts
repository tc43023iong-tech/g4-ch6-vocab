import React from 'react';

export interface WordItem {
  id: string;
  en: string;
  ch: string;
  ipa?: string;
  emoji?: string;
  category: 'phrase' | 'vocab';
  sentenceClue?: string; // For Fill in the Blank
}

export enum GameType {
  DETECTIVE = 'detective',
  MATCHING = 'matching',
  SPELLING = 'spelling',
  FILL_BLANK = 'fill_blank',
  BUBBLE = 'bubble',
  WORD_SEARCH = 'word_search',
  HIDDEN_TREASURE = 'hidden_treasure',
  CROSSWORD = 'crossword',
  JIGSAW = 'jigsaw',
  RAIN_DROPS = 'rain_drops',
}

export interface Furniture {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export type GameState = 'intro' | 'review' | 'menu' | 'playing' | 'reward';