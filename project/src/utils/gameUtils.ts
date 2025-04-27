import { BudgetCategory, GameState, PlayerScore } from '../types';

export function calculateScore(state: GameState): number {
  const { currentBudget, doomMeter, morale, categories } = state;
  
  // Calculate how many categories met their minimum requirements
  const categoriesMet = categories.filter(c => c.allocation >= c.minRequired).length;
  const categoryRatio = categoriesMet / categories.length;
  
  // Calculate budget efficiency (how much of the initial budget is left)
  const budgetEfficiency = currentBudget / state.totalBudget;
  
  // Calculate the final score
  const score = Math.round(
    (categoryRatio * 40) + // 40% of score is based on meeting category requirements
    (budgetEfficiency * 30) + // 30% of score is based on budget efficiency
    ((100 - doomMeter) / 100 * 15) + // 15% of score is based on keeping doom meter low
    (morale / 100 * 15) // 15% of score is based on maintaining morale
  );
  
  return Math.max(0, Math.min(100, score));
}

export function getPerformanceNickname(score: number): string {
  if (score >= 90) return 'Budget Wizard';
  if (score >= 80) return 'Financial Mastermind';
  if (score >= 70) return 'Competent Administrator';
  if (score >= 60) return 'Adequate Manager';
  if (score >= 50) return 'Struggling Principal';
  if (score >= 40) return 'Budget Juggler';
  if (score >= 30) return 'Fiscal Disaster';
  if (score >= 20) return 'Bankruptcy Bound';
  if (score >= 10) return 'School Boards Nightmare';
  return 'Complete Financial Catastrophe';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getMonthName(monthNumber: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months[monthNumber - 1];
}

export function getCategoryStatus(category: BudgetCategory): 'underfunded' | 'adequate' | 'overfunded' {
  const ratio = category.allocation / category.minRequired;
  
  if (ratio < 1) return 'underfunded';
  if (ratio < 1.5) return 'adequate';
  return 'overfunded';
}

export function saveScore(state: GameState, playerName: string): PlayerScore {
  const score = calculateScore(state);
  const nickname = getPerformanceNickname(score);
  
  const playerScore: PlayerScore = {
    id: `score_${Date.now()}`,
    playerName,
    schoolName: 'School Name', // This would come from actual school data
    schoolType: 'elementary', // This would come from actual school data
    finalBudget: state.currentBudget,
    doomMeter: state.doomMeter,
    morale: state.morale,
    schoolYear: state.schoolYear,
    nickname,
    date: new Date().toISOString()
  };
  
  // In a real app, this would save to localStorage or a database
  const existingScores = localStorage.getItem('budgetQuestScores');
  const scores = existingScores ? JSON.parse(existingScores) : [];
  scores.push(playerScore);
  localStorage.setItem('budgetQuestScores', JSON.stringify(scores));
  
  return playerScore;
}

export function getLeaderboard(): PlayerScore[] {
  const existingScores = localStorage.getItem('budgetQuestScores');
  return existingScores ? JSON.parse(existingScores) : [];
}