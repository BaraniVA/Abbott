import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import GameStart from './components/game/GameStart';
import SchoolSelection from './components/game/SchoolSelection';
import BudgetBoard from './components/game/BudgetBoard';
import EndOfYearReport from './components/game/EndOfYearReport';
import Leaderboard from './components/game/Leaderboard';
import { initSounds } from './utils/soundEffects';

function App() {
  const { schoolId, gameOver } = useGameStore();
  
  useEffect(() => {
    // Initialize sound effects
    initSounds();
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameStart />} />
        <Route path="/select-school" element={<SchoolSelection />} />
        <Route 
          path="/game" 
          element={
            schoolId ? (
              gameOver ? <Navigate to="/report" /> : <BudgetBoard />
            ) : (
              <Navigate to="/select-school" />
            )
          } 
        />
        <Route 
          path="/report" 
          element={
            gameOver ? <EndOfYearReport /> : <Navigate to="/game" />
          } 
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;