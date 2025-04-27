import React from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../../utils/soundEffects';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'typewriter';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  sound?: keyof ReturnType<typeof import('../../utils/soundEffects')['playSound']>;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  sound = 'buttonClick'
}) => {
  const baseClasses = 'font-bold rounded-md transition-all transform active:scale-95 focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-school-primary hover:bg-school-dark text-white shadow-md',
    secondary: 'bg-school-light hover:bg-gray-200 text-school-secondary shadow-sm',
    danger: 'bg-school-error hover:bg-red-700 text-white shadow-md',
    success: 'bg-school-success hover:bg-green-700 text-white shadow-md',
    typewriter: 'bg-school-dark hover:bg-school-primary text-white border-2 border-school-primary shadow-inner font-mono'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const handleClick = () => {
    if (!disabled && onClick) {
      playSound(sound);
      onClick();
    }
  };
  
  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;