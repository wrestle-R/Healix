import React, { useEffect, useRef } from 'react';

const ExerciseInstructor = ({ exercise, currentStep, isActive }) => {
  const instructorRef = useRef();
  const avatarRef = useRef();

  useEffect(() => {
    if (isActive && instructorRef.current) {
      demonstrateExercise();
    }
  }, [isActive, currentStep, exercise]);

  const demonstrateExercise = () => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    // Stop any existing animations
    avatar.removeAttribute('animation');
    avatar.removeAttribute('animation__2');

    switch (exercise.id) {
      case 'arm-raise':
        // Animate the entire avatar for arm raising
        avatar.setAttribute('animation', {
          property: 'rotation',
          from: '0 0 0',
          to: '0 0 5',
          dur: 2000,
          dir: 'alternate',
          loop: true,
          easing: 'easeInOutQuad'
        });
        avatar.setAttribute('animation__2', {
          property: 'position',
          from: '0 0 0',
          to: '0 0.1 0',
          dur: 2000,
          dir: 'alternate',
          loop: true,
          easing: 'easeInOutQuad'
        });
        break;

      case 'squat':
        // Realistic squatting motion
        avatar.setAttribute('animation', {
          property: 'position',
          from: '0 0 0',
          to: '0 -0.3 0',
          dur: 3000,
          dir: 'alternate',
          loop: true,
          easing: 'easeInOutQuad'
        });
        break;

      case 'balance':
        // Balance exercise - subtle body sway
        avatar.setAttribute('animation', {
          property: 'rotation',
          from: '0 0 -3',
          to: '0 0 3',
          dur: 4000,
          dir: 'alternate',
          loop: true,
          easing: 'easeInOutSine'
        });
        break;

      default:
        break;
    }
  };

  return (
    <a-entity ref={instructorRef} position="2 0 -2">
      {/* Ready Player Me Avatar - Replace ALL the old model */}
      <a-gltf-model 
        ref={avatarRef}
        src="https://models.readyplayer.me/685c3742f3e9ba0f88c194ec.glb"
        position="0 0 0"
        scale="1 1 1"
        rotation="0 180 0"
        shadow="cast: true"
        animation-mixer="clip: *; loop: repeat; timeScale: 0.8"
      ></a-gltf-model>

      {/* Speech Bubble - Keep this */}
      <a-entity position="0 2.2 0">
        <a-plane 
          width="2" 
          height="0.8" 
          color="#FFFFFF" 
          opacity="0.9"
          position="0 0 0.01"
          shadow="cast: true"
        ></a-plane>
        <a-text 
          position="0 0 0.02" 
          value={isActive ? "Follow my movements!" : "Ready to start?"} 
          align="center" 
          color="#2C3E50"
          scale="1.8 1.8 1.8"
          font="kelsonsans"
        ></a-text>
      </a-entity>

      {/* Floating instruction arrows - Keep these */}
      {isActive && exercise.id === 'arm-raise' && (
        <>
          <a-cone 
            position="-0.8 1.8 0" 
            radius-bottom="0.08" 
            radius-top="0" 
            height="0.15" 
            color="#E74C3C"
            rotation="0 0 90"
            animation="property: position; to: -0.8 2.2 0; dur: 1000; dir: alternate; loop: true"
          ></a-cone>
          <a-cone 
            position="0.8 1.8 0" 
            radius-bottom="0.08" 
            radius-top="0" 
            height="0.15" 
            color="#E74C3C"
            rotation="0 0 -90"
            animation="property: position; to: 0.8 2.2 0; dur: 1000; dir: alternate; loop: true"
          ></a-cone>
        </>
      )}
    </a-entity>
  );
};

export default ExerciseInstructor;