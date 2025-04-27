import { School } from '../types';

export const schools: School[] = [
  {
    id: 'elementary1',
    name: 'Penny Pincher Elementary',
    type: 'elementary',
    description: 'A small elementary school with basic needs and a tight budget.',
    initialBudget: 80000,
    difficulty: 'easy',
    pros: [
      'Lower overall budget requirements',
      'Fewer extracurricular demands',
      'Simpler crisis events'
    ],
    cons: [
      'Limited budget flexibility',
      'Outdated facilities need constant repairs',
      'Parents are very involved and demanding'
    ]
  },
  {
    id: 'elementary2',
    name: 'Abbott Elementary',
    type: 'elementary',
    description: 'An underfunded public school with dedicated teachers and endless optimism.',
    initialBudget: 75000,
    difficulty: 'medium',
    pros: [
      'Creative teachers who make do with less',
      'Strong community support',
      'Resourceful staff'
    ],
    cons: [
      'Severely limited resources',
      'Aging infrastructure',
      'High student needs'
    ]
  },
  {
    id: 'elementary3',
    name: 'Sunshine Valley Elementary',
    type: 'elementary',
    description: 'A growing suburban school facing rapid expansion challenges.',
    initialBudget: 90000,
    difficulty: 'hard',
    pros: [
      'Growing student population',
      'Active PTA fundraising',
      'Modern facility'
    ],
    cons: [
      'Overcrowded classrooms',
      'Rapid growth strains resources',
      'High parent expectations'
    ]
  },
  {
    id: 'middle1',
    name: 'Middling Budget Middle School',
    type: 'middle',
    description: 'A medium-sized middle school with growing needs and budget challenges.',
    initialBudget: 120000,
    difficulty: 'medium',
    pros: [
      'Balanced budget requirements',
      'Supportive parent-teacher association',
      'Decent facilities'
    ],
    cons: [
      'Growing extracurricular demands',
      'Increasing technology needs',
      'More frequent crisis events'
    ]
  },
  {
    id: 'middle2',
    name: 'Innovation Middle School',
    type: 'middle',
    description: 'A STEM-focused school struggling to maintain its programs.',
    initialBudget: 150000,
    difficulty: 'hard',
    pros: [
      'Strong STEM curriculum',
      'Technology grants available',
      'Engaged student body'
    ],
    cons: [
      'Expensive equipment needs',
      'High maintenance costs',
      'Complex program requirements'
    ]
  },
  {
    id: 'high1',
    name: 'High Stakes High School',
    type: 'high',
    description: 'A large high school with complex budget demands and frequent crises.',
    initialBudget: 200000,
    difficulty: 'hard',
    pros: [
      'Larger initial budget',
      'More fundraising opportunities',
      'Diverse program options'
    ],
    cons: [
      'Expensive sports programs',
      'Complex staffing requirements',
      'Frequent and severe crisis events',
      'Higher minimum requirements for all categories'
    ]
  }
];