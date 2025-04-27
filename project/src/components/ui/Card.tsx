import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'paper' | 'sticky' | 'chalkboard' | 'whiteboard' | 'file';
  className?: string;
  onClick?: () => void;
  draggable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'paper',
  className = '',
  onClick,
  draggable = false
}) => {
  const baseClasses = 'rounded-md shadow-md overflow-hidden';
  
  const variantClasses = {
    paper: 'bg-white border border-gray-200',
    sticky: 'bg-school-accent border-b-4 border-yellow-400 transform rotate-1',
    chalkboard: 'bg-school-dark border-4 border-school-secondary text-white',
    whiteboard: 'bg-white border-2 border-school-secondary',
    file: 'bg-school-light border border-school-secondary'
  };
  
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : '';
  
  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileHover={onClick || draggable ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      drag={draggable}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
    >
      {children}
    </motion.div>
  );
};

export default Card;