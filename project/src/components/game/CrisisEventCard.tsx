import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, TrendingDown, Heart } from 'lucide-react';
import { CrisisEvent } from '../../types';
import { useGameStore } from '../../store/gameStore';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/gameUtils';
import { playSound } from '../../utils/soundEffects';

interface CrisisEventCardProps {
  event: CrisisEvent;
  onClose: () => void;
}

const CrisisEventCard: React.FC<CrisisEventCardProps> = ({ event, onClose }) => {
  const { handleCrisisEvent, currentBudget } = useGameStore();
  
  const handleSelectOption = (optionId: string) => {
    handleCrisisEvent(event.id, optionId);
    playSound('crisis');
    onClose();
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'text-school-warning';
      case 'major': return 'text-school-error';
      case 'catastrophic': return 'text-red-800';
      default: return 'text-school-secondary';
    }
  };
  
  const canAffordOption = (optionId: string) => {
    const option = event.options.find(o => o.id === optionId);
    if (!option) return false;
    
    const totalCost = option.budgetEffect.reduce((sum, effect) => {
      return sum + (effect.amount > 0 ? effect.amount : 0);
    }, 0);
    
    return currentBudget >= totalCost;
  };
  
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-school-light p-4 rounded-md border border-school-error max-h-[70vh] overflow-y-auto"
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="bg-white p-2 rounded-full shadow-md">
          <AlertTriangle className="text-school-error" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-school-dark">{event.title}</h3>
          <p className={`text-sm font-medium ${getSeverityColor(event.severity)}`}>
            {event.severity.toUpperCase()} CRISIS
          </p>
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-white rounded-md border border-school-secondary shadow-sm">
        <p className="text-school-dark">{event.description}</p>
      </div>
      
      <div className="mb-4 flex items-center space-x-2">
        <Clock className="text-school-error" size={18} />
        <p className="text-sm text-school-dark">
          <span className="font-medium">Response Needed:</span> Within {event.deadline} days
        </p>
      </div>
      
      <div className="space-y-4">
        {event.options.map(option => {
          const canAfford = canAffordOption(option.id);
          const totalBudgetEffect = option.budgetEffect.reduce((sum, effect) => {
            return sum + effect.amount;
          }, 0);
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-md border ${
                canAfford ? 'bg-white border-school-secondary' : 'bg-school-light border-school-error'
              }`}
            >
              <p className="font-medium mb-3 text-school-dark">{option.text}</p>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex items-center space-x-1">
                  <TrendingDown size={14} className={
                    option.doomEffect < 0 ? 'text-school-success' : 
                    option.doomEffect > 0 ? 'text-school-error' : 'text-school-secondary'
                  } />
                  <span className="text-school-dark">Doom: {option.doomEffect > 0 ? '+' : ''}{option.doomEffect}%</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Heart size={14} className={
                    option.moraleEffect > 0 ? 'text-school-success' : 
                    option.moraleEffect < 0 ? 'text-school-error' : 'text-school-secondary'
                  } />
                  <span className="text-school-dark">Morale: {option.moraleEffect > 0 ? '+' : ''}{option.moraleEffect}%</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className={
                    totalBudgetEffect < 0 ? 'text-school-success' : 
                    totalBudgetEffect > 0 ? 'text-school-error' : 'text-school-secondary'
                  }>
                    Cost: {totalBudgetEffect === 0 ? '$0' : formatCurrency(Math.abs(totalBudgetEffect))}
                  </span>
                </div>
              </div>
              
              {!canAfford && totalBudgetEffect > 0 && (
                <p className="text-xs text-school-error mt-2">
                  Insufficient budget available for this option.
                </p>
              )}
              
              <div className="mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSelectOption(option.id)}
                  disabled={!canAfford && totalBudgetEffect > 0}
                  className="w-full"
                >
                  Choose This Option
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CrisisEventCard;