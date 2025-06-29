import React from 'react';

const ExerciseUI = ({ 
  exercise, 
  repsCompleted, 
  totalReps,
  timeElapsed,
  estimatedTime,
  isActive, 
  onStart, 
  onNext, 
  onExit,
  therapy,
  exerciseIndex
}) => {
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const repProgress = (repsCompleted / totalReps) * 100;
  
  // Get expected time for current reps completed
  const getRepDuration = (exerciseId) => {
    switch (exerciseId) {
      case 'stand': return 3; // 3 seconds per rep
      case 'arm-raise': return 4; // 4 seconds per rep
      case 'squat': return 5; // 5 seconds per rep
      case 'balance': return 4; // 4 seconds per rep
      default: return 4;
    }
  };

  const expectedTimeForReps = repsCompleted * getRepDuration(exercise?.exerciseId || 'stand');
  const timeProgress = expectedTimeForReps > 0 ? Math.min((timeElapsed / expectedTimeForReps) * 100, 100) : 0;

  return (
    <div className="fixed top-6 left-6 z-[1000] max-w-sm">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl text-white p-6 rounded-2xl border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-green-400">
            {exercise?.exerciseName || 'Loading...'}
          </h2>
          <p className="text-xs text-gray-400">
            Exercise {exerciseIndex + 1} of {therapy?.exercises.length}
          </p>
        </div>
        
        {/* Progress Stats */}
        <div className="mb-4 space-y-3">
          {/* Reps Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Reps Completed</span>
              <span className="text-green-400 font-bold text-lg">{repsCompleted}/{totalReps}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${repProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Time Display */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Time Elapsed</span>
              <span className="text-blue-400 font-bold">
                {formatTime(timeElapsed)}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Expected: ~{getRepDuration(exercise?.exerciseId || 'stand')}s per rep
            </div>
          </div>
        </div>

        {/* Exercise Instructions */}
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Instructions:</div>
          <div className="text-sm text-gray-200">{exercise?.instructions || 'Follow the model'}</div>
        </div>

        {/* Status Message */}
        {isActive && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-900/40 to-blue-900/40 border border-green-500/30 rounded-lg">
            <div className="text-sm text-green-300 font-medium text-center">
              {repsCompleted >= totalReps ? 
                '🎉 Exercise Complete! Moving to next...' : 
                `💪 Keep Going! ${totalReps - repsCompleted} reps remaining`
              }
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="space-y-3">
          {!isActive ? (
            <button 
              onClick={onStart} 
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
            >
              <span className="mr-2">🚀</span>
              Start Exercise
            </button>
          ) : (
            <button 
              onClick={onNext} 
              disabled={repsCompleted < totalReps}
              className={`w-full py-4 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center text-lg ${
                repsCompleted >= totalReps 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-105' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="mr-2">⏭️</span>
              {repsCompleted >= totalReps ? 'Next Exercise' : 'Complete All Reps First'}
            </button>
          )}
          
          {/* EXIT BUTTON */}
          <button 
            onClick={onExit} 
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center"
          >
            <span className="mr-2">🚪</span>
            Exit VR Session
          </button>
        </div>

        {/* Overall Progress */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center mb-2">
            Therapy Progress: {exerciseIndex + 1}/{therapy?.exercises.length} exercises
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((exerciseIndex + (repsCompleted/totalReps)) / therapy?.exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseUI;