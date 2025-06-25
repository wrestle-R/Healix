import React, { useEffect, useRef } from 'react';

const ExerciseInstructor = ({ exercise, currentStep, isActive }) => {
  const instructorRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const bodyRef = useRef();
  const legRef = useRef();

  useEffect(() => {
    if (isActive && instructorRef.current) {
      demonstrateExercise();
    }
  }, [isActive, currentStep, exercise]);

  const demonstrateExercise = () => {
    const leftArm = leftArmRef.current;
    const rightArm = rightArmRef.current;
    const body = bodyRef.current;
    const legs = legRef.current;

    // Stop any existing animations
    [leftArm, rightArm, body, legs].forEach(element => {
      if (element) {
        element.removeAttribute('animation');
        element.removeAttribute('animation__2');
        element.removeAttribute('animation__3');
      }
    });

    switch (exercise.id) {
      case 'arm-raise':
        // Realistic arm raising animation
        if (leftArm) {
          leftArm.setAttribute('animation', {
            property: 'rotation',
            from: '0 0 -30',
            to: '0 0 90',
            dur: 2000,
            dir: 'alternate',
            loop: true,
            easing: 'easeInOutQuad'
          });
        }
        if (rightArm) {
          rightArm.setAttribute('animation', {
            property: 'rotation',
            from: '0 0 30',
            to: '0 0 -90',
            dur: 2000,
            dir: 'alternate',
            loop: true,
            easing: 'easeInOutQuad'
          });
        }
        break;

      case 'squat':
        // Realistic squatting motion
        if (body) {
          body.setAttribute('animation', {
            property: 'position',
            from: '0 0 0',
            to: '0 -0.5 0',
            dur: 3000,
            dir: 'alternate',
            loop: true,
            easing: 'easeInOutQuad'
          });
        }
        if (legs) {
          legs.setAttribute('animation', {
            property: 'rotation',
            from: '0 0 0',
            to: '45 0 0',
            dur: 3000,
            dir: 'alternate',
            loop: true,
            easing: 'easeInOutQuad'
          });
        }
        break;

      case 'balance':
        // Balance exercise - subtle body sway
        if (body) {
          body.setAttribute('animation', {
            property: 'rotation',
            from: '0 0 -5',
            to: '0 0 5',
            dur: 4000,
            dir: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
          });
        }
        break;

      default:
        break;
    }
  };

  return (
    <a-entity ref={instructorRef} position="2 0 -2">
      {/* Realistic Human Model */}
      
      {/* Body/Torso */}
      <a-entity ref={bodyRef} position="0 0 0">
        <a-cylinder 
          position="0 1.5 0" 
          radius="0.25" 
          height="1.2" 
          color="#4A90E2"
          shadow="cast: true"
        ></a-cylinder>
        
        {/* Head */}
        <a-sphere 
          position="0 2.3 0" 
          radius="0.18" 
          color="#FFAB91"
          shadow="cast: true"
        ></a-sphere>
        
        {/* Eyes */}
        <a-sphere 
          position="-0.05 2.35 0.15" 
          radius="0.02" 
          color="#2C3E50"
        ></a-sphere>
        <a-sphere 
          position="0.05 2.35 0.15" 
          radius="0.02" 
          color="#2C3E50"
        ></a-sphere>
        
        {/* Smile */}
        <a-torus 
          position="0 2.25 0.15" 
          radius="0.03" 
          radius-tubular="0.005" 
          color="#E74C3C"
          rotation="0 0 0"
        ></a-torus>
      </a-entity>

      {/* Left Arm */}
      <a-entity ref={leftArmRef} position="-0.35 1.8 0" rotation="0 0 -30">
        <a-cylinder 
          radius="0.06" 
          height="0.8" 
          color="#FFAB91"
          shadow="cast: true"
        ></a-cylinder>
        {/* Hand */}
        <a-sphere 
          position="0 -0.5 0" 
          radius="0.08" 
          color="#FFAB91"
          shadow="cast: true"
        ></a-sphere>
      </a-entity>

      {/* Right Arm */}
      <a-entity ref={rightArmRef} position="0.35 1.8 0" rotation="0 0 30">
        <a-cylinder 
          radius="0.06" 
          height="0.8" 
          color="#FFAB91"
          shadow="cast: true"
        ></a-cylinder>
        {/* Hand */}
        <a-sphere 
          position="0 -0.5 0" 
          radius="0.08" 
          color="#FFAB91"
          shadow="cast: true"
        ></a-sphere>
      </a-entity>

      {/* Legs */}
      <a-entity ref={legRef} position="0 0.8 0">
        {/* Left Leg */}
        <a-cylinder 
          position="-0.12 -0.4 0" 
          radius="0.08" 
          height="0.8" 
          color="#2C3E50"
          shadow="cast: true"
        ></a-cylinder>
        {/* Right Leg */}
        <a-cylinder 
          position="0.12 -0.4 0" 
          radius="0.08" 
          height="0.8" 
          color="#2C3E50"
          shadow="cast: true"
        ></a-cylinder>
        
        {/* Feet */}
        <a-box 
          position="-0.12 -0.85 0.1" 
          width="0.1" 
          height="0.05" 
          depth="0.2" 
          color="#8B4513"
          shadow="cast: true"
        ></a-box>
        <a-box 
          position="0.12 -0.85 0.1" 
          width="0.1" 
          height="0.05" 
          depth="0.2" 
          color="#8B4513"
          shadow="cast: true"
        ></a-box>
      </a-entity>

      {/* Speech Bubble */}
      <a-entity position="0 2.8 0">
        <a-plane 
          width="1.5" 
          height="0.6" 
          color="#FFFFFF" 
          opacity="0.9"
          position="0 0 0.01"
        ></a-plane>
        <a-text 
          position="0 0 0.02" 
          value={isActive ? "Follow my movements!" : "Ready to start?"} 
          align="center" 
          color="#2C3E50"
          scale="1.5 1.5 1.5"
          font="kelsonsans"
        ></a-text>
      </a-entity>

      {/* Floating instruction arrows */}
      {isActive && exercise.id === 'arm-raise' && (
        <>
          <a-cone 
            position="-1 2.5 0" 
            radius-bottom="0.1" 
            radius-top="0" 
            height="0.2" 
            color="#E74C3C"
            rotation="0 0 90"
            animation="property: position; to: -1 3 0; dur: 1000; dir: alternate; loop: true"
          ></a-cone>
          <a-cone 
            position="1 2.5 0" 
            radius-bottom="0.1" 
            radius-top="0" 
            height="0.2" 
            color="#E74C3C"
            rotation="0 0 -90"
            animation="property: position; to: 1 3 0; dur: 1000; dir: alternate; loop: true"
          ></a-cone>
        </>
      )}
    </a-entity>
  );
};

export default ExerciseInstructor;