import { TeacherRequest } from '../types';

const teacherNames = [
  'Ms. Johnson', 'Mr. Smith', 'Mrs. Garcia', 'Dr. Patel', 
  'Mr. Williams', 'Ms. Chen', 'Mrs. Rodriguez', 'Mr. Kim',
  'Dr. Brown', 'Ms. Martinez', 'Mr. Taylor', 'Mrs. Wilson',
  'Ms. Teagues', 'Mr. Gregory', 'Mrs. Howard', 'Ms. Schemmenti',
  'Mr. Eddie', 'Ms. Barbara', 'Mr. Jacob', 'Mrs. Melissa'
];

const requestDescriptions = {
  supplies: [
    'We need new textbooks for the class.',
    'Our art supplies are completely depleted.',
    'The science lab needs new equipment.',
    'We need printer paper and ink cartridges.',
    'Students need new calculators for math class.',
    'The library needs new books.',
    'We need educational posters for the classroom.',
    'The music room needs new sheet music.'
  ],
  salaries: [
    'Requesting a small raise for exceptional performance.',
    'Need compensation for after-school tutoring program.',
    'Requesting funds for professional development course.',
    'Need to hire a temporary teaching assistant.',
    'Overtime pay for weekend academic program.',
    'Additional hours for student mentoring program.',
    'Substitute teacher coverage needed.',
    'Extended day program staffing costs.'
  ],
  extracurriculars: [
    'The drama club needs funding for the spring play.',
    'Our sports team needs new uniforms.',
    'The band needs instrument repairs.',
    'We want to start a new robotics club.',
    'Chess club needs new equipment.',
    'Art club supplies for the annual showcase.',
    'Science fair project materials needed.',
    'Field trip transportation costs.'
  ],
  repairs: [
    'The classroom windows dont close properly.',
    'Several student desks need replacement.',
    'The whiteboard is damaged and needs replacement.',
    'The classroom door lock is broken.',
    'Leaky ceiling needs immediate repair.',
    'Broken water fountain in hallway.',
    'Playground equipment needs safety repairs.',
    'Bathroom facilities need maintenance.'
  ],
  emergency: [
    'Need funds for student emergency medical supplies.',
    'Requesting budget for unexpected field trip opportunity.',
    'Need to replace equipment damaged in recent incident.',
    'Requesting funds for special guest speaker opportunity.',
    'Emergency heating system repair needed.',
    'Unexpected plumbing issue needs immediate attention.',
    'Storm damage to outdoor equipment.',
    'Security system upgrade required.'
  ]
};

export function generateTeacherRequest(category?: string): TeacherRequest {
  const categories = ['supplies', 'salaries', 'extracurriculars', 'repairs', 'emergency'];
  const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];
  
  let amount = 0;
  switch (selectedCategory) {
    case 'supplies':
      amount = Math.floor(Math.random() * 2000) + 500;
      break;
    case 'salaries':
      amount = Math.floor(Math.random() * 3000) + 1000;
      break;
    case 'extracurriculars':
      amount = Math.floor(Math.random() * 2500) + 800;
      break;
    case 'repairs':
      amount = Math.floor(Math.random() * 3000) + 1000;
      break;
    case 'emergency':
      amount = Math.floor(Math.random() * 1500) + 500;
      break;
  }
  
  const teacherName = teacherNames[Math.floor(Math.random() * teacherNames.length)];
  const descriptions = requestDescriptions[selectedCategory as keyof typeof requestDescriptions];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const urgencies: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
  const deadline = Math.floor(Math.random() * 10) + 1;
  
  return {
    id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    teacherName,
    category: selectedCategory,
    amount,
    description,
    urgency,
    deadline
  };
}

export function generateTeacherRequests(count: number, difficulty: 'easy' | 'medium' | 'hard'): TeacherRequest[] {
  const requests: TeacherRequest[] = [];
  
  let adjustedCount = count;
  if (difficulty === 'easy') {
    adjustedCount = Math.max(1, Math.floor(count * 0.7));
  } else if (difficulty === 'hard') {
    adjustedCount = Math.ceil(count * 1.5);
  }
  
  for (let i = 0; i < adjustedCount; i++) {
    requests.push(generateTeacherRequest());
  }
  
  return requests;
}