import { LeaderboardEntry } from '../types';

const STORAGE_KEY = 'LIXI_LEADERBOARD_V1';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading leaderboard", e);
    return [];
  }
};

export const saveScore = (name: string, score: number) => {
  try {
    const current = getLeaderboard();
    const newEntry: LeaderboardEntry = {
      name,
      score,
      date: new Date().toLocaleDateString('vi-VN')
    };
    
    // Add new score, sort descending by score, take top 10
    const updated = [...current, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
      
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Error saving score", e);
    return [];
  }
};