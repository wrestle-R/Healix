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
      {/* Control Panel */}
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl text-white p-6 rounded-2xl border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-green-400">
            {exercise.name}
          </h2>
          <p className="text-xs text-gray-400">VR Therapy Session</p>
        </div>
        
        {/* Stats */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-green-400">{repsCompleted}/10</div>
          <div className="text-sm text-gray-300">Reps Completed</div>
        </div>

        {/* Exercise Info */}
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
          <div className="text-xs text-gray-400">Duration: {exercise.duration}</div>
          <div className="text-xs text-gray-400">Difficulty: {exercise.difficulty}</div>
        </div>

        {/* Control Buttons */}
        <div className="space-y-3">
          {!isActive ? (
            // START BUTTON - ADDED BACK!
            <button 
              onClick={onStart} 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <span className="mr-2">🚀</span>
              Start Exercise
            </button>
          ) : (
            // NEXT EXERCISE BUTTON
            <button 
              onClick={onNext} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <span className="mr-2">⏭️</span>
              Next Exercise
            </button>
          )}
          
          {/* EXIT BUTTON */}
          <button 
            onClick={onExit} 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🚪</span>
            Exit Session
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-gray-400">
            {isActive ? 'Exercise Active' : 'Ready to Start'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseUI;