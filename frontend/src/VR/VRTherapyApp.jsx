import React, { useEffect, useState } from 'react';
import 'aframe';
import VRScene from './VRScene';
import ExerciseUI from './ExerciseUI';

const VRTherapyApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Multiple exercises with Mixamo models
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

  useEffect(() => {
    console.log('VR Therapy with Mixamo models started');
  }, []);

  // Auto-increment reps when exercise is active
  useEffect(() => {
    let interval;
    if (isExerciseActive && repsCompleted < 10) {
      interval = setInterval(() => {
        setRepsCompleted(prev => {
          if (prev < 10) {
            console.log(`Rep ${prev + 1} completed with Mixamo model!`);
            return prev + 1;
          }
          return prev;
        });
      }, 4000); // Every 4 seconds for Mixamo animation cycle
    }
    return () => clearInterval(interval);
  }, [isExerciseActive, repsCompleted]);

  const startExercise = () => {
    console.log('Starting Mixamo exercise demonstration!');
    setIsExerciseActive(true);
    setRepsCompleted(0);
  };

  const completeRep = () => {
    console.log('Manual rep completed!');
    setRepsCompleted(prev => prev + 1);
  };

  const nextStep = () => {
    if (repsCompleted >= 10) {
      // Move to next exercise
      setCurrentExerciseIndex(prev => (prev + 1) % exercises.length);
      setRepsCompleted(0);
      setIsExerciseActive(false);
    }
    setCurrentStep(prev => prev + 1);
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
        onStart={startExercise}
        onNext={nextStep}
        onExit={exitVR}
      />
    </div>
  );
};

export default VRTherapyApp;