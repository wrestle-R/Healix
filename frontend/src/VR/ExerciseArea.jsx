import React from 'react';

const ExerciseArea = ({ exercise, isActive, onRepComplete }) => {
  return (
    <a-entity>
      {/* Exercise area markers - just visual guides, no clicking needed */}
      
      {exercise.id === 'arm-raise' && isActive && (
        <>
          {/* Floor markers to show where to stand */}
          <a-ring 
            position="0 0.02 2" 
            radius-inner="0.8" 
            radius-outer="1" 
            color="#10B981"
            rotation="-90 0 0"
            opacity="0.5"
            animation="property: rotation; to: -90 0 360; dur: 8000; loop: true"
          ></a-ring>
          
          <a-text 
            position="0 0.1 2.5" 
            value="Stand here and follow the instructor" 
            align="center" 
            color="#10B981"
            scale="1 1 1"
          ></a-text>
        </>
      )}

      {exercise.id === 'squat' && isActive && (
        <>
          <a-ring 
            position="0 0.02 2" 
            radius-inner="0.6" 
            radius-outer="0.8" 
            color="#3742FA"
            rotation="-90 0 0"
            opacity="0.6"
          ></a-ring>
          
          <a-text 
            position="0 0.1 2.5" 
            value="Squat in this area" 
            align="center" 
            color="#3742FA"
            scale="1 1 1"
          ></a-text>
        </>
      )}

      {exercise.id === 'balance' && isActive && (
        <>
          <a-plane 
            position="0 0.02 2" 
            width="2" 
            height="0.1" 
            color="#FF6B35"
            rotation="-90 0 0"
            opacity="0.7"
          ></a-plane>
          
          <a-text 
            position="0 0.1 2.5" 
            value="Balance on this line" 
            align="center" 
            color="#FF6B35"
            scale="1 1 1"
          ></a-text>
        </>
      )}
    </a-entity>
  );
};

export default ExerciseArea;