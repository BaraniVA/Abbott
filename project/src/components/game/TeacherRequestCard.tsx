import React from 'react';
import { motion } from 'framer-motion';
import { User, Clock, DollarSign, FileText } from 'lucide-react';
import { TeacherRequest } from '../../types';
import { useGameStore } from '../../store/gameStore';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/gameUtils';
import { playSound } from '../../utils/soundEffects';

interface TeacherRequestCardProps {
  request: TeacherRequest;
  onClose: () => void;
}

const TeacherRequestCard: React.FC<TeacherRequestCardProps> = ({ request, onClose }) => {
  const { handleTeacherRequest, currentBudget } = useGameStore();
  
  const handleApprove = () => {
    handleTeacherRequest(request.id, true);
    playSound('success');
    onClose();
  };
  
  const handleReject = () => {
    handleTeacherRequest(request.id, false);
    playSound('failure');
    onClose();
  };
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-school-primary';
      case 'medium': return 'text-school-warning';
      case 'high': return 'text-school-error';
      default: return 'text-school-secondary';
    }
  };
  
  const canApprove = currentBudget >= request.amount;
  
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-school-light p-4 rounded-md border border-school-secondary"
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="bg-white p-2 rounded-full shadow-md">
          <User className="text-school-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-school-dark">{request.teacherName}</h3>
          <p className="text-sm text-school-secondary">
            {request.category.charAt(0).toUpperCase() + request.category.slice(1)} Department
          </p>
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-white rounded-md border border-school-secondary shadow-sm">
        <div className="flex items-start space-x-2">
          <FileText size={18} className="text-school-primary flex-shrink-0 mt-1" />
          <p className="text-school-dark">{request.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-3 rounded-md border border-school-secondary">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign size={16} className="text-school-primary" />
            <span className="text-sm font-medium text-school-dark">Amount Needed</span>
          </div>
          <p className="font-bold text-lg text-school-primary">{formatCurrency(request.amount)}</p>
        </div>
        
        <div className="bg-white p-3 rounded-md border border-school-secondary">
          <div className="flex items-center space-x-2 mb-1">
            <Clock size={16} className="text-school-primary" />
            <span className="text-sm font-medium text-school-dark">Urgency Level</span>
          </div>
          <p className={`font-bold text-lg ${getUrgencyColor(request.urgency)}`}>
            {request.urgency.toUpperCase()}
          </p>
        </div>
      </div>
      
      {!canApprove && (
        <div className="bg-school-error bg-opacity-10 p-3 rounded-md border border-school-error mb-4">
          <p className="text-sm text-school-error">
            <strong>Notice:</strong> Insufficient budget available.
            Current budget: {formatCurrency(currentBudget)}
          </p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button
          variant="secondary"
          onClick={handleReject}
        >
          Decline Request
        </Button>
        <Button
          variant="primary"
          onClick={handleApprove}
          disabled={!canApprove}
        >
          Approve Funding
        </Button>
      </div>
    </motion.div>
  );
};

export default TeacherRequestCard;