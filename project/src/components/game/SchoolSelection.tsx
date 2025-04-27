import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, School, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { schools } from '../../data/schools';
import { useGameStore } from '../../store/gameStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { playSound } from '../../utils/soundEffects';

const loadingMessages = [
  "Budget cuts announced for the third year in a row...",
  "Calculating minimum viable education standards...",
  "Searching for loose change in couch cushions...",
  "Negotiating with angry PTA members...",
  "Fixing leaky roof with duct tape...",
  "Convincing teachers to accept payment in high-fives...",
  "Repurposing old textbooks as building materials...",
  "Applying for emergency funding (again)..."
];

const SchoolSelection: React.FC = () => {
  const navigate = useNavigate();
  const setSchool = useGameStore(state => state.setSchool);
  
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentSchoolIndex, setCurrentSchoolIndex] = useState(0);
  
  const currentSchool = schools[currentSchoolIndex];
  
  useEffect(() => {
    if (isLoading) {
      let messageIndex = 0;
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[messageIndex]);
        messageIndex = (messageIndex + 1) % loadingMessages.length;
      }, 2000);
      
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setIsLoading(false);
        
        if (selectedSchool) {
          setSchool(selectedSchool);
          navigate('/game');
        }
      }, 6000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isLoading, navigate, selectedSchool, setSchool]);
  
  const handlePrevSchool = () => {
    playSound('buttonClick');
    setCurrentSchoolIndex(prev => (prev - 1 + schools.length) % schools.length);
  };
  
  const handleNextSchool = () => {
    playSound('buttonClick');
    setCurrentSchoolIndex(prev => (prev + 1) % schools.length);
  };
  
  const handleSelectSchool = () => {
    playSound('schoolBell');
    setSelectedSchool(currentSchool.id);
    setIsLoading(true);
  };
  
  const handleBack = () => {
    playSound('buttonClick');
    navigate('/');
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-green-900 flex flex-col items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-md">
              <div className="bg-green-800 p-6 rounded-lg shadow-lg border-4 border-green-700">
                <h2 className="text-white text-2xl font-bold mb-4 text-center">Loading School Data</h2>
                
                <div className="w-full bg-green-700 h-4 rounded-full mb-6">
                  <motion.div
                    className="bg-white h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6 }}
                  />
                </div>
                
                <motion.p
                  key={loadingMessage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-center font-medium"
                >
                  {loadingMessage}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl"
          >
            <div className="flex justify-between items-center mb-6">
              <Button variant="secondary" onClick={handleBack}>
                <div className="flex items-center space-x-2">
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </div>
              </Button>
              
              <h1 className="text-3xl font-bold text-amber-900">Select Your School</h1>
              
              <div className="w-24"></div> {/* Spacer for alignment */}
            </div>
            
            <Card variant="file" className="mb-8">
              <div className="bg-amber-800 text-white p-4 flex items-center space-x-2">
                <FolderOpen size={20} />
                <h2 className="text-xl font-semibold">School Files</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Button variant="secondary" onClick={handlePrevSchool}>
                    <ArrowLeft size={20} />
                  </Button>
                  
                  <h3 className="text-2xl font-bold text-amber-900">{currentSchool.name}</h3>
                  
                  <Button variant="secondary" onClick={handleNextSchool}>
                    <ArrowRight size={20} />
                  </Button>
                </div>
                
                <div className="bg-white border border-amber-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <School className="text-amber-800 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-lg">{currentSchool.type.charAt(0).toUpperCase() + currentSchool.type.slice(1)} School</h4>
                        <span className={`text-sm font-medium ${getDifficultyColor(currentSchool.difficulty)}`}>
                          ({currentSchool.difficulty.toUpperCase()})
                        </span>
                      </div>
                      <p className="text-gray-700">{currentSchool.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-semibold text-green-700 mb-2">Advantages</h5>
                      <ul className="space-y-1">
                        {currentSchool.pros.map((pro, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Check size={16} className="text-green-600 flex-shrink-0 mt-1" />
                            <span className="text-gray-700">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-red-700 mb-2">Challenges</h5>
                      <ul className="space-y-1">
                        {currentSchool.cons.map((con, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-red-600 flex-shrink-0 mt-1 font-bold">!</span>
                            <span className="text-gray-700">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t border-amber-100 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">Initial Budget:</span>
                        <p className="text-xl font-bold text-amber-900">
                          ${currentSchool.initialBudget.toLocaleString()}
                        </p>
                      </div>
                      
                      <Button
                        variant="primary"
                        onClick={handleSelectSchool}
                        className="bg-amber-700 hover:bg-amber-800"
                      >
                        Select This School
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    {schools.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === currentSchoolIndex ? 'bg-amber-800' : 'bg-amber-300'
                        }`}
                        onClick={() => setCurrentSchoolIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolSelection;