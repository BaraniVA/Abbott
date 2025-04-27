import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Medal, User, Calendar, School } from 'lucide-react';
import Button from '../ui/Button';
import { PlayerScore } from '../../types';
import { getLeaderboard, formatCurrency } from '../../utils/gameUtils';
import { playSound } from '../../utils/soundEffects';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<PlayerScore[]>([]);
  
  useEffect(() => {
    // Get scores from localStorage
    const leaderboardScores = getLeaderboard();
    
    // Sort by score (we'll calculate it here)
    const sortedScores = [...leaderboardScores].sort((a, b) => {
      // Simple scoring based on budget, doom meter, and morale
      const scoreA = a.finalBudget - (a.doomMeter * 100) + (a.morale * 100);
      const scoreB = b.finalBudget - (b.doomMeter * 100) + (b.morale * 100);
      return scoreB - scoreA;
    });
    
    setScores(sortedScores);
  }, []);
  
  const handleBack = () => {
    playSound('buttonClick');
    navigate('/');
  };
  
  const getMedalIcon = (index: number) => {
    if (index === 0) return <Medal className="text-yellow-500" />;
    if (index === 1) return <Medal className="text-gray-400" />;
    if (index === 2) return <Medal className="text-amber-700" />;
    return <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium">{index + 1}</span>;
  };
  
  return (
    <div className="min-h-screen bg-green-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="flex justify-between items-center mb-6">
          <Button variant="secondary" onClick={handleBack}>
            <div className="flex items-center space-x-2">
              <ArrowLeft size={16} />
              <span>Back to Menu</span>
            </div>
          </Button>
          
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
        
        <div className="bg-green-800 rounded-lg shadow-lg overflow-hidden border-4 border-green-700 mb-8">
          <div className="bg-green-700 p-4 flex items-center space-x-2">
            <Trophy className="text-yellow-300" />
            <h2 className="text-xl font-bold text-white">Top Budget Managers</h2>
          </div>
          
          <div className="p-6">
            {scores.length === 0 ? (
              <div className="bg-white bg-opacity-10 rounded-md p-6 text-center">
                <p className="text-white text-lg font-medium">No scores yet!</p>
                <p className="text-green-100 mt-2">
                  Complete a game to see your name on the leaderboard.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {scores.map((score, index) => (
                  <motion.div
                    key={score.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white bg-opacity-10 rounded-md p-4 flex items-center space-x-4 ${
                      index < 3 ? 'border-2 border-yellow-500 bg-opacity-20' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getMedalIcon(index)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-bold text-white text-lg">{score.playerName}</h3>
                          <p className="text-green-100 text-sm">{score.nickname}</p>
                        </div>
                        
                        <div className="mt-2 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                          <div className="flex items-center space-x-1">
                            <School size={14} className="text-green-300" />
                            <span className="text-white">{score.schoolType}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <User size={14} className="text-green-300" />
                            <span className="text-white">Morale: {score.morale}%</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} className="text-green-300" />
                            <span className="text-white">Year {score.schoolYear}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-yellow-300 font-medium">
                          Final Budget: {formatCurrency(score.finalBudget)}
                        </span>
                        <span className="text-red-300 font-medium">
                          Doom: {score.doomMeter}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-green-800 rounded-lg p-4 text-center text-green-100 text-sm">
          <p>
            Can you become the ultimate budget master? Play again to improve your score!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;