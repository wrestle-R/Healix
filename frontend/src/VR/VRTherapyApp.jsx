import React, { useEffect, useState } from 'react';
import 'aframe';
import VRScene from './VRScene';
import ExerciseUI from './ExerciseUI';

const VRTherapyApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [isExerciseActive, setIsExerciseActive] = useState(false);

  // Default exercise for direct VR display
  const defaultExercise = {
    id: 'arm-raise',
    name: 'Arm Raise Therapy',
    duration: '5 min',
    difficulty: 'Easy'
  };

  useEffect(() => {
    console.log('VR Therapy session started');
  }, []);

  const startExercise = () => {
    setIsExerciseActive(true);
  };

  const completeRep = () => {
    setRepsCompleted(prev => prev + 1);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const exitVR = () => {
    // Navigate back or close VR
    window.history.back();
  };

  return (
    <div className="vr-therapy-app">
      <VRScene 
        exercise={defaultExercise}
        currentStep={currentStep}
        isActive={isExerciseActive}
        onRepComplete={completeRep}
      />
      <ExerciseUI 
        exercise={defaultExercise}
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