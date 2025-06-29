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
      {!isMinimized ? (
        <motion.div
          key="sidebar"
          initial={{ x: -300, opacity: 0 }} // ✅ CHANGED: Start from LEFT
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }} // ✅ CHANGED: Exit to LEFT
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-xl border-r border-border shadow-2xl z-[1000] flex flex-col" // ✅ CHANGED: left-0 and border-r
        >
          <div className="bg-primary/10 border-b border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-muted'}`}></div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    {exercise?.exerciseName || 'Loading...'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Exercise {exerciseIndex + 1} of {therapy?.exercises.length}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-muted-foreground text-sm">-</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-border">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Progress</span>
                <div className="text-right">
                  <div className="text-primary font-bold text-xl">
                    {repsCompleted}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    of {totalReps} reps
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="bg-primary h-3 rounded-full"
                    animate={{ width: `${repProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent animate-pulse"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent animate-pulse"></div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Time</span>
              <div className="text-right">
                <div className="text-primary font-bold text-lg">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-muted-foreground text-sm">
                  ~{getRepDuration(exercise?.exerciseId || 'stand')}s per rep
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-border flex-1">
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
              <div className="text-muted-foreground text-sm mb-2 font-medium">Instructions</div>
              <div className="text-foreground text-sm leading-relaxed">
                {exercise?.instructions || 'Follow the instructor model for proper form'}
              </div>
            </div>

            {isActive && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-primary/10 border border-primary/30 rounded-lg p-3 mt-4"
              >
                <div className="text-primary font-medium text-center text-sm">
                  {repsCompleted >= totalReps ? 
                    '🎉 Exercise Complete! Moving to next...' : 
                    `💪 Keep Going! ${totalReps - repsCompleted} reps remaining`
                  }
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 space-y-3 bg-muted/20">
            {!isActive ? (
              <motion.button 
                onClick={onStart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center shadow-lg"
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
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center ${
                  repsCompleted >= totalReps 
                    ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
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
              className="w-full bg-destructive/80 hover:bg-destructive text-destructive-foreground py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2">🚪</span>
              Exit VR Session
            </motion.button>

            <div className="pt-3 border-t border-border">
              <div className="text-muted-foreground text-xs text-center mb-2">
                Therapy Progress: {exerciseIndex + 1}/{therapy?.exercises.length} exercises
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-secondary h-2 rounded-full"
                  animate={{ width: `${((exerciseIndex + (repsCompleted/totalReps)) / therapy?.exercises.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="minimized"
          initial={{ x: -100, opacity: 0, scale: 0.8 }} // ✅ CHANGED: Start from LEFT
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -100, opacity: 0, scale: 0.8 }} // ✅ CHANGED: Exit to LEFT
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-4 left-4 z-[1000]" // ✅ CHANGED: left-4 instead of right-4
        >
          <motion.button
            onClick={() => setIsMinimized(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-2xl flex flex-col items-center justify-center transition-all border-2 border-primary-foreground/20"
          >
            <div className="text-sm font-bold">{repsCompleted}/{totalReps}</div>
            <div className="text-xs opacity-70">{formatTime(timeElapsed)}</div>
          </motion.button>

          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExerciseUI;