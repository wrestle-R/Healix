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
  const steps = [
    '🏃‍♂️ Get ready for your exercise',
    '👀 Follow the instructor\'s movements',
    '💪 Complete the repetitions',
    '🎉 Great job! Session complete'
  ];

  const progressPercent = ((currentStep + 1) / steps.length) * 100;
  const repProgress = (repsCompleted / 10) * 100;

  return (
    <div className="fixed top-4 left-4 z-[1000] max-w-sm">
      <div className="bg-black/80 backdrop-blur-lg text-white p-6 rounded-xl border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <h2 className="text-xl font-bold text-green-400">{exercise.name}</h2>
        </div>
        
        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs text-gray-400">{Math.round(progressPercent)}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {steps[currentStep]}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{repsCompleted}</div>
            <div className="text-xs text-gray-400">Completed</div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${repProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">10</div>
            <div className="text-xs text-gray-400">Target</div>
            <div className="text-xs text-gray-500 mt-2">{exercise.duration}</div>
          </div>
        </div>

        {/* Exercise Type Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            exercise.difficulty === 'Easy' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : exercise.difficulty === 'Medium'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {exercise.difficulty}
          </span>
          
          <div className="flex items-center text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            VR Active
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {!isActive ? (
            <button 
              onClick={onStart} 
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
            >
              <span className="mr-2">🚀</span>
              Start Exercise
            </button>
          ) : (
            <button 
              onClick={onNext} 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
            >
              <span className="mr-2">⏭️</span>
              Next Step
            </button>
          )}
          
          <button 
            onClick={onExit} 
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
          >
            <span className="mr-2">🚪</span>
            Exit VR
          </button>
        </div>

        {/* Tips Section */}
        {isActive && (
          <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/20">
            <div className="flex items-start">
              <span className="text-blue-400 mr-2">💡</span>
              <div>
                <p className="text-xs text-blue-300 font-medium mb-1">Tip:</p>
                <p className="text-xs text-gray-400">
                  {exercise.id === 'arm-raise' && "Keep your back straight and raise arms slowly"}
                  {exercise.id === 'squat' && "Keep your knees behind your toes when squatting"}
                  {exercise.id === 'balance' && "Focus on a fixed point to maintain balance"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseUI;