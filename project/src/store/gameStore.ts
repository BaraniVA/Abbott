import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, BudgetCategory, TeacherRequest, CrisisEvent } from '../types';
import { generateTeacherRequest as generateTeacherRequestUtil } from '../data/teacherRequests';
import { getRandomCrisisEvents } from '../data/crisisEvents';
import { schools } from '../data/schools';

interface GameStore extends GameState {
  setSchool: (schoolId: string) => void;
  allocateBudget: (categoryId: string, amount: number) => void;
  handleTeacherRequest: (requestId: string, approved: boolean) => void;
  handleCrisisEvent: (eventId: string, optionId: string) => void;
  advanceMonth: () => void;
  resetGame: () => void;
  generateTeacherRequest: () => void;
  generateCrisisEvent: () => void;
}

const initialState: GameState = {
  schoolId: null,
  currentBudget: 0,
  totalBudget: 0,
  categories: [],
  teacherRequests: [],
  crisisEvents: [],
  currentMonth: 8, // Start in August
  schoolYear: 1,
  doomMeter: 0,
  morale: 100,
  gameOver: false,
  gameWon: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSchool: (schoolId: string) => {
        // Find the selected school
        const selectedSchool = schools.find(s => s.id === schoolId);
        
        if (!selectedSchool) {
          console.error('School not found:', schoolId);
          return;
        }

        const initialBudget = selectedSchool.initialBudget;
        const difficulty = selectedSchool.difficulty;

        const categories: BudgetCategory[] = [
          {
            id: 'supplies',
            name: 'Supplies',
            allocation: 0,
            minRequired: difficulty === 'hard' ? 15000 : 10000,
            description: 'Basic classroom supplies and materials',
            icon: 'Pencil',
          },
          {
            id: 'salaries',
            name: 'Salaries',
            allocation: 0,
            minRequired: difficulty === 'hard' ? 70000 : difficulty === 'medium' ? 60000 : 50000,
            description: 'Teacher and staff salaries',
            icon: 'Users',
          },
          {
            id: 'extracurriculars',
            name: 'Extracurriculars',
            allocation: 0,
            minRequired: difficulty === 'hard' ? 10000 : 5000,
            description: 'Sports, clubs, and after-school activities',
            icon: 'Music',
          },
          {
            id: 'repairs',
            name: 'Repairs',
            allocation: 0,
            minRequired: difficulty === 'hard' ? 12000 : 8000,
            description: 'Building maintenance and repairs',
            icon: 'Wrench',
          },
          {
            id: 'emergency',
            name: 'Emergency Fund',
            allocation: 0,
            minRequired: difficulty === 'hard' ? 8000 : 5000,
            description: 'Funds for unexpected situations',
            icon: 'AlertTriangle',
          },
        ];

        set({
          schoolId,
          currentBudget: initialBudget,
          totalBudget: initialBudget,
          categories,
          gameOver: false,
          gameWon: false,
        });
      },

      allocateBudget: (categoryId: string, amount: number) => {
        const { categories, currentBudget } = get();
        
        // Find the category
        const categoryIndex = categories.findIndex(c => c.id === categoryId);
        if (categoryIndex === -1) return;
        
        const category = categories[categoryIndex];
        const currentAllocation = category.allocation;
        
        // Calculate the difference
        const difference = amount - currentAllocation;
        
        // Check if we have enough budget
        if (currentBudget - difference < 0) return;
        
        // Update the category and budget
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex] = {
          ...category,
          allocation: amount,
        };
        
        set({
          categories: updatedCategories,
          currentBudget: currentBudget - difference,
        });
      },

      handleTeacherRequest: (requestId: string, approved: boolean) => {
        const { teacherRequests, categories, currentBudget, morale } = get();
        
        // Find the request
        const request = teacherRequests.find(r => r.id === requestId);
        if (!request) return;
        
        // Remove the request
        const updatedRequests = teacherRequests.filter(r => r.id !== requestId);
        
        if (approved) {
          // Find the category
          const categoryIndex = categories.findIndex(c => c.id === request.category);
          if (categoryIndex === -1) return;
          
          // Update the category and budget
          const updatedCategories = [...categories];
          updatedCategories[categoryIndex] = {
            ...categories[categoryIndex],
            allocation: categories[categoryIndex].allocation + request.amount,
          };
          
          set({
            teacherRequests: updatedRequests,
            categories: updatedCategories,
            currentBudget: currentBudget - request.amount,
            morale: morale + 5, // Approving requests improves morale
          });
        } else {
          set({
            teacherRequests: updatedRequests,
            morale: morale - 3, // Rejecting requests decreases morale
          });
        }
      },

      handleCrisisEvent: (eventId: string, optionId: string) => {
        const { crisisEvents, categories, currentBudget, doomMeter, morale } = get();
        
        // Find the event
        const event = crisisEvents.find(e => e.id === eventId);
        if (!event) return;
        
        // Find the option
        const option = event.options.find(o => o.id === optionId);
        if (!option) return;
        
        // Remove the event
        const updatedEvents = crisisEvents.filter(e => e.id !== eventId);
        
        // Apply the effects
        let updatedBudget = currentBudget;
        const updatedCategories = [...categories];
        
        option.budgetEffect.forEach(effect => {
          const categoryIndex = updatedCategories.findIndex(c => c.id === effect.category);
          if (categoryIndex !== -1) {
            updatedCategories[categoryIndex] = {
              ...updatedCategories[categoryIndex],
              allocation: updatedCategories[categoryIndex].allocation + effect.amount,
            };
            updatedBudget -= effect.amount;
          }
        });
        
        set({
          crisisEvents: updatedEvents,
          categories: updatedCategories,
          currentBudget: updatedBudget,
          doomMeter: Math.max(0, Math.min(100, doomMeter + option.doomEffect)),
          morale: Math.max(0, Math.min(100, morale + option.moraleEffect)),
        });
      },

      advanceMonth: () => {
        const { currentMonth, schoolYear, categories, doomMeter, morale, schoolId } = get();
        
        // Get the school difficulty
        const selectedSchool = schools.find(s => s.id === schoolId);
        const difficulty = selectedSchool?.difficulty || 'medium';
        
        // Check if we've reached the end of the school year (May)
        if (currentMonth === 5) {
          // Check win condition
          const allCategoriesMet = categories.every(c => c.allocation >= c.minRequired);
          const gameWon = allCategoriesMet && doomMeter < 80 && morale > 30;
          
          set({
            currentMonth: 8, // Reset to August
            schoolYear: schoolYear + 1,
            gameOver: true,
            gameWon,
          });
          return;
        }
        
        // Generate new teacher requests and crisis events
        const newTeacherRequests = generateTeacherRequests(difficulty);
        const newCrisisEvents = generateCrisisEvents(difficulty);
        
        // Update the game state
        set(state => ({
          currentMonth: (currentMonth % 12) + 1,
          teacherRequests: [...state.teacherRequests, ...newTeacherRequests],
          crisisEvents: [...state.crisisEvents, ...newCrisisEvents],
          // Increase doom meter if categories are underfunded
          doomMeter: calculateNewDoomMeter(state.categories, state.doomMeter),
          // Decrease morale over time
          morale: Math.max(0, state.morale - 2),
        }));
      },

      resetGame: () => {
        set(initialState);
      },
      
      generateTeacherRequest: () => {
        const request = generateTeacherRequestUtil();
        set(state => ({
          teacherRequests: [...state.teacherRequests, request]
        }));
      },
      
      generateCrisisEvent: () => {
        const { schoolId } = get();
        const selectedSchool = schools.find(s => s.id === schoolId);
        const difficulty = selectedSchool?.difficulty || 'medium';
        
        const events = getRandomCrisisEvents(1, difficulty as any);
        if (events.length > 0) {
          set(state => ({
            crisisEvents: [...state.crisisEvents, events[0]]
          }));
        }
      }
    }),
    {
      name: 'budget-quest-storage',
    }
  )
);

// Helper functions
function generateTeacherRequests(difficulty: string): TeacherRequest[] {
  // Generate 1-3 random requests based on difficulty
  const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  
  const requests: TeacherRequest[] = [];
  for (let i = 0; i < count; i++) {
    requests.push(generateTeacherRequestUtil());
  }
  
  return requests;
}

function generateCrisisEvents(difficulty: string): CrisisEvent[] {
  // Generate 0-2 random events based on difficulty
  const count = difficulty === 'easy' ? 
    (Math.random() > 0.5 ? 1 : 0) : 
    difficulty === 'medium' ? 1 : 
    (Math.random() > 0.3 ? 2 : 1);
  
  return getRandomCrisisEvents(count, difficulty as any);
}

function calculateNewDoomMeter(categories: BudgetCategory[], currentDoom: number): number {
  // Calculate how many categories are underfunded
  const underfundedCount = categories.filter(c => c.allocation < c.minRequired).length;
  
  // Increase doom meter based on underfunded categories
  const doomIncrease = underfundedCount * 5;
  
  return Math.min(100, currentDoom + doomIncrease);
}