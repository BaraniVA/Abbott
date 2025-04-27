import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, DollarSign, RefreshCw, Trophy } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { calculateScore, getPerformanceNickname, formatCurrency, saveScore } from '../../utils/gameUtils';
import { playSound } from '../../utils/soundEffects';

const EndOfYearReport: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentBudget, totalBudget, categories, doomMeter, morale, 
    gameWon, schoolYear, resetGame, schoolId
  } = useGameStore();
  
  const [playerName, setPlayerName] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  
  const gameState = useGameStore.getState();
  const score = calculateScore(gameState);
  
  const nickname = getPerformanceNickname(score);
  
  const getGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };
  
  const grade = getGrade(score);
  
  const getHeadline = () => {
    if (gameWon) {
      if (score >= 90) {
        return "Miracle Worker Principal Saves School with Brilliant Budget Management!";
      } else if (score >= 70) {
        return "School Survives Another Year Thanks to Competent Leadership";
      } else {
        return "School Narrowly Avoids Financial Disaster, Continues Operations";
      }
    } else {
      if (score < 30) {
        return "School Closes Doors After Catastrophic Budget Mismanagement";
      } else if (score < 50) {
        return "Financial Crisis Forces School to Slash Programs and Staff";
      } else {
        return "Budget Woes Continue as School Struggles to Stay Afloat";
      }
    }
  };
  
  const handleSubmitScore = () => {
    if (playerName.trim()) {
      saveScore({
        currentBudget, totalBudget, categories, doomMeter, morale, schoolYear, schoolId
      } as any, playerName);
      setScoreSubmitted(true);
      playSound('success');
    }
  };
  
  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
    playSound('buttonClick');
  };
  
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
    playSound('buttonClick');
  };
  
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className={`p-4 ${gameWon ? 'bg-green-700' : 'bg-red-700'} text-white`}>
            <h1 className="text-2xl font-bold">End of Year Report</h1>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{getHeadline()}</h2>
              <p className="text-gray-600">
                {gameWon 
                  ? "Congratulations! You've successfully managed the school budget for another year."
                  : "Unfortunately, your budget management wasn't sufficient to keep the school running smoothly."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card variant="paper" className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Award className="text-amber-600 mr-2" />
                  Performance Grade
                </h3>
                
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold ${
                    grade === 'A' ? 'bg-green-100 text-green-800' :
                    grade === 'B' ? 'bg-blue-100 text-blue-800' :
                    grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    grade === 'D' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {grade}
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="font-semibold text-lg">{nickname}</p>
                  <p className="text-gray-600">Score: {score}/100</p>
                </div>
              </Card>
              
              <Card variant="paper" className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <DollarSign className="text-green-600 mr-2" />
                  Budget Summary
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Initial Budget:</span>
                    <span className="font-semibold">{formatCurrency(totalBudget)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Budget:</span>
                    <span className="font-semibold">{formatCurrency(currentBudget)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-semibold">{formatCurrency(totalBudget - currentBudget)}</span>
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doom Meter:</span>
                      <span className={`font-semibold ${doomMeter > 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {doomMeter}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Staff Morale:</span>
                      <span className={`font-semibold ${morale < 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {morale}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Category Performance</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="grid grid-cols-3 gap-2 font-semibold text-sm mb-2 text-gray-600">
                  <div>Category</div>
                  <div>Allocation</div>
                  <div>Required</div>
                </div>
                
                {categories.map(category => {
                  const isMet = category.allocation >= category.minRequired;
                  
                  return (
                    <div 
                      key={category.id}
                      className={`grid grid-cols-3 gap-2 py-2 border-t border-gray-200 ${
                        isMet ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      <div className="font-medium">{category.name}</div>
                      <div>{formatCurrency(category.allocation)}</div>
                      <div>{formatCurrency(category.minRequired)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {!scoreSubmitted ? (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Trophy className="text-amber-600 mr-2" />
                  Submit Your Score
                </h3>
                
                <div className="mb-4">
                  <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your name"
                  />
                </div>
                
                <Button
                  variant="primary"
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim()}
                  className="w-full"
                >
                  Submit Score to Leaderboard
                </Button>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-6 text-center">
                <p className="font-semibold text-green-800 mb-2">
                  Score submitted successfully!
                </p>
                <p className="text-gray-600">
                  Check the leaderboard to see how you rank against other principals.
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="primary"
                onClick={handlePlayAgain}
                className="flex-1"
              >
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw size={18} />
                  <span>Play Again</span>
                </div>
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleViewLeaderboard}
                className="flex-1"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Trophy size={18} />
                  <span>View Leaderboard</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EndOfYearReport;