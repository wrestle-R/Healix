import React from 'react';

const ExerciseArea = ({ exercise, isActive, onRepComplete }) => {
  const handleTargetClick = () => {
    if (isActive) {
      onRepComplete();
      
      // Play success sound if available
      const successSound = document.getElementById('success-sound');
      if (successSound) {
        successSound.play().catch(e => console.log('Audio play failed:', e));
      }
    }
  };

  return (
    <a-entity>
      {/* Exercise targets based on exercise type */}
      {exercise.id === 'arm-raise' && (
        <>
          <a-sphere 
            position="-1 2 1" 
            radius="0.12" 
            color="#10B981"
            opacity="0.8"
            class="clickable"
            onClick={handleTargetClick}
            animation="property: scale; to: 1.3 1.3 1.3; dur: 1000; dir: alternate; loop: true"
            shadow="cast: true"
          ></a-sphere>
          <a-sphere 
            position="1 2 1" 
            radius="0.12" 
            color="#10B981"
            opacity="0.8"
            class="clickable"
            onClick={handleTargetClick}
            animation="property: scale; to: 1.3 1.3 1.3; dur: 1000; dir: alternate; loop: true"
            shadow="cast: true"
          ></a-sphere>
          
          {/* Target guidance */}
          <a-text 
            position="0 2.5 1" 
            value="Touch the green spheres!" 
            align="center" 
            color="#10B981"
            scale="1.5 1.5 1.5"
            animation="property: position; to: 0 2.7 1; dur: 2000; dir: alternate; loop: true"
          ></a-text>
        </>
      )}

      {exercise.id === 'squat' && (
        <>
          <a-ring 
            position="0 0.1 1" 
            radius-inner="0.5" 
            radius-outer="1" 
            color="#3742FA"
            rotation="-90 0 0"
            opacity="0.7"
            animation="property: rotation; to: -90 0 360; dur: 4000; loop: true"
          ></a-ring>
          <a-text 
            position="0 1.5 1" 
            value="Stand in the blue circle and squat!" 
            align="center" 
            color="#3742FA"
            scale="1.2 1.2 1.2"
          ></a-text>
        </>
      )}

      {exercise.id === 'balance' && (
        <>
          <a-plane 
            position="0 0.05 1" 
            width="2" 
            height="0.1" 
            color="#FF6B35"
            rotation="-90 0 0"
            opacity="0.8"
          ></a-plane>
          <a-text 
            position="0 1.5 1" 
            value="Balance on the orange line!" 
            align="center" 
            color="#FF6B35"
            scale="1.2 1.2 1.2"
          ></a-text>
        </>
      )}

      {/* Dynamic exercise title */}
      <a-text 
        position="0 3.5 0" 
        value={`Exercise: ${exercise.name}`} 
        align="center" 
        color="#2C3E50"
        scale="2.5 2.5 2.5"
        font="kelsonsans"
      ></a-text>
    </a-entity>
  );
};

export default ExerciseArea;