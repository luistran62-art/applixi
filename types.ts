export enum ContentType {
  MATH_QUESTION = 'MATH_QUESTION',
  MONEY_REWARD = 'MONEY_REWARD'
}

export interface MathQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  points: number;
}

export interface MoneyReward {
  id: string;
  amount: number;
  message: string;
}

export interface EnvelopeContent {
  type: ContentType;
  data: MathQuestion | MoneyReward;
}

export interface Envelope {
  id: number;
  isOpen: boolean;
  content: EnvelopeContent;
  // Visual properties for natural hanging
  x: number; // percentage left
  y: number; // percentage top
  rotation: number; // degrees
  scale: number; // size variation
  delay: number; // animation delay
  decoration: string; // The text or icon on the envelope
  variant: number; // 0-3 for different envelope styles/colors
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export interface GameState {
  playerName: string;
  screen: 'WELCOME' | 'PLAYING' | 'SUMMARY';
  openedCount: number;
  maxOpens: number;
  totalScore: number;
  history: Array<{
    envelopeId: number;
    description: string;
    pointsEarned: number;
  }>;
}