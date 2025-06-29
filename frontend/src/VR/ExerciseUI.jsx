import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const repProgress = (repsCompleted / totalReps) * 100;
  
  const getRepDuration = (exerciseId) => {
    switch (exerciseId) {
      case 'arm-stretching': return 15;
      case 'arms-up': return 10;
      case 'burpee': return 5;
      case 'front-raises': return 13;
      case 'jogging': return 5;
      case 'left-leg-balance': return 4;
      case 'neck-stretching': return 1.5;
      case 'plank': return 4;
      case 'push-up': return 3;
      case 'right-leg-balance': return 4;
      case 'situps': return 3;
      case 'squat': return 2;
      case 'stair-climbing': return 3;
      case 'stand': return 3;
      case 'walking': return 1.5;
      case 'warming-up': return 5;
      default: return 4;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.05}
        dragConstraints={{
          left: -200,
          right: 200,
          top: -200,
          bottom: 200
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        className={`fixed bottom-6 right-6 z-[1000] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* 🎨 MINIMIZED STATE */}
        {isMinimized ? (
          <motion.div
            layoutId="ui-container"
            className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-xl flex items-center justify-center cursor-pointer border-3 border-white"
            onClick={() => setIsMinimized(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="text-white font-bold text-xs">
              {repsCompleted}/{totalReps}
            </div>
          </motion.div>
        ) : (
          
          /* 🚀 FULL UI - Modern Card Design */
          <motion.div
            layoutId="ui-container"
            className="w-80 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl text-white rounded-2xl border border-slate-600/50 shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* 🎯 HEADER */}
            <div className="bg-gradient-to-r from-primary/80 to-primary/60 p-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      {exercise?.exerciseName || 'Loading...'}
                    </h3>
                    <p className="text-white/70 text-xs">
                      Exercise {exerciseIndex + 1} of {therapy?.exercises.length}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-white text-xs">−</span>
                  </button>
                  <div className="w-4 h-1 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              
              {/* 📊 PROGRESS */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium text-sm">Progress</span>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold text-xl">
                      {repsCompleted}
                    </div>
                    <div className="text-slate-400 text-xs">
                      of {totalReps} reps
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${repProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* ⏰ TIME */}
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium text-sm">Time</span>
                <div className="text-right">
                  <div className="text-cyan-400 font-bold text-lg">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="text-slate-400 text-xs">
                    ~{getRepDuration(exercise?.exerciseId || 'stand')}s per rep
                  </div>
                </div>
              </div>

              {/* 💡 INSTRUCTIONS */}
              <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-600/30">
                <div className="text-slate-400 text-xs mb-1 font-medium">Instructions</div>
                <div className="text-slate-200 text-xs leading-relaxed">
                  {exercise?.instructions || 'Follow the instructor model for proper form'}
                </div>
              </div>

              {/* 🎉 STATUS */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border border-emerald-500/30 rounded-xl p-3"
                >
                  <div className="text-emerald-300 font-medium text-center text-xs">
                    {repsCompleted >= totalReps ? 
                      '🎉 Exercise Complete! Moving to next...' : 
                      `💪 Keep Going! ${totalReps - repsCompleted} reps remaining`
                    }
                  </div>
                </motion.div>
              )}

              {/* 🚀 BUTTONS */}
              <div className="space-y-2">
                {!isActive ? (
                  <motion.button 
                    onClick={onStart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center shadow-lg"
                  >
                    <span className="mr-2 text-lg">🚀</span>
                    Start Exercise
                  </motion.button>
                ) : (
                  <motion.button 
                    onClick={onNext}
                    disabled={repsCompleted < totalReps}
                    whileHover={repsCompleted >= totalReps ? { scale: 1.02 } : {}}
                    whileTap={repsCompleted >= totalReps ? { scale: 0.98 } : {}}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                      repsCompleted >= totalReps 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg' 
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="mr-2 text-base">⏭️</span>
                    {repsCompleted >= totalReps ? 'Next Exercise' : 'Complete All Reps First'}
                  </motion.button>
                )}
                
                <motion.button 
                  onClick={onExit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-700 hover:bg-red-600/80 text-white py-2 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center"
                >
                  <span className="mr-2">🚪</span>
                  Exit VR Session
                </motion.button>
              </div>

              {/* 📈 OVERALL PROGRESS */}
              <div className="pt-3 border-t border-slate-700">
                <div className="text-slate-400 text-xs text-center mb-2">
                  Therapy Progress: {exerciseIndex + 1}/{therapy?.exercises.length} exercises
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((exerciseIndex + (repsCompleted/totalReps)) / therapy?.exercises.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ExerciseUI;