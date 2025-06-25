import React from 'react';

const ExerciseArea = ({ exercise, isActive, onRepComplete }) => {
  const handleTargetClick = () => {
    if (isActive) {
      onRepComplete();
    }
  };

  return (
    <a-entity>
      {/* Exercise targets based on exercise type */}
      {exercise.id === 'arm-raise' && (
        <>
          <a-sphere 
            position="-1 2 1" 
            radius="0.1" 
            color="#FF4757"
            class="clickable"
            onClick={handleTargetClick}
            animation="property: scale; to: 1.2 1.2 1.2; dur: 1000; dir: alternate; loop: true"
          ></a-sphere>
          <a-sphere 
            position="1 2 1" 
            radius="0.1" 
            color="#FF4757"
            class="clickable"
            onClick={handleTargetClick}
            animation="property: scale; to: 1.2 1.2 1.2; dur: 1000; dir: alternate; loop: true"
          ></a-sphere>
        </>
      )}

      {exercise.id === 'squat' && (
        <a-ring 
          position="0 0.1 1" 
          radius-inner="0.5" 
          radius-outer="1" 
          color="#3742FA"
          rotation="-90 0 0"
        ></a-ring>
      )}

      {exercise.id === 'balance' && (
        <a-plane 
          position="0 0.05 1" 
          width="2" 
          height="0.1" 
          color="#FF6B35"
          rotation="-90 0 0"
        ></a-plane>
      )}

      {/* Visual guides */}
      <a-text 
        position="0 3 0" 
        value={`Exercise: ${exercise.name}`} 
        align="center" 
        color="#2C3E50"
        scale="3 3 3"
      ></a-text>
    </a-entity>
  );
};

export default ExerciseArea;