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
    'Get ready for your exercise',
    'Follow the instructor\'s movements',
    'Complete the repetitions',
    'Great job! Session complete'
  ];

  return (
    <div className="exercise-ui-overlay">
      <div className="ui-panel">
        <h2>{exercise.name}</h2>
        
        <div className="progress-section">
          <div className="step-indicator">
            Step {currentStep + 1} of {steps.length}
          </div>
          <p className="step-description">{steps[currentStep]}</p>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="label">Reps Completed:</span>
            <span className="value">{repsCompleted}</span>
          </div>
          <div className="stat">
            <span className="label">Target:</span>
            <span className="value">10</span>
          </div>
        </div>

        <div className="controls">
          {!isActive ? (
            <button onClick={onStart} className="btn btn-primary">
              Start Exercise
            </button>
          ) : (
            <button onClick={onNext} className="btn btn-secondary">
              Next Step
            </button>
          )}
          <button onClick={onExit} className="btn btn-exit">
            Exit VR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseUI;