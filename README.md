# Budget Quest: School Survival

A school budget management simulation game where you take on the role of a principal managing school finances, responding to teacher requests, and handling crisis events.

## Description

Budget Quest: School Survival is an interactive simulation game that puts you in the challenging position of a school principal with limited resources. Your mission is to allocate your budget wisely, maintain staff morale, and keep the "doom meter" low as you navigate through an academic year filled with unexpected crises and constant demands.

Will you successfully balance the needs of your school, or will your institution face closure due to financial mismanagement?

## Features

- **School Selection**: Choose from different types of schools (elementary, middle, high) with varying difficulty levels
- **Budget Management**: Drag and drop interface for allocating funds to different categories
- **Teacher Requests**: Respond to funding requests from teachers throughout the school year
- **Crisis Events**: Deal with unexpected situations that require immediate attention and tough decisions
- **Year Progression**: Navigate through the school year month by month
- **Performance Assessment**: End-of-year report with scoring based on your decisions
- **Leaderboard**: Compare your performance with other players
- **Sound Effects**: Immersive audio experience with sound effects and background music

## Technologies Used

- **React** with **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Howler.js** for sound effects
- **React Router** for navigation
- **Hello Pangea DND** (fork of react-beautiful-dnd) for drag and drop functionality
- **Vite** as the build tool

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/budget-quest.git
   cd budget-quest
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

5. Preview the production build:
   ```
   npm run preview
   ```

## How to Play

1. **Start the Game**: Begin by clicking "Start Your First Day" on the welcome screen
2. **Select a School**: Choose from different schools, each with unique challenges and budget constraints
3. **Allocate Budget**: Drag money notes to different categories or use the edit feature to directly input amounts
4. **Handle Requests**: Respond to teacher requests by approving or declining funding
5. **Manage Crises**: Make decisions during crisis events that affect your budget, morale, and doom meter
6. **Advance Through the Year**: Progress through the school year month by month
7. **Review Performance**: At the end of the school year, review your performance and add your score to the leaderboard

## Game Mechanics

- **Budget Categories**: Each category requires a minimum allocation to avoid negative consequences
- **Doom Meter**: Rises when categories are underfunded and during crisis events
- **Morale**: Affected by your decisions regarding teacher requests and crisis events
- **End of Year Evaluation**: Your performance is scored based on budget efficiency, category fulfillment, doom meter, and morale

## Project Structure

```
src/
  ├── components/     # UI and game components
  │   ├── game/       # Game-specific components
  │   └── ui/         # Reusable UI components
  ├── data/           # Game data (schools, events, etc.)
  ├── store/          # State management using Zustand
  ├── types/          # TypeScript type definitions
  ├── utils/          # Utility functions
  └── App.tsx         # Main application component
```

## Credits

- Sound effects: [MixKit](https://mixkit.co/)
- Icons: [Lucide React](https://lucide.dev/docs/lucide-react)
- Animations: [Framer Motion](https://www.framer.com/motion/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed with 📚 and ❤️ for educators and budget wizards everywhere.
