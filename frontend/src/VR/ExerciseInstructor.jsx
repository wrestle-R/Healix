import React, { useEffect, useRef } from 'react';

const ExerciseInstructor = ({ exercise, currentStep, isActive }) => {
  const instructorRef = useRef();

  // NOW USE THE RIGHT MODEL FOR EACH EXERCISE!
  const getModelPath = () => {
    switch (exercise.id) {
      case 'arm-raise':
        return '/models/Arms_Up.glb';    // ✅ Perfect arm-raise animation!
      case 'squat':
        return '/models/Squat.glb';      // ✅ Perfect squat animation!
      case 'balance':
      default:
        return '/models/Stand.glb';      // ✅ Perfect balance/standing animation!
    }
  };

  const getExerciseName = () => {
    switch (exercise.id) {
      case 'arm-raise':
        return 'Professional Arm Raise Demo';
      case 'squat':
        return 'Professional Squat Demo';
      case 'balance':
        return 'Professional Balance Demo';
      default:
        return 'Professional Therapy Demo';
    }
  };

  return (
    <a-entity ref={instructorRef} position="2.5 0 -1">
      {/* PERFECT GLB MIXAMO MODEL! */}
      <a-gltf-model 
        src={getModelPath()}
        position="0 0 0"
        scale="1 1 1"              // GLB perfect scale
        rotation="0 -60 0"         // Face towards user
        shadow="cast: true"
        animation-mixer={isActive ? "clip: *; loop: repeat; timeScale: 0.7" : ""}
      ></a-gltf-model>

      {/* Exercise type indicator */}
      <a-sphere 
        position="0 2.8 0" 
        radius="0.12" 
        color={exercise.id === 'arm-raise' ? "#10B981" : 
               exercise.id === 'squat' ? "#3742FA" : "#FF6B35"}
        animation="property: scale; to: 1.4 1.4 1.4; dur: 1200; dir: alternate; loop: true"
      ></a-sphere>

      {/* Professional status */}
      {isActive && (
        <a-text 
          position="0 3.2 0" 
          value={getExerciseName()}
          align="center" 
          color="#FFFFFF"
          scale="1.3 1.3 1.3"
          animation="property: scale; to: 1.5 1.5 1.5; dur: 2000; dir: alternate; loop: true"
        ></a-text>
      )}

      {/* Exercise instructions */}
      {isActive && (
        <a-text 
          position="0 3.6 0" 
          value={exercise.id === 'arm-raise' ? 'Watch my arms and follow!' : 
                 exercise.id === 'squat' ? 'Bend your knees like me!' : 
                 'Balance and stay steady!'}
          align="center" 
          color="#00FF00"
          scale="1 1 1"
        ></a-text>
      )}

      {/* Professional platform */}
      <a-ring 
        position="0 0.05 0" 
        radius-inner="1" 
        radius-outer="1.3" 
        color="#4CAF50"
        rotation="-90 0 0"
        opacity="0.4"
        animation="property: rotation; to: -90 0 360; dur: 10000; loop: true"
      ></a-ring>
    </a-entity>
  );
};

export default ExerciseInstructor;