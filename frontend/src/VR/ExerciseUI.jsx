import React from 'react';

const ExerciseUI = ({ 
  exercise, 
  currentStep, 
  repsCompleted, 
  isActive, 
  onStart, 
  onNext, 
  onExit 
}) => {
  return (
    <div className="fixed top-6 left-6 z-[1000] max-w-sm">
      {/* Simple Info Panel */}
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl text-white p-6 rounded-2xl border border-white/10 shadow-2xl">
        
        {/* Simple Header */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-green-400">
            {exercise.name}
          </h2>
          <p className="text-xs text-gray-400">VR Therapy Session</p>
        </div>
        
        {/* Simple Stats */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-green-400">{repsCompleted}/10</div>
          <div className="text-sm text-gray-300">Reps Completed</div>
        </div>

        {/* Only Exit Button */}
        <button 
          onClick={onExit} 
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-bold transition-colors"
        >
          Exit Session
        </button>
      </div>
    </div>
  );
};

export default ExerciseUI;