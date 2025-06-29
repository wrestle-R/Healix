import React, { useRef, useEffect } from 'react';

const ExerciseInstructor = ({ exercise, isActive, repsCompleted }) => {
  const instructorRef = useRef();

  // FIX: Use CORRECT model paths that match your actual models
  const getModelPath = () => {
    if (!exercise?.exerciseId) return '/models/Stand.glb';
    
    switch (exercise.exerciseId) {
      case 'arm-stretching': return '/models/Arm_Stretching.glb';
      case 'arms-up': return '/models/Arms_Up.glb';
      case 'burpee': return '/models/Burpee.glb';
      case 'front-raises': return '/models/Front_Raises.glb';
      case 'jogging': return '/models/Jogging.glb';
      case 'left-leg-balance': return '/models/Left_Leg_Balance.glb';
      case 'neck-stretching': return '/models/Neck Stretching.glb';
      case 'plank': return '/models/Plank.glb';
      case 'push-up': return '/models/Push_Up.glb';
      case 'right-leg-balance': return '/models/Right_Leg_Balance.glb';
      case 'situps': return '/models/Situps.glb';
      case 'squat': return '/models/Squat.glb';
      case 'stair-climbing': return '/models/Stair_Climbing.glb';
      case 'stand': return '/models/Stand.glb';
      case 'walking': return '/models/Walking.glb';
      case 'warming-up': return '/models/Warming_Up.glb';
      default: return '/models/Stand.glb';
    }
  };

  useEffect(() => {
    console.log('🤖 Instructor Model:', exercise?.exerciseName, getModelPath());
  }, [exercise]);

  return (
    <a-entity ref={instructorRef} position="2.5 0 -1">
      {/* Model with CORRECT path and SYNCED animation speed */}
      <a-gltf-model 
        src={getModelPath()}
        position="0 0 0"
        scale="1.2 1.2 1.2"
        rotation="0 -60 0"
        shadow="cast: true"
        animation-mixer={isActive ? 
          `clip: *; loop: repeat;` : 
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
          value="Ready to Exercise!\nClick Start to begin"
          align="center" 
          color="#FFD700"
          scale="0.8 0.8 0.8"
        ></a-text>
      )}

      {/* Exercise name display */}
      <a-text 
        position="0 2.2 0" 
        value={exercise?.exerciseName || 'Exercise'}
        align="center" 
        color="#FFFFFF"
        scale="0.6 0.6 0.6"
      ></a-text>
    </a-entity>
  );
};

export default ExerciseInstructor;