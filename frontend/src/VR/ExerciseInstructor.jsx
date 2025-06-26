import React, { useRef } from 'react';

const ExerciseInstructor = ({ exercise, currentStep, isActive }) => {
  const instructorRef = useRef();

  const getModelPath = () => {
    switch (exercise.id) {
      case 'arm-raise':
        return '/models/Arms_Up.glb';
      case 'squat':
        return '/models/Squat.glb';
      case 'balance':
      default:
        return '/models/Stand.glb';
    }
  };

  return (
    <a-entity ref={instructorRef} position="2.5 0 -1">
      {/* JUST THE MODEL - NO BULLSHIT */}
      <a-gltf-model 
        src={getModelPath()}
        position="0 0 0"
        scale="1 1 1"
        rotation="0 -60 0"
        shadow="cast: true"
        animation-mixer={isActive ? "clip: *; loop: repeat; timeScale: 0.7" : ""}
      ></a-gltf-model>
    </a-entity>
  );
};

export default ExerciseInstructor;