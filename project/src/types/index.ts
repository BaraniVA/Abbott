export type SchoolType = 'elementary' | 'middle' | 'high';

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  description: string;
  initialBudget: number;
  difficulty: 'easy' | 'medium' | 'hard';
  pros: string[];
  cons: string[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocation: number;
  minRequired: number;
  description: string;
  icon: string;
}

export interface TeacherRequest {
  id: string;
  teacherName: string;
  category: string;
  amount: number;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  deadline: number;
}

export interface CrisisEvent {
  id: string;
  title: string;
  description: string;
  options: CrisisOption[];
  deadline: number;
  severity: 'minor' | 'major' | 'catastrophic';
}

export interface CrisisOption {
  id: string;
  text: string;
  budgetEffect: {
    category: string;
    amount: number;
  }[];
  moraleEffect: number;
  doomEffect: number;
}

export interface GameState {
  schoolId: string | null;
  currentBudget: number;
  totalBudget: number;
  categories: BudgetCategory[];
  teacherRequests: TeacherRequest[];
  crisisEvents: CrisisEvent[];
  currentMonth: number;
  schoolYear: number;
  doomMeter: number;
  morale: number;
  gameOver: boolean;
  gameWon: boolean;
}

export interface PlayerScore {
  id: string;
  playerName: string;
  schoolName: string;
  schoolType: SchoolType;
  finalBudget: number;
  doomMeter: number;
  morale: number;
  schoolYear: number;
  nickname: string;
  date: string;
}