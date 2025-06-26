import React, { useEffect, useState } from 'react';
import 'aframe';
import VRScene from './VRScene';
import ExerciseUI from './ExerciseUI';

const VRTherapyApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [isExerciseActive, setIsExerciseActive] = useState(true); // AUTO START!
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const exercises = [
    {
      id: 'arm-raise',
      name: 'Arm Raise Therapy',
      duration: '5 min',
      difficulty: 'Easy'
    },
    {
      id: 'squat',
      name: 'Squat Exercise', 
      duration: '8 min',
      difficulty: 'Medium'
    },
    {
      id: 'balance',
      name: 'Balance Training',
      duration: '6 min', 
      difficulty: 'Easy'
    }
  ];

  const currentExercise = exercises[currentExerciseIndex];

  // Auto-increment reps
  useEffect(() => {
    let interval;
    if (isExerciseActive && repsCompleted < 10) {
      interval = setInterval(() => {
        setRepsCompleted(prev => {
          if (prev < 10) {
            return prev + 1;
          }
          return prev;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isExerciseActive, repsCompleted]);

  const completeRep = () => {
    setRepsCompleted(prev => prev + 1);
  };

  const exitVR = () => {
    window.history.back();
  };

  return (
    <div className="vr-therapy-app">
      <VRScene 
        exercise={currentExercise}
        currentStep={currentStep}
        isActive={isExerciseActive}
        onRepComplete={completeRep}
      />
      <ExerciseUI 
        exercise={currentExercise}
        currentStep={currentStep}
        repsCompleted={repsCompleted}
        isActive={isExerciseActive}
        onExit={exitVR}
      />
    </div>
  );
};

export default VRTherapyApp;