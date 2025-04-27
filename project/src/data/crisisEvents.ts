import { CrisisEvent } from '../types';

export const crisisEventPool: CrisisEvent[] = [
  {
    id: 'roof_leak',
    title: 'Roof Leak Disaster!',
    description: 'Heavy rains have caused significant leaks in the school roof. Water is pouring into classrooms!',
    options: [
      {
        id: 'quick_fix',
        text: 'Apply a quick, temporary fix',
        budgetEffect: [
          { category: 'repairs', amount: 2000 }
        ],
        moraleEffect: -5,
        doomEffect: 3
      },
      {
        id: 'proper_repair',
        text: 'Invest in proper repairs',
        budgetEffect: [
          { category: 'repairs', amount: 8000 }
        ],
        moraleEffect: 5,
        doomEffect: -5
      },
      {
        id: 'ignore',
        text: 'Place buckets and hope for the best',
        budgetEffect: [
          { category: 'supplies', amount: 500 }
        ],
        moraleEffect: -15,
        doomEffect: 15
      }
    ],
    deadline: 3,
    severity: 'major'
  },
  {
    id: 'teacher_strike',
    title: 'Teacher Strike Threat!',
    description: 'Teachers are threatening to strike due to low salaries and poor working conditions.',
    options: [
      {
        id: 'increase_salaries',
        text: 'Increase teacher salaries',
        budgetEffect: [
          { category: 'salaries', amount: 10000 }
        ],
        moraleEffect: 20,
        doomEffect: -10
      },
      {
        id: 'negotiate',
        text: 'Negotiate a compromise',
        budgetEffect: [
          { category: 'salaries', amount: 5000 }
        ],
        moraleEffect: 5,
        doomEffect: 0
      },
      {
        id: 'refuse',
        text: 'Refuse their demands',
        budgetEffect: [],
        moraleEffect: -25,
        doomEffect: 25
      }
    ],
    deadline: 5,
    severity: 'catastrophic'
  },
  {
    id: 'broken_hvac',
    title: 'HVAC System Breakdown',
    description: 'The heating and cooling system has completely failed. Students are freezing/sweating!',
    options: [
      {
        id: 'new_system',
        text: 'Install a new energy-efficient system',
        budgetEffect: [
          { category: 'repairs', amount: 15000 }
        ],
        moraleEffect: 10,
        doomEffect: -10
      },
      {
        id: 'repair',
        text: 'Repair the existing system',
        budgetEffect: [
          { category: 'repairs', amount: 7000 }
        ],
        moraleEffect: 0,
        doomEffect: 0
      },
      {
        id: 'fans_heaters',
        text: 'Distribute fans/space heaters',
        budgetEffect: [
          { category: 'supplies', amount: 3000 }
        ],
        moraleEffect: -15,
        doomEffect: 10
      }
    ],
    deadline: 2,
    severity: 'major'
  },
  {
    id: 'budget_cuts',
    title: 'District Budget Cuts',
    description: 'The school district has announced unexpected budget cuts for all schools.',
    options: [
      {
        id: 'fundraiser',
        text: 'Organize an emergency fundraiser',
        budgetEffect: [
          { category: 'emergency', amount: -2000 }
        ],
        moraleEffect: 5,
        doomEffect: 5
      },
      {
        id: 'cut_programs',
        text: 'Cut non-essential programs',
        budgetEffect: [
          { category: 'extracurriculars', amount: -5000 }
        ],
        moraleEffect: -15,
        doomEffect: 10
      },
      {
        id: 'appeal',
        text: 'Appeal to the school board',
        budgetEffect: [],
        moraleEffect: 0,
        doomEffect: 8
      }
    ],
    deadline: 7,
    severity: 'major'
  },
  {
    id: 'technology_upgrade',
    title: 'Technology Upgrade Needed',
    description: 'The school\'s computers are outdated and can no longer run required educational software.',
    options: [
      {
        id: 'full_upgrade',
        text: 'Complete technology overhaul',
        budgetEffect: [
          { category: 'supplies', amount: 12000 }
        ],
        moraleEffect: 15,
        doomEffect: -5
      },
      {
        id: 'partial_upgrade',
        text: 'Upgrade only essential computers',
        budgetEffect: [
          { category: 'supplies', amount: 6000 }
        ],
        moraleEffect: 5,
        doomEffect: 0
      },
      {
        id: 'ignore_tech',
        text: 'Continue using outdated technology',
        budgetEffect: [],
        moraleEffect: -10,
        doomEffect: 15
      }
    ],
    deadline: 10,
    severity: 'minor'
  }
];

export function getRandomCrisisEvents(count: number, difficulty: 'easy' | 'medium' | 'hard'): CrisisEvent[] {
  // Filter events based on difficulty
  let filteredEvents = crisisEventPool;
  
  if (difficulty === 'easy') {
    filteredEvents = crisisEventPool.filter(event => event.severity !== 'catastrophic');
  } else if (difficulty === 'medium') {
    // All events are possible in medium difficulty
  } else if (difficulty === 'hard') {
    // Increase the likelihood of catastrophic events for hard difficulty
    filteredEvents = [
      ...crisisEventPool,
      ...crisisEventPool.filter(event => event.severity === 'catastrophic')
    ];
  }
  
  // Shuffle and select random events
  const shuffled = [...filteredEvents].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}