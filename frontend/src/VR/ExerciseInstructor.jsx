import React, { useRef } from 'react';

const ExerciseInstructor = ({ exercise, currentStep, isActive }) => {
  const instructorRef = useRef();

  const getModelPath = () => {
    switch (exercise.id) {
      case 'stand':
        return '/models/Stand.glb';      // DEFAULT: Standing pose
      case 'arm-raise':
        return '/models/Arms_Up.glb';
      case 'squat':
        return '/models/Squat.glb';
      case 'balance':
      default:
        return '/models/Stand.glb';      // Fallback to standing
    }
  };

  return (
    <a-entity ref={instructorRef} position="2.5 0 -1">
      {/* Model - Shows standing pose by default */}
      <a-gltf-model 
        src={getModelPath()}
        position="0 0 0"
        scale="1 1 1"
        rotation="0 -60 0"
        shadow="cast: true"
        animation-mixer={isActive ? "clip: *; loop: repeat; timeScale: 0.7" : ""}
      ></a-gltf-model>

      {/* Status Text */}
      {!isActive && (
        <a-text 
          position="0 2.5 0" 
          value="Ready to Start" 
          align="center" 
          color="#FFFF00"
          scale="1.2 1.2 1.2"
        ></a-text>
      )}

      {isActive && (
        <a-text 
          position="0 2.5 0" 
          value="Follow My Movement" 
          align="center" 
          color="#00FF00"
          scale="1.2 1.2 1.2"
        ></a-text>
      )}
    </a-entity>
  );
};

export default ExerciseInstructor;