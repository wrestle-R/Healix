import React, { useRef, useEffect } from 'react';

const ExerciseInstructor = ({ exercise, isActive, repsCompleted }) => {
  const instructorRef = useRef();

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

  const getAnimationSpeed = () => {
    if (!exercise?.exerciseId) return 0.25;
    
    switch (exercise.exerciseId) {
      case 'arm-stretching': return 0.067;
      case 'arms-up': return 0.1;
      case 'burpee': return 0.2;
      case 'front-raises': return 0.077;
      case 'jogging': return 0.2;
      case 'left-leg-balance': return 0.25;
      case 'neck-stretching': return 0.67;
      case 'plank': return 0.25;
      case 'push-up': return 0.33;
      case 'right-leg-balance': return 0.25;
      case 'situps': return 0.33;
      case 'squat': return 0.5;
      case 'stair-climbing': return 0.33;
      case 'stand': return 0.33;
      case 'walking': return 0.67;
      case 'warming-up': return 0.2;
      default: return 0.25;
    }
  };

  const getInstructorPosition = () => {
    if (exercise?.exerciseId === 'jogging' || exercise?.exerciseId === 'walking') {
      return "0 0 -2"; 
    }
    return "0 0 -1"; 
  };

  useEffect(() => {
    console.log('🤖 Instructor Model:', exercise?.exerciseName, getModelPath());
  }, [exercise]);

  return (
    <a-entity ref={instructorRef} position={getInstructorPosition()}>

      {/* 🤖 INSTRUCTOR MODEL */}
      <a-gltf-model 
        src={getModelPath()}
        position="0 0 0"
        scale="1.8 1.8 1.8"
        rotation="0 0 0"
        shadow="cast: true"
        animation-mixer={isActive ? 
          `clip: *; loop: repeat;` : 
          ""
        }
      ></a-gltf-model>

      {/* 🎯 STATUS - POSITIONED TO RIGHT SIDE so it doesn't cover poster */}
      {isActive ? (
  <a-text 
    position="3 3.5 0" 
    value={`${exercise?.exerciseName}\nRep ${repsCompleted}/${exercise?.repsTarget || 10}`}
    align="center" 
    color="#10b981"
    scale="1.2 1.2 1.2"
    font="dejavu"
  ></a-text>
) : (
  <a-text 
    position="3 3.5 0" 
    value={`Ready: ${exercise?.exerciseName || 'Exercise'}\nClick Start to begin`}
    align="center" 
    color="#f59e0b"
    scale="1.0 1.0 1.0"
    font="dejavu"
  ></a-text>
)}
    </a-entity>
  );
};

export default ExerciseInstructor;