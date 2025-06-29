import React, { useRef, useEffect } from 'react';

const ExerciseInstructor = ({ exercise, isActive, repsCompleted }) => {
  const instructorRef = useRef();

  const getModelPath = () => {
    switch (exercise?.exerciseId) {
      case 'stand': return '/models/Stand.glb';
      case 'arm-raise': return '/models/Arms_Up.glb';
      case 'squat': return '/models/Squat.glb';
      case 'balance': return '/models/Stand.glb';
      default: return '/models/Stand.glb';
    }
  };

  // SYNC ANIMATION SPEED with our rep timing
  const getAnimationSpeed = () => {
    switch (exercise?.exerciseId) {
      case 'stand': return 0.33; // 3 seconds per cycle
      case 'arm-raise': return 0.25; // 4 seconds per cycle
      case 'squat': return 0.2; // 5 seconds per cycle
      case 'balance': return 0.25; // 4 seconds per cycle
      default: return 0.25;
    }
  };

  return (
    <a-entity ref={instructorRef} position="2.5 0 -1">
      {/* Model with SYNCED animation speed */}
      <a-gltf-model 
        src={getModelPath()}
        position="0 0 0"
        scale="1.2 1.2 1.2"
        rotation="0 -60 0"
        shadow="cast: true"
        animation-mixer={isActive ? 
          `clip: *; loop: repeat; timeScale: ${getAnimationSpeed()}` : 
          ""
        }
      ></a-gltf-model>

      {/* Status indicator above model */}
      {isActive ? (
        <a-text 
          position="0 2.8 0" 
          value={`Follow Me!\nRep ${repsCompleted}/${exercise?.repsTarget || 10}`}
          align="center" 
          color="#00FF00"
          scale="0.8 0.8 0.8"
        ></a-text>
      ) : (
        <a-text 
          position="0 2.8 0" 
          value="Ready to Guide You!"
          align="center" 
          color="#FFFF00"
          scale="0.8 0.8 0.8"
        ></a-text>
      )}

      {/* Exercise name */}
      <a-text 
        position="0 2.4 0" 
        value={exercise?.exerciseName || 'Exercise'}
        align="center" 
        color="#87CEEB"
        scale="0.6 0.6 0.6"
      ></a-text>
    </a-entity>
  );
};

export default ExerciseInstructor;