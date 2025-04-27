import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'budget' | 'doom' | 'morale';
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  variant = 'budget',
  showLabel = true,
  className = '',
  animate = true
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variantClasses = {
    budget: {
      container: 'bg-school-light',
      bar: 'bg-school-primary',
      text: 'text-school-secondary'
    },
    doom: {
      container: 'bg-school-light',
      bar: percentage < 30 ? 'bg-school-success' : percentage < 70 ? 'bg-school-warning' : 'bg-school-error',
      text: 'text-school-secondary'
    },
    morale: {
      container: 'bg-school-light',
      bar: percentage < 30 ? 'bg-school-error' : percentage < 70 ? 'bg-school-warning' : 'bg-school-success',
      text: 'text-school-secondary'
    }
  };
  
  const { container, bar, text } = variantClasses[variant];
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className={`flex justify-between mb-1 ${text}`}>
          <span className="text-sm font-medium">{variant.charAt(0).toUpperCase() + variant.slice(1)}</span>
          <span className="text-sm font-medium">{value}/{max}</span>
        </div>
      )}
      <div className={`w-full h-4 rounded-full ${container}`}>
        <motion.div
          className={`h-full rounded-full ${bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animate ? 0.5 : 0 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;