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
    '🎯 Position yourself in the marked area',
    '👁️ Watch the instructor demonstrate the movement',
    '💪 Follow along and complete the exercise',
    '🏆 Excellent work! Session completed!'
  ];

  const progressPercent = ((currentStep + 1) / steps.length) * 100;
  const repProgress = (repsCompleted / 10) * 100;

  return (
    <div className="fixed top-6 left-6 z-[1000] max-w-sm">
      {/* Main Control Panel */}
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl text-white p-6 rounded-2xl border border-white/10 shadow-2xl">
        
        {/* Header with Status */}
        <div className="flex items-center mb-5">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-3 animate-pulse shadow-lg"></div>
          <div>
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              {exercise.name}
            </h2>
            <p className="text-xs text-gray-400 mt-1">VR Therapy Session Active</p>
          </div>
        </div>
        
        {/* Beautiful Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-green-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
              {Math.round(progressPercent)}%
            </span>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="w-full h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <p className="text-gray-300 text-sm leading-relaxed">
              {steps[currentStep]}
            </p>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 text-center border border-green-500/20">
            <div className="text-3xl font-bold text-green-400 mb-1">{repsCompleted}</div>
            <div className="text-xs text-green-300 font-medium">Completed</div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${repProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 text-center border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400 mb-1">10</div>
            <div className="text-xs text-blue-300 font-medium">Target</div>
            <div className="text-xs text-gray-400 mt-3 bg-gray-800/50 rounded px-2 py-1">
              {exercise.duration}
            </div>
          </div>
        </div>

        {/* Exercise Badge */}
        <div className="flex items-center justify-between mb-5">
          <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
            exercise.difficulty === 'Easy' 
              ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30' 
              : exercise.difficulty === 'Medium'
              ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30'
              : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30'
          }`}>
            {exercise.difficulty} Level
          </span>
          
          <div className="flex items-center text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 absolute"></div>
            Live Session
          </div>
        </div>

        {/* Modern Control Buttons */}
        <div className="space-y-3">
          {!isActive ? (
            <button 
              onClick={onStart} 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group"
            >
              <span className="mr-3 text-lg group-hover:animate-bounce">🚀</span>
              Start VR Exercise
            </button>
          ) : (
            <button 
              onClick={onNext} 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group"
            >
              <span className="mr-3 text-lg group-hover:animate-bounce">⏭️</span>
              Continue Session
            </button>
          )}
          
          <button 
            onClick={onExit} 
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group"
          >
            <span className="mr-3 text-lg group-hover:animate-bounce">🚪</span>
            Exit Session
          </button>
        </div>

        {/* Pro Tips Panel */}
        {isActive && (
          <div className="mt-5 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <div className="flex items-start">
              <span className="text-purple-400 mr-3 text-lg">💡</span>
              <div>
                <p className="text-xs text-purple-300 font-bold mb-2">Pro Tip:</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {exercise.id === 'arm-raise' && "Keep your core engaged and raise arms in a controlled motion"}
                  {exercise.id === 'squat' && "Imagine sitting back into a chair, keep your chest up"}
                  {exercise.id === 'balance' && "Focus on a fixed point ahead, breathe naturally"}
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