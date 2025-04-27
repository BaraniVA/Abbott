import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Coffee, FileText, Pencil, School } from 'lucide-react';
import Button from '../ui/Button';
import { playSound, startBackgroundMusic } from '../../utils/soundEffects';

const announcements = [
  "Budget cuts announced for the third year in a row!",
  "Teacher's union demands higher salaries, board says no funds available.",
  "School roof leaking again, repairs delayed due to budget constraints.",
  "Parents complain about outdated textbooks, principal cites limited resources.",
  "District-wide technology upgrade postponed indefinitely.",
  "Sports program facing elimination without additional funding.",
  "School board meeting erupts in chaos over budget allocation.",
  "Superintendent announces 'creative solutions' for ongoing financial crisis."
];

const GameStart: React.FC = () => {
  const navigate = useNavigate();
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  
  useEffect(() => {
    // Start background music
    startBackgroundMusic();
    
    // Cycle through announcements
    const interval = setInterval(() => {
      setCurrentAnnouncement(prev => (prev + 1) % announcements.length);
      playSound('schoolBell');
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleStart = () => {
    playSound('buttonClick');
    navigate('/select-school');
  };
  
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-2">Budget Quest</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-amber-800">School Survival</h2>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-4xl bg-amber-100 rounded-lg shadow-lg overflow-hidden mb-8"
      >
        <div className="bg-amber-800 text-white p-4">
          <h3 className="text-xl font-semibold">Principal's Desk</h3>
        </div>
        
        <div className="p-6 bg-[url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover">
          <div className="bg-white bg-opacity-90 p-6 rounded-md shadow-md">
            <div className="flex items-start space-x-4 mb-6">
              <Coffee className="text-amber-800 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-amber-900">Welcome, New Principal!</h4>
                <p className="text-gray-700">
                  Congratulations on your new position! The school board has entrusted you with 
                  managing our institution's limited budget. Your decisions will determine whether 
                  we thrive or close our doors forever.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 mb-6">
              <FileText className="text-amber-800 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-amber-900">Your Mission</h4>
                <p className="text-gray-700">
                  Balance the budget across essential categories, respond to teacher requests, 
                  and handle unexpected crises. Keep the doom meter low and staff morale high!
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <School className="text-amber-800 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-amber-900">Good Luck!</h4>
                <p className="text-gray-700">
                  You'll need it. The last three principals quit within months. No pressure!
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-4xl bg-gray-800 rounded-lg p-4 mb-8"
      >
        <div className="flex items-center space-x-2 text-red-500 mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-semibold uppercase">Live Announcements</p>
        </div>
        
        <motion.p
          key={currentAnnouncement}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-white font-medium"
        >
          {announcements[currentAnnouncement]}
        </motion.p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Button
          variant="typewriter"
          size="lg"
          onClick={handleStart}
          className="px-10 py-4 text-xl"
        >
          <div className="flex items-center space-x-2">
            <Pencil size={20} />
            <span>Start Your First Day</span>
          </div>
        </Button>
      </motion.div>
    </div>
  );
};

export default GameStart;