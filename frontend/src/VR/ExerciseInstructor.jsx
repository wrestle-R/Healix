import React, { useRef, useEffect, useState } from 'react';

const ExerciseInstructor = ({ exercise, isActive, repsCompleted }) => {
  const instructorRef = useRef();
  const [modelLoading, setModelLoading] = useState(true);

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

  const getInstructorPosition = () => {
    if (exercise?.exerciseId === 'jogging' || exercise?.exerciseId === 'walking') {
      return "0 0 -2"; 
    }
    return "0 0 -1"; 
  };

  useEffect(() => {
    setModelLoading(true);
    // Listen for A-Frame model-loaded event
    const entity = instructorRef.current;
    if (entity) {
      const handler = () => setModelLoading(false);
      entity.addEventListener('model-loaded', handler);
      return () => entity.removeEventListener('model-loaded', handler);
    }
  }, [exercise]);

  return (
    <>
      {/* Loading Spinner Overlay */}
      {modelLoading && (
        <a-entity position="0 2 -1">
          <a-plane 
            color="#fff" 
            opacity="0.85" 
            width="2" 
            height="1" 
            position="0 0 0.1"
          ></a-plane>
          <a-text 
            value="Loading Model..." 
            color="#2563eb" 
            align="center" 
            position="0 0 0.2"
            width="2"
          ></a-text>
          <a-circle 
            color="#2563eb" 
            radius="0.15" 
            position="0 -0.3 0.2"
            animation="property: rotation; to: 0 0 360; loop: true; dur: 1000"
            opacity="0.7"
          ></a-circle>
        </a-entity>
      )}

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
    </>
  );
};

export default ExerciseInstructor;