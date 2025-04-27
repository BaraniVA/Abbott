import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Pencil, Users, Music, Wrench, AlertTriangle, 
  Calendar, DollarSign, TrendingDown, Heart, 
  Bell, Volume2, VolumeX
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import Modal from '../ui/Modal';
import { formatCurrency, getMonthName, getCategoryStatus } from '../../utils/gameUtils';
import { playSound, toggleSound, isSoundOn } from '../../utils/soundEffects';
import TeacherRequestCard from './TeacherRequestCard';
import CrisisEventCard from './CrisisEventCard';

const iconMap: Record<string, React.ReactNode> = {
  'Pencil': <Pencil />,
  'Users': <Users />,
  'Music': <Music />,
  'Wrench': <Wrench />,
  'AlertTriangle': <AlertTriangle />
};

const BudgetBoard: React.FC = () => {
  const { 
    currentBudget, totalBudget, categories, teacherRequests, crisisEvents,
    currentMonth, schoolYear, doomMeter, morale,
    allocateBudget, advanceMonth, generateTeacherRequest, generateCrisisEvent
  } = useGameStore();
  
  const [notes, setNotes] = useState<{id: string, amount: number}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allocationAmount, setAllocationAmount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(isSoundOn());
  const [showTeacherRequest, setShowTeacherRequest] = useState<boolean>(false);
  const [showCrisisEvent, setShowCrisisEvent] = useState<boolean>(false);
  const [showEndOfMonth, setShowEndOfMonth] = useState<boolean>(false);
  const [lastPopupTime, setLastPopupTime] = useState<number>(Date.now());
  
  // Generate money notes when budget changes
  useEffect(() => {
    regenerateNotes();
  }, [currentBudget]);
  
  // Check for teacher requests and crisis events with cooldown
  useEffect(() => {
    const currentTime = Date.now();
    const cooldownPeriod = 30000; // 30 seconds cooldown between popups
    
    if (currentTime - lastPopupTime < cooldownPeriod) {
      return; // Skip if we're still in cooldown
    }
    
    if (teacherRequests.length > 0 && !showTeacherRequest && !showCrisisEvent && !showEndOfMonth) {
      setShowTeacherRequest(true);
      setLastPopupTime(currentTime);
      playSound('schoolBell');
    } else if (crisisEvents.length > 0 && !showTeacherRequest && !showCrisisEvent && !showEndOfMonth) {
      setShowCrisisEvent(true);
      setLastPopupTime(currentTime);
      playSound('crisis');
    }
  }, [teacherRequests, crisisEvents, showTeacherRequest, showCrisisEvent, showEndOfMonth, lastPopupTime]);
  
  // Generate a test teacher request and crisis event if none exist (for testing)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (teacherRequests.length === 0) {
        generateTeacherRequest();
      }
      
      if (crisisEvents.length === 0) {
        generateCrisisEvent();
      }
    }, 95000);
    
    return () => clearTimeout(timer);
  }, [teacherRequests.length, crisisEvents.length, generateTeacherRequest, generateCrisisEvent]);
  
  const regenerateNotes = () => {
    const denominations = [1000, 5000, 10000];
    const newNotes = [];
    
    // Generate a mix of different denominations
    for (let i = 0; i < 10; i++) {
      const amount = denominations[Math.floor(Math.random() * denominations.length)];
      newNotes.push({
        id: `money-${amount}-${i}-${Date.now()}`,
        amount
      });
    }
    
    setNotes(newNotes);
  };
  
  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategory(categoryId);
      setAllocationAmount(category.allocation);
    }
  };
  
  const handleAllocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setAllocationAmount(value);
    }
  };
  
  const handleAllocationSave = () => {
    if (selectedCategory) {
      allocateBudget(selectedCategory, allocationAmount);
      setSelectedCategory(null);
      playSound('buttonClick');
    }
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const categoryId = destination.droppableId;
    
    // Find the note that was dragged
    const draggedNote = notes.find(note => note.id === draggableId);
    if (!draggedNote) return;
    
    const amount = draggedNote.amount;
    
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      allocateBudget(categoryId, category.allocation + amount);
      playSound('paperCrumple');
      
      // Remove the dragged note
      setNotes(prev => prev.filter(note => note.id !== draggableId));
    }
  };
  
  const handleAdvanceMonth = () => {
    setShowEndOfMonth(true);
  };
  
  const confirmAdvanceMonth = () => {
    advanceMonth();
    setShowEndOfMonth(false);
    playSound('schoolBell');
  };
  
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };
  
  const getCategoryIcon = (iconName: string) => {
    return iconMap[iconName] || <Pencil />;
  };
  
  const getStatusClass = (status: 'underfunded' | 'adequate' | 'overfunded') => {
    switch (status) {
      case 'underfunded': return 'bg-red-100 border-red-300';
      case 'adequate': return 'bg-green-100 border-green-300';
      case 'overfunded': return 'bg-blue-100 border-blue-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <div className="bg-amber-100 p-2 rounded-md">
                <Calendar className="text-amber-800" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{getMonthName(currentMonth)}, Year {schoolYear}</h2>
                <p className="text-sm text-gray-600">School Budget Management</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="secondary" onClick={handleToggleSound}>
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </Button>
              
              <Button
                variant="primary"
                onClick={handleAdvanceMonth}
                className="bg-amber-700 hover:bg-amber-800"
              >
                Advance to Next Month
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="text-blue-600" size={20} />
                <h3 className="font-semibold">Available Budget</h3>
              </div>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(currentBudget)}</p>
              <p className="text-sm text-gray-600">of {formatCurrency(totalBudget)} total</p>
              <ProgressBar
                value={currentBudget}
                max={totalBudget}
                variant="budget"
                className="mt-2"
              />
            </div>
            
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="text-red-600" size={20} />
                <h3 className="font-semibold">Doom Meter</h3>
              </div>
              <p className="text-2xl font-bold text-red-800">{doomMeter}%</p>
              <p className="text-sm text-gray-600">School Survival Status</p>
              <ProgressBar
                value={doomMeter}
                max={100}
                variant="doom"
                className="mt-2"
              />
            </div>
            
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="text-green-600" size={20} />
                <h3 className="font-semibold">Staff Morale</h3>
              </div>
              <p className="text-2xl font-bold text-green-800">{morale}%</p>
              <p className="text-sm text-gray-600">Teacher & Staff Happiness</p>
              <ProgressBar
                value={morale}
                max={100}
                variant="morale"
                className="mt-2"
              />
            </div>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
              {categories.map(category => {
                const status = getCategoryStatus(category);
                return (
                  <Droppable droppableId={category.id} key={category.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-4 rounded-md border ${getStatusClass(status)}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="text-gray-700">
                              {getCategoryIcon(category.icon)}
                            </div>
                            <h3 className="font-semibold">{category.name}</h3>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCategoryClick(category.id)}
                          >
                            Edit
                          </Button>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-xl font-bold">{formatCurrency(category.allocation)}</p>
                          <p className="text-sm text-gray-600">
                            Min: {formatCurrency(category.minRequired)}
                          </p>
                        </div>
                        
                        <div className="min-h-[100px] border border-dashed border-gray-300 rounded-md p-2 bg-white bg-opacity-50">
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
            <Droppable droppableId="moneyNotes" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Budget Allocation</h3>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={regenerateNotes}
                    className="text-xs"
                  >
                    Get More Money Notes
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {notes.map((note, index) => (
                    <Draggable
                      key={note.id}
                      draggableId={note.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-yellow-200 p-3 rounded-md shadow-md transform rotate-1 cursor-grab"
                          style={{
                            ...provided.draggableProps.style,
                            transform: `${provided.draggableProps.style?.transform || ''} rotate(${Math.random() * 6 - 3}deg)`
                          }}
                        >
                          <p className="font-bold">{formatCurrency(note.amount)}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Drag and drop money notes to allocate to different categories
                </p>
              </div>
            )}
            </Droppable>
          </DragDropContext>
          
          {teacherRequests.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="text-blue-600" />
                  <h3 className="font-semibold">Teacher Requests</h3>
                </div>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  {teacherRequests.length}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Teachers have submitted funding requests that need your attention.
              </p>
              <Button
                variant="primary"
                onClick={() => setShowTeacherRequest(true)}
                className="w-full"
              >
                View Requests
              </Button>
            </div>
          )}
          
          {crisisEvents.length > 0 && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="text-red-600" />
                  <h3 className="font-semibold">Crisis Events</h3>
                </div>
                <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                  {crisisEvents.length}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Urgent situations require your immediate attention!
              </p>
              <Button
                variant="danger"
                onClick={() => setShowCrisisEvent(true)}
                className="w-full"
              >
                Handle Crisis
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Category Allocation Modal */}
      <Modal
        isOpen={selectedCategory !== null}
        onClose={() => setSelectedCategory(null)}
        title="Adjust Budget Allocation"
      >
        {selectedCategory && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <p className="font-semibold">
                {categories.find(c => c.id === selectedCategory)?.name}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Allocation
              </label>
              <p className="font-semibold">
                {formatCurrency(categories.find(c => c.id === selectedCategory)?.allocation || 0)}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Required
              </label>
              <p className="font-semibold">
                {formatCurrency(categories.find(c => c.id === selectedCategory)?.minRequired || 0)}
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="allocation" className="block text-sm font-medium text-gray-700 mb-1">
                New Allocation
              </label>
              <input
                type="number"
                id="allocation"
                value={allocationAmount}
                onChange={handleAllocationChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
                max={currentBudget + (categories.find(c => c.id === selectedCategory)?.allocation || 0)}
                step="1000"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setSelectedCategory(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAllocationSave}
              >
                Save Allocation
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Teacher Request Modal */}
      <Modal
        isOpen={showTeacherRequest && teacherRequests.length > 0}
        onClose={() => setShowTeacherRequest(false)}
        title="Teacher Request"
        variant="default"
        closeOnOutsideClick={false}
      >
        {teacherRequests.length > 0 && (
          <TeacherRequestCard
            request={teacherRequests[0]}
            onClose={() => setShowTeacherRequest(false)}
          />
        )}
      </Modal>
      
      {/* Crisis Event Modal */}
      <Modal
        isOpen={showCrisisEvent && crisisEvents.length > 0}
        onClose={() => setShowCrisisEvent(false)}
        title="Crisis Event!"
        variant="crisis"
        closeOnOutsideClick={false}
      >
        {crisisEvents.length > 0 && (
          <CrisisEventCard
            event={crisisEvents[0]}
            onClose={() => setShowCrisisEvent(false)}
          />
        )}
      </Modal>
      
      {/* End of Month Modal */}
      <Modal
        isOpen={showEndOfMonth}
        onClose={() => setShowEndOfMonth(false)}
        title={`End of ${getMonthName(currentMonth)}`}
        closeOnOutsideClick={false}
      >
        <div>
          <p className="mb-4">
            You're about to advance to the next month. This will:
          </p>
          
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Generate new teacher requests</li>
            <li>Potentially trigger crisis events</li>
            <li>Update the doom meter based on your budget allocations</li>
            <li>Slightly decrease staff morale over time</li>
          </ul>
          
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-6">
            <h4 className="font-semibold mb-1">Current Status:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Available Budget:</p>
                <p className="font-semibold">{formatCurrency(currentBudget)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Doom Meter:</p>
                <p className="font-semibold">{doomMeter}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Staff Morale:</p>
                <p className="font-semibold">{morale}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Underfunded Categories:</p>
                <p className="font-semibold">
                  {categories.filter(c => c.allocation < c.minRequired).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowEndOfMonth(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmAdvanceMonth}
            >
              Advance to Next Month
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetBoard;